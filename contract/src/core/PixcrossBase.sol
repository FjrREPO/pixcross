// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {IPixcross, Id, Pool, Position, PoolParams} from "@interfaces/IPixcross.sol";
import {Iirm} from "@interfaces/Iirm.sol";
import {IOracle} from "@interfaces/IOracle.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {PixcrossStorage} from "./PixcrossStorage.sol";
import {PixcrossErrors} from "../libraries/PixcrossErrors.sol";
import {PixcrossEvents} from "../libraries/PixcrossEvents.sol";

/**
 * @title PixcrossBase
 * @dev Base contract for the Pixcross protocol with core functionality.
 * Implements pool creation, interest accrual, health factor calculations,
 * and other core protocol operations.
 * @author Pixcross Team
 */
contract PixcrossBase is PixcrossStorage, IERC721Receiver {
    using Math for uint256;

    // ============================================================
    //                  PROTOCOL MANAGEMENT
    // ============================================================

    /**
     * @notice Checks if a pool exists
     * @param id The unique identifier of the pool
     * @return bool True if the pool exists, false otherwise
     */
    function isPoolExist(Id id) external view virtual returns (bool) {
        return _pools[id].lastAccrued != 0;
    }

    /**
     * @notice Interface implementation for pool data
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

    /**
     * @notice Sets an interest rate model as enabled or disabled
     * @param irm The address of the interest rate model
     * @param enabled Whether the model should be enabled or disabled
     */
    function setInterestRateModel(
        address irm,
        bool enabled
    ) external virtual onlyOwner {
        if (irm == address(0)) revert PixcrossErrors.ZeroAddress("irm");
        interestRateModels[irm] = enabled;
        emit PixcrossEvents.InterestRateModelChanged(irm, enabled);
    }

    /**
     * @notice Sets a loan-to-value ratio as enabled or disabled
     * @param ltv The loan-to-value ratio (as a percentage)
     * @param enabled Whether the LTV should be enabled or disabled
     */
    function setLTV(uint256 ltv, bool enabled) external virtual onlyOwner {
        if (ltv > 100) revert PixcrossErrors.LTVExceeded(ltv);
        ltvs[ltv] = enabled;
        emit PixcrossEvents.LTVChanged(ltv, enabled);
    }

    // ============================================================
    //                  POOL MANAGEMENT
    // ============================================================

    /**
     * @notice Creates a new lending pool
     * @param poolParams The parameters for the pool
     * @return id The unique identifier of the created pool
     */
    function createPool(
        PoolParams memory poolParams
    ) external virtual returns (Id) {
        // Validate pool parameters
        _validatePoolParams(poolParams);

        // Compute unique pool ID based on parameters
        Id id = computeId(poolParams);

        // Check if pool already exists
        Pool storage pool = _pools[id];
        if (pool.lastAccrued != 0)
            revert PixcrossErrors.PoolAlreadyCreated(Id.unwrap(id));

        // Initialize pool with parameters
        pool.collateralToken = poolParams.collateralToken;
        pool.loanToken = poolParams.loanToken;
        pool.oracle = poolParams.oracle;
        pool.irm = poolParams.irm;
        pool.ltv = poolParams.ltv;
        pool.lth = poolParams.lth;
        pool.lastAccrued = block.timestamp;

        // Emit pool creation event with detailed parameters
        emit PixcrossEvents.PoolCreated(
            id,
            poolParams.collateralToken,
            poolParams.loanToken,
            poolParams.oracle,
            poolParams.irm,
            poolParams.ltv,
            poolParams.lth
        );

        return id;
    }

    /**
     * @notice Computes the unique identifier for a pool based on its parameters
     * @param poolParams The parameters for the pool
     * @return id The unique identifier
     */
    function computeId(
        PoolParams memory poolParams
    ) public pure virtual returns (Id id) {
        return Id.wrap(keccak256(abi.encode(poolParams)));
    }

    /**
     * @notice Manually triggers interest accrual for a pool
     * @param id The unique identifier of the pool
     */
    function accrueInterest(Id id) external virtual poolExists(id) {
        _accrue(id);
    }

    /**
     * @notice Gets position information for a token
     * @param id The unique identifier of the pool
     * @param tokenId The token ID
     * @return borrowShares The amount of borrow shares
     * @return owner The owner of the position
     */
    function getPositon(
        Id id,
        uint256 tokenId
    ) external view virtual poolExists(id) returns (uint256, address) {
        return (
            positions[id][tokenId].borrowShares,
            positions[id][tokenId].owner
        );
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
    ) public virtual nonZeroAddress(operator) returns (bool) {
        operators[msg.sender][operator] = approved;
        emit PixcrossEvents.OperatorSet(msg.sender, operator, approved);
        return true;
    }

    /**
     * @notice Implements the ERC721 receiver interface for safe transfers
     * @return bytes4 The function selector
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // ============================================================
    //                  INTERNAL CORE FUNCTIONS
    // ============================================================

    /**
     * @notice Creates a new pool (internal implementation)
     */
    function _createPool(PoolParams memory poolParams) internal virtual returns (Id) {
        _validatePoolParams(poolParams);
        Id id = _computeId(poolParams);
        Pool storage pool = _pools[id];
        if (pool.lastAccrued != 0) revert PixcrossErrors.PoolAlreadyCreated(Id.unwrap(id));
        
        pool.collateralToken = poolParams.collateralToken;
        pool.loanToken = poolParams.loanToken;
        pool.oracle = poolParams.oracle;
        pool.irm = poolParams.irm;
        pool.ltv = poolParams.ltv;
        pool.lth = poolParams.lth;
        pool.lastAccrued = block.timestamp;
        
        // Add pool ID to tracking array
        _poolIds.push(id);
        
        emit PixcrossEvents.PoolCreated(id, poolParams.collateralToken, poolParams.loanToken, poolParams.oracle, poolParams.irm, poolParams.ltv, poolParams.lth);
        return id;
    }

    function _computeId(PoolParams memory poolParams) internal pure virtual returns (Id) {
        return Id.wrap(keccak256(abi.encode(poolParams)));
    }

    function _setInterestRateModel(address irm, bool enabled) internal virtual {
        if (irm == address(0)) revert PixcrossErrors.ZeroAddress("irm");
        interestRateModels[irm] = enabled;
        emit PixcrossEvents.InterestRateModelChanged(irm, enabled);
    }

    function _setLTV(uint256 ltv, bool enabled) internal virtual {
        if (ltv > 100) revert PixcrossErrors.LTVExceeded(ltv);
        ltvs[ltv] = enabled;
        emit PixcrossEvents.LTVChanged(ltv, enabled);
    }

    function _isPoolExist(Id id) internal view virtual returns (bool) {
        return _pools[id].lastAccrued != 0;
    }

    // ============================================================
    //                  INTERNAL FUNCTIONS
    // ============================================================

    /**
     * @notice Validates pool parameters before creation
     * @param poolParams The parameters to validate
     */
    function _validatePoolParams(PoolParams memory poolParams) internal view {
        // Check for zero addresses
        if (poolParams.collateralToken == address(0))
            revert PixcrossErrors.ZeroAddress("collateralToken");
        if (poolParams.loanToken == address(0))
            revert PixcrossErrors.ZeroAddress("loanToken");
        if (poolParams.oracle == address(0))
            revert PixcrossErrors.ZeroAddress("oracle");
        if (poolParams.irm == address(0))
            revert PixcrossErrors.ZeroAddress("irm");

        // Check if IRM is enabled
        if (!interestRateModels[poolParams.irm])
            revert PixcrossErrors.IRMNotExist(poolParams.irm);

        // Check if LTV is enabled
        if (!ltvs[poolParams.ltv])
            revert PixcrossErrors.LTVNotExist(poolParams.ltv);

        // Check LTV/LTH relationship
        if (poolParams.ltv > poolParams.lth)
            revert PixcrossErrors.LTVGreaterThanLTH(
                poolParams.ltv,
                poolParams.lth
            );
    }

    /**
     * @notice Accrues interest for a pool
     */
    function _accrue(Id id) internal returns (uint256) {
        Pool storage pool = _pools[id];
        uint256 timeElapsed = block.timestamp - pool.lastAccrued;
        
        if (timeElapsed == 0) return 0;
        if (pool.totalBorrowAssets == 0 || pool.totalBorrowShares == 0) {
            pool.lastAccrued = block.timestamp;
            return 0;
        }
        
        uint256 borrowRate = Iirm(pool.irm).getBorrowRate(id, pool);
        uint256 accumulatedInterest = pool.totalBorrowAssets.mulDiv(
            borrowRate * timeElapsed,
            INTEREST_SCALED * 365 days
        );
        
        pool.totalBorrowAssets += accumulatedInterest;
        pool.totalSupplyAssets += accumulatedInterest;
        pool.lastAccrued = block.timestamp;
        
        emit PixcrossEvents.InterestAccrued(id, borrowRate, accumulatedInterest, timeElapsed, 0);
        return accumulatedInterest;
    }

    function _calculateExchangeRate(uint256 assets, uint256 shares) internal pure returns (uint256) {
        return shares == 0 ? INTEREST_SCALED : assets.mulDiv(INTEREST_SCALED, shares);
    }

    function _isHealthy(Pool memory pool, Position memory position, uint256 tokenId) internal view virtual returns (bool) {
        if (position.borrowShares == 0) return true;
        uint256 collateralValue = IOracle(pool.oracle).getPrice(tokenId);
        uint256 borrowed = position.borrowShares.mulDiv(pool.totalBorrowAssets, pool.totalBorrowShares);
        return borrowed <= (collateralValue * pool.lth) / 100;
    }

    function _calculateMaxBorrow(Pool memory pool, uint256 tokenId) internal view returns (uint256) {
        return (IOracle(pool.oracle).getPrice(tokenId) * pool.ltv) / 100;
    }

    function _isMaxBorrow(Pool memory pool, Position memory position, uint256 tokenId) internal view virtual returns (bool) {
        uint256 collateralValue = IOracle(pool.oracle).getPrice(tokenId);
        uint256 borrowed = position.borrowShares.mulDiv(pool.totalBorrowAssets, pool.totalBorrowShares);
        return borrowed > (collateralValue * pool.ltv) / 100;
    }

    function _calculateHealthFactor(Pool memory pool, Position memory position, uint256 tokenId) internal view virtual returns (uint256) {
        if (position.borrowShares == 0) return type(uint256).max;
        uint256 collateralValue = IOracle(pool.oracle).getPrice(tokenId);
        uint256 borrowed = position.borrowShares.mulDiv(pool.totalBorrowAssets, pool.totalBorrowShares);
        uint256 liquidationValue = (collateralValue * pool.lth) / 100;
        return liquidationValue.mulDiv(INTEREST_SCALED, borrowed);
    }
}
