// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {PixcrossFaucet} from "../src/core/PixcrossFaucet.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PixcrossFaucetTest
 * @dev Comprehensive tests for PixcrossFaucet contract
 */
contract PixcrossFaucetTest is Test {
    // Constants
    uint256 constant INITIAL_SUPPLY = 1000000 * 10**18; // 1M tokens
    uint256 constant DEFAULT_FAUCET_LIMIT = 100 * 10**18; // 100 tokens
    uint256 constant DEFAULT_COOLDOWN = 24 hours;
    uint256 constant SUPPLY_AMOUNT = 10000 * 10**18; // 10K tokens
    uint256 constant CLAIM_AMOUNT = 50 * 10**18; // 50 tokens

    // Test accounts
    address owner;
    address supplier1;
    address supplier2;
    address claimer1;
    address claimer2;
    address receiver1;
    address receiver2;

    // Contracts
    PixcrossFaucet faucet;
    MockERC20 tokenA;
    MockERC20 tokenB;

    // Events for testing
    event TokensSupplied(address indexed supplier, address indexed token, uint256 amount);
    event TokensClaimed(address indexed claimer, address indexed token, address indexed receiver, uint256 amount);
    event FaucetLimitUpdated(address indexed token, uint256 newLimit);
    event CooldownUpdated(uint256 newCooldown);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    function setUp() public {
        // Setup accounts
        owner = address(this);
        supplier1 = makeAddr("supplier1");
        supplier2 = makeAddr("supplier2");
        claimer1 = makeAddr("claimer1");
        claimer2 = makeAddr("claimer2");
        receiver1 = makeAddr("receiver1");
        receiver2 = makeAddr("receiver2");

        // Deploy contracts
        faucet = new PixcrossFaucet();
        tokenA = new MockERC20("Token A", "TKA", 18);
        tokenB = new MockERC20("Token B", "TKB", 18);

        // Mint tokens to suppliers
        tokenA.mint(supplier1, INITIAL_SUPPLY);
        tokenA.mint(supplier2, INITIAL_SUPPLY);
        tokenB.mint(supplier1, INITIAL_SUPPLY);
        tokenB.mint(supplier2, INITIAL_SUPPLY);

        // Setup approvals
        vm.prank(supplier1);
        tokenA.approve(address(faucet), type(uint256).max);
        vm.prank(supplier1);
        tokenB.approve(address(faucet), type(uint256).max);
        vm.prank(supplier2);
        tokenA.approve(address(faucet), type(uint256).max);
        vm.prank(supplier2);
        tokenB.approve(address(faucet), type(uint256).max);
    }

    // ============ Supply Tests ============

    function testSupplyTokens() public {
        vm.expectEmit(true, true, false, true);
        emit TokensSupplied(supplier1, address(tokenA), SUPPLY_AMOUNT);

        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);

        // Check faucet state
        (uint256 balance, uint256 faucetLimit, bool isActive) = faucet.tokenInfo(address(tokenA));
        assertEq(balance, SUPPLY_AMOUNT);
        assertEq(faucetLimit, DEFAULT_FAUCET_LIMIT);
        assertTrue(isActive);
        assertTrue(faucet.supportedTokens(address(tokenA)));
    }

    function testSupplyTokensMultipleSuppliers() public {
        // First supplier
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);

        // Second supplier adds more
        vm.prank(supplier2);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT / 2);

        // Check total balance
        (uint256 balance,,) = faucet.tokenInfo(address(tokenA));
        assertEq(balance, SUPPLY_AMOUNT + SUPPLY_AMOUNT / 2);
    }

    function testSupplyTokensRevertInvalidToken() public {
        vm.expectRevert("Invalid token address");
        vm.prank(supplier1);
        faucet.supplyTokens(address(0), SUPPLY_AMOUNT);
    }

    function testSupplyTokensRevertZeroAmount() public {
        vm.expectRevert("Amount must be greater than 0");
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), 0);
    }

    function testSupplyTokensRevertInsufficientBalance() public {
        vm.expectRevert("Insufficient balance");
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), INITIAL_SUPPLY + 1);
    }

    // ============ Claim Tests ============

    function testClaimTokens() public {
        // First supply tokens
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);

        vm.expectEmit(true, true, true, true);
        emit TokensClaimed(claimer1, address(tokenA), receiver1, CLAIM_AMOUNT);

        // Claim tokens
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);

        // Check balances
        assertEq(tokenA.balanceOf(receiver1), CLAIM_AMOUNT);
        (uint256 balance,,) = faucet.tokenInfo(address(tokenA));
        assertEq(balance, SUPPLY_AMOUNT - CLAIM_AMOUNT);
    }

    function testClaimTokensRevertCooldown() public {
        // Supply and claim once
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);

        // Try to claim again immediately
        vm.expectRevert("Cooldown period not elapsed");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
    }

    function testClaimTokensAfterCooldown() public {
        // Supply tokens
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // First claim
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);

        // Wait for cooldown to pass
        vm.warp(block.timestamp + DEFAULT_COOLDOWN + 1);

        // Second claim should work
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);

        assertEq(tokenA.balanceOf(receiver1), CLAIM_AMOUNT * 2);
    }

    function testClaimTokensRevertExceedsLimit() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);

        vm.expectRevert("Amount exceeds faucet limit");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, DEFAULT_FAUCET_LIMIT + 1);
    }

    function testClaimTokensRevertInsufficientFaucetBalance() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), CLAIM_AMOUNT / 2); // Supply less than claim amount

        vm.expectRevert("Insufficient faucet balance");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
    }

    function testClaimTokensRevertUnsupportedToken() public {
        vm.expectRevert("Token not supported");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
    }

    function testClaimTokensRevertInvalidAddresses() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);

        // Invalid token
        vm.expectRevert("Invalid token address");
        vm.prank(claimer1);
        faucet.claimTokens(address(0), receiver1, CLAIM_AMOUNT);

        // Invalid receiver
        vm.expectRevert("Invalid receiver address");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), address(0), CLAIM_AMOUNT);
    }

    // ============ Cooldown Tests ============

    function testNoCooldownWhenSetToZero() public {
        // Set cooldown to 0
        faucet.setCooldownPeriod(0);
        
        // Supply tokens
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Claim multiple times without waiting
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);

        assertEq(tokenA.balanceOf(receiver1), CLAIM_AMOUNT * 3);
    }

    function testGetTimeUntilNextClaim() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // No previous claim
        assertEq(faucet.getTimeUntilNextClaim(claimer1, address(tokenA)), 0);
        
        // After first claim
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        uint256 remaining = faucet.getTimeUntilNextClaim(claimer1, address(tokenA));
        assertEq(remaining, DEFAULT_COOLDOWN);
        
        // After some time passes
        vm.warp(block.timestamp + 12 hours);
        remaining = faucet.getTimeUntilNextClaim(claimer1, address(tokenA));
        assertEq(remaining, 12 hours);
        
        // After cooldown passes
        vm.warp(block.timestamp + 12 hours + 1);
        remaining = faucet.getTimeUntilNextClaim(claimer1, address(tokenA));
        assertEq(remaining, 0);
    }

    // ============ View Function Tests ============

    function testCanClaim() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Should be able to claim initially
        (bool success, string memory reason) = faucet.canClaim(claimer1, address(tokenA), CLAIM_AMOUNT);
        assertTrue(success);
        assertEq(reason, "Can claim");
        
        // After claiming, should not be able to claim due to cooldown
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        (success, reason) = faucet.canClaim(claimer1, address(tokenA), CLAIM_AMOUNT);
        assertFalse(success);
        assertEq(reason, "Cooldown period not elapsed");
    }

    function testCanClaimVariousReasons() public {
        // Unsupported token
        (bool canClaim, string memory reason) = faucet.canClaim(claimer1, address(tokenA), CLAIM_AMOUNT);
        assertFalse(canClaim);
        assertEq(reason, "Token not supported");
        
        // Supply tokens and test other reasons
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Exceeds limit
        (canClaim, reason) = faucet.canClaim(claimer1, address(tokenA), DEFAULT_FAUCET_LIMIT + 1);
        assertFalse(canClaim);
        assertEq(reason, "Amount exceeds faucet limit");
        
        // Test insufficient balance by supplying less tokens than limit
        // Supply only 50 tokens but try to claim 100 (which is within the limit)
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenB), CLAIM_AMOUNT); // Supply 50 tokens
        
        (canClaim, reason) = faucet.canClaim(claimer1, address(tokenB), DEFAULT_FAUCET_LIMIT); // Try to claim 100
        assertFalse(canClaim);
        assertEq(reason, "Insufficient faucet balance");
    }

    function testGetSupportedTokens() public {
        address[] memory tokens = faucet.getSupportedTokens();
        assertEq(tokens.length, 0);
        
        // Add tokens
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenB), SUPPLY_AMOUNT);
        
        tokens = faucet.getSupportedTokens();
        assertEq(tokens.length, 2);
        assertEq(tokens[0], address(tokenA));
        assertEq(tokens[1], address(tokenB));
    }

    function testGetTokenInfo() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        PixcrossFaucet.TokenInfo memory info = faucet.getTokenInfo(address(tokenA));
        assertEq(info.balance, SUPPLY_AMOUNT);
        assertEq(info.faucetLimit, DEFAULT_FAUCET_LIMIT);
        assertTrue(info.isActive);
    }

    // ============ Admin Function Tests ============

    function testSetFaucetLimit() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        uint256 newLimit = 200 * 10**18;
        
        vm.expectEmit(true, false, false, true);
        emit FaucetLimitUpdated(address(tokenA), newLimit);
        
        faucet.setFaucetLimit(address(tokenA), newLimit);
        
        (, uint256 faucetLimit,) = faucet.tokenInfo(address(tokenA));
        assertEq(faucetLimit, newLimit);
    }

    function testSetFaucetLimitRevertUnsupported() public {
        vm.expectRevert("Token not supported");
        faucet.setFaucetLimit(address(tokenA), 200 * 10**18);
    }

    function testSetDefaultFaucetLimit() public {
        uint256 newDefault = 500 * 10**18;
        faucet.setDefaultFaucetLimit(newDefault);
        assertEq(faucet.defaultFaucetLimit(), newDefault);
        
        // New tokens should use the new default
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        (, uint256 faucetLimit,) = faucet.tokenInfo(address(tokenA));
        assertEq(faucetLimit, newDefault);
    }

    function testSetCooldownPeriod() public {
        uint256 newCooldown = 12 hours;
        
        vm.expectEmit(false, false, false, true);
        emit CooldownUpdated(newCooldown);
        
        faucet.setCooldownPeriod(newCooldown);
        assertEq(faucet.cooldownPeriod(), newCooldown);
    }

    function testSetTokenActive() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Disable token
        faucet.setTokenActive(address(tokenA), false);
        
        (,, bool isActive) = faucet.tokenInfo(address(tokenA));
        assertFalse(isActive);
        
        // Should not be able to claim
        vm.expectRevert("Token claiming is disabled");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        // Re-enable token
        faucet.setTokenActive(address(tokenA), true);
        
        (,, isActive) = faucet.tokenInfo(address(tokenA));
        assertTrue(isActive);
    }

    function testAddToken() public {
        uint256 customLimit = 75 * 10**18;
        faucet.addToken(address(tokenA), customLimit);
        
        assertTrue(faucet.supportedTokens(address(tokenA)));
        (, uint256 faucetLimit, bool isActive) = faucet.tokenInfo(address(tokenA));
        assertEq(faucetLimit, customLimit);
        assertTrue(isActive);
    }

    function testAddTokenRevertInvalid() public {
        vm.expectRevert("Invalid token address");
        faucet.addToken(address(0), 100 * 10**18);
    }

    function testAddTokenRevertAlreadySupported() public {
        faucet.addToken(address(tokenA), 100 * 10**18);
        
        vm.expectRevert("Token already supported");
        faucet.addToken(address(tokenA), 200 * 10**18);
    }

    function testEmergencyWithdraw() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        uint256 withdrawAmount = 1000 * 10**18;
        
        vm.expectEmit(true, false, false, true);
        emit EmergencyWithdraw(address(tokenA), withdrawAmount);
        
        faucet.emergencyWithdraw(address(tokenA), withdrawAmount, owner);
        
        assertEq(tokenA.balanceOf(owner), withdrawAmount);
        (uint256 balance,,) = faucet.tokenInfo(address(tokenA));
        assertEq(balance, SUPPLY_AMOUNT - withdrawAmount);
    }

    function testEmergencyWithdrawRevertInsufficientBalance() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        vm.expectRevert("Insufficient balance");
        faucet.emergencyWithdraw(address(tokenA), SUPPLY_AMOUNT + 1, owner);
    }

    function testPauseUnpause() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Pause contract
        faucet.pause();
        
        // Should not be able to supply or claim
        vm.expectRevert("Pausable: paused");
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        vm.expectRevert("Pausable: paused");
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        // Unpause
        faucet.unpause();
        
        // Should work again
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        assertEq(tokenA.balanceOf(receiver1), CLAIM_AMOUNT);
    }

    // ============ Access Control Tests ============

    function testOnlyOwnerFunctions() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Non-owner should not be able to call admin functions
        vm.startPrank(claimer1);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.setFaucetLimit(address(tokenA), 200 * 10**18);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.setDefaultFaucetLimit(200 * 10**18);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.setCooldownPeriod(12 hours);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.setTokenActive(address(tokenA), false);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.addToken(address(tokenB), 100 * 10**18);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.emergencyWithdraw(address(tokenA), 1000 * 10**18, claimer1);
        
        vm.expectRevert("Ownable: caller is not the owner");
        faucet.pause();
        
        vm.stopPrank();
    }

    // ============ Multiple Token Tests ============

    function testMultipleTokenSupplyAndClaim() public {
        // Supply multiple tokens
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenB), SUPPLY_AMOUNT);
        
        // Claim from both tokens
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenB), receiver1, CLAIM_AMOUNT);
        
        assertEq(tokenA.balanceOf(receiver1), CLAIM_AMOUNT);
        assertEq(tokenB.balanceOf(receiver1), CLAIM_AMOUNT);
        
        // Cooldowns should be independent
        (bool canClaimA,) = faucet.canClaim(claimer1, address(tokenA), CLAIM_AMOUNT);
        (bool canClaimB,) = faucet.canClaim(claimer1, address(tokenB), CLAIM_AMOUNT);
        
        assertFalse(canClaimA);
        assertFalse(canClaimB);
    }

    function testDifferentUsersIndependentCooldowns() public {
        vm.prank(supplier1);
        faucet.supplyTokens(address(tokenA), SUPPLY_AMOUNT);
        
        // Both users claim
        vm.prank(claimer1);
        faucet.claimTokens(address(tokenA), receiver1, CLAIM_AMOUNT);
        
        vm.prank(claimer2);
        faucet.claimTokens(address(tokenA), receiver2, CLAIM_AMOUNT);
        
        // Both should have cooldowns
        (bool canClaim1,) = faucet.canClaim(claimer1, address(tokenA), CLAIM_AMOUNT);
        (bool canClaim2,) = faucet.canClaim(claimer2, address(tokenA), CLAIM_AMOUNT);
        
        assertFalse(canClaim1);
        assertFalse(canClaim2);
        
        assertEq(tokenA.balanceOf(receiver1), CLAIM_AMOUNT);
        assertEq(tokenA.balanceOf(receiver2), CLAIM_AMOUNT);
    }
}

