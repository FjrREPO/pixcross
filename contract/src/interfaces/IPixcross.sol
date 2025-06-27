// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

type Id is bytes32;

struct PoolParams {
    address collateralToken;
    address loanToken;
    address oracle;
    address irm;
    uint256 ltv;
    uint256 lth;
}

struct Pool {
    address collateralToken;
    address loanToken;
    address oracle;
    address irm;
    uint256 ltv;
    uint256 lth;
    uint256 totalSupplyAssets;
    uint256 totalSupplyShares;
    uint256 totalBorrowAssets;
    uint256 totalBorrowShares;
    uint256 lastAccrued;
}

struct Position {
    uint256 borrowShares;
    address owner;
    address bidder;
    uint256 bid;
    uint256 endTime;
}

interface IPixcross {
    function pools(
        Id id
    )
        external
        view
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
        );
}
