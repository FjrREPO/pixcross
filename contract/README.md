# Pixcross Smart Contract

[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://docs.soliditylang.org/en/v0.8.28/)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg)](https://getfoundry.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PixCross is a cutting-edge DeFi protocol that enables cross-chain lending and borrowing using IP (Intellectual Property) NFTs as collateral. The protocol combines advanced financial primitives with cross-chain bridging capabilities to create a unified liquidity layer for digital assets across multiple blockchain networks.

## 🌟 Key Features

- **NFT-Collateralized Lending**: Use IP NFTs as collateral to borrow ERC20 tokens
- **Cross-Chain Bridging**: Seamlessly bridge ERC20 and ERC721 tokens across supported chains
- **Dynamic Interest Rates**: Configurable interest rate models for optimal market efficiency
- **Automated Liquidations**: Dutch auction mechanism for efficient liquidation of undercollateralized positions
- **Flash Loans**: Uncollateralized loans for arbitrage and advanced DeFi strategies
- **Curator System**: Decentralized curation of IP NFTs with governance mechanisms
- **Multi-Chain Support**: Ethereum, Base, Arbitrum, and Avalanche networks

## 🏗️ System Architecture

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PixCross      │    │  Bridge System  │    │  Curator System │
│   Core Protocol │────│  ERC20/ERC721   │────│  IP Management  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Lending &     │    │   Cross-Chain   │    │   NFT Minting   │
│   Borrowing     │    │   Operations    │    │   & Curation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Contract Structure

- **Core Layer**: `Pixcross.sol` - Main protocol contract with modular inheritance
- **Bridge Layer**: Cross-chain token transfers with burn/mint or lock/unlock mechanisms  
- **NFT Layer**: IP NFT minting, curation, and management systems
- **Utils Layer**: Shared libraries, constants, errors, and helper functions

## 📋 Data Structures

### Pool Parameters
```solidity
struct PoolParams {
    address collateralToken;  // NFT contract address
    address loanToken;        // ERC20 token address
    address oracle;           // Price oracle address
    address irm;              // Interest rate model address
    uint256 ltv;              // Loan-to-value ratio
    uint256 lth;              // Liquidation threshold
}
```

### Pool Data
```solidity
struct Pool {
    uint128 totalSupplyAssets;   // Total supplied assets
    uint128 totalSupplyShares;   // Total supply shares
    uint128 totalBorrowAssets;   // Total borrowed assets
    uint128 totalBorrowShares;   // Total borrow shares
    uint256 lastUpdate;          // Last interest accrual timestamp
    uint128 fee;                 // Protocol fee
}
```

### Position Data
```solidity
struct Position {
    Id id;                       // Pool identifier
    address user;                // Position owner
    uint256 collateralTokenId;   // NFT token ID used as collateral
    uint256 borrowShares;        // User's borrow shares
    uint256 lastDebtUpdate;      // Last debt update timestamp
}
```

## 🚀 Getting Started

### Prerequisites

- [Foundry](https://getfoundry.sh/) (Latest version)
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [pnpm](https://pnpm.io/) package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pixcross/contract
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   forge install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Required environment variables:
   ```bash
   PRIVATE_KEY=your_private_key
   ETHEREUM_SEPOLIA_RPC_URL=your_ethereum_sepolia_rpc
   BASE_SEPOLIA_RPC_URL=your_base_sepolia_rpc
   ARBITRUM_SEPOLIA_RPC_URL=your_arbitrum_sepolia_rpc
   AVALANCHE_FUJI_RPC_URL=your_avalanche_fuji_rpc
   ETHERSCAN_API_KEY=your_etherscan_api_key
   BASESCAN_API_KEY=your_basescan_api_key
   ARBISCAN_API_KEY=your_arbiscan_api_key
   ```

### Building

```bash
forge build
```

### Testing

Run the complete test suite:
```bash
forge test
```

Run specific tests:
```bash
forge test --match-contract PixcrossCore
forge test --match-test testSupplyAndBorrow
```

Run tests with gas reporting:
```bash
forge test --gas-report
```

## 📖 Core Protocol Usage

### 1. Pool Creation

```solidity
PoolParams memory params = PoolParams({
    collateralToken: 0x...,  // NFT contract
    loanToken: 0x...,        // ERC20 token
    oracle: 0x...,           // Price oracle
    irm: 0x...,              // Interest rate model
    ltv: 80,                 // 80% LTV
    lth: 90                  // 90% liquidation threshold
});

pixcross.createPool(params);
```

### 2. Supply Assets (Lending)

```solidity
// Approve tokens first
IERC20(loanToken).approve(address(pixcross), amount);

// Supply assets to earn interest
pixcross.supply(poolId, amount, receiver);
```

### 3. Supply Collateral & Borrow

```solidity
// Approve NFT
IERC721(collateralToken).approve(address(pixcross), tokenId);

// Supply NFT as collateral and borrow
pixcross.supplyCollateral(poolId, tokenId);
pixcross.borrow(poolId, amount, receiver, tokenId);
```

### 4. Repay & Withdraw

```solidity
// Repay loan
IERC20(loanToken).approve(address(pixcross), repayAmount);
pixcross.repay(poolId, repayAmount, tokenId);

// Withdraw collateral
pixcross.withdrawCollateral(poolId, tokenId, receiver);
```

## 🌉 Cross-Chain Bridge Usage

### ERC20 Bridge

```solidity
// Bridge tokens to another chain
IERC20(token).approve(address(bridge), amount);
bridge.bridgeToken(
    token,
    amount,
    targetChainId,
    targetAddress,
    shouldBurn  // true for burn/mint, false for lock/unlock
);
```

### ERC721 Bridge

```solidity
// Bridge NFT to another chain
IERC721(nftContract).approve(address(bridge), tokenId);
bridge.bridgeToken(
    nftContract,
    tokenId,
    targetChainId,
    targetAddress,
    shouldBurn
);
```

## 🎯 Deployment

### Local Deployment

```bash
# Start local node
anvil

# Deploy to local network
forge script script/DeployPixcross.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Testnet Deployment

```bash
# Deploy to Ethereum Sepolia
forge script script/DeployPixcross.s.sol \
  --rpc-url $ETHEREUM_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY

# Deploy to Base Sepolia
forge script script/DeployPixcross.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Multi-Chain Deployment

Deploy across all supported networks:
```bash
# Deploy bridge contracts
forge script script/DeployPixcrossBridgeERC20.s.sol --multi
forge script script/DeployPixcrossBridgeERC721.s.sol --multi

# Deploy core protocol
forge script script/DeployPixcross.s.sol --multi
```

## 🔧 Configuration

### Supported Networks

| Network | Chain ID | RPC Endpoint | Explorer |
|---------|----------|--------------|----------|
| Ethereum Sepolia | 11155111 | `$ETHEREUM_SEPOLIA_RPC_URL` | [Sepolia Etherscan](https://sepolia.etherscan.io) |
| Base Sepolia | 84532 | `$BASE_SEPOLIA_RPC_URL` | [Base Sepolia Explorer](https://sepolia.basescan.org) |
| Arbitrum Sepolia | 421614 | `$ARBITRUM_SEPOLIA_RPC_URL` | [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io) |
| Avalanche Fuji | 43113 | `$AVALANCHE_FUJI_RPC_URL` | [Avalanche Fuji Explorer](https://testnet.snowtrace.io) |

### Interest Rate Models

The protocol supports configurable interest rate models:
- **Fixed Rate Models**: Constant interest rates
- **Dynamic Models**: Variable rates based on utilization
- **Custom Models**: Implement `IInterestRateModel` interface

### Oracle Integration

Price oracles provide collateral valuation:
- **Chainlink Oracles**: Decentralized price feeds
- **Custom Oracles**: Implement `IOracle` interface
- **Mock Oracles**: For testing and development

## 🛡️ Security Features

### Access Control
- **Owner**: Protocol governance and configuration
- **Operators**: Authorized bridge operators
- **Position Owners**: Individual collateral management

### Safety Mechanisms
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Pausable Operations**: Emergency pause functionality
- **Health Factor Checks**: Prevents over-borrowing
- **Slippage Protection**: Guards against price manipulation

### Audit Considerations
- Comprehensive error handling with custom error types
- Extensive test coverage for all core functions
- Formal verification-ready contract structure
- Gas-optimized implementations

## 🧪 Testing Framework

### Test Categories

1. **Unit Tests**: Individual contract functionality
2. **Integration Tests**: Cross-contract interactions  
3. **End-to-End Tests**: Complete user workflows
4. **Fuzz Tests**: Property-based testing
5. **Invariant Tests**: System-wide invariants

### Test Files Structure

```
test/
├── mocks/                  # Mock contracts for testing
├── PixcrossCore.t.sol     # Core protocol tests
├── PixcrossBorrow.t.sol   # Borrowing functionality
├── PixcrossSupply.t.sol   # Supply/lending tests
├── PixcrossAuction.t.sol  # Liquidation auctions
├── PixcrossBridgeERC20.t.sol    # ERC20 bridge tests
├── PixcrossBridgeERC721.t.sol   # ERC721 bridge tests
└── AllocationTest.t.sol   # Resource allocation tests
```

### Running Specific Test Suites

```bash
# Core protocol tests
forge test --match-contract PixcrossCore -vvv

# Bridge functionality
forge test --match-contract Bridge -vvv

# Gas optimization tests
forge test --gas-report --match-contract Gas
```

## 📊 Gas Optimization

The protocol implements several gas optimization techniques:

- **Packed Structs**: Efficient storage layout
- **Batch Operations**: Multiple actions in single transaction
- **Storage Optimization**: Minimal storage reads/writes
- **Assembly Optimizations**: Low-level optimizations where safe

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Comprehensive documentation with NatSpec comments
- 100% test coverage for new features
- Gas optimization considerations

### Testing Requirements

All contributions must include:
- Unit tests for new functions
- Integration tests for cross-contract interactions
- Documentation updates
- Gas usage analysis

## 📚 Resources

### Documentation
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Chainlink Documentation](https://docs.chain.link/)

### Tutorials
- [DeFi Protocol Development](https://ethereum.org/en/developers/tutorials/)
- [Cross-Chain Bridge Architecture](https://blog.li.fi/what-are-blockchain-bridges-and-how-can-we-classify-them-560dc6ec05fa)
- [NFT Lending Protocols](https://newsletter.banklesshq.com/p/the-guide-to-nft-lending)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This software is provided "as is" and is intended for educational and development purposes. The code has not been audited and should not be used in production without proper security review. Use at your own risk.

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]

---

Built with ❤️ by the PixCross Team
