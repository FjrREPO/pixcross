// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * @title ERC20Bridge
 * @notice A comprehensive bridge contract for cross-chain USDC and USDT transfers using Chainlink CCIP
 * @dev This contract can both send and receive ERC20 tokens across different chains
 */
contract PixcrossBridgeERC20 is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;

    // Supported tokens enum
    enum SupportedToken {
        USDC,
        USDT,
        IDRX
    }

    // Payment method enum
    enum PayFeesIn {
        Native,
        LINK
    }

    // Supported networks (matching Helper.sol)
    enum SupportedNetworks {
        ETHEREUM_SEPOLIA, // 0
        BASE_SEPOLIA,     // 1
        ARBITRUM_SEPOLIA, // 2
        AVALANCHE_FUJI    // 3
    }

    // Token addresses for each network
    mapping(SupportedNetworks => mapping(SupportedToken => address)) public tokenAddresses;
    
    // LINK token addresses for each network
    mapping(SupportedNetworks => address) public linkTokenAddresses;
    
    // Chain selectors for each network
    mapping(SupportedNetworks => uint64) public chainSelectors;
    
    // Minimum transfer amounts for each token
    mapping(SupportedToken => uint256) public minTransferAmounts;
    
    // Maximum transfer amounts for each token
    mapping(SupportedToken => uint256) public maxTransferAmounts;
    
    // Bridge fee percentage (in basis points, e.g., 100 = 1%)
    uint256 public bridgeFeePercent = 30; // 0.3%
    
    // Fee collector address
    address public feeCollector;
    
    // Paused state
    bool public paused = false;

    // Custom errors
    error UnsupportedToken(address token);
    error UnsupportedNetwork(uint64 chainSelector);
    error TransferAmountTooLow(uint256 amount, uint256 minimum);
    error TransferAmountTooHigh(uint256 amount, uint256 maximum);
    error InsufficientBalance(uint256 requested, uint256 available);
    error InsufficientFeeTokenAmount();
    error BridgeIsPaused();
    error InvalidFeePercent();
    error ZeroAddress();
    error TransferFailed();

    // Events
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

    event BridgeFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeCollectorUpdated(address oldCollector, address newCollector);
    event TransferLimitsUpdated(SupportedToken token, uint256 minAmount, uint256 maxAmount);
    event BridgePaused();
    event BridgeUnpaused();

    /**
     * @notice Constructor to initialize the bridge contract
     * @param router The CCIP router address for the current network
     * @param _feeCollector Address to collect bridge fees
     */
    constructor(address router, address _feeCollector) CCIPReceiver(router) {
        if (_feeCollector == address(0)) revert ZeroAddress();
        feeCollector = _feeCollector;
        
        _initializeTokenAddresses();
        _initializeLinkAddresses();
        _initializeChainSelectors();
        _initializeTransferLimits();
    }

    /**
     * @notice Initialize token addresses for all supported networks
     */
    function _initializeTokenAddresses() private {
        // USDC addresses
        tokenAddresses[SupportedNetworks.ETHEREUM_SEPOLIA][SupportedToken.USDC] = 0x854edF78e05Cd554CE538DA198Ce31807F2Cb7CF;
        tokenAddresses[SupportedNetworks.BASE_SEPOLIA][SupportedToken.USDC] = 0xD353131F4802046eF0f57FE362c64e641Be003Ad;
        tokenAddresses[SupportedNetworks.ARBITRUM_SEPOLIA][SupportedToken.USDC] = 0x82A7176a7601764af75CC863640544f4B0ba8e43;
        tokenAddresses[SupportedNetworks.AVALANCHE_FUJI][SupportedToken.USDC] = 0xC231246DB86C897B1A8DaB35bA2A834F4bC6191c;
        
        // USDT addresses
        tokenAddresses[SupportedNetworks.ETHEREUM_SEPOLIA][SupportedToken.USDT] = 0x839206B60a48Ea38F6a1B2FeD93c10194625761E;
        tokenAddresses[SupportedNetworks.BASE_SEPOLIA][SupportedToken.USDT] = 0x961b6e3a9D14885EBA423a36EA7627Ed4cb20CE1;
        tokenAddresses[SupportedNetworks.ARBITRUM_SEPOLIA][SupportedToken.USDT] = 0x8De8B197B46124Efbbefb798005432206F4Fe7BF;
        tokenAddresses[SupportedNetworks.AVALANCHE_FUJI][SupportedToken.USDT] = 0xC9ca7BeBfBf3E53a8aE36E2e93390a2E6A5dAF4C;

        // IDRX token address
        tokenAddresses[SupportedNetworks.ETHEREUM_SEPOLIA][SupportedToken.IDRX] = 0x5514991174EB584aA3c057309051E0eCA85E4Ac7;
        tokenAddresses[SupportedNetworks.BASE_SEPOLIA][SupportedToken.IDRX] = 0xcab958b9Af92E8d7fE3f64AdBDea9ccF0bDf75a9;
        tokenAddresses[SupportedNetworks.ARBITRUM_SEPOLIA][SupportedToken.IDRX] = 0xd15aCcad19004E2A5146B88837e307f20AaC1A0e;
        tokenAddresses[SupportedNetworks.AVALANCHE_FUJI][SupportedToken.IDRX] = 0xCdB252804f39819AB40854EA380bCC339a040B15;
    }

    /**
     * @notice Initialize LINK token addresses for all supported networks
     */
    function _initializeLinkAddresses() private {
        linkTokenAddresses[SupportedNetworks.ETHEREUM_SEPOLIA] = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
        linkTokenAddresses[SupportedNetworks.BASE_SEPOLIA] = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        linkTokenAddresses[SupportedNetworks.ARBITRUM_SEPOLIA] = 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E;
        linkTokenAddresses[SupportedNetworks.AVALANCHE_FUJI] = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    }

    /**
     * @notice Initialize chain selectors for all supported networks
     */
    function _initializeChainSelectors() private {
        chainSelectors[SupportedNetworks.ETHEREUM_SEPOLIA] = 16015286601757825753;
        chainSelectors[SupportedNetworks.BASE_SEPOLIA] = 10344971235874465080;
        chainSelectors[SupportedNetworks.ARBITRUM_SEPOLIA] = 3478487238524512106;
        chainSelectors[SupportedNetworks.AVALANCHE_FUJI] = 14767482510784806043;
    }

    /**
     * @notice Initialize transfer limits for supported tokens
     */
    function _initializeTransferLimits() private {
        // USDC: min 1 USDC (18 decimals), max 100,000 USDC
        minTransferAmounts[SupportedToken.USDC] = 1e18; // 1 USDC with 18 decimals
        maxTransferAmounts[SupportedToken.USDC] = 1e23; // 1,000,000 USDC with 18 decimals

        // USDT: min 1 USDT (18 decimals), max 100,000 USDT
        minTransferAmounts[SupportedToken.USDT] = 1e18; // 1 USDT with 18 decimals
        maxTransferAmounts[SupportedToken.USDT] = 1e23; // 1,000,000 USDT with 18 decimals

        // IDRX token: min 1 IDRX (18 decimals), max 100,000 IDRX
        minTransferAmounts[SupportedToken.IDRX] = 1e18; // 1 IDRX with 18 decimals
        maxTransferAmounts[SupportedToken.IDRX] = 1e23; // 1,000,000 IDRX with 18 decimals
    }

    /**
     * @notice Modifier to check if the bridge is not paused
     */
    modifier whenNotPaused() {
        if (paused) revert BridgeIsPaused();
        _;
    }

    /**
     * @notice Get the supported token enum from token address
     * @param tokenAddress The address of the token
     * @return The SupportedToken enum value
     */
    function getTokenFromAddress(address tokenAddress) public view returns (SupportedToken) {
        for (uint8 i = 0; i < 4; i++) {
            SupportedNetworks network = SupportedNetworks(i);
            if (tokenAddresses[network][SupportedToken.USDC] == tokenAddress) {
                return SupportedToken.USDC;
            }
            if (tokenAddresses[network][SupportedToken.USDT] == tokenAddress) {
                return SupportedToken.USDT;
            }
            if (tokenAddresses[network][SupportedToken.IDRX] == tokenAddress) {
                return SupportedToken.IDRX;
            }
        }
        revert UnsupportedToken(tokenAddress);
    }

    /**
     * @notice Get the network enum from chain selector
     * @param chainSelector The chain selector
     * @return The SupportedNetworks enum value
     */
    function getNetworkFromChainSelector(uint64 chainSelector) public view returns (SupportedNetworks) {
        for (uint8 i = 0; i < 4; i++) {
            SupportedNetworks network = SupportedNetworks(i);
            if (chainSelectors[network] == chainSelector) {
                return network;
            }
        }
        revert UnsupportedNetwork(chainSelector);
    }

    /**
     * @notice Bridge tokens to another chain
     * @param destinationNetwork The destination network
     * @param receiver The address to receive tokens on the destination chain
     * @param token The token to bridge (USDC or USDT or IDRX)
     * @param amount The amount of tokens to bridge
     * @param payFeesIn How to pay for CCIP fees (Native or LINK)
     * @return messageId The CCIP message ID
     */
    function bridgeTokens(
        SupportedNetworks destinationNetwork,
        address receiver,
        SupportedToken token,
        uint256 amount,
        PayFeesIn payFeesIn
    ) external payable whenNotPaused returns (bytes32 messageId) {
        if (receiver == address(0)) revert ZeroAddress();
        if (amount < minTransferAmounts[token]) {
            revert TransferAmountTooLow(amount, minTransferAmounts[token]);
        }
        if (amount > maxTransferAmounts[token]) {
            revert TransferAmountTooHigh(amount, maxTransferAmounts[token]);
        }

        // Get current network token address
        SupportedNetworks currentNetwork = _getCurrentNetwork();
        address tokenAddress = tokenAddresses[currentNetwork][token];
        
        // Calculate bridge fee
        uint256 bridgeFee = (amount * bridgeFeePercent) / 10000;
        uint256 amountAfterFee = amount - bridgeFee;

        // Transfer tokens from user to this contract
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        
        // Transfer bridge fee to fee collector
        if (bridgeFee > 0) {
            IERC20(tokenAddress).safeTransfer(feeCollector, bridgeFee);
        }

        // Get destination chain selector and token address
        uint64 destinationChainSelector = chainSelectors[destinationNetwork];
        // address destinationTokenAddress = tokenAddresses[destinationNetwork][token];

        // Prepare token amounts for CCIP
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: tokenAddress,
            amount: amountAfterFee
        });

        // Create CCIP message
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode(msg.sender, token), // Include original sender and token type
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.GenericExtraArgsV2({
                    gasLimit: 300_000,
                    allowOutOfOrderExecution: true
                })
            ),
            feeToken: payFeesIn == PayFeesIn.LINK ? linkTokenAddresses[currentNetwork] : address(0)
        });

        // Get router and calculate fees
        IRouterClient router = IRouterClient(this.getRouter());
        
        // Approve router to spend tokens
        IERC20(tokenAddress).approve(address(router), amountAfterFee);
        
        uint256 fees = router.getFee(destinationChainSelector, evm2AnyMessage);

        // Send CCIP message and pay fees
        if (payFeesIn == PayFeesIn.LINK) {
            address linkToken = linkTokenAddresses[currentNetwork];
            if (IERC20(linkToken).balanceOf(address(this)) < fees) {
                revert InsufficientFeeTokenAmount();
            }
            LinkTokenInterface(linkToken).approve(address(router), fees);
            messageId = router.ccipSend(destinationChainSelector, evm2AnyMessage);
        } else {
            if (address(this).balance < fees) revert InsufficientFeeTokenAmount();
            messageId = router.ccipSend{value: fees}(destinationChainSelector, evm2AnyMessage);
        }

        emit TokensBridged(
            messageId,
            destinationChainSelector,
            receiver,
            tokenAddress,
            amountAfterFee,
            fees,
            msg.sender
        );

        return messageId;
    }

    /**
     * @notice Handle received CCIP messages
     * @param any2EvmMessage The received CCIP message
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override whenNotPaused {
        bytes32 messageId = any2EvmMessage.messageId;
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector;
        address originalSender = abi.decode(any2EvmMessage.sender, (address));
        
        // Decode the message data
        (address sender,) = abi.decode(any2EvmMessage.data, (address, SupportedToken));
        
        // Get token details from the received tokens
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage.destTokenAmounts;
        require(tokenAmounts.length == 1, "Expected exactly one token");
        
        address tokenAddress = tokenAmounts[0].token;
        uint256 amount = tokenAmounts[0].amount;

        emit TokensReceived(
            messageId,
            sourceChainSelector,
            sender,
            tokenAddress,
            amount,
            originalSender
        );
    }

    /**
     * @notice Get the current network based on the router address
     * @return The current SupportedNetworks enum value
     */
    function _getCurrentNetwork() private view returns (SupportedNetworks) {
        address router = this.getRouter();
        
        if (router == 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59) {
            return SupportedNetworks.ETHEREUM_SEPOLIA;
        } else if (router == 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93) {
            return SupportedNetworks.BASE_SEPOLIA;
        } else if (router == 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165) {
            return SupportedNetworks.ARBITRUM_SEPOLIA;
        } else if (router == 0xF694E193200268f9a4868e4Aa017A0118C9a8177) {
            return SupportedNetworks.AVALANCHE_FUJI;
        }
        
        revert UnsupportedNetwork(0);
    }

    /**
     * @notice Get the estimated bridge fee for a transfer
     * @param destinationNetwork The destination network
     * @param token The token to bridge
     * @param amount The amount to bridge
     * @param payFeesIn How fees will be paid
     * @return ccipFee The CCIP fee
     * @return bridgeFee The bridge fee
     * @return totalAmount The total amount needed (including bridge fee)
     */
    function getEstimatedFees(
        SupportedNetworks destinationNetwork,
        SupportedToken token,
        uint256 amount,
        PayFeesIn payFeesIn
    ) external view returns (uint256 ccipFee, uint256 bridgeFee, uint256 totalAmount) {
        SupportedNetworks currentNetwork = _getCurrentNetwork();
        address tokenAddress = tokenAddresses[currentNetwork][token];
        
        bridgeFee = (amount * bridgeFeePercent) / 10000;
        uint256 amountAfterFee = amount - bridgeFee;
        totalAmount = amount;

        // Prepare token amounts for fee estimation
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: tokenAddress,
            amount: amountAfterFee
        });

        // Create message for fee estimation
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(msg.sender),
            data: abi.encode(msg.sender, token),
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.GenericExtraArgsV2({
                    gasLimit: 300_000,
                    allowOutOfOrderExecution: true
                })
            ),
            feeToken: payFeesIn == PayFeesIn.LINK ? linkTokenAddresses[currentNetwork] : address(0)
        });

        uint64 destinationChainSelector = chainSelectors[destinationNetwork];
        IRouterClient router = IRouterClient(this.getRouter());
        ccipFee = router.getFee(destinationChainSelector, evm2AnyMessage);

        return (ccipFee, bridgeFee, totalAmount);
    }

    // Admin functions

    /**
     * @notice Update bridge fee percentage
     * @param newFeePercent New fee percentage in basis points (e.g., 100 = 1%)
     */
    function updateBridgeFee(uint256 newFeePercent) external onlyOwner {
        if (newFeePercent > 1000) revert InvalidFeePercent(); // Max 10%
        uint256 oldFee = bridgeFeePercent;
        bridgeFeePercent = newFeePercent;
        emit BridgeFeeUpdated(oldFee, newFeePercent);
    }

    /**
     * @notice Update fee collector address
     * @param newFeeCollector New fee collector address
     */
    function updateFeeCollector(address newFeeCollector) external onlyOwner {
        if (newFeeCollector == address(0)) revert ZeroAddress();
        address oldCollector = feeCollector;
        feeCollector = newFeeCollector;
        emit FeeCollectorUpdated(oldCollector, newFeeCollector);
    }

    /**
     * @notice Update transfer limits for a token
     * @param token The token to update limits for
     * @param minAmount New minimum transfer amount
     * @param maxAmount New maximum transfer amount
     */
    function updateTransferLimits(
        SupportedToken token,
        uint256 minAmount,
        uint256 maxAmount
    ) external onlyOwner {
        require(minAmount < maxAmount, "Min amount must be less than max amount");
        minTransferAmounts[token] = minAmount;
        maxTransferAmounts[token] = maxAmount;
        emit TransferLimitsUpdated(token, minAmount, maxAmount);
    }

    /**
     * @notice Pause the bridge
     */
    function pause() external onlyOwner {
        paused = true;
        emit BridgePaused();
    }

    /**
     * @notice Unpause the bridge
     */
    function unpause() external onlyOwner {
        paused = false;
        emit BridgeUnpaused();
    }

    /**
     * @notice Withdraw native tokens from the contract
     * @param to Address to send tokens to
     */
    function withdrawNative(address payable to) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        uint256 balance = address(this).balance;
        if (balance == 0) revert InsufficientBalance(1, 0);
        
        (bool success, ) = to.call{value: balance}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Withdraw ERC20 tokens from the contract
     * @param token Token address to withdraw
     * @param to Address to send tokens to
     * @param amount Amount to withdraw
     */
    function withdrawToken(address token, address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @notice Allow contract to receive native tokens
     */
    receive() external payable {}

    /**
     * @notice Fallback function
     */
    fallback() external payable {}
}

