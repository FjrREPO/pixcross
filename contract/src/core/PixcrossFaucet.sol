// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PixcrossFaucet
 * @dev A vault-like faucet system where anyone can supply tokens and anyone can claim tokens
 * Users specify token address, receiver, and amount when claiming
 */
contract PixcrossFaucet is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Events
    event TokensSupplied(address indexed supplier, address indexed token, uint256 amount);
    event TokensClaimed(address indexed claimer, address indexed token, address indexed receiver, uint256 amount);
    event FaucetLimitUpdated(address indexed token, uint256 newLimit);
    event CooldownUpdated(uint256 newCooldown);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // Structs
    struct TokenInfo {
        uint256 balance;        // Total balance available in faucet
        uint256 faucetLimit;    // Maximum amount per claim
        bool isActive;          // Whether this token is active for claiming
    }

    // State variables
    mapping(address => TokenInfo) public tokenInfo;           // token address => TokenInfo
    mapping(address => mapping(address => uint256)) public lastClaimTime;  // user => token => timestamp
    mapping(address => bool) public supportedTokens;         // Supported tokens list
    
    uint256 public cooldownPeriod = 24 hours;               // Cooldown between claims
    uint256 public defaultFaucetLimit = 100 * 10**18;       // Default 100 tokens (assuming 18 decimals)
    
    address[] public tokenList;                              // List of all tokens ever added

    constructor() {
        _transferOwnership(msg.sender);
    }

    /**
     * @dev Supply tokens to the faucet vault
     * @param token The token contract address
     * @param amount The amount of tokens to supply
     */
    function supplyTokens(address token, uint256 amount) external nonReentrant whenNotPaused {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        IERC20 tokenContract = IERC20(token);
        require(tokenContract.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(tokenContract.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // Transfer tokens from supplier to faucet
        tokenContract.safeTransferFrom(msg.sender, address(this), amount);

        // Update token info
        if (!supportedTokens[token]) {
            supportedTokens[token] = true;
            tokenList.push(token);
            tokenInfo[token].faucetLimit = defaultFaucetLimit;
            tokenInfo[token].isActive = true;
        }

        tokenInfo[token].balance += amount;

        emit TokensSupplied(msg.sender, token, amount);
    }

    /**
     * @dev Claim tokens from the faucet
     * @param token The token contract address to claim
     * @param receiver The address to receive the tokens
     * @param amount The amount of tokens to claim
     */
    function claimTokens(address token, address receiver, uint256 amount) external nonReentrant whenNotPaused {
        require(token != address(0), "Invalid token address");
        require(receiver != address(0), "Invalid receiver address");
        require(amount > 0, "Amount must be greater than 0");
        require(supportedTokens[token], "Token not supported");
        require(tokenInfo[token].isActive, "Token claiming is disabled");
        require(amount <= tokenInfo[token].faucetLimit, "Amount exceeds faucet limit");
        require(tokenInfo[token].balance >= amount, "Insufficient faucet balance");
        
        // Check cooldown period (allow first-time claims)
        require(
            lastClaimTime[msg.sender][token] == 0 || 
            block.timestamp >= lastClaimTime[msg.sender][token] + cooldownPeriod,
            "Cooldown period not elapsed"
        );

        // Update state
        tokenInfo[token].balance -= amount;
        lastClaimTime[msg.sender][token] = block.timestamp;

        // Transfer tokens to receiver
        IERC20(token).safeTransfer(receiver, amount);

        emit TokensClaimed(msg.sender, token, receiver, amount);
    }

    /**
     * @dev Get the remaining time until next claim is available
     * @param user The user address
     * @param token The token address
     * @return remainingTime in seconds, 0 if can claim now
     */
    function getTimeUntilNextClaim(address user, address token) external view returns (uint256 remainingTime) {
        // If user has never claimed, they can claim immediately
        if (lastClaimTime[user][token] == 0) {
            return 0;
        }
        
        uint256 nextClaimTime = lastClaimTime[user][token] + cooldownPeriod;
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        return nextClaimTime - block.timestamp;
    }

    /**
     * @dev Check if a user can claim a specific token
     * @param user The user address
     * @param token The token address
     * @param amount The amount to claim
     * @return success whether the user can claim
     * @return reason the reason if cannot claim
     */
    function canClaim(address user, address token, uint256 amount) 
        external 
        view 
        returns (bool success, string memory reason)
    {
        if (!supportedTokens[token]) {
            return (false, "Token not supported");
        }
        if (!tokenInfo[token].isActive) {
            return (false, "Token claiming is disabled");
        }
        if (amount > tokenInfo[token].faucetLimit) {
            return (false, "Amount exceeds faucet limit");
        }
        if (tokenInfo[token].balance < amount) {
            return (false, "Insufficient faucet balance");
        }
        if (lastClaimTime[user][token] != 0 && block.timestamp < lastClaimTime[user][token] + cooldownPeriod) {
            return (false, "Cooldown period not elapsed");
        }
        return (true, "Can claim");
    }

    /**
     * @dev Get all supported tokens
     * @return tokens array of supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory tokens) {
        return tokenList;
    }

    /**
     * @dev Get token information
     * @param token The token address
     * @return info TokenInfo struct
     */
    function getTokenInfo(address token) external view returns (TokenInfo memory info) {
        return tokenInfo[token];
    }

    // Admin functions

    /**
     * @dev Set faucet limit for a specific token (only owner)
     * @param token The token address
     * @param limit The new faucet limit
     */
    function setFaucetLimit(address token, uint256 limit) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        tokenInfo[token].faucetLimit = limit;
        emit FaucetLimitUpdated(token, limit);
    }

    /**
     * @dev Set default faucet limit for new tokens (only owner)
     * @param limit The new default faucet limit
     */
    function setDefaultFaucetLimit(uint256 limit) external onlyOwner {
        defaultFaucetLimit = limit;
    }

    /**
     * @dev Set cooldown period between claims (only owner)
     * @param newCooldown The new cooldown period in seconds
     */
    function setCooldownPeriod(uint256 newCooldown) external onlyOwner {
        cooldownPeriod = newCooldown;
        emit CooldownUpdated(newCooldown);
    }

    /**
     * @dev Toggle token active status (only owner)
     * @param token The token address
     * @param isActive Whether the token should be active for claiming
     */
    function setTokenActive(address token, bool isActive) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        tokenInfo[token].isActive = isActive;
    }

    /**
     * @dev Emergency withdraw function (only owner)
     * @param token The token address to withdraw
     * @param amount The amount to withdraw
     * @param to The address to send tokens to
     */
    function emergencyWithdraw(address token, uint256 amount, address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(tokenInfo[token].balance >= amount, "Insufficient balance");
        
        tokenInfo[token].balance -= amount;
        IERC20(token).safeTransfer(to, amount);
        
        emit EmergencyWithdraw(token, amount);
    }

    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Add a new token to the faucet without supplying (only owner)
     * @param token The token address
     * @param faucetLimit The faucet limit for this token
     */
    function addToken(address token, uint256 faucetLimit) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!supportedTokens[token], "Token already supported");
        
        supportedTokens[token] = true;
        tokenList.push(token);
        tokenInfo[token].faucetLimit = faucetLimit;
        tokenInfo[token].isActive = true;
    }
}

