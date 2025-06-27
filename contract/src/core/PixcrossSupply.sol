// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Id, Pool, Position} from "@interfaces/IPixcross.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {PixcrossBase} from "./PixcrossBase.sol";
import {PixcrossErrors} from "../libraries/PixcrossErrors.sol";
import {PixcrossEvents} from "../libraries/PixcrossEvents.sol";

/**
 * @title PixcrossSupply
 * @dev Contract that implements supply functionality for the Pixcross protocol.
 * Includes asset supply/withdrawal and collateral management with
 * proper share/asset conversion and safety checks.
 * @author Pixcross Team
 */
contract PixcrossSupply is PixcrossBase {
    using SafeERC20 for IERC20;
    using Math for uint256;

    // ============================================================
    //                  ASSET SUPPLY OPERATIONS
    // ============================================================

    /**
     * @notice Supplies assets to a pool
     * @param id The unique identifier of the pool
     * @param amount The amount to supply
     * @param onBehalfOf The address that will own the shares
     * @return suppliedAmount The amount supplied
     * @return supplyShares The amount of supply shares minted
     */
    function supply(
        Id id,
        uint256 amount,
        address onBehalfOf
    )
        external
        virtual
        poolExists(id)
        nonZeroAmount(amount)
        nonZeroAddress(onBehalfOf)
        returns (uint256, uint256)
    {
        Pool storage pool = _pools[id];

        // Accrue interest before any state changes
        _accrue(id);

        // Calculate supply shares based on current exchange rate
        uint256 shares = _calculateSupplyShares(pool, amount);
        if (shares == 0) revert PixcrossErrors.ZeroSharesCalculated(amount);

        // Update user and pool state
        supplies[id][onBehalfOf] += shares;
        pool.totalSupplyShares += shares;
        pool.totalSupplyAssets += amount;

        // Emit supply event
        emit PixcrossEvents.Supply(id, msg.sender, onBehalfOf, amount, shares);

        // Transfer supplied assets from user
        IERC20(pool.loanToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        return (amount, shares);
    }

    /**
     * @notice Withdraws supplied assets from a pool
     * @param id The unique identifier of the pool
     * @param shares The amount of shares to withdraw (0 = withdraw max)
     * @param onBehalfOf The address that owns the shares
     * @param receiver The address that will receive the assets
     * @return withdrawnAmount The amount withdrawn
     * @return withdrawnShares The amount of shares burned
     */
    function withdraw(
        Id id,
        uint256 shares,
        address onBehalfOf,
        address receiver
    )
        external
        virtual
        poolExists(id)
        nonZeroAddress(receiver)
        onlyOperator(onBehalfOf)
        returns (uint256, uint256)
    {
        Pool storage pool = _pools[id];

        // Accrue interest before any state changes
        _accrue(id);

        // Determine shares to withdraw (0 = withdraw max)
        uint256 userShares = supplies[id][onBehalfOf];
        uint256 sharesToWithdraw = (shares == 0) ? userShares : shares;

        // Ensure not withdrawing more than owned
        if (sharesToWithdraw > userShares) {
            revert PixcrossErrors.InsufficientShares(
                sharesToWithdraw,
                userShares
            );
        }

        // Calculate amount based on current exchange rate
        uint256 amount = _calculateSupplyAmount(pool, sharesToWithdraw);
        if (amount == 0)
            revert PixcrossErrors.ZeroAmountCalculated(sharesToWithdraw);

        // Update user and pool state
        supplies[id][onBehalfOf] -= sharesToWithdraw;
        pool.totalSupplyShares -= sharesToWithdraw;
        pool.totalSupplyAssets -= amount;

        // Ensure enough liquidity in pool after withdrawal
        uint256 availableLiquidity = pool.totalSupplyAssets >= pool.totalBorrowAssets ? 
            pool.totalSupplyAssets - pool.totalBorrowAssets : 0;
        
        // Check if withdrawal would leave insufficient liquidity
        if (availableLiquidity < amount) {
            revert PixcrossErrors.InsufficientLiquidity(amount, availableLiquidity);
        }

        // Emit withdraw event
        emit PixcrossEvents.Withdraw(
            id,
            msg.sender,
            onBehalfOf,
            receiver,
            amount,
            sharesToWithdraw
        );

        // Transfer withdrawn assets to receiver
        IERC20(pool.loanToken).safeTransfer(receiver, amount);

        return (amount, sharesToWithdraw);
    }

    // ============================================================
    //                COLLATERAL MANAGEMENT
    // ============================================================

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
    ) external virtual poolExists(id) nonZeroAddress(onBehalfOf) {
        Pool storage pool = _pools[id];

        // Verify token ownership
        address tokenOwner = IERC721(pool.collateralToken).ownerOf(tokenId);
        if (tokenOwner != msg.sender) {
            revert PixcrossErrors.NotTokenOwner(
                tokenId,
                msg.sender,
                tokenOwner
            );
        }

        // Record position ownership
        positions[id][tokenId].owner = msg.sender;

        // Emit supply collateral event
        emit PixcrossEvents.SupplyCollateral(
            id,
            tokenId,
            msg.sender,
            onBehalfOf
        );

        // Transfer NFT to contract
        IERC721(pool.collateralToken).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );
    }

    /**
     * @notice Supplies collateral and borrows in a single transaction
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to supply as collateral
     * @param amount The amount to borrow
     * @param onBehalfOf The address that will own the debt
     * @param receiver The address that will receive the borrowed assets
     * @return borrowedAmount The amount borrowed
     * @return borrowShares The amount of borrow shares minted
     * @dev This function is meant to be overridden by contracts that inherit from PixcrossSupply
     *      and have access to borrow functionality. The base implementation only supplies collateral.
     */
    function supplyCollateralAndBorrow(
        Id id,
        uint256 tokenId,
        uint256 amount,
        address onBehalfOf,
        address receiver
    )
        external
        virtual
        poolExists(id)
        nonZeroAmount(amount)
        nonZeroAddress(onBehalfOf)
        nonZeroAddress(receiver)
        returns (uint256, uint256)
    {
        // Supply collateral first
        this.supplyCollateral(id, tokenId, onBehalfOf);

        // In the base implementation, we don't borrow
        // This function should be overridden by contracts that have borrow functionality
        return (0, 0);
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
    )
        external
        virtual
        poolExists(id)
        nonZeroAddress(receiver)
        onlyOperator(onBehalfOf)
    {
        Pool storage pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Verify position ownership
        if (position.owner != onBehalfOf) {
            revert PixcrossErrors.NotPositionOwner(
                tokenId,
                msg.sender,
                position.owner
            );
        }

        // Ensure no outstanding debt
        if (position.borrowShares != 0) {
            uint256 outstandingDebt = position.borrowShares.mulDiv(
                pool.totalBorrowAssets,
                pool.totalBorrowShares
            );
            revert PixcrossErrors.DebtNotZero(outstandingDebt);
        }

        // Clear position data
        delete positions[id][tokenId];

        // Emit withdraw collateral event
        emit PixcrossEvents.WithdrawCollateral(
            id,
            tokenId,
            msg.sender,
            onBehalfOf,
            receiver
        );

        // Transfer NFT to receiver
        IERC721(pool.collateralToken).safeTransferFrom(
            address(this),
            receiver,
            tokenId
        );
    }

    /**
     * @notice Withdraws royalties from a position (placeholder, not implemented)
     * @dev This is a stub for future implementation of royalty distribution
     */
    function withdrawRoyalty(
        Id id,
        uint256 tokenId,
        address onBehalfOf,
        address receiver
    ) external virtual {
        // Placeholder for future implementation
    }

    // ============================================================
    //                  PUBLIC WRAPPERS FOR INTERNAL FUNCTIONS
    // ============================================================

    /**
     * @notice Public wrapper for supply operation
     * @param id The unique identifier of the pool
     * @param amount The amount to supply
     * @param onBehalfOf The address that will own the shares
     * @return suppliedAmount The amount supplied
     * @return supplyShares The amount of supply shares minted
     */
    function _supply(
        Id id,
        uint256 amount,
        address onBehalfOf
    ) public virtual poolExists(id) returns (uint256, uint256) {
        Pool storage pool = _pools[id];

        // Transfer tokens from user
        IERC20(pool.loanToken).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );

        // Calculate shares to mint based on current exchange rate
        uint256 shares = _calculateSupplyShares(pool, amount);
        if (shares == 0) revert PixcrossErrors.ZeroSharesCalculated(amount);

        // Update pool state
        pool.totalSupplyAssets += amount;
        pool.totalSupplyShares += shares;

        // Update user's supply balance
        supplies[id][onBehalfOf] += shares;

        emit PixcrossEvents.Supply(id, msg.sender, onBehalfOf, amount, shares);

        return (amount, shares);
    }

    /**
     * @notice Public wrapper for withdraw operation
     * @param id The unique identifier of the pool
     * @param shares The amount of shares to withdraw
     * @param onBehalfOf The address that owns the shares
     * @param receiver The address that will receive the assets
     * @return withdrawnAmount The amount withdrawn
     * @return withdrawnShares The amount of shares burned
     */
    function _withdraw(
        Id id,
        uint256 shares,
        address onBehalfOf,
        address receiver
    ) public virtual poolExists(id) returns (uint256, uint256) {
        Pool storage pool = _pools[id];

        // Determine shares to withdraw (0 = withdraw max)
        uint256 userShares = supplies[id][onBehalfOf];
        uint256 sharesToWithdraw = (shares == 0) ? userShares : shares;

        // Ensure not withdrawing more than owned
        if (sharesToWithdraw > userShares) {
            revert PixcrossErrors.InsufficientShares(
                sharesToWithdraw,
                userShares
            );
        }

        // Calculate amount based on current exchange rate
        uint256 amount = _calculateSupplyAmount(pool, sharesToWithdraw);
        if (amount == 0)
            revert PixcrossErrors.ZeroAmountCalculated(sharesToWithdraw);

        // Update pool state
        pool.totalSupplyAssets -= amount;
        pool.totalSupplyShares -= sharesToWithdraw;

        // Update user's supply balance
        supplies[id][onBehalfOf] -= sharesToWithdraw;

        // Transfer assets to receiver
        IERC20(pool.loanToken).safeTransfer(receiver, amount);

        emit PixcrossEvents.Withdraw(
            id,
            msg.sender,
            onBehalfOf,
            receiver,
            amount,
            sharesToWithdraw
        );

        return (amount, sharesToWithdraw);
    }

    /**
     * @notice Public wrapper for supply collateral operation
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to supply as collateral
     * @param onBehalfOf The address that will own the position
     */
    function _supplyCollateral(
        Id id,
        uint256 tokenId,
        address onBehalfOf
    ) public virtual poolExists(id) {
        Pool storage pool = _pools[id];

        // Verify token ownership
        address tokenOwner = IERC721(pool.collateralToken).ownerOf(tokenId);
        if (tokenOwner != msg.sender) {
            revert PixcrossErrors.NotTokenOwner(
                tokenId,
                msg.sender,
                tokenOwner
            );
        }

        // Record position ownership
        positions[id][tokenId].owner = msg.sender;

        // Transfer NFT to contract
        IERC721(pool.collateralToken).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        emit PixcrossEvents.SupplyCollateral(
            id,
            tokenId,
            msg.sender,
            onBehalfOf
        );
    }

    /**
     * @notice Public wrapper for withdraw collateral operation
     * @param id The unique identifier of the pool
     * @param tokenId The token ID to withdraw
     * @param onBehalfOf The address that owns the position
     * @param receiver The address that will receive the collateral
     */
    function _withdrawCollateral(
        Id id,
        uint256 tokenId,
        address onBehalfOf,
        address receiver
    ) public virtual poolExists(id) {
        Pool storage pool = _pools[id];
        Position storage position = positions[id][tokenId];

        // Verify position ownership
        if (position.owner != onBehalfOf) {
            revert PixcrossErrors.NotPositionOwner(
                tokenId,
                msg.sender,
                position.owner
            );
        }

        // Ensure no outstanding debt
        if (position.borrowShares != 0) {
            uint256 outstandingDebt = position.borrowShares.mulDiv(
                pool.totalBorrowAssets,
                pool.totalBorrowShares
            );
            revert PixcrossErrors.DebtNotZero(outstandingDebt);
        }

        // Clear position data
        delete positions[id][tokenId];

        // Transfer NFT to receiver
        IERC721(pool.collateralToken).safeTransferFrom(
            address(this),
            receiver,
            tokenId
        );

        emit PixcrossEvents.WithdrawCollateral(
            id,
            tokenId,
            msg.sender,
            onBehalfOf,
            receiver
        );
    }

    /**
     * @notice Public wrapper for withdraw royalty operation
     * @param id The unique identifier of the pool
     * @param tokenId The token ID
     * @param onBehalfOf The address that owns the position
     * @param receiver The address that will receive the royalties
     */
    function _withdrawRoyalty(
        Id id,
        uint256 tokenId,
        address onBehalfOf,
        address receiver
    ) public virtual poolExists(id) {
        // Placeholder for future implementation
    }

    // ============================================================
    //                  INTERNAL FUNCTIONS
    // ============================================================

    /**
     * @notice Calculates supply shares for a given asset amount
     * @param pool The pool data
     * @param amount The amount of assets to calculate shares for
     * @return shares The corresponding share amount
     */
    function _calculateSupplyShares(
        Pool memory pool,
        uint256 amount
    ) internal pure returns (uint256) {
        // If no existing supplies, initial exchange rate is 1:1
        if (pool.totalSupplyShares == 0) {
            return amount;
        }

        // Calculate shares based on current exchange rate
        // shares = amount * totalSupplyShares / totalSupplyAssets
        return amount.mulDiv(pool.totalSupplyShares, pool.totalSupplyAssets);
    }

    /**
     * @notice Calculates asset amount for a given number of supply shares
     * @param pool The pool data
     * @param shares The number of shares to calculate assets for
     * @return assets The corresponding asset amount
     */
    function _calculateSupplyAmount(
        Pool memory pool,
        uint256 shares
    ) internal pure returns (uint256) {
        // If no existing supplies, initial exchange rate is 1:1
        if (pool.totalSupplyShares == 0) {
            return shares;
        }

        // Calculate amount based on current exchange rate
        // amount = shares * totalSupplyAssets / totalSupplyShares
        return shares.mulDiv(pool.totalSupplyAssets, pool.totalSupplyShares);
    }

    /**
     * @notice Gets the current supply amount for a user
     * @param id The pool ID
     * @param user The user address
     * @return amount The current supply amount including accrued interest
     */
    function getCurrentSupplyAmount(
        Id id,
        address user
    ) external view virtual poolExists(id) returns (uint256) {
        Pool memory pool = _pools[id];
        uint256 userShares = supplies[id][user];

        if (userShares == 0) return 0;

        return
            userShares.mulDiv(pool.totalSupplyAssets, pool.totalSupplyShares);
    }

    /**
     * @notice Gets the exchange rate for a pool's supplies
     * @param id The pool ID
     * @return exchangeRate The current exchange rate (assets per share, scaled by 1e18)
     */
    function getSupplyExchangeRate(
        Id id
    ) external view virtual poolExists(id) returns (uint256) {
        Pool memory pool = _pools[id];
        return
            _calculateExchangeRate(
                pool.totalSupplyAssets,
                pool.totalSupplyShares
            );
    }
}
