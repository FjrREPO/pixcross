// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../src/bridge/PixcrossBridgeERC20.sol";
import {CCIPLocalSimulator} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Mock ERC20 Token for testing
 */
contract MockERC20 is ERC20 {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        _mint(msg.sender, initialSupply);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/**
 * @title PixcrossBridgeERC20Test
 * @notice Test suite for ERC20Bridge contract
 */
contract PixcrossBridgeERC20Test is Test {
    PixcrossBridgeERC20 public bridge;
    CCIPLocalSimulator public ccipLocalSimulator;
    MockERC20 public mockUSDC;
    MockERC20 public mockUSDT;
    MockERC20 public mockLINK;
    
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public feeCollector = makeAddr("feeCollector");
    address public owner;
    
    uint256 public constant INITIAL_BALANCE = 1000000 * 10**18; // 1M tokens with 18 decimals
    uint256 public constant LINK_BALANCE = 1000 * 10**18; // 1K LINK with 18 decimals
    
    // Events to test
    event TokensBridged(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address indexed receiver,
        address token,
        uint256 amount,
        uint256 fee,
        address sender
    );
    
    event TokensReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address indexed sender,
        address token,
        uint256 amount,
        address receiver
    );
    
    function setUp() public {
        owner = address(this);
        
        // Deploy CCIP Local Simulator
        ccipLocalSimulator = new CCIPLocalSimulator();
        
        (
            ,
            IRouterClient sourceRouter,
            ,
            ,
            ,
            ,
        ) = ccipLocalSimulator.configuration();
        
        // Deploy mock tokens
        mockUSDC = new MockERC20("Mock USDC", "USDC", 18, INITIAL_BALANCE);
        mockUSDT = new MockERC20("Mock USDT", "USDT", 18, INITIAL_BALANCE);
        mockLINK = new MockERC20("Mock LINK", "LINK", 18, LINK_BALANCE);
        
        // Deploy bridge contract
        bridge = new PixcrossBridgeERC20(address(sourceRouter), feeCollector);
        
        // Setup initial balances
        mockUSDC.transfer(alice, 100000 * 10**18); // 100K USDC
        mockUSDT.transfer(alice, 100000 * 10**18); // 100K USDT
        mockLINK.transfer(alice, 100 * 10**18); // 100 LINK

        mockUSDC.transfer(bob, 50000 * 10**18); // 50K USDC
        mockUSDT.transfer(bob, 50000 * 10**18); // 50K USDT

        // Fund bridge with ETH for fees
        vm.deal(address(bridge), 10 ether);
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        
        // Transfer some LINK to bridge for fees
        mockLINK.transfer(address(bridge), 10 * 10**18);
    }
    
    function testDeployment() public {
        assertEq(bridge.owner(), owner);
        assertEq(bridge.feeCollector(), feeCollector);
        assertEq(bridge.bridgeFeePercent(), 30); // 0.3%
        assertFalse(bridge.paused());
        
        // Check transfer limits (contract uses 18 decimals)
        assertEq(bridge.minTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC), 1e18); // 1 USDC with 18 decimals
        assertEq(bridge.maxTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC), 1e23); // 1,000,000 USDC with 18 decimals
        assertEq(bridge.minTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDT), 1e18); // 1 USDT with 18 decimals
        assertEq(bridge.maxTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDT), 1e23); // 1,000,000 USDT with 18 decimals
    }
    
    function testGetTokenFromAddress() public {
        // This test won't work with our mock setup since the contract looks for specific addresses
        // We'll test the error case
        vm.expectRevert(abi.encodeWithSelector(PixcrossBridgeERC20.UnsupportedToken.selector, address(mockUSDC)));
        bridge.getTokenFromAddress(address(mockUSDC));
    }
    
    function testUpdateBridgeFee() public {
        uint256 newFee = 50; // 0.5%
        
        vm.expectEmit(true, true, true, true);
        emit PixcrossBridgeERC20.BridgeFeeUpdated(30, newFee);
        
        bridge.updateBridgeFee(newFee);
        assertEq(bridge.bridgeFeePercent(), newFee);
    }
    
    function testUpdateBridgeFeeFailsWithHighFee() public {
        vm.expectRevert(PixcrossBridgeERC20.InvalidFeePercent.selector);
        bridge.updateBridgeFee(1001); // > 10%
    }
    
    function testUpdateBridgeFeeFailsFromNonOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        bridge.updateBridgeFee(50);
    }
    
    function testUpdateFeeCollector() public {
        address newCollector = makeAddr("newCollector");
        
        vm.expectEmit(true, true, true, true);
        emit PixcrossBridgeERC20.FeeCollectorUpdated(feeCollector, newCollector);
        
        bridge.updateFeeCollector(newCollector);
        assertEq(bridge.feeCollector(), newCollector);
    }
    
    function testUpdateFeeCollectorFailsWithZeroAddress() public {
        vm.expectRevert(PixcrossBridgeERC20.ZeroAddress.selector);
        bridge.updateFeeCollector(address(0));
    }
    
    function testUpdateTransferLimits() public {
        uint256 newMin = 2000000; // 2 USDC
        uint256 newMax = 200000000000; // 200K USDC
        
        vm.expectEmit(true, true, true, true);
        emit PixcrossBridgeERC20.TransferLimitsUpdated(PixcrossBridgeERC20.SupportedToken.USDC, newMin, newMax);
        
        bridge.updateTransferLimits(PixcrossBridgeERC20.SupportedToken.USDC, newMin, newMax);
        
        assertEq(bridge.minTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC), newMin);
        assertEq(bridge.maxTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC), newMax);
    }
    
    function testUpdateTransferLimitsFailsWithInvalidRange() public {
        vm.expectRevert("Min amount must be less than max amount");
        bridge.updateTransferLimits(PixcrossBridgeERC20.SupportedToken.USDC, 2000000, 1000000);
    }
    
    function testPauseAndUnpause() public {
        // Test pause
        vm.expectEmit(true, true, true, true);
        emit PixcrossBridgeERC20.BridgePaused();
        
        bridge.pause();
        assertTrue(bridge.paused());
        
        // Test unpause
        vm.expectEmit(true, true, true, true);
        emit PixcrossBridgeERC20.BridgeUnpaused();
        
        bridge.unpause();
        assertFalse(bridge.paused());
    }
    
    function testPauseFailsFromNonOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        bridge.pause();
    }
    
    function testWithdrawNative() public {
        uint256 initialBalance = address(bridge).balance;
        uint256 recipientInitialBalance = alice.balance;
        
        bridge.withdrawNative(payable(alice));
        
        assertEq(address(bridge).balance, 0);
        assertEq(alice.balance, recipientInitialBalance + initialBalance);
    }
    
    function testWithdrawNativeFailsWithZeroAddress() public {
        vm.expectRevert(PixcrossBridgeERC20.ZeroAddress.selector);
        bridge.withdrawNative(payable(address(0)));
    }
    
    function testWithdrawNativeFailsWithZeroBalance() public {
        // First withdraw all native tokens
        bridge.withdrawNative(payable(alice));
        
        // Then try to withdraw again
        vm.expectRevert(abi.encodeWithSelector(PixcrossBridgeERC20.InsufficientBalance.selector, 1, 0));
        bridge.withdrawNative(payable(alice));
    }
    
    function testWithdrawToken() public {
        // Transfer some USDC to bridge first
        mockUSDC.transfer(address(bridge), 1000 * 10**6);
        
        uint256 initialBalance = mockUSDC.balanceOf(alice);
        uint256 withdrawAmount = 500 * 10**6;
        
        bridge.withdrawToken(address(mockUSDC), alice, withdrawAmount);
        
        assertEq(mockUSDC.balanceOf(alice), initialBalance + withdrawAmount);
        assertEq(mockUSDC.balanceOf(address(bridge)), 500 * 10**6);
    }
    
    function testWithdrawTokenFailsWithZeroAddress() public {
        vm.expectRevert(PixcrossBridgeERC20.ZeroAddress.selector);
        bridge.withdrawToken(address(mockUSDC), address(0), 1000);
    }
    
    function testWithdrawTokenFailsFromNonOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        bridge.withdrawToken(address(mockUSDC), alice, 1000);
    }
    
    function testReceiveFunction() public {
        uint256 initialBalance = address(bridge).balance;
        uint256 sendAmount = 1 ether;
        
        vm.prank(alice);
        (bool success, ) = address(bridge).call{value: sendAmount}("");
        
        assertTrue(success);
        assertEq(address(bridge).balance, initialBalance + sendAmount);
    }
    
    function testFallbackFunction() public {
        uint256 initialBalance = address(bridge).balance;
        uint256 sendAmount = 1 ether;
        
        vm.prank(alice);
        (bool success, ) = address(bridge).call{value: sendAmount}("someData");
        
        assertTrue(success);
        assertEq(address(bridge).balance, initialBalance + sendAmount);
    }
    
    // Test helper functions that would work with mock setup
    function testBridgeInitialization() public {
        // Test that bridge is properly initialized
        assertTrue(address(bridge) != address(0));
        assertEq(bridge.bridgeFeePercent(), 30);
        assertEq(bridge.feeCollector(), feeCollector);
    }
    
    function testAccessControl() public {
        // Test that only owner can call admin functions
        vm.prank(alice);
        vm.expectRevert();
        bridge.updateBridgeFee(50);
        
        vm.prank(alice);
        vm.expectRevert();
        bridge.pause();
        
        vm.prank(alice);
        vm.expectRevert();
        bridge.updateFeeCollector(alice);
    }
    
    // Integration test with CCIP Local Simulator would need more setup
    // This is a basic test structure that can be extended
    
    function testBridgeContractState() public {
        // Verify initial state
        assertFalse(bridge.paused());
        assertEq(bridge.owner(), address(this));
        assertGt(address(bridge).balance, 0);
    }
    
    function testTokenAmountValidation() public {
        // Test minimum amount validation
        // uint256 tooSmall = 500000; // 0.5 USDC (below minimum of 1 USDC)
        
        // We can't easily test the bridgeTokens function without proper CCIP setup
        // But we can test the validation logic indirectly through other functions
        
        // Test that transfer limits are properly set (contract uses 18 decimals)
        assertEq(bridge.minTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC), 1e18);
        assertEq(bridge.maxTransferAmounts(PixcrossBridgeERC20.SupportedToken.USDC), 1e23);
    }
}

