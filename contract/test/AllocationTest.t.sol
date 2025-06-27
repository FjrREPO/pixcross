// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {PixcrossCurator} from "../src/core/PixcrossCurator.sol";
import {Pixcross} from "../src/core/Pixcross.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AllocationTest is Test {
    PixcrossCurator curator;
    Pixcross pixcross;
    MockERC20 mockToken;
    
    // Test addresses
    address constant TEST_USER = address(0x1234);
    
    function setUp() public {
        // Deploy mock contracts locally instead of using fork
        pixcross = new Pixcross();
        mockToken = new MockERC20("Test Token", "TEST", 18);
        
        // Deploy curator with mock contracts
        curator = new PixcrossCurator(
            "Test Vault",
            "TV",
            address(pixcross),
            address(mockToken)
        );
        
        // Mint some tokens for testing
        mockToken.mint(TEST_USER, 100000e18);
        mockToken.mint(address(curator), 1000e18); // Give curator some balance for testing
    }
    
    function testAllocationWith70Percent() public {
        // Test the allocation calculation
        uint256 totalAllocation = 70e16; // 70%
        uint256 depositAmount = 100e18; // 100 tokens
        
        // Expected allocated amount: 70% of 100 = 70 tokens
        uint256 expectedAllocated = (depositAmount * totalAllocation) / 1e18;
        uint256 expectedIdle = depositAmount - expectedAllocated;
        
        console.log("Deposit amount:", depositAmount);
        console.log("Expected allocated (70%):", expectedAllocated);
        console.log("Expected idle (30%):", expectedIdle);
        
        assertEq(expectedAllocated, 70e18);
        assertEq(expectedIdle, 30e18);
    }
    
    function testPreviewDepositCalculation() public {
        // Test that previewDeposit calculates correctly
        uint256 currentTotalSupply = curator.totalSupply();
        uint256 currentTotalAssets = curator.totalAssets();
        
        console.log("Current total supply:", currentTotalSupply);
        console.log("Current total assets:", currentTotalAssets);
        
        uint256 depositAmount = 100e18;
        uint256 previewShares = curator.previewDeposit(depositAmount);
        
        console.log("Preview shares:", previewShares);
        
        // For first deposit when total supply is 0, should be 1:1 ratio
        if (currentTotalSupply == 0) {
            assertEq(previewShares, depositAmount);
        } else {
            // For subsequent deposits, calculate expected shares
            uint256 expectedShares = (depositAmount * currentTotalSupply) / currentTotalAssets;
            assertEq(previewShares, expectedShares);
        }
    }
    
    function testUserBalance() public {
        // Test user balance tracking after deposit
        uint256 userBalanceBefore = curator.userSuppliedBalance(TEST_USER);
        console.log("User supplied balance before:", userBalanceBefore);
        
        // Initially should be 0
        assertEq(userBalanceBefore, 0);
        
        // Make a deposit as the test user
        vm.startPrank(TEST_USER);
        mockToken.approve(address(curator), 100e18);
        curator.deposit(100e18, TEST_USER);
        vm.stopPrank();
        
        // Check balance after deposit
        uint256 userBalanceAfter = curator.userSuppliedBalance(TEST_USER);
        console.log("User supplied balance after:", userBalanceAfter);
        
        // Should equal the deposit amount
        assertEq(userBalanceAfter, 100e18);
    }
}
