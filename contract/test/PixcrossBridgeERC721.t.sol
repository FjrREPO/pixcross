// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/bridge/PixcrossBridgeERC721.sol";
import "./mocks/MockERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract PixcrossBridgeERC721Test is Test, IERC721Receiver {
    PixcrossBridgeERC721 public bridge;
    MockERC721 public mockIPToken;
    
    address public owner;
    address public user1;
    address public user2;
    address public bridgeOperator;
    address public feeCollector;
    
    uint256 public constant CHAIN_ID_SEPOLIA = 11155111;
    uint256 public constant CHAIN_ID_BASE = 84532;
    uint256 public constant BRIDGE_FEE = 0.0001 ether;
    
    event TokenLocked(address indexed token, uint256 indexed tokenId, address indexed user, uint256 targetChainId, address targetAddress);
    event TokenBurned(address indexed token, uint256 indexed tokenId, address indexed user, uint256 targetChainId, address targetAddress);
    event TokenMinted(address indexed token, uint256 indexed tokenId, address indexed user, uint256 sourceChainId, bytes32 txHash);
    
    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        bridgeOperator = makeAddr("bridgeOperator");
        feeCollector = makeAddr("feeCollector");
        
        // Deploy contracts
        bridge = new PixcrossBridgeERC721(CHAIN_ID_SEPOLIA, feeCollector);
        mockIPToken = new MockERC721(
            "MockIP Token",
            "MOCKIP",
            "https://api.mockip.com/metadata/"
        );
        
        // Setup bridge
        bridge.addSupportedToken(address(mockIPToken));
        bridge.addSupportedChain(CHAIN_ID_BASE);
        bridge.addBridgeOperator(bridgeOperator);
        
        // Setup token for bridge
        mockIPToken.addBridgeContract(address(bridge));
        
        // Give users some ETH
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }
    
    function testDeployment() public {
        assertEq(bridge.currentChainId(), CHAIN_ID_SEPOLIA);
        assertEq(bridge.feeCollector(), feeCollector);
        assertEq(bridge.bridgeFee(), BRIDGE_FEE);
        assertTrue(bridge.supportedTokens(address(mockIPToken)));
        assertTrue(bridge.supportedChains(CHAIN_ID_BASE));
        assertTrue(bridge.bridgeOperators(bridgeOperator));
    }
    
    function testMintIPToken() public {
        string[] memory tags = new string[](2);
        tags[0] = "test";
        tags[1] = "patent";
        
        uint256 tokenId = mockIPToken.mintIP(
            user1,
            "https://api.mockip.com/metadata/1.json",
            "patent",
            "Test Patent",
            "A test patent",
            tags
        );
        
        assertEq(mockIPToken.ownerOf(tokenId), user1);
        assertEq(tokenId, 1);
        
        MockERC721.IPMetadata memory metadata = mockIPToken.getIPMetadata(tokenId);
        assertEq(metadata.ipType, "patent");
        assertEq(metadata.title, "Test Patent");
        assertEq(metadata.creator, user1);
        assertTrue(metadata.isActive);
    }
    
    function testBridgeTokenLock() public {
        // Mint token to user1
        uint256 tokenId = mockIPToken.mint(user1);
        
        // User1 approves bridge
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        
        // Bridge token (lock mode)
        vm.expectEmit(true, true, true, true);
        emit TokenLocked(address(mockIPToken), tokenId, user1, CHAIN_ID_BASE, user2);
        
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false // shouldBurn = false (lock mode)
        );
        vm.stopPrank();
        
        // Check token is locked in bridge
        assertEq(mockIPToken.ownerOf(tokenId), address(bridge));
        assertTrue(bridge.isTokenLocked(address(mockIPToken), tokenId));
        
        // Check fee was transferred
        assertEq(feeCollector.balance, BRIDGE_FEE);
    }
    
    function testBridgeTokenBurn() public {
        // Mint token to user1
        uint256 tokenId = mockIPToken.mint(user1);
        
        // User1 approves bridge
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        
        // Bridge token (burn mode)
        vm.expectEmit(true, true, true, true);
        emit TokenBurned(address(mockIPToken), tokenId, user1, CHAIN_ID_BASE, user2);
        
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            true // shouldBurn = true
        );
        vm.stopPrank();
        
        // Check token was burned - it should no longer exist
        vm.expectRevert("ERC721: invalid token ID");
        mockIPToken.ownerOf(tokenId);
        assertFalse(bridge.isTokenLocked(address(mockIPToken), tokenId));
    }
    
    function testMintTokenOnDestination() public {
        uint256 tokenId = 100;
        bytes32 txHash = keccak256("test_tx_hash");
        
        // Bridge operator mints token
        vm.startPrank(bridgeOperator);
        
        vm.expectEmit(true, true, true, true);
        emit TokenMinted(address(mockIPToken), tokenId, user2, CHAIN_ID_BASE, txHash);
        
        bridge.mintToken(
            address(mockIPToken),
            tokenId,
            user2,
            CHAIN_ID_BASE,
            txHash
        );
        vm.stopPrank();
        
        // Check token was minted to user2
        assertEq(mockIPToken.ownerOf(tokenId), user2);
        assertTrue(bridge.isTransactionProcessed(txHash));
    }
    
    function testUnlockToken() public {
        // First, lock a token
        uint256 tokenId = mockIPToken.mint(user1);
        
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false // lock mode
        );
        vm.stopPrank();
        
        // Verify token is locked
        assertTrue(bridge.isTokenLocked(address(mockIPToken), tokenId));
        assertEq(mockIPToken.ownerOf(tokenId), address(bridge));
        
        // Bridge operator unlocks token
        bytes32 txHash = keccak256("unlock_tx_hash");
        
        vm.prank(bridgeOperator);
        bridge.unlockToken(
            address(mockIPToken),
            tokenId,
            user1,
            CHAIN_ID_BASE,
            txHash
        );
        
        // Check token is unlocked and returned to user
        assertFalse(bridge.isTokenLocked(address(mockIPToken), tokenId));
        assertEq(mockIPToken.ownerOf(tokenId), user1);
        assertTrue(bridge.isTransactionProcessed(txHash));
    }
    
    function test_RevertWhen_BridgeUnsupportedToken() public {
        MockERC721 unsupportedToken = new MockERC721(
            "Unsupported Token",
            "UNSUP",
            "https://api.unsupported.com/"
        );
        
        uint256 tokenId = unsupportedToken.mint(user1);
        
        vm.startPrank(user1);
        unsupportedToken.approve(address(bridge), tokenId);
        
        // This should fail
        vm.expectRevert("Token not supported");
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(unsupportedToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false
        );
        vm.stopPrank();
    }
    
    function test_RevertWhen_BridgeUnsupportedChain() public {
        uint256 tokenId = mockIPToken.mint(user1);
        
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        
        // This should fail (chain 999 not supported)
        vm.expectRevert("Chain not supported");
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            999,
            user2,
            false
        );
        vm.stopPrank();
    }
    
    function test_RevertWhen_BridgeInsufficientFee() public {
        uint256 tokenId = mockIPToken.mint(user1);
        
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        
        // This should fail (insufficient fee - sending less than required BRIDGE_FEE)
        vm.expectRevert("Insufficient bridge fee");
        bridge.bridgeToken{value: 0.00005 ether}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false
        );
        vm.stopPrank();
    }
    
    function test_RevertWhen_NotTokenOwner() public {
        uint256 tokenId = mockIPToken.mint(user1);
        
        // user2 tries to bridge user1's token
        vm.startPrank(user2);
        
        vm.expectRevert("Not token owner");
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false
        );
        vm.stopPrank();
    }
    
    function test_RevertWhen_DoubleProcessTransaction() public {
        uint256 tokenId = 100;
        bytes32 txHash = keccak256("test_tx_hash");
        
        vm.startPrank(bridgeOperator);
        
        // First mint succeeds
        bridge.mintToken(
            address(mockIPToken),
            tokenId,
            user2,
            CHAIN_ID_BASE,
            txHash
        );
        
        // Second mint with same tx hash should fail
        vm.expectRevert("Transaction already processed");
        bridge.mintToken(
            address(mockIPToken),
            tokenId + 1,
            user2,
            CHAIN_ID_BASE,
            txHash
        );
        vm.stopPrank();
    }
    
    function testPauseBridge() public {
        bridge.pause();
        
        uint256 tokenId = mockIPToken.mint(user1);
        
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        
        // This should fail when paused
        vm.expectRevert("Pausable: paused");
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false
        );
        vm.stopPrank();
    }
    
    function testEmergencyWithdraw() public {
        // Lock a token first
        uint256 tokenId = mockIPToken.mint(user1);
        
        vm.startPrank(user1);
        mockIPToken.approve(address(bridge), tokenId);
        bridge.bridgeToken{value: BRIDGE_FEE}(
            address(mockIPToken),
            tokenId,
            CHAIN_ID_BASE,
            user2,
            false // lock mode
        );
        vm.stopPrank();
        
        // Emergency withdraw by owner
        bridge.emergencyWithdraw(address(mockIPToken), tokenId, owner);
        
        assertEq(mockIPToken.ownerOf(tokenId), owner);
    }
    
    function testSetBridgeFee() public {
        uint256 newFee = 0.002 ether;
        bridge.setBridgeFee(newFee);
        assertEq(bridge.bridgeFee(), newFee);
    }
    
    function testSetFeeCollector() public {
        address newCollector = makeAddr("newCollector");
        bridge.setFeeCollector(newCollector);
        assertEq(bridge.feeCollector(), newCollector);
    }
    
    // Implement IERC721Receiver
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

