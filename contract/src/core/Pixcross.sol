// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {IPixcross, Id, Pool, Position, PoolParams} from "@interfaces/IPixcross.sol";
import {Iirm} from "@interfaces/Iirm.sol";
import {IOracle} from "@interfaces/IOracle.sol";
import {IERC3156FlashBorrower} from "@interfaces/IERC3156FlashBorrower.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {PixcrossBase} from "./PixcrossBase.sol";
import {PixcrossBorrow} from "./PixcrossBorrow.sol";
import {PixcrossSupply} from "./PixcrossSupply.sol";
import {PixcrossAuction} from "./PixcrossAuction.sol";

/**
 * @title Pixcross
 * @dev Main contract for the Pixcross protocol that integrates all functionality from specialized contracts.
 * This contract serves as the primary entry point for all protocol interactions.
 *
 * @author Pixcross Team
 */
contract Pixcross is
    PixcrossBase,
    PixcrossBorrow,
    PixcrossSupply,
    PixcrossAuction,
    IPixcross
{
    using Math for uint256;
    /**
     * @notice Contract constructor
     * @dev Initializes the contract with the deployer as the owner
     */
    constructor() {
        // PixcrossBase constructor is called automatically and initializes ownership
    }

    // ============================================================
    //                  POOL MANAGEMENT
    // ============================================================

    /**
     * @notice Creates a new lending pool with specified parameters
     * @param poolParams The parameters for the pool
     * @return id The unique identifier of the created pool
     *
     * Requirements:
     * - IRM must be registered via setInterestRateModel
     * - LTV must be registered via setLTV
     * - LTV must be less than LTH
     * - Pool with the same parameters must not already exist
     */
    function createPool(
        PoolParams memory poolParams
    ) external override(PixcrossBase) returns (Id) {
        return super._createPool(poolParams);
    }

    /**
     * @notice Computes the unique identifier for a pool based on its parameters
     * @param poolParams The parameters for the pool
     * @return id The unique identifier
     */
    function computeId(
        PoolParams memory poolParams
    ) public pure override returns (Id) {
        return super._computeId(poolParams);
    }

    /**
     * @notice Checks if a pool exists
     * @param id The unique identifier of the pool
     * @return bool True if the pool exists, false otherwise
     */
    function isPoolExist(
        Id id
    ) external view override(PixcrossBase) returns (bool) {
        return super._isPoolExist(id);
    }

    /**
     * @notice Sets an interest rate model as enabled or disabled
     * @param irm The address of the interest rate model
     * @param enabled Whether the model should be enabled or disabled
     */
    function setInterestRateModel(
        address irm,
        bool enabled
    ) external override(PixcrossBase) {
        super._setInterestRateModel(irm, enabled);
    }

    /**
     * @notice Sets a loan-to-value ratio as enabled or disabled
     * @param ltv The loan-to-value ratio (as a percentage)
     * @param enabled Whether the LTV should be enabled or disabled
     */
    function setLTV(uint256 ltv, bool enabled) external override(PixcrossBase) {
        super._setLTV(ltv, enabled);
    }

    /**
     * @notice Gets pool information by ID
     * @param id The unique identifier of the pool
     * @return asset The asset token address
     * @return gauge The gauge address
     * @return bribe The bribe address
     * @return index The pool index
     * @return gaugePeriodReward The gauge period reward
     * @return gaugePeriodStart The gauge period start timestamp
     * @return totalSupplyAsset The total supply of assets
     * @return totalSupplyShare The total supply of shares
     * @return activeBalance The active balance
     * @return feeAccrued The accrued fees
     * @return lastAccrued The last accrual timestamp
     */
    function pools(
        Id id
    )
        external
        view
        virtual
        override(PixcrossBase, IPixcross)
        returns (
            address asset,
            address gauge,
            address bribe,
            uint256 index,
            uint256 gaugePeriodReward,
            uint256 gaugePeriodStart,
            uint256 totalSupplyAsset,
            uint256 totalSupplyShare,
            uint256 activeBalance,
            uint256 feeAccrued,
            uint256 lastAccrued
        )
    {
        Pool memory pool = _pools[id];
        return (
            pool.collateralToken, // asset
            address(0), // gauge
            address(0), // bribe
            0, // index
            0, // gaugePeriodReward
            0, // gaugePeriodStart
            pool.totalSupplyAssets, // totalSupplyAsset
            pool.totalSupplyShares, // totalSupplyShare
            0, // activeBalance
            0, // feeAccrued
            pool.lastAccrued // lastAccrued
        );
    }

    // ============================================================
    //                  SUPPLY OPERATIONS
    // ============================================================

    /**
     * @notice Supplies assets to a pool
     * @param id The unique identifier of the pool
     * @param amount The amount to supply
     * @param to The address that will own the shares
     * @return suppliedAmount The amount supplied
     * @return supplyShares The amount of supply shares minted
     */
    function supply(
        Id id,
        uint256 amount,
        address to
    ) external virtual override(PixcrossSupply) returns (uint256, uint256) {
        return PixcrossSupply._supply(id, amount, to);
    }

    /**
     * @notice Withdraws assets from a pool
     * @param id The unique identifier of the pool
     * @param shares The amount of shares to withdraw (0 = withdraw max)
     * @param to The address that will receive the assets
     * @param from The address that owns the shares
     * @return withdrawnAmount The amount withdrawn
     * @return withdrawnShares The amount of shares burned
     */
    function withdraw(
        Id id,
        uint256 shares,
        address to,
        address from
    ) external virtual override(PixcrossSupply) returns (uint256, uint256) {
        return PixcrossSupply._withdraw(id, shares, from, to);
    }

    /**
     * @notice Supplies NFT collateral to a pool
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to supply as collateral
     * @param onBehalfOf The address that will own the position
     */
    function supplyCollateral(
        Id id,
        uint256 tokenId,
        address onBehalfOf
    ) external override(PixcrossSupply) {
        PixcrossSupply._supplyCollateral(id, tokenId, onBehalfOf);
    }

    /**
     * @notice Withdraws NFT collateral from a pool
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to withdraw
     * @param onBehalfOf The address that owns the position
     * @param receiver The address that will receive the collateral
     */
    function withdrawCollateral(
        Id id,
        uint256 tokenId,
        address onBehalfOf,
        address receiver
    ) external override(PixcrossSupply) {
        PixcrossSupply._withdrawCollateral(id, tokenId, onBehalfOf, receiver);
    }

    /**
     * @notice Supplies collateral and borrows in a single transaction
     * @dev This refactored version shows how the new composable functions
     *      from PixcrossBorrow can be used to create more maintainable code
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to supply as collateral
     * @param amount The amount to borrow
     * @param onBehalfOf The address that will own the position
     * @param receiver The address that will receive the borrowed assets
     * @return borrowedAmount The amount borrowed
     * @return borrowShares The amount of borrow shares minted
     */
    function supplyCollateralAndBorrow(
        Id id,
        uint256 tokenId,
        uint256 amount,
        address onBehalfOf,
        address receiver
    ) external override(PixcrossSupply) returns (uint256, uint256) {
        // Step 1: Supply the collateral
        super._supplyCollateral(id, tokenId, onBehalfOf);

        // Step 2: Borrow against the supplied collateral using refactored function
        // The new _borrow function now uses smaller, composable validation functions
        // which makes it easier to understand, test, and maintain
        return super._borrow(id, tokenId, amount, onBehalfOf, receiver);
    }

    /**
     * @notice Withdraws royalties from a position (placeholder, not implemented)
     */
    function withdrawRoyalty(
        Id id,
        uint256 tokenId,
        address onBehalfOf,
        address receiver
    ) external override(PixcrossSupply) {
        super._withdrawRoyalty(id, tokenId, onBehalfOf, receiver);
    }

    // ============================================================
    //                  BORROW OPERATIONS
    // ============================================================

    /**
     * @notice Borrows assets from a pool using collateral
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to use as collateral
     * @param amount The amount to borrow
     * @param onBehalfOf The address that will own the debt
     * @param receiver The address that will receive the borrowed assets
     * @return borrowedAmount The amount borrowed
     * @return borrowShares The amount of borrow shares minted
     */
    function borrow(
        Id id,
        uint256 tokenId,
        uint256 amount,
        address onBehalfOf,
        address receiver
    ) external override(PixcrossBorrow) returns (uint256, uint256) {
        return super._borrow(id, tokenId, amount, onBehalfOf, receiver);
    }

    /**
     * @notice Repays a debt
     * @param id The unique identifier of the pool
     * @param tokenId The token ID associated with the debt
     * @param shares The amount of borrow shares to repay (0 = repay max)
     * @param onBehalfOf The address that owns the debt
     * @return repaidAmount The amount repaid
     * @return repaidShares The amount of borrow shares burned
     */
    function repay(
        Id id,
        uint256 tokenId,
        uint256 shares,
        address onBehalfOf
    ) external override(PixcrossBorrow) returns (uint256, uint256) {
        return super._repay(id, tokenId, shares, onBehalfOf);
    }

    // ============================================================
    //                  AUCTION OPERATIONS
    // ============================================================

    /**
     * @notice Places a bid in an auction for a liquidatable position
     * @param id The unique identifier of the pool
     * @param tokenId The token ID being auctioned
     * @param amount The bid amount
     */
    function bid(
        Id id,
        uint256 tokenId,
        uint256 amount
    ) external override(PixcrossAuction) returns (bool) {
        return super._bid(id, tokenId, amount);
    }

    /**
     * @notice Settles an auction after it has ended
     * @param id The unique identifier of the pool
     * @param tokenId The token ID that was auctioned
     */
    function settleAuction(
        Id id,
        uint256 tokenId
    ) external override(PixcrossAuction) returns (bool) {
        return super._settleAuction(id, tokenId);
    }

    /**
     * @notice Starts an auction for a liquidatable position
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to be auctioned
     */
    function startAuction(
        Id id,
        uint256 tokenId
    ) external override(PixcrossAuction) returns (bool) {
        return super._startAuction(id, tokenId);
    }

    /**
     * @notice Batch checks liquidations and starts auctions for multiple token IDs
     * @param id The pool ID to check
     * @param tokenIds Array of token IDs to check for liquidation
     * @return liquidatedCount Number of auctions started
     * @return liquidatedTokenIds Array of token IDs that were liquidated
     */
    function batchLiquidateAndStartAuctions(
        Id id,
        uint256[] calldata tokenIds
    ) public override(PixcrossAuction) returns (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) {
        return super.batchLiquidateAndStartAuctions(id, tokenIds);
    }

    /**
     * @notice Automatically finds and liquidates unhealthy positions in a pool
     * @param id The pool ID to scan
     * @param startTokenId Starting token ID to scan from
     * @param maxTokensToCheck Maximum number of tokens to check (to prevent gas limit issues)
     * @return liquidatedCount Number of auctions started
     * @return liquidatedTokenIds Array of token IDs that were liquidated
     */
    function autoLiquidatePool(
        Id id,
        uint256 startTokenId,
        uint256 maxTokensToCheck
    ) public override(PixcrossAuction) returns (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds) {
        return super.autoLiquidatePool(id, startTokenId, maxTokensToCheck);
    }

    // ============================================================
    //                  FLASH LOAN OPERATIONS
    // ============================================================

    /**
     * @notice Executes a flash loan
     * @param receiver The contract that will receive the loan
     * @param token The token to borrow
     * @param amount The amount to borrow
     * @param data Arbitrary data to pass to the receiver
     * @return success True if the flash loan was successful
     */
    function flashLoan(
        IERC3156FlashBorrower receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external override(PixcrossBorrow) returns (bool) {
        return super._flashLoan(receiver, token, amount, data);
    }

    // ============================================================
    //                  UTILITY OPERATIONS
    // ============================================================

    /**
     * @notice Gets position information for a token
     * @param id The unique identifier of the pool
     * @param tokenId The token ID
     * @return borrowShares The amount of borrow shares
     * @return owner The owner of the position
     */
    function getPosition(
        Id id,
        uint256 tokenId
    ) external view returns (uint256, address) {
        Position memory position = positions[id][tokenId];
        return (position.borrowShares, position.owner);
    }

    /**
     * @notice Sets an operator for the caller
     * @param operator The operator address
     * @param approved Whether the operator is approved
     * @return success Always returns true
     */
    function setOperator(
        address operator,
        bool approved
    ) public override(PixcrossBase) returns (bool) {
        return super.setOperator(operator, approved);
    }

    /**
     * @notice Manually triggers interest accrual for a pool
     * @param id The unique identifier of the pool
     */
    function accrueInterest(Id id) external override(PixcrossBase) {
        super._accrue(id);
    }

    /**
     * @notice Returns a list of all pool IDs
     * @return poolIds Array of all pool IDs that have been created
     */
    function listPool() external view returns (Id[] memory) {
        return _poolIds;
    }

    // ============================================================
    //                  LIQUIDATION QUERY FUNCTIONS
    // ============================================================

    /**
     * @notice Checks which collateral positions in a range are liquidatable
     * @dev This is a read-only function designed for batch liquidation preparation
     * @param id The pool ID to check
     * @param startTokenId Starting token ID to check from
     * @param endTokenId Ending token ID to check (inclusive)
     * @return liquidatableTokenIds Array of token IDs that can be liquidated
     * @return healthFactors Array of health factors for each liquidatable position
     * @return minimumBids Array of minimum bid amounts for each liquidatable position
     * @return owners Array of position owners for each liquidatable position
     */
    function checkLiquidatableCollateral(
        Id id,
        uint256 startTokenId,
        uint256 endTokenId
    )
        external
        view
        poolExists(id)
        returns (
            uint256[] memory liquidatableTokenIds,
            uint256[] memory healthFactors,
            uint256[] memory minimumBids,
            address[] memory owners
        )
    {
        require(startTokenId <= endTokenId, "Invalid token ID range");
        require(endTokenId - startTokenId <= 1000, "Range too large (max 1000)");

        return _checkLiquidatableCollateralInternal(id, startTokenId, endTokenId);
    }

    /**
     * @notice Checks if specific token IDs are liquidatable
     * @dev This is a read-only function for checking specific positions
     * @param id The pool ID to check
     * @param tokenIds Array of specific token IDs to check
     * @return liquidatableTokenIds Array of token IDs that can be liquidated
     * @return healthFactors Array of health factors for each liquidatable position
     * @return minimumBids Array of minimum bid amounts for each liquidatable position
     * @return owners Array of position owners for each liquidatable position
     */
    function checkSpecificCollateralLiquidation(
        Id id,
        uint256[] calldata tokenIds
    )
        external
        view
        poolExists(id)
        returns (
            uint256[] memory liquidatableTokenIds,
            uint256[] memory healthFactors,
            uint256[] memory minimumBids,
            address[] memory owners
        )
    {
        require(tokenIds.length <= 500, "Too many token IDs (max 500)");

        Pool memory pool = _pools[id];
        
        // Temporary arrays to store results
        uint256[] memory tempTokenIds = new uint256[](tokenIds.length);
        uint256[] memory tempHealthFactors = new uint256[](tokenIds.length);
        uint256[] memory tempMinimumBids = new uint256[](tokenIds.length);
        address[] memory tempOwners = new address[](tokenIds.length);
        uint256 liquidatableCount = 0;

        // Check each specified token
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            Position memory position = positions[id][tokenId];
            
            // Skip if position doesn't exist or has no debt
            if (position.owner == address(0) || position.borrowShares == 0) {
                continue;
            }

            // Calculate health factor
            uint256 healthFactor = _calculateHealthFactor(pool, position, tokenId);
            
            // Check if position is liquidatable (health factor < 1e18)
            if (healthFactor < INTEREST_SCALED) {
                // Calculate minimum bid amount (outstanding debt)
                uint256 minimumBid = position.borrowShares.mulDiv(
                    pool.totalBorrowAssets,
                    pool.totalBorrowShares
                );
                
                tempTokenIds[liquidatableCount] = tokenId;
                tempHealthFactors[liquidatableCount] = healthFactor;
                tempMinimumBids[liquidatableCount] = minimumBid;
                tempOwners[liquidatableCount] = position.owner;
                liquidatableCount++;
            }
        }

        // Create properly sized result arrays
        liquidatableTokenIds = new uint256[](liquidatableCount);
        healthFactors = new uint256[](liquidatableCount);
        minimumBids = new uint256[](liquidatableCount);
        owners = new address[](liquidatableCount);
        
        for (uint256 i = 0; i < liquidatableCount; i++) {
            liquidatableTokenIds[i] = tempTokenIds[i];
            healthFactors[i] = tempHealthFactors[i];
            minimumBids[i] = tempMinimumBids[i];
            owners[i] = tempOwners[i];
        }

        return (liquidatableTokenIds, healthFactors, minimumBids, owners);
    }

    /**
     * @notice Gets detailed information about a position's liquidation status
     * @dev This provides comprehensive data for a single position
     * @param id The pool ID
     * @param tokenId The token ID to check
     * @return isLiquidatable Whether the position can be liquidated
     * @return healthFactor The health factor of the position
     * @return minimumBidAmount The minimum bid amount required
     * @return outstandingDebt The total outstanding debt
     * @return collateralValue The current collateral value
     * @return owner The position owner
     * @return auctionStatus Whether auction is already active
     */
    function getPositionLiquidationDetails(
        Id id,
        uint256 tokenId
    )
        external
        view
        poolExists(id)
        returns (
            bool isLiquidatable,
            uint256 healthFactor,
            uint256 minimumBidAmount,
            uint256 outstandingDebt,
            uint256 collateralValue,
            address owner,
            bool auctionStatus
        )
    {
        Pool memory pool = _pools[id];
        Position memory position = positions[id][tokenId];
        
        // Return defaults if position doesn't exist
        if (position.owner == address(0) || position.borrowShares == 0) {
            return (false, type(uint256).max, 0, 0, 0, address(0), false);
        }

        // Calculate health factor
        healthFactor = _calculateHealthFactor(pool, position, tokenId);
        
        // Check if liquidatable
        isLiquidatable = healthFactor < INTEREST_SCALED;
        
        // Calculate outstanding debt
        outstandingDebt = position.borrowShares.mulDiv(
            pool.totalBorrowAssets,
            pool.totalBorrowShares
        );
        
        // Get collateral value
        collateralValue = IOracle(pool.oracle).getPrice(tokenId);
        
        // Minimum bid is the outstanding debt
        minimumBidAmount = outstandingDebt;
        
        // Check auction status
        auctionStatus = position.endTime > 0;
        
        return (
            isLiquidatable,
            healthFactor,
            minimumBidAmount,
            outstandingDebt,
            collateralValue,
            position.owner,
            auctionStatus
        );
    }

    // ============================================================
    //                  INTERNAL HELPER FUNCTIONS
    // ============================================================

    /**
     * @notice Internal function to check liquidatable collateral in a range
     * @dev This reduces stack depth for the main function
     */
    function _checkLiquidatableCollateralInternal(
        Id id,
        uint256 startTokenId,
        uint256 endTokenId
    )
        internal
        view
        returns (
            uint256[] memory liquidatableTokenIds,
            uint256[] memory healthFactors,
            uint256[] memory minimumBids,
            address[] memory owners
        )
    {
        Pool memory pool = _pools[id];
        uint256 rangeSize = endTokenId - startTokenId + 1;
        
        // Temporary arrays to store results
        uint256[] memory tempTokenIds = new uint256[](rangeSize);
        uint256[] memory tempHealthFactors = new uint256[](rangeSize);
        uint256[] memory tempMinimumBids = new uint256[](rangeSize);
        address[] memory tempOwners = new address[](rangeSize);
        uint256 liquidatableCount = 0;

        // Check each token in the range
        for (uint256 tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
            (bool isLiquidatable, uint256 healthFactor, uint256 minimumBid, address owner) = 
                _checkSinglePosition(pool, id, tokenId);
            
            if (isLiquidatable) {
                tempTokenIds[liquidatableCount] = tokenId;
                tempHealthFactors[liquidatableCount] = healthFactor;
                tempMinimumBids[liquidatableCount] = minimumBid;
                tempOwners[liquidatableCount] = owner;
                liquidatableCount++;
            }
        }

        // Create properly sized result arrays
        liquidatableTokenIds = new uint256[](liquidatableCount);
        healthFactors = new uint256[](liquidatableCount);
        minimumBids = new uint256[](liquidatableCount);
        owners = new address[](liquidatableCount);
        
        for (uint256 i = 0; i < liquidatableCount; i++) {
            liquidatableTokenIds[i] = tempTokenIds[i];
            healthFactors[i] = tempHealthFactors[i];
            minimumBids[i] = tempMinimumBids[i];
            owners[i] = tempOwners[i];
        }

        return (liquidatableTokenIds, healthFactors, minimumBids, owners);
    }

    /**
     * @notice Checks a single position for liquidation eligibility
     */
    function _checkSinglePosition(
        Pool memory pool,
        Id id,
        uint256 tokenId
    )
        internal
        view
        returns (
            bool isLiquidatable,
            uint256 healthFactor,
            uint256 minimumBid,
            address owner
        )
    {
        Position memory position = positions[id][tokenId];
        
        // Skip if position doesn't exist or has no debt
        if (position.owner == address(0) || position.borrowShares == 0) {
            return (false, type(uint256).max, 0, address(0));
        }

        // Calculate health factor
        healthFactor = _calculateHealthFactor(pool, position, tokenId);
        
        // Check if position is liquidatable (health factor < 1e18)
        isLiquidatable = healthFactor < INTEREST_SCALED;
        
        if (isLiquidatable) {
            // Calculate minimum bid amount (outstanding debt)
            minimumBid = position.borrowShares.mulDiv(
                pool.totalBorrowAssets,
                pool.totalBorrowShares
            );
        }
        
        owner = position.owner;
        
        return (isLiquidatable, healthFactor, minimumBid, owner);
    }

}
