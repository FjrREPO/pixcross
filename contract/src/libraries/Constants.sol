// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title Constants
 * @dev Library containing constant values used throughout the project
 */
library Constants {
    // Common blockchain-related constants
    uint256 public constant SECONDS_PER_DAY = 86400;
    uint256 public constant SECONDS_PER_HOUR = 3600;
    uint256 public constant SECONDS_PER_MINUTE = 60;

    // Common denominations
    uint256 public constant WEI_PER_ETHER = 1e18;
    uint8 public constant DECIMALS = 18;

    // Protocol specific constants
    // Add your protocol-specific constants here

    // Gas related
    uint256 public constant GAS_OVERHEAD = 21000;


    // Interest scaling constant
    uint256 public constant INTEREST_SCALED = 1e18;
}
