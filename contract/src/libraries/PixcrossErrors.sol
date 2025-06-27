// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

/**
 * @title PixcrossErrors
 * @dev Library containing all error definitions for the Pixcross protocol.
 * This centralizes error declarations for better organization, maintenance,
 * and improved error reporting.
 * @author Pixcross Team
 */
library PixcrossErrors {
    // ============================================================
    //                  ACCESS CONTROL ERRORS
    // ============================================================

    /**
     * @notice Error when the caller is not the contract owner
     * @dev Thrown when a function restricted to the owner is called by another address
     */
    error CallerNotOwner();

    /**
     * @notice Error when the caller is not authorized for a specific action
     * @dev Thrown when access control checks fail (not owner or operator)
     * @param caller The address that attempted the action
     * @param requiredRole The role that was required (e.g., "owner", "operator")
     */
    error Unauthorized(address caller, string requiredRole);

    /**
     * @notice Error when the caller is not allowed to perform an operation
     * @dev Thrown when the caller is not the owner or an approved operator
     * @param caller The address that attempted the operation
     * @param target The address on whose behalf the operation was attempted
     */
    error NotAllowed(address caller, address target);

    /**
     * @notice Error when an address parameter is zero
     * @dev Thrown when a function requires a non-zero address but receives address(0)
     * @param paramName Name of the parameter that was zero
     */
    error ZeroAddress(string paramName);

    // ============================================================
    //                  POOL MANAGEMENT ERRORS
    // ============================================================

    /**
     * @notice Error when the interest rate model doesn't exist
     * @dev Thrown when creating a pool with an unregistered interest rate model
     * @param irm The address of the interest rate model that doesn't exist
     */
    error IRMNotExist(address irm);

    /**
     * @notice Error when the LTV doesn't exist in the allowed set
     * @dev Thrown when creating a pool with an unregistered LTV value
     * @param ltv The LTV value that doesn't exist
     */
    error LTVNotExist(uint256 ltv);

    /**
     * @notice Error when attempting to create a pool that already exists
     * @dev Thrown when trying to create a pool with parameters that match an existing pool
     * @param id The ID of the pool that already exists
     */
    error PoolAlreadyCreated(bytes32 id);

    /**
     * @notice Error when the pool doesn't exist
     * @dev Thrown when trying to perform operations on a non-existent pool
     * @param id The ID of the pool that doesn't exist
     */
    error PoolNotExist(bytes32 id);

    /**
     * @notice Error when LTV is greater than LTH
     * @dev Thrown when creating a pool with LTV > LTH, which would make liquidation impossible
     * @param ltv The loan-to-value ratio
     * @param lth The liquidation threshold
     */
    error LTVGreaterThanLTH(uint256 ltv, uint256 lth);

    /**
     * @notice Error when LTV exceeds maximum allowed value
     * @dev Thrown when setting an LTV value greater than 100%
     * @param ltv The LTV value that exceeded the maximum
     */
    error LTVExceeded(uint256 ltv);

    /**
     * @notice Error when an amount parameter is zero
     * @dev Thrown when a function requires a non-zero amount but receives 0
     * @param paramName Name of the parameter that was zero
     */
    error ZeroAmount(string paramName);

    // ============================================================
    //            SUPPLY & WITHDRAW OPERATION ERRORS
    // ============================================================

    /**
     * @notice Error when there is insufficient liquidity in the pool
     * @dev Thrown when trying to borrow or withdraw more than available liquidity
     * @param requested The requested amount
     * @param available The available liquidity
     */
    error InsufficientLiquidity(uint256 requested, uint256 available);

    /**
     * @notice Error when trying to withdraw more shares than owned
     * @dev Thrown when a user attempts to withdraw more shares than their balance
     * @param requested The requested shares
     * @param available The available shares
     */
    error InsufficientShares(uint256 requested, uint256 available);

    /**
     * @notice Error when shares calculation results in zero shares
     * @dev Thrown when a supply amount is too small to result in any shares
     * @param amount The supply amount that was too small
     */
    error ZeroSharesCalculated(uint256 amount);

    /**
     * @notice Error when amount calculation results in zero amount
     * @dev Thrown when a share amount is too small to result in any asset amount
     * @param shares The share amount that was too small
     */
    error ZeroAmountCalculated(uint256 shares);

    // ============================================================
    //           BORROW & REPAY OPERATION ERRORS
    // ============================================================

    /**
     * @notice Error when there is insufficient collateral for a borrow operation
     * @dev Thrown when trying to borrow more than allowed by the collateral's value and LTV
     * @param requested The requested borrow amount
     * @param maxAllowed The maximum allowed borrow amount based on collateral
     */
    error InsufficientCollateral(uint256 requested, uint256 maxAllowed);

    /**
     * @notice Error when attempting to repay more than the outstanding debt
     * @dev Thrown when repay amount exceeds the current debt
     * @param repayAmount The attempted repay amount
     * @param debtAmount The actual outstanding debt
     */
    error ExcessiveRepayment(uint256 repayAmount, uint256 debtAmount);

    /**
     * @notice Error when debt is not zero during withdrawal of collateral
     * @dev Thrown when trying to withdraw collateral while there's still outstanding debt
     * @param outstandingDebt The amount of debt still outstanding
     */
    error DebtNotZero(uint256 outstandingDebt);

    // ============================================================
    //             COLLATERAL MANAGEMENT ERRORS
    // ============================================================

    /**
     * @notice Error when caller is not the token owner
     * @dev Thrown when trying to supply collateral for a token not owned by the caller
     * @param tokenId The ID of the token
     * @param caller The address attempting to supply the token
     * @param actualOwner The actual owner of the token
     */
    error NotTokenOwner(uint256 tokenId, address caller, address actualOwner);

    /**
     * @notice Error when caller is not the position owner
     * @dev Thrown when trying to perform operations on a position not owned by the caller
     * @param tokenId The ID of the token
     * @param caller The address attempting to use the position
     * @param actualOwner The actual owner of the position
     */
    error NotPositionOwner(
        uint256 tokenId,
        address caller,
        address actualOwner
    );

    /**
     * @notice Error when the token is not supported as collateral
     * @dev Thrown when trying to use an unsupported token as collateral
     * @param tokenAddress The address of the token contract
     */
    error UnsupportedCollateral(address tokenAddress);

    // ============================================================
    //                  AUCTION ERRORS
    // ============================================================

    /**
     * @notice Error when a position is not auctionable
     * @dev Thrown when trying to auction a healthy position
     * @param tokenId The ID of the token
     * @param healthFactor The current health factor of the position
     */
    error NotAuctionable(uint256 tokenId, uint256 healthFactor);

    /**
     * @notice Error when the auction has already ended
     * @dev Thrown when trying to bid on an auction that has already ended
     * @param tokenId The ID of the token being auctioned
     * @param endTime The time when the auction ended
     * @param currentTime The current time
     */
    error AuctionAlreadyEnded(
        uint256 tokenId,
        uint256 endTime,
        uint256 currentTime
    );

    /**
     * @notice Error when the auction has not yet ended
     * @dev Thrown when trying to settle an auction before its end time
     * @param tokenId The ID of the token being auctioned
     * @param endTime The time when the auction will end
     * @param currentTime The current time
     */
    error AuctionNotYetEnded(
        uint256 tokenId,
        uint256 endTime,
        uint256 currentTime
    );

    /**
     * @notice Error when a bid is too low
     * @dev Thrown when a bid is lower than the required minimum or previous bid
     * @param tokenId The ID of the token being auctioned
     * @param bidAmount The amount of the attempted bid
     * @param minRequired The minimum required bid amount
     */
    error BidTooLow(uint256 tokenId, uint256 bidAmount, uint256 minRequired);

    /**
     * @notice Error when no auction exists for the position
     * @dev Thrown when trying to interact with a non-existent auction
     * @param tokenId The ID of the token
     */
    error NoAuctionExists(uint256 tokenId);

    // ============================================================
    //                  FLASH LOAN ERRORS
    // ============================================================

    /**
     * @notice Error when flash loan callback fails
     * @dev Thrown when the receiver's onFlashLoan callback doesn't return the expected value
     * @param receiver The address of the flash loan receiver
     * @param expected The expected return value
     * @param received The actual return value
     */
    error FlashLoanCallbackFailed(
        address receiver,
        bytes32 expected,
        bytes32 received
    );

    /**
     * @notice Error when flash loan repayment is insufficient
     * @dev Thrown when the flash loan receiver doesn't repay the full amount plus fee
     * @param receiver The address of the flash loan receiver
     * @param expected The expected repayment amount
     * @param received The actual repayment amount
     */
    error FlashLoanRepaymentFailed(
        address receiver,
        uint256 expected,
        uint256 received
    );

    /**
     * @notice Error when calculation precision is lost
     * @dev Thrown when a calculation would result in loss of precision
     * @param operation The name of the operation where precision was lost
     */
    error PrecisionLost(string operation);
}
