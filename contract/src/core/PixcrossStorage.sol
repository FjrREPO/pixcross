// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Id, Pool, Position} from "@interfaces/IPixcross.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PixcrossErrors} from "../libraries/PixcrossErrors.sol";

/**
 * @title PixcrossStorage
 * @dev Contract that defines the storage layout for the Pixcross protocol.
 * All storage variables and mappings are defined here for better organization
 * and to avoid storage collisions in inherited contracts.
 *
 * The storage is organized in slots to facilitate future upgrades if needed.
 * @author Pixcross Team
 */
contract PixcrossStorage is Ownable {
    // ============================================================
    //                    CONSTANTS
    // ============================================================

    /**
     * @dev Scaling factor for interest calculations (1e18)
     * @notice Used to represent percentages with high precision
     */
    uint256 public constant INTEREST_SCALED = 1e18;

    /**
     * @dev Duration of auctions in seconds (24 hours)
     * @notice The time period during which bids can be placed on a liquidated position
     */
    uint256 public constant AUCTION_TIME = 24 hours;

    // ============================================================
    //                    STORAGE SLOT 1
    //              PROTOCOL CONFIGURATION STORAGE
    // ============================================================

    /**
     * @dev Mapping of interest rate model addresses to their enabled status
     * @notice Tracks which interest rate models are approved for use in pools
     */
    mapping(address irm => bool enabled) public interestRateModels;

    /**
     * @dev Mapping of loan-to-value ratios to their enabled status
     * @notice Tracks which LTV values are approved for use in pools (as percentages)
     */
    mapping(uint256 ltv => bool enabled) public ltvs;

    // ============================================================
    //                    STORAGE SLOT 2
    //                  POOL DATA STORAGE
    // ============================================================

    /**
     * @dev Mapping of pool IDs to their pool data
     * @notice Stores all pool configurations and state:
     * - collateralToken: NFT contract address
     * - loanToken: ERC20 token address for borrowing/lending
     * - oracle: Price oracle for collateral valuation
     * - irm: Interest rate model address
     * - ltv: Loan-to-Value ratio (percentage)
     * - lth: Liquidation Threshold (percentage)
     * - totalSupplyAssets: Total assets supplied to the pool
     * - totalSupplyShares: Total shares representing pool supplies
     * - totalBorrowAssets: Total assets borrowed from the pool
     * - totalBorrowShares: Total shares representing borrows
     * - lastAccrued: Timestamp of last interest accrual
     */
    mapping(Id => Pool) internal _pools;

    /**
     * @dev Mapping of pool IDs and owner addresses to their supply shares
     * @notice Tracks how many shares each user has supplied to each pool
     */
    mapping(Id => mapping(address owner => uint256 shares)) public supplies;

    // ============================================================
    //                    STORAGE SLOT 3
    //                POSITION DATA STORAGE
    // ============================================================

    /**
     * @dev Mapping of pool IDs and token IDs to their position data
     * @notice Stores information about each collateralized position:
     * - owner: Address that owns the position
     * - borrowShares: Amount of borrow shares for this position
     * - endTime: Auction end time (if being liquidated)
     * - bidder: Current highest bidder (if being liquidated)
     * - bid: Current highest bid amount (if being liquidated)
     */
    mapping(Id => mapping(uint256 tokenId => Position)) public positions;

    /**
     * @dev Array to track all created pool IDs
     * @notice Maintains a list of all pool IDs for enumeration purposes
     */
    Id[] internal _poolIds;

    // ============================================================
    //                    STORAGE SLOT 4
    //               ACCESS CONTROL STORAGE
    // ============================================================

    /**
     * @dev Mapping of owner addresses and operator addresses to their operator status
     * @notice Tracks which addresses are authorized operators for other addresses
     */
    mapping(address owner => mapping(address operator => bool isOperator))
        public operators;

    // ============================================================
    //                      CONSTRUCTOR
    // ============================================================

    /**
     * @dev Constructor initializes the contract owner
     */
    constructor() Ownable() {}

    // ============================================================
    //                     ACCESS MODIFIERS
    // ============================================================

    /**
     * @dev Modifier to check if a pool exists
     * @param id The unique identifier of the pool
     */
    modifier poolExists(Id id) {
        if (_pools[id].lastAccrued == 0)
            revert PixcrossErrors.PoolNotExist(Id.unwrap(id));
        _;
    }

    /**
     * @dev Modifier to check if the caller is an operator for an address
     * @param onBehalfOf The address to check operation rights for
     */
    modifier onlyOperator(address onBehalfOf) {
        if (!_isOperator(onBehalfOf))
            revert PixcrossErrors.NotAllowed(msg.sender, onBehalfOf);
        _;
    }

    /**
     * @dev Modifier to check if an address is not zero
     * @param addr The address to check
     */
    modifier nonZeroAddress(address addr) {
        if (addr == address(0))
            revert PixcrossErrors.ZeroAddress("Zero address provided");
        _;
    }

    /**
     * @dev Modifier to check if an amount is not zero
     * @param amount The amount to check
     */
    modifier nonZeroAmount(uint256 amount) {
        if (amount == 0)
            revert PixcrossErrors.ZeroAmount("Zero amount provided");
        _;
    }

    // ============================================================
    //                   INTERNAL FUNCTIONS
    // ============================================================

    /**
     * @notice Checks if the caller is an operator for an address
     * @param onBehalf The address to check
     * @return bool True if the caller is an operator, false otherwise
     */
    function _isOperator(address onBehalf) internal view returns (bool) {
        return msg.sender == onBehalf || operators[onBehalf][msg.sender];
    }
}
