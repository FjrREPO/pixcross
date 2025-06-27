// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PixcrossBridgeERC721 Bridge
 * @dev General bridge contract for ERC721 tokens with burn and mint logic
 * @notice This bridge allows cross-chain transfers of ERC721 tokens without Chainlink
 */
contract PixcrossBridgeERC721 is Ownable, ReentrancyGuard, Pausable, IERC721Receiver {
    
    // Events
    event TokenLocked(address indexed token, uint256 indexed tokenId, address indexed user, uint256 targetChainId, address targetAddress);
    event TokenBurned(address indexed token, uint256 indexed tokenId, address indexed user, uint256 targetChainId, address targetAddress);
    event TokenMinted(address indexed token, uint256 indexed tokenId, address indexed user, uint256 sourceChainId, bytes32 txHash);
    event TokenUnlocked(address indexed token, uint256 indexed tokenId, address indexed user, uint256 sourceChainId, bytes32 txHash);
    event BridgeOperatorAdded(address indexed operator);
    event BridgeOperatorRemoved(address indexed operator);
    event SupportedTokenAdded(address indexed token);
    event SupportedTokenRemoved(address indexed token);
    event ChainSupportAdded(uint256 indexed chainId);
    event ChainSupportRemoved(uint256 indexed chainId);
    
    // Structs
    struct BridgeRequest {
        address token;
        uint256 tokenId;
        address user;
        uint256 sourceChainId;
        uint256 targetChainId;
        address targetAddress;
        bool isProcessed;
        uint256 timestamp;
    }
    
    // State variables
    mapping(address => bool) public supportedTokens;
    mapping(uint256 => bool) public supportedChains;
    mapping(address => bool) public bridgeOperators;
    mapping(bytes32 => bool) public processedTransactions;
    mapping(bytes32 => BridgeRequest) public bridgeRequests;
    mapping(address => mapping(uint256 => bool)) public lockedTokens; // token => tokenId => isLocked
    
    uint256 public currentChainId;
    uint256 public bridgeRequestNonce;
    
    // Fee structure
    uint256 public bridgeFee = 0.0001 ether; // Default bridge fee
    address public feeCollector;
    
    modifier onlyBridgeOperator() {
        require(bridgeOperators[msg.sender], "Not a bridge operator");
        _;
    }
    
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }
    
    modifier onlySupportedChain(uint256 chainId) {
        require(supportedChains[chainId], "Chain not supported");
        _;
    }
    
    constructor(uint256 _currentChainId, address _feeCollector) {
        currentChainId = _currentChainId;
        feeCollector = _feeCollector;
        bridgeOperators[msg.sender] = true;
    }
    
    /**
     * @dev Lock and burn token for cross-chain transfer
     * @param token Address of the ERC721 token
     * @param tokenId Token ID to bridge
     * @param targetChainId Target chain ID
     * @param targetAddress Address to receive tokens on target chain
     * @param shouldBurn Whether to burn the token (true) or lock it (false)
     */
    function bridgeToken(
        address token,
        uint256 tokenId,
        uint256 targetChainId,
        address targetAddress,
        bool shouldBurn
    ) external payable nonReentrant whenNotPaused onlySupportedToken(token) onlySupportedChain(targetChainId) {
        require(msg.value >= bridgeFee, "Insufficient bridge fee");
        require(targetAddress != address(0), "Invalid target address");
        require(targetChainId != currentChainId, "Cannot bridge to same chain");
        
        IERC721 nftContract = IERC721(token);
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(nftContract.isApprovedForAll(msg.sender, address(this)) || 
                nftContract.getApproved(tokenId) == address(this), "Bridge not approved");
        
        // Transfer token to bridge
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
        
        bytes32 requestId = keccak256(abi.encodePacked(
            msg.sender,
            token,
            tokenId,
            targetChainId,
            targetAddress,
            block.timestamp,
            bridgeRequestNonce++
        ));
        
        bridgeRequests[requestId] = BridgeRequest({
            token: token,
            tokenId: tokenId,
            user: msg.sender,
            sourceChainId: currentChainId,
            targetChainId: targetChainId,
            targetAddress: targetAddress,
            isProcessed: false,
            timestamp: block.timestamp
        });
        
        if (shouldBurn) {
            // Burn the token if it supports burning
            _burnToken(token, tokenId);
            emit TokenBurned(token, tokenId, msg.sender, targetChainId, targetAddress);
        } else {
            // Lock the token
            lockedTokens[token][tokenId] = true;
            emit TokenLocked(token, tokenId, msg.sender, targetChainId, targetAddress);
        }
        
        // Transfer fee to collector
        if (msg.value > 0) {
            payable(feeCollector).transfer(msg.value);
        }
    }
    
    /**
     * @dev Mint token on destination chain (called by bridge operators)
     * @param token Address of the ERC721 token
     * @param tokenId Token ID to mint
     * @param user Address to receive the token
     * @param sourceChainId Source chain ID
     * @param txHash Transaction hash from source chain
     */
    function mintToken(
        address token,
        uint256 tokenId,
        address user,
        uint256 sourceChainId,
        bytes32 txHash
    ) external onlyBridgeOperator whenNotPaused onlySupportedToken(token) {
        require(!processedTransactions[txHash], "Transaction already processed");
        require(user != address(0), "Invalid user address");
        
        processedTransactions[txHash] = true;
        
        // Mint token to user
        _mintToken(token, tokenId, user);
        
        emit TokenMinted(token, tokenId, user, sourceChainId, txHash);
    }
    
    /**
     * @dev Unlock token on source chain (called by bridge operators)
     * @param token Address of the ERC721 token
     * @param tokenId Token ID to unlock
     * @param user Address to receive the token
     * @param sourceChainId Source chain ID
     * @param txHash Transaction hash from source chain
     */
    function unlockToken(
        address token,
        uint256 tokenId,
        address user,
        uint256 sourceChainId,
        bytes32 txHash
    ) external onlyBridgeOperator whenNotPaused onlySupportedToken(token) {
        require(!processedTransactions[txHash], "Transaction already processed");
        require(lockedTokens[token][tokenId], "Token not locked");
        require(user != address(0), "Invalid user address");
        
        processedTransactions[txHash] = true;
        lockedTokens[token][tokenId] = false;
        
        // Transfer token back to user
        IERC721(token).safeTransferFrom(address(this), user, tokenId);
        
        emit TokenUnlocked(token, tokenId, user, sourceChainId, txHash);
    }
    
    /**
     * @dev Add bridge operator
     */
    function addBridgeOperator(address operator) external onlyOwner {
        require(operator != address(0), "Invalid operator address");
        bridgeOperators[operator] = true;
        emit BridgeOperatorAdded(operator);
    }
    
    /**
     * @dev Remove bridge operator
     */
    function removeBridgeOperator(address operator) external onlyOwner {
        bridgeOperators[operator] = false;
        emit BridgeOperatorRemoved(operator);
    }
    
    /**
     * @dev Add supported token
     */
    function addSupportedToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        supportedTokens[token] = true;
        emit SupportedTokenAdded(token);
    }
    
    /**
     * @dev Remove supported token
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
        emit SupportedTokenRemoved(token);
    }
    
    /**
     * @dev Add supported chain
     */
    function addSupportedChain(uint256 chainId) external onlyOwner {
        require(chainId != 0, "Invalid chain ID");
        supportedChains[chainId] = true;
        emit ChainSupportAdded(chainId);
    }
    
    /**
     * @dev Remove supported chain
     */
    function removeSupportedChain(uint256 chainId) external onlyOwner {
        supportedChains[chainId] = false;
        emit ChainSupportRemoved(chainId);
    }
    
    /**
     * @dev Set bridge fee
     */
    function setBridgeFee(uint256 _fee) external onlyOwner {
        bridgeFee = _fee;
    }
    
    /**
     * @dev Set fee collector
     */
    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "Invalid fee collector");
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev Pause bridge operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause bridge operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw function for stuck tokens
     */
    function emergencyWithdraw(address token, uint256 tokenId, address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC721(token).safeTransferFrom(address(this), to, tokenId);
    }
    
    /**
     * @dev Internal function to burn token (implement based on token's burn method)
     */
    function _burnToken(address token, uint256 tokenId) internal {
        // Note: This depends on the token implementation
        // Some tokens have burn function, others might need transfer to 0x000...dead
        // For MockIP tokens, we might need to adapt based on their interface
        
        // Try to call burn function if available
        (bool success, ) = token.call(abi.encodeWithSignature("burn(uint256)", tokenId));
        
        if (!success) {
            // If burn function doesn't exist, transfer to dead address
            IERC721(token).safeTransferFrom(address(this), address(0x000000000000000000000000000000000000dEaD), tokenId);
        }
    }
    
    /**
     * @dev Internal function to mint token (implement based on token's mint method)
     */
    function _mintToken(address token, uint256 tokenId, address to) internal {
        // Note: This depends on the token implementation
        // Most ERC721 tokens have a mint function
        
        (bool success, ) = token.call(abi.encodeWithSignature("mint(address,uint256)", to, tokenId));
        
        if (!success) {
            // Try alternative mint signature
            (success, ) = token.call(abi.encodeWithSignature("safeMint(address,uint256)", to, tokenId));
        }
        
        require(success, "Failed to mint token");
    }
    
    /**
     * @dev Handle receiving ERC721 tokens
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    /**
     * @dev Get bridge request details
     */
    function getBridgeRequest(bytes32 requestId) external view returns (BridgeRequest memory) {
        return bridgeRequests[requestId];
    }
    
    /**
     * @dev Check if transaction is processed
     */
    function isTransactionProcessed(bytes32 txHash) external view returns (bool) {
        return processedTransactions[txHash];
    }
    
    /**
     * @dev Check if token is locked
     */
    function isTokenLocked(address token, uint256 tokenId) external view returns (bool) {
        return lockedTokens[token][tokenId];
    }
}

