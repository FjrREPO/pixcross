// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Id} from "@interfaces/IPixcross.sol";

/**
 * @title PixcrossEvents
 * @dev Library containing all event definitions for the Pixcross protocol.
 * This centralizes event declarations for better organization, consistency,
 * and easier off-chain indexing.
 * @author Pixcross Team
 */
library PixcrossEvents {
    // ============================================================
    //                  POOL MANAGEMENT EVENTS
    // ============================================================

    /**
     * @notice Emitted when a new pool is created
     * @param id The unique identifier of the pool
     * @param collateralToken The address of the NFT contract used as collateral
     * @param loanToken The address of the ERC20 token used for loans
     * @param oracle The address of the price oracle
     * @param irm The address of the interest rate model
     * @param ltv The loan-to-value ratio (as a percentage)
     * @param lth The liquidation threshold (as a percentage)
     */
    event PoolCreated(
        Id indexed id,
        address indexed collateralToken,
        address indexed loanToken,
        address oracle,
        address irm,
        uint256 ltv,
        uint256 lth
    );

    /**
     * @notice Emitted when an interest rate model is enabled or disabled
     * @param irm The address of the interest rate model
     * @param enabled Whether the model is enabled or disabled
     */
    event InterestRateModelChanged(address indexed irm, bool enabled);

    /**
     * @notice Emitted when a loan-to-value ratio is enabled or disabled
     * @param ltv The loan-to-value ratio
     * @param enabled Whether the LTV is enabled or disabled
     */
    event LTVChanged(uint256 ltv, bool enabled);

    /**
     * @notice Emitted when interest is accrued in a pool
     * @param id The unique identifier of the pool
     * @param borrowRate The borrow rate used for accrual (annual rate scaled by 1e18)
     * @param interest The amount of interest accrued
     * @param timeElapsed The time elapsed since the last accrual (in seconds)
     * @param feeShares The amount of fee shares (if applicable)
     */
    event InterestAccrued(
        Id indexed id,
        uint256 borrowRate,
        uint256 interest,
        uint256 timeElapsed,
        uint256 feeShares
    );

    // ============================================================
    //             SUPPLY & WITHDRAW OPERATION EVENTS
    // ============================================================

    /**
     * @notice Emitted when assets are supplied to a pool
     * @param id The unique identifier of the pool
     * @param sender The address that initiated the supply
     * @param onBehalfOf The address that will own the shares
     * @param amount The amount of assets supplied
     * @param shares The amount of shares minted
     */
    event Supply(
        Id indexed id,
        address indexed sender,
        address indexed onBehalfOf,
        uint256 amount,
        uint256 shares
    );

    /**
     * @notice Emitted when assets are withdrawn from a pool
     * @param id The unique identifier of the pool
     * @param sender The address that initiated the withdrawal
     * @param onBehalfOf The address that owned the shares
     * @param receiver The address that received the assets
     * @param amount The amount of assets withdrawn
     * @param shares The amount of shares burned
     */
    event Withdraw(
        Id indexed id,
        address indexed sender,
        address indexed onBehalfOf,
        address receiver,
        uint256 amount,
        uint256 shares
    );

    // ============================================================
    //           BORROW & REPAY OPERATION EVENTS
    // ============================================================

    /**
     * @notice Emitted when assets are borrowed from a pool
     * @param id The unique identifier of the pool
     * @param tokenId The token ID of the collateral
     * @param sender The address that initiated the borrow
     * @param onBehalfOf The address that will own the debt
     * @param receiver The address that received the borrowed assets
     * @param amount The amount of assets borrowed
     * @param shares The amount of borrow shares minted
     */
    event Borrow(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed sender,
        address onBehalfOf,
        address receiver,
        uint256 amount,
        uint256 shares
    );

    /**
     * @notice Emitted when a debt is repaid
     * @param id The unique identifier of the pool
     * @param tokenId The token ID of the collateral
     * @param sender The address that initiated the repayment
     * @param onBehalfOf The address that owned the debt
     * @param amount The amount of assets repaid
     * @param shares The amount of borrow shares burned
     */
    event Repay(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed sender,
        address onBehalfOf,
        uint256 amount,
        uint256 shares
    );

    // ============================================================
    //             COLLATERAL MANAGEMENT EVENTS
    // ============================================================

    /**
     * @notice Emitted when collateral is supplied to a pool
     * @param id The unique identifier of the pool
     * @param tokenId The token ID of the supplied collateral
     * @param sender The address that initiated the supply
     * @param onBehalfOf The address that will own the position
     */
    event SupplyCollateral(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed sender,
        address onBehalfOf
    );

    /**
     * @notice Emitted when collateral is withdrawn from a pool
     * @param id The unique identifier of the pool
     * @param tokenId The token ID of the withdrawn collateral
     * @param sender The address that initiated the withdrawal
     * @param onBehalfOf The address that owned the position
     * @param receiver The address that received the collateral
     */
    event WithdrawCollateral(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed sender,
        address onBehalfOf,
        address receiver
    );

    // ============================================================
    //                  AUCTION EVENTS
    // ============================================================

    /**
     * @notice Emitted when an auction is started for a position
     * @param id The unique identifier of the pool
     * @param tokenId The token ID being auctioned
     * @param owner The owner of the position
     * @param collateralToken The address of the NFT contract being auctioned
     * @param loanToken The address of the ERC20 token used for bidding
     * @param startTime The timestamp when the auction started
     * @param endTime The timestamp when the auction will end
     * @param debtAmount The debt amount that triggered the auction
     */
    event AuctionStarted(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed owner,
        address collateralToken,
        address loanToken,
        uint256 startTime,
        uint256 endTime,
        uint256 debtAmount
    );

    /**
     * @notice Emitted when a bid is placed in an auction
     * @param id The unique identifier of the pool
     * @param tokenId The token ID being auctioned
     * @param bidder The address that placed the bid
     * @param collateralToken The address of the NFT contract being auctioned
     * @param loanToken The address of the ERC20 token used for bidding
     * @param amount The bid amount
     * @param previousBidder The address of the previous highest bidder (if any)
     * @param previousBid The amount of the previous highest bid (if any)
     */
    event Bid(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed bidder,
        address collateralToken,
        address loanToken,
        uint256 amount,
        address previousBidder,
        uint256 previousBid
    );

    /**
     * @notice Emitted when an auction is settled
     * @param id The unique identifier of the pool
     * @param tokenId The token ID that was auctioned
     * @param winner The address of the winning bidder
     * @param collateralToken The address of the NFT contract that was auctioned
     * @param loanToken The address of the ERC20 token used for bidding
     * @param outstandingDebt The debt amount that was cleared
     * @param bidAmount The winning bid amount
     * @param excess The excess amount returned to the original position owner (if any)
     */
    event AuctionSettled(
        Id indexed id,
        uint256 indexed tokenId,
        address indexed winner,
        address collateralToken,
        address loanToken,
        uint256 outstandingDebt,
        uint256 bidAmount,
        uint256 excess
    );

    /**
     * @notice Emitted when batch liquidation is executed
     * @param id The pool ID
     * @param liquidatedCount Number of positions liquidated
     * @param tokenIds Array of token IDs that were liquidated
     */
    event BatchLiquidationExecuted(
        Id indexed id,
        uint256 liquidatedCount,
        uint256[] tokenIds
    );

    // ============================================================
    //                  ACCESS CONTROL EVENTS
    // ============================================================

    /**
     * @notice Emitted when an operator is set for an address
     * @param owner The address that set the operator
     * @param operator The operator address
     * @param approved Whether the operator is approved
     */
    event OperatorSet(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    /**
     * @notice Emitted when ownership of the contract is transferred
     * @param previousOwner The address of the previous owner
     * @param newOwner The address of the new owner
     */
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ============================================================
    //                  FLASH LOAN EVENTS
    // ============================================================

    /**
     * @notice Emitted when a flash loan is executed
     * @param caller The address that initiated the flash loan
     * @param receiver The contract that received the flash loan
     * @param token The token that was borrowed
     * @param amount The amount that was borrowed
     * @param fee The fee charged for the flash loan
     */
    event FlashLoan(
        address indexed caller,
        address indexed receiver,
        address indexed token,
        uint256 amount,
        uint256 fee
    );
}
