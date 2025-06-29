// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Id, Pool, Position} from "@interfaces/IPixcross.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IOracle} from "@interfaces/IOracle.sol";

import {PixcrossBase} from "./PixcrossBase.sol";
import {PixcrossErrors} from "../libraries/PixcrossErrors.sol";
import {PixcrossEvents} from "../libraries/PixcrossEvents.sol";

/**
 * @title PixcrossAuction
 * @dev Contract that implements auction functionality for the Pixcross protocol.
 * Manages the liquidation of unhealthy positions through a 24-hour auction process
 * where bidders compete to acquire the collateral NFT.
 * @author Pixcross Team
 */
contract PixcrossAuction is PixcrossBase {
    using SafeERC20 for IERC20;
    using Math for uint256;

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
    ) external virtual poolExists(id) nonZeroAmount(amount) returns (bool) {
        Pool storage pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Accrue interest before any state changes
        _accrue(id);

        // Check if position is liquidatable (not healthy)
        uint256 healthFactor = _calculateHealthFactor(pool, position, tokenId);
        if (healthFactor >= INTEREST_SCALED) {
            revert PixcrossErrors.NotAuctionable(tokenId, healthFactor);
        }

        // Check if auction has already ended
        if (position.endTime != 0 && position.endTime <= block.timestamp) {
            revert PixcrossErrors.AuctionAlreadyEnded(
                tokenId,
                position.endTime,
                block.timestamp
            );
        }

        // Calculate minimum required bid amount
        uint256 minimumBidAmount = _calculateMinimumBidAmount(pool, position);

        // Validate bid amount
        if (position.bid == 0) {
            // For first bid, amount must be at least the outstanding debt
            if (amount < minimumBidAmount) {
                revert PixcrossErrors.BidTooLow(
                    tokenId,
                    amount,
                    minimumBidAmount
                );
            }
        } else {
            // For subsequent bids, must be higher than previous bid
            // And at least the minimum bid amount (in case debt has increased)
            uint256 requiredBid = position.bid > minimumBidAmount
                ? position.bid
                : minimumBidAmount;
            if (amount <= requiredBid) {
                revert PixcrossErrors.BidTooLow(tokenId, amount, requiredBid);
            }
        }

        // Store previous bid information for refund
        address previousBidder = position.bidder;
        uint256 previousBid = position.bid;

        // Update position with new bid information
        position.bidder = msg.sender;
        position.bid = amount;

        // Start auction with 24 hour timer if this is first bid
        if (position.endTime == 0) {
            position.endTime = block.timestamp + AUCTION_TIME;

            // Emit auction started event
            emit PixcrossEvents.AuctionStarted(
                id,
                tokenId,
                position.owner,
                pool.collateralToken,
                pool.loanToken,
                block.timestamp,
                position.endTime,
                minimumBidAmount
            );
        }

        // Transfer bid amount from bidder
        IERC20(pool.loanToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        // Refund previous bidder if exists
        if (previousBidder != address(0)) {
            IERC20(pool.loanToken).safeTransfer(previousBidder, previousBid);
        }

        // Emit bid event
        emit PixcrossEvents.Bid(
            id,
            tokenId,
            msg.sender,
            pool.collateralToken,
            pool.loanToken,
            amount,
            previousBidder,
            previousBid
        );

        return true;
    }

    /**
     * @notice Settles an auction after it has ended
     * @param id The unique identifier of the pool
     * @param tokenId The token ID that was auctioned
     */
    function settleAuction(
        Id id,
        uint256 tokenId
    ) external virtual poolExists(id) returns (bool) {
        Pool storage pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Check if an auction has been started
        if (position.endTime == 0) {
            revert PixcrossErrors.NoAuctionExists(tokenId);
        }

        // Check if caller is the highest bidder
        if (msg.sender != position.bidder) {
            revert PixcrossErrors.Unauthorized(msg.sender, "highest bidder");
        }

        // Check if auction end time has passed
        if (block.timestamp < position.endTime) {
            revert PixcrossErrors.AuctionNotYetEnded(
                tokenId,
                position.endTime,
                block.timestamp
            );
        }

        // Check if there is a winning bidder
        if (position.bidder == address(0)) {
            revert PixcrossErrors.NotAuctionable(tokenId, 0);
        }

        // Accrue interest before settlement
        _accrue(id);

        // Retrieve final state
        address winningBidder = position.bidder;
        uint256 bidAmount = position.bid;
        address originalOwner = position.owner;

        // Calculate outstanding debt
        uint256 outstandingDebt = position.borrowShares.mulDiv(
            pool.totalBorrowAssets,
            pool.totalBorrowShares
        );

        // Calculate excess amount after debt repayment
        uint256 excess = 0;
        if (bidAmount > outstandingDebt) {
            excess = bidAmount - outstandingDebt;
        }

        // Update pool state
        pool.totalBorrowAssets -= outstandingDebt;
        pool.totalBorrowShares -= position.borrowShares;

        // Transfer NFT to winning bidder
        IERC721(pool.collateralToken).safeTransferFrom(
            address(this),
            winningBidder,
            tokenId
        );

        // Transfer excess to original owner if any
        if (excess > 0 && originalOwner != address(0)) {
            IERC20(pool.loanToken).safeTransfer(originalOwner, excess);
        }

        // Emit auction settled event
        emit PixcrossEvents.AuctionSettled(
            id,
            tokenId,
            winningBidder,
            pool.collateralToken,
            pool.loanToken,
            outstandingDebt,
            bidAmount,
            excess
        );

        // Clear position data
        delete positions[id][tokenId];

        return true;
    }

    /**
     * @notice Starts an auction for a liquidatable position
     * @dev This function can be used to explicitly start an auction without placing a bid
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to be auctioned
     */
    function startAuction(
        Id id,
        uint256 tokenId
    ) external virtual poolExists(id) returns (bool) {
        Pool memory pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Accrue interest first
        _accrue(id);

        // Check if position is liquidatable (not healthy)
        uint256 healthFactor = _calculateHealthFactor(pool, position, tokenId);
        if (healthFactor >= INTEREST_SCALED) {
            revert PixcrossErrors.NotAuctionable(tokenId, healthFactor);
        }

        // Check if auction already started
        if (position.endTime != 0) {
            revert PixcrossErrors.AuctionAlreadyEnded(
                tokenId,
                position.endTime,
                block.timestamp
            );
        }

        // Calculate minimum required bid amount
        uint256 minimumBidAmount = _calculateMinimumBidAmount(pool, position);

        // Start auction with 24 hour timer
        position.endTime = block.timestamp + AUCTION_TIME;

        // Emit auction started event
        emit PixcrossEvents.AuctionStarted(
            id,
            tokenId,
            position.owner,
            pool.collateralToken,
            pool.loanToken,
            block.timestamp,
            position.endTime,
            minimumBidAmount
        );

        return true;
    }

    /**
     * @notice Checks if a position is eligible for auction (liquidatable)
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to check
     * @return isAuctionable True if the position can be auctioned
     * @return healthFactor The current health factor of the position
     * @return minimumBidAmount The minimum bid amount required
     */
    function checkAuctionEligibility(
        Id id,
        uint256 tokenId
    )
        external
        view
        virtual
        poolExists(id)
        returns (
            bool isAuctionable,
            uint256 healthFactor,
            uint256 minimumBidAmount
        )
    {
        Pool memory pool = _pools[id];
        Position memory position = positions[id][tokenId];

        // Position must have an owner and debt
        if (position.owner == address(0) || position.borrowShares == 0) {
            return (false, type(uint256).max, 0);
        }

        // Calculate health factor
        healthFactor = _calculateHealthFactor(pool, position, tokenId);

        // Position is auctionable if health factor < 1e18
        isAuctionable = healthFactor < INTEREST_SCALED;

        // Calculate minimum bid amount if auctionable
        if (isAuctionable) {
            minimumBidAmount = position.borrowShares.mulDiv(
                pool.totalBorrowAssets,
                pool.totalBorrowShares
            );
        }

        return (isAuctionable, healthFactor, minimumBidAmount);
    }

    // ============================================================
    //                  PUBLIC WRAPPERS FOR INTERNAL FUNCTIONS
    // ============================================================

    /**
     * @notice Public wrapper for bid operation
     * @param id The unique identifier of the pool
     * @param tokenId The token ID being auctioned
     * @param amount The bid amount
     * @return success True if the bid was successful
     */
    function _bid(
        Id id,
        uint256 tokenId,
        uint256 amount
    ) public virtual poolExists(id) returns (bool) {
        Pool storage pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Check if position is liquidatable (not healthy)
        uint256 healthFactor = _calculateHealthFactor(pool, position, tokenId);
        if (healthFactor >= INTEREST_SCALED) {
            revert PixcrossErrors.NotAuctionable(tokenId, healthFactor);
        }

        // Check if auction has already ended
        if (position.endTime != 0 && position.endTime <= block.timestamp) {
            revert PixcrossErrors.AuctionAlreadyEnded(
                tokenId,
                position.endTime,
                block.timestamp
            );
        }

        // Calculate minimum required bid amount
        uint256 minimumBidAmount = _calculateMinimumBidAmount(pool, position);

        // Validate bid amount
        if (position.bid == 0) {
            if (amount < minimumBidAmount) {
                revert PixcrossErrors.BidTooLow(
                    tokenId,
                    amount,
                    minimumBidAmount
                );
            }
        } else {
            uint256 requiredBid = position.bid > minimumBidAmount
                ? position.bid
                : minimumBidAmount;
            if (amount <= requiredBid) {
                revert PixcrossErrors.BidTooLow(tokenId, amount, requiredBid);
            }
        }

        // Store previous bid information for refund
        address previousBidder = position.bidder;
        uint256 previousBid = position.bid;

        // Update position with new bid information
        position.bidder = msg.sender;
        position.bid = amount;

        // Start auction with 24 hour timer if this is first bid
        if (position.endTime == 0) {
            position.endTime = block.timestamp + AUCTION_TIME;
            emit PixcrossEvents.AuctionStarted(
                id,
                tokenId,
                position.owner,
                pool.collateralToken,
                pool.loanToken,
                block.timestamp,
                position.endTime,
                minimumBidAmount
            );
        }

        // Transfer bid amount from bidder
        IERC20(pool.loanToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        // Refund previous bidder if exists
        if (previousBidder != address(0)) {
            IERC20(pool.loanToken).safeTransfer(previousBidder, previousBid);
        }

        emit PixcrossEvents.Bid(
            id,
            tokenId,
            msg.sender,
            pool.collateralToken,
            pool.loanToken,
            amount,
            previousBidder,
            previousBid
        );

        return true;
    }

    /**
     * @notice Public wrapper for settle auction operation
     * @param id The unique identifier of the pool
     * @param tokenId The token ID that was auctioned
     * @return success True if the auction was settled successfully
     */
    function _settleAuction(
        Id id,
        uint256 tokenId
    ) public virtual poolExists(id) returns (bool) {
        Pool storage pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Check if an auction has been started
        if (position.endTime == 0) {
            revert PixcrossErrors.NoAuctionExists(tokenId);
        }

        // Check if caller is the highest bidder
        if (msg.sender != position.bidder) {
            revert PixcrossErrors.Unauthorized(msg.sender, "highest bidder");
        }

        // Check if auction end time has passed
        if (block.timestamp < position.endTime) {
            revert PixcrossErrors.AuctionNotYetEnded(
                tokenId,
                position.endTime,
                block.timestamp
            );
        }

        // Check if there is a winning bidder
        if (position.bidder == address(0)) {
            revert PixcrossErrors.NotAuctionable(tokenId, 0);
        }

        // Retrieve final state
        address winningBidder = position.bidder;
        uint256 bidAmount = position.bid;
        address originalOwner = position.owner;

        // Calculate outstanding debt
        uint256 outstandingDebt = position.borrowShares.mulDiv(
            pool.totalBorrowAssets,
            pool.totalBorrowShares
        );

        // Calculate excess amount after debt repayment
        uint256 excess = 0;
        if (bidAmount > outstandingDebt) {
            excess = bidAmount - outstandingDebt;
        }

        // Update pool state
        pool.totalBorrowAssets -= outstandingDebt;
        pool.totalBorrowShares -= position.borrowShares;

        // Transfer NFT to winning bidder
        IERC721(pool.collateralToken).safeTransferFrom(
            address(this),
            winningBidder,
            tokenId
        );

        // Transfer excess to original owner if any
        if (excess > 0 && originalOwner != address(0)) {
            IERC20(pool.loanToken).safeTransfer(originalOwner, excess);
        }

        emit PixcrossEvents.AuctionSettled(
            id,
            tokenId,
            winningBidder,
            pool.collateralToken,
            pool.loanToken,
            outstandingDebt,
            bidAmount,
            excess
        );

        // Clear position data
        delete positions[id][tokenId];

        return true;
    }

    /**
     * @notice Public wrapper for start auction operation
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to be auctioned
     * @return success True if the auction was started successfully
     */
    function _startAuction(
        Id id,
        uint256 tokenId
    ) public virtual poolExists(id) returns (bool) {
        Pool memory pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Check if position is liquidatable (not healthy)
        uint256 healthFactor = _calculateHealthFactor(pool, position, tokenId);
        if (healthFactor >= INTEREST_SCALED) {
            revert PixcrossErrors.NotAuctionable(tokenId, healthFactor);
        }

        // Check if auction already started
        if (position.endTime != 0) {
            revert PixcrossErrors.AuctionAlreadyEnded(
                tokenId,
                position.endTime,
                block.timestamp
            );
        }

        // Calculate minimum required bid amount
        uint256 minimumBidAmount = _calculateMinimumBidAmount(pool, position);

        // Start auction with 24 hour timer
        position.endTime = block.timestamp + AUCTION_TIME;

        emit PixcrossEvents.AuctionStarted(
            id,
            tokenId,
            position.owner,
            pool.collateralToken,
            pool.loanToken,
            block.timestamp,
            position.endTime,
            minimumBidAmount
        );

        return true;
    }

    // ============================================================
    //                  INTERNAL FUNCTIONS
    // ============================================================

    /**
     * @notice Calculates the minimum bid amount for a position
     * @param pool The pool data
     * @param position The position data
     * @return minimumBid The minimum bid amount required
     */
    function _calculateMinimumBidAmount(
        Pool memory pool,
        Position memory position
    ) internal pure returns (uint256) {
        // Minimum bid is the outstanding debt
        return
            position.borrowShares.mulDiv(
                pool.totalBorrowAssets,
                pool.totalBorrowShares
            );
    }

    /**
     * @notice Gets auction state for a position
     * @param id The pool ID
     * @param tokenId The token ID
     * @return isActive Whether auction is active
     * @return endTime When the auction ends
     * @return currentBid Current highest bid amount
     * @return currentBidder Current highest bidder
     */
    function getAuctionState(
        Id id,
        uint256 tokenId
    )
        external
        view
        virtual
        poolExists(id)
        returns (
            bool isActive,
            uint256 endTime,
            uint256 currentBid,
            address currentBidder
        )
    {
        Position memory position = positions[id][tokenId];

        bool hasEndTime = position.endTime > 0;
        bool notEnded = position.endTime > block.timestamp;

        isActive = hasEndTime && notEnded;
        endTime = position.endTime;
        currentBid = position.bid;
        currentBidder = position.bidder;

        return (isActive, endTime, currentBid, currentBidder);
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
    )
        public
        virtual
        poolExists(id)
        returns (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds)
    {
        Pool memory pool = _pools[id];

        // Pre-allocate arrays for results
        uint256[] memory tempLiquidatedIds = new uint256[](tokenIds.length);
        uint256 count = 0;

        // Accrue interest once for the entire batch
        _accrue(id);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            Position storage position = positions[id][tokenId];

            // Skip if position doesn't exist or has no debt
            if (position.owner == address(0) || position.borrowShares == 0) {
                continue;
            }

            // Skip if auction already started
            if (position.endTime != 0) {
                continue;
            }

            // Check if position is liquidatable
            uint256 healthFactor = _calculateHealthFactor(
                pool,
                position,
                tokenId
            );

            if (healthFactor < INTEREST_SCALED) {
                // Position is liquidatable, start auction
                try this._startAuctionInternal(id, tokenId) {
                    tempLiquidatedIds[count] = tokenId;
                    count++;
                } catch {
                    // Continue with next token if this one fails
                    continue;
                }
            }
        }

        // Create properly sized result array
        liquidatedTokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            liquidatedTokenIds[i] = tempLiquidatedIds[i];
        }

        liquidatedCount = count;

        if (count > 0) {
            emit PixcrossEvents.BatchLiquidationExecuted(
                id,
                count,
                liquidatedTokenIds
            );
        }

        return (liquidatedCount, liquidatedTokenIds);
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
    )
        public
        virtual
        poolExists(id)
        returns (uint256 liquidatedCount, uint256[] memory liquidatedTokenIds)
    {
        require(
            maxTokensToCheck > 0 && maxTokensToCheck <= 100,
            "Invalid maxTokensToCheck range"
        );

        Pool memory pool = _pools[id];

        // Pre-allocate arrays for results
        uint256[] memory tempLiquidatedIds = new uint256[](maxTokensToCheck);
        uint256 count = 0;

        // Accrue interest once for the entire operation
        _accrue(id);

        for (uint256 i = 0; i < maxTokensToCheck; i++) {
            uint256 tokenId = startTokenId + i;
            Position storage position = positions[id][tokenId];

            // Skip if position doesn't exist or has no debt
            if (position.owner == address(0) || position.borrowShares == 0) {
                continue;
            }

            // Skip if auction already started
            if (position.endTime != 0) {
                continue;
            }

            // Check if position is liquidatable
            uint256 healthFactor = _calculateHealthFactor(
                pool,
                position,
                tokenId
            );

            if (healthFactor < INTEREST_SCALED) {
                // Position is liquidatable, start auction
                try this._startAuctionInternal(id, tokenId) {
                    tempLiquidatedIds[count] = tokenId;
                    count++;
                } catch {
                    // Continue with next token if this one fails
                    continue;
                }
            }
        }

        // Create properly sized result array
        liquidatedTokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            liquidatedTokenIds[i] = tempLiquidatedIds[i];
        }

        liquidatedCount = count;

        if (count > 0) {
            emit PixcrossEvents.BatchLiquidationExecuted(
                id,
                count,
                liquidatedTokenIds
            );
        }

        return (liquidatedCount, liquidatedTokenIds);
    }

    /**
     * @notice Internal function to start auction (used by batch functions)
     * @param id The pool ID
     * @param tokenId The token ID to start auction for
     */
    function _startAuctionInternal(
        Id id,
        uint256 tokenId
    ) external virtual poolExists(id) returns (bool) {
        // This function should only be called by the contract itself
        require(msg.sender == address(this), "Internal function only");

        Pool memory pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Calculate minimum required bid amount
        uint256 minimumBidAmount = _calculateMinimumBidAmount(pool, position);

        // Start auction with 24 hour timer
        position.endTime = block.timestamp + AUCTION_TIME;

        // Emit auction started event
        emit PixcrossEvents.AuctionStarted(
            id,
            tokenId,
            position.owner,
            pool.collateralToken,
            pool.loanToken,
            block.timestamp,
            position.endTime,
            minimumBidAmount
        );

        return true;
    }

}
