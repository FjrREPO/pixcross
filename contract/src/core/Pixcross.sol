// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {IPixcross, Id, Pool, Position, PoolParams} from "@interfaces/IPixcross.sol";
import {Iirm} from "@interfaces/Iirm.sol";
import {IERC3156FlashBorrower} from "@interfaces/IERC3156FlashBorrower.sol";

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

}
