// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {IPixcross, Id} from "@interfaces/IPixcross.sol";
import {Pixcross} from "@core/Pixcross.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20, ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PixcrossCurator
 * @notice A vault contract that aggregates yield by allocating funds across multiple Pixcross pools
 * @dev Implements ERC4626 standard with user balance tracking and fee mechanisms
 */
contract PixcrossCurator is Ownable, ERC4626, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Math for uint256;

    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice Reference to the Pixcross contract where pools are managed
    Pixcross public immutable pixcross;

    /// @notice The token used for deposits and withdrawals
    IERC20 public immutable depositToken;

    /// @notice Scaling factor for allocations (100% = 1e18)
    /// @dev Examples: 50% = 50e16, 25% = 25e16, 100% = 1e18
    uint256 constant ALLOCATION_SCALED = 1e18;

    /// @notice Number of decimals in the deposit token
    uint8 private immutable _decimals;

    /**
     * @notice Returns the number of decimals used by the deposit token
     * @return The number of decimals
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice List of pool IDs currently used for allocation
    bytes32[] public poolList;

    /// @notice Mapping of pool IDs to their allocation percentages (stored as scaled values: 70e16 = 70%)
    mapping(bytes32 => uint256) public poolAllocations;

    /// @notice Mapping of addresses to curator status
    mapping(address => bool) public curators;

    // User balance tracking
    mapping(address => uint256) public userSuppliedBalance;
    mapping(address => uint256) public userDepositHistory;
    mapping(address => uint256) public userWithdrawHistory;

    address public feeRecipient;
    uint256 public feePercentage; // Fee percentage in basis points (e.g., 100 = 1%)

    /// @notice Flag to indicate if the contract is paused
    bool public paused;

    /*//////////////////////////////////////////////////////////////
                         EVENTS & ERRORS
    //////////////////////////////////////////////////////////////*/

    event CuratorUpdated(address indexed curator, bool isCurator);
    event AllocationSetup(bytes32 indexed poolId, uint256 allocation);
    event AllocationBatchSetup(bytes32[] poolIds, uint256[] allocations);
    event FeeRecipientUpdated(address indexed newRecipient);
    event FeePercentageUpdated(uint256 newFeePercentage);
    event UserBalanceUpdated(
        address indexed user,
        uint256 newBalance,
        uint256 totalDeposited,
        uint256 totalWithdrawn
    );
    event CuratorDeposit(
        address indexed curator,
        address indexed receiver,
        uint256 assets,
        uint256 shares
    );
    event PublicDeposit(
        address indexed depositor,
        address indexed receiver,
        uint256 assets,
        uint256 shares
    );
    event EmergencyAction(
        address indexed curator,
        string action,
        string reason
    );
    event PausedStateChanged(bool paused);
    event PixcrossApprovalSet(uint256 amount);
    event PoolSkipped(bytes32 indexed poolId, string reason);
    event PoolDeposit(bytes32 indexed poolId, uint256 amount);
    event PoolWithdraw(bytes32 indexed poolId, uint256 amount);
    event PartialAllocation(uint256 requested, uint256 allocated);
    event IdleFundsAllocated(uint256 idleFunds, uint256 totalAllocated);

    error ZeroAddress();
    error InvalidLength(uint256 poolLength, uint256 allocationLength);
    error AllocationTooHigh();
    error InvalidAmount();
    error InsufficientTokenBalance(uint256 available, uint256 required);
    error InvalidShares(uint256 provided);
    error InsufficientShares(uint256 available, uint256 required);
    error NotImplemented();
    error DuplicatePoolId(bytes32 poolId);
    error PoolDoesNotExist(bytes32 poolId);
    error NotAuthorizedCurator();
    error FeePercentageTooHigh(uint256 provided, uint256 maximum);
    error Paused();
    error PoolInactive(bytes32 poolId);
    error CooldownTooShort(uint256 provided, uint256 minimum);
    error DivisionByZero();
    error InsufficientPixcrossAllowance(uint256 available, uint256 required);
    error InsufficientAssets(uint256 available, uint256 required);

    /*//////////////////////////////////////////////////////////////
                      CONSTRUCTOR & MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Initializes the PixcrossCurator contract
     * @param _name Name of the vault token
     * @param _symbol Symbol of the vault token
     * @param _pixcross Address of the Pixcross contract
     * @param _depositToken Address of the token accepted for deposits
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _pixcross,
        address _depositToken
    ) ERC4626(IERC20(_depositToken)) Ownable() ERC20(_name, _symbol) {
        if (_pixcross == address(0)) revert ZeroAddress();
        if (address(_depositToken) == address(0)) revert ZeroAddress();

        pixcross = Pixcross(_pixcross);
        depositToken = IERC20(address(_depositToken));

        // Capture the decimals from the deposit token
        try ERC20(_depositToken).decimals() returns (uint8 _tokenDecimals) {
            _decimals = _tokenDecimals;
        } catch {
            // Default to 18 if decimals() call fails
            _decimals = 18;
        }

        // Set deployer as initial curator
        curators[msg.sender] = true;
        emit CuratorUpdated(msg.sender, true);

        // Set infinite approval for Pixcross contract to save gas on deposits
        depositToken.approve(address(pixcross), type(uint256).max);
        emit PixcrossApprovalSet(type(uint256).max);
    }

    /**
     * @notice Modifier to prevent actions when contract is paused
     */
    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                   ALLOCATION & CONFIGURATION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Sets the allocation percentages for multiple pools
     * @dev Completely replaces the current allocation setup
     * @param poolIds Array of pool IDs to allocate funds to
     * @param allocations Array of allocation percentages (scaled by ALLOCATION_SCALED)
     *        Examples: [50e16, 30e16, 20e16] for 50%, 30%, 20% allocation
     *        Total must not exceed 100% (1e18). Remaining percentage stays as idle funds.
     */
    function setAllocation(
        bytes32[] memory poolIds,
        uint256[] memory allocations
    ) external onlyOwner {
        if (poolIds.length != allocations.length)
            revert InvalidLength(poolIds.length, allocations.length);

        delete poolList;
        uint256 totalAllocation = 0;

        // Check for duplicate pool IDs
        for (uint256 i = 0; i < poolIds.length; i++) {
            for (uint256 j = i + 1; j < poolIds.length; j++) {
                if (poolIds[i] == poolIds[j])
                    revert DuplicatePoolId(poolIds[i]);
            }
        }

        for (uint256 i = 0; i < poolIds.length; i++) {
            // Verify the pool exists in Pixcross
            (, , , , , , , , , , uint256 lastAccrued) = pixcross.pools(
                Id.wrap(poolIds[i])
            );
            if (lastAccrued == 0) revert PoolDoesNotExist(poolIds[i]);

            // Validate allocation is not greater than 100%
            if (allocations[i] > ALLOCATION_SCALED) revert AllocationTooHigh();

            poolAllocations[poolIds[i]] = allocations[i];
            poolList.push(poolIds[i]);

            totalAllocation += allocations[i];

            // Emit individual allocation setup event
            emit AllocationSetup(poolIds[i], allocations[i]);
        }

        // Ensure total allocation doesn't exceed 100%
        if (totalAllocation > ALLOCATION_SCALED) revert AllocationTooHigh();

        // Emit batch allocation setup event
        emit AllocationBatchSetup(poolIds, allocations);
    }

    /**
     * @notice Sets the fee recipient address
     * @param _feeRecipient Address that will receive fees
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        if (_feeRecipient == address(0)) revert ZeroAddress();
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }

    /**
     * @notice Sets the fee percentage in basis points (1% = 100)
     * @param _feePercentage Fee percentage (maximum 10000 = 100%)
     */
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        if (_feePercentage > 10000)
            revert FeePercentageTooHigh(_feePercentage, 10000);
        feePercentage = _feePercentage;
        emit FeePercentageUpdated(_feePercentage);
    }

    /**
     * @notice Add or remove an address as a curator
     * @param curator Address to update curator status for
     * @param status Whether the address should be a curator
     */
    function setCurator(address curator, bool status) external onlyOwner {
        if (curator == address(0)) revert ZeroAddress();
        curators[curator] = status;
        emit CuratorUpdated(curator, status);
    }

    /*//////////////////////////////////////////////////////////////
                     CORE ERC4626 FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Deposits assets into the vault and mints shares to receiver
     * @dev Simplified deposit function with corrected allocation handling
     * @param assets Amount of assets to deposit
     * @param receiver Address to receive the minted shares
     * @return Amount of shares minted to receiver
     */
    function deposit(
        uint256 assets,
        address receiver
    ) public virtual override whenNotPaused returns (uint256) {
        if (assets <= 0) revert InvalidAmount();
        if (depositToken.balanceOf(msg.sender) < assets) {
            revert InsufficientTokenBalance(
                depositToken.balanceOf(msg.sender),
                assets
            );
        }

        // Calculate shares BEFORE any state changes to get correct ratio
        uint256 shares = previewDeposit(assets);
        
        // Transfer tokens from user
        depositToken.safeTransferFrom(msg.sender, address(this), assets);
        
        // Handle fees
        uint256 feeShares = (shares * feePercentage) / 10000;
        uint256 receiverShares = shares - feeShares;

        // Mint shares
        if (feeShares > 0 && feeRecipient != address(0)) {
            _mint(feeRecipient, feeShares);
        }
        _mint(receiver, receiverShares);

        // Distribute the assets to pools
        _distributeToPoolsAfterDeposit(assets);

        // Update user balance tracking
        userSuppliedBalance[receiver] += assets;
        userDepositHistory[receiver] += assets;

        emit Deposit(msg.sender, receiver, assets, receiverShares);
        emit UserBalanceUpdated(
            receiver,
            userSuppliedBalance[receiver],
            userDepositHistory[receiver],
            userWithdrawHistory[receiver]
        );

        return receiverShares;
    }

    /**
     * @notice Internal function to distribute assets to pools after deposit
     * @param assets Total assets to distribute
     */
    function _distributeToPoolsAfterDeposit(uint256 assets) internal {
        uint256 poolListLength = poolList.length;
        uint256 totalDeposited = 0;

        for (uint256 i = 0; i < poolListLength; i++) {
            bytes32 poolId = poolList[i];

            // Skip inactive pools
            if (!_isPoolActive(poolId)) {
                emit PoolSkipped(poolId, "Pool inactive during deposit");
                continue;
            }

            // Convert allocation percentage to deposit amount
            // poolAllocations[poolId] should be in basis points or scaled format
            // If allocation is 70 (meaning 70%), we need to convert it properly
            uint256 allocation = poolAllocations[poolId];
            uint256 depositAmount;
            
            // Check if allocation is already in scaled format (>= 1e16) or percentage format (< 100)
            if (allocation >= 1e16) {
                // Already scaled format (70e16 for 70%)
                depositAmount = (assets * allocation) / ALLOCATION_SCALED;
            } else {
                // Percentage format (70 for 70%)
                depositAmount = (assets * allocation) / 100;
            }
            if (depositAmount > 0) {
                try pixcross.accrueInterest(Id.wrap(poolId)) {
                    pixcross.supply(Id.wrap(poolId), depositAmount, address(this));
                    totalDeposited += depositAmount;
                    emit PoolDeposit(poolId, depositAmount);
                } catch Error(string memory reason) {
                    emit PoolSkipped(poolId, reason);
                } catch {
                    emit PoolSkipped(poolId, "Unknown error during supply");
                }
            }
        }

        // Emit event if not all funds were allocated to pools
        if (totalDeposited < assets) {
            emit PartialAllocation(assets, totalDeposited);
        }
    }

    /**
     * @notice Redeems shares for assets, burning shares from owner and sending assets to receiver
     * @dev Withdraws from all pools proportionally to the shares being redeemed
     * @param shares Amount of shares to redeem
     * @param receiver Address to receive the withdrawn assets
     * @param owner Address that owns the shares being redeemed
     * @return assets Amount of assets transferred to receiver
     */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual override whenNotPaused returns (uint256 assets) {
        if (shares == 0) revert InvalidShares(shares);
        if (balanceOf(owner) < shares)
            revert InsufficientShares(balanceOf(owner), shares);

        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }

        // Calculate expected assets based on shares
        assets = convertToAssets(shares);

        uint256 assetsFromPools = 0;

        // Try to withdraw proportionally from pools first
        uint256 poolListLength = poolList.length;
        for (uint256 i = 0; i < poolListLength; i++) {
            bytes32 poolId = poolList[i];

            // Skip inactive pools
            if (!_isPoolActive(poolId)) {
                continue;
            }

            uint256 ourPoolShares = pixcross.supplies(
                Id.wrap(poolId),
                address(this)
            );
            if (ourPoolShares > 0) {
                // Calculate how many shares to withdraw based on proportion of total vault shares being redeemed
                uint256 withdrawShares = (shares * ourPoolShares) /
                    totalSupply();
                if (withdrawShares > 0 && withdrawShares <= ourPoolShares) {
                    try
                        pixcross.withdraw(
                            Id.wrap(poolId),
                            withdrawShares,
                            address(this),
                            address(this)
                        )
                    returns (uint256 poolAssets, uint256 actualShares) {
                        assetsFromPools += poolAssets;
                        emit PoolWithdraw(poolId, actualShares);
                    } catch {
                        // Continue with other pools if one fails
                        emit PoolSkipped(
                            poolId,
                            "Failed to withdraw from pool"
                        );
                    }
                }
            }
        }

        uint256 currentBalance = depositToken.balanceOf(address(this));

        // Calculate the final amount to transfer
        // If we got enough from pools, transfer the expected amount
        // If not, transfer what we have available
        uint256 transferAmount = assets;
        if (currentBalance < assets) {
            transferAmount = currentBalance;
            // Note: In a production system, you might want to revert here
            // For now, we'll transfer what's available
        }

        if (transferAmount > 0) {
            depositToken.safeTransfer(receiver, transferAmount);
        }

        // Update the actual assets returned
        assets = transferAmount;
        _burn(owner, shares);

        // Update user balance tracking
        if (userSuppliedBalance[owner] >= assets) {
            userSuppliedBalance[owner] -= assets;
        } else {
            userSuppliedBalance[owner] = 0;
        }
        userWithdrawHistory[owner] += assets;

        emit Withdraw(msg.sender, receiver, owner, assets, shares);
        emit UserBalanceUpdated(
            owner,
            userSuppliedBalance[owner],
            userDepositHistory[owner],
            userWithdrawHistory[owner]
        );
        return assets;
    }

    /**
     * @notice Restricts function access to curators only
     */
    modifier onlyCurator() {
        if (!curators[msg.sender]) revert NotAuthorizedCurator();
        _;
    }

    /**
     * @notice Returns the total amount of assets managed by this vault
     * @dev Sums up the value of positions across all Pixcross pools plus idle funds
     * @return Total assets in underlying token
     */
    function totalAssets() public view virtual override returns (uint256) {
        uint256 totalAsset = 0;
        uint256 poolListLength = poolList.length;

        // Sum up assets from all pools
        for (uint256 i = 0; i < poolListLength; i++) {
            bytes32 poolId = poolList[i];

            // Get our shares in this pool
            uint256 ourShares = pixcross.supplies(
                Id.wrap(poolId),
                address(this)
            );

            if (ourShares > 0) {
                // Get the current supply amount for our shares
                try
                    pixcross.getCurrentSupplyAmount(
                        Id.wrap(poolId),
                        address(this)
                    )
                returns (uint256 currentAmount) {
                    totalAsset += currentAmount;
                } catch {
                    // Fallback: calculate manually if the function is not available
                    (
                        ,
                        ,
                        ,
                        ,
                        ,
                        ,
                        uint256 totalSupplyAssets,
                        uint256 totalSupplyShares,
                        ,
                        ,

                    ) = pixcross.pools(Id.wrap(poolId));

                    // Avoid division by zero
                    if (totalSupplyShares > 0) {
                        totalAsset +=
                            (ourShares * totalSupplyAssets) /
                            totalSupplyShares;
                    }
                }
            }
        }

        // Add idle funds (tokens sitting in the contract)
        uint256 idleFunds = depositToken.balanceOf(address(this));
        totalAsset += idleFunds;

        return totalAsset;
    }

    /**
     * @notice Withdraws assets from the vault based on the amount specified
     * @dev This redirects to the redeem function with a calculated share amount
     * @param assets Amount of assets to withdraw
     * @param receiver Address to receive the withdrawn assets
     * @param owner Address that owns the shares being redeemed
     * @return Amount of shares redeemed
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public virtual override whenNotPaused returns (uint256) {
        if (assets == 0) revert InvalidAmount();

        uint256 shares = previewWithdraw(assets);
        return redeem(shares, receiver, owner);
    }

    /**
     * @notice Preview how many shares would be minted for a given deposit amount
     * @dev Simple calculation: shares = (assets * totalSupply) / totalAssets
     * @param assets Amount of assets to deposit
     * @return shares Amount of shares that would be minted
     */
    function previewDeposit(
        uint256 assets
    ) public view virtual override returns (uint256) {
        uint256 totalSupplyShares = totalSupply();
        uint256 totalAssetValue = totalAssets();
        
        if (totalSupplyShares == 0 || totalAssetValue == 0) {
            // For first deposit, use 1:1 ratio
            return assets;
        }

        // Standard ERC4626 calculation: shares = (assets * totalSupply) / totalAssets
        return (assets * totalSupplyShares) / totalAssetValue;
    }

    /**
     * @notice Get the total allocation percentage across all pools
     * @return totalAllocation Sum of all pool allocations
     */
    function _getTotalAllocation() internal view returns (uint256 totalAllocation) {
        uint256 poolListLength = poolList.length;
        for (uint256 i = 0; i < poolListLength; i++) {
            totalAllocation += poolAllocations[poolList[i]];
        }
        return totalAllocation;
    }

    /**
     * @notice Calculates the maximum amount of assets an address can withdraw
     * @param owner Address of the owner
     * @return Maximum amount of assets that can be withdrawn
     */
    function maxWithdraw(
        address owner
    ) public view virtual override returns (uint256) {
        if (paused) return 0;

        uint256 ownerShares = balanceOf(owner);
        if (ownerShares == 0) return 0;

        return convertToAssets(ownerShares);
    }

    /*//////////////////////////////////////////////////////////////
                        CURATOR FUNCTIONALITY
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice Emergency function to allocate idle funds to pools
     * @dev Use this when funds are stuck in the curator contract
     */
    function allocateIdleFunds() external onlyOwner whenNotPaused nonReentrant {
        uint256 idleFunds = depositToken.balanceOf(address(this));
        if (idleFunds == 0) revert InvalidAmount();

        uint256 poolListLength = poolList.length;
        uint256 totalAllocated = 0;

        for (uint256 i = 0; i < poolListLength; i++) {
            bytes32 poolId = poolList[i];

            if (!_isPoolActive(poolId)) {
                continue;
            }

            uint256 allocation = poolAllocations[poolId];
            if (allocation == 0) continue;

            // Convert allocation percentage to deposit amount
            uint256 depositAmount;
            
            // Check if allocation is already in scaled format (>= 1e16) or percentage format (< 100)
            if (allocation >= 1e16) {
                // Already scaled format (70e16 for 70%)
                depositAmount = (idleFunds * allocation) / ALLOCATION_SCALED;
            } else {
                // Percentage format (70 for 70%)
                depositAmount = (idleFunds * allocation) / 100;
            }
            if (depositAmount > 0) {
                try pixcross.accrueInterest(Id.wrap(poolId)) {
                    // Then supply to the pool
                    pixcross.supply(
                        Id.wrap(poolId),
                        depositAmount,
                        address(this)
                    );
                    totalAllocated += depositAmount;
                    emit PoolDeposit(poolId, depositAmount);
                } catch Error(string memory reason) {
                    emit PoolSkipped(poolId, reason);
                } catch {
                    emit PoolSkipped(poolId, "Failed to allocate idle funds");
                }
            }
        }

        emit IdleFundsAllocated(idleFunds, totalAllocated);
    }

    /**
     * @notice Checks for idle funds and emits an event if found
     * @dev This can be called by anyone to detect unallocated funds
     */
    function checkIdleFunds()
        external
        view
        returns (uint256 idleFunds, bool hasIdleFunds)
    {
        idleFunds = depositToken.balanceOf(address(this));
        hasIdleFunds = idleFunds > 0;

        return (idleFunds, hasIdleFunds);
    }

    /**
     * @notice Pauses or unpauses the contract
     * @param _paused New paused state
     */
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }

    /**
     * @notice Sets approval for Pixcross contract to spend deposit tokens
     * @dev Can be called by owner or curators to set unlimited or specific approval
     * @param amount Amount to approve, use type(uint256).max for unlimited approval
     */
    function setPixcrossApproval(uint256 amount) external onlyOwner {
        depositToken.approve(address(pixcross), amount);
        emit PixcrossApprovalSet(amount);
    }

    /**
     * @notice Emergency function to withdraw from a specific pool
     * @param poolId ID of the pool to withdraw from
     * @param reason Reason for the emergency withdrawal
     */
    function emergencyWithdraw(
        bytes32 poolId,
        string calldata reason
    ) external onlyOwner nonReentrant {
        uint256 poolSupply = pixcross.supplies(Id.wrap(poolId), address(this));
        if (poolSupply > 0) {
            pixcross.withdraw(
                Id.wrap(poolId),
                poolSupply,
                address(this),
                address(this)
            );
        }

        emit EmergencyAction(msg.sender, "WITHDRAW", reason);
    }

    /**
     * @notice Gets the amount of idle funds sitting in the contract
     * @return idleFunds Amount of tokens not allocated to pools
     */
    function getIdleFunds() external view returns (uint256 idleFunds) {
        return depositToken.balanceOf(address(this));
    }

    /*//////////////////////////////////////////////////////////////
                     INTERNAL HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Checks if a pool is active without reverting
     * @dev Used when we need to check status but not revert
     * @param poolId ID of the pool to check
     * @return isActive Whether the pool is active
     */
    function _isPoolActive(
        bytes32 poolId
    ) internal view returns (bool isActive) {
        (address asset, , , , , , , , , , uint256 lastAccrued) = pixcross.pools(
            Id.wrap(poolId)
        );
        return (lastAccrued > 0 && asset != address(0));
    }
}
