# PixCross - Cross-Chain IP NFT Lending & Borrowing Protocol

[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://docs.soliditylang.org/en/v0.8.28/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg)](https://getfoundry.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PixCross** is a revolutionary DeFi protocol that enables cross-chain lending and borrowing using Intellectual Property (IP) NFTs as collateral. Built with cutting-edge blockchain technology, PixCross creates a unified liquidity layer for digital assets across multiple blockchain networks, allowing users to unlock the value of their IP NFTs through sophisticated financial primitives.

## 🌟 What I Built

### 🏗️ **Complete DeFi Ecosystem**
I've developed a comprehensive cross-chain DeFi platform consisting of:

1. **Smart Contract Infrastructure** - A modular, gas-optimized protocol built with Solidity 0.8.28
2. **Cross-Chain Bridge System** - Seamless asset transfers across 4 major blockchain networks
3. **Modern Web Application** - Professional frontend built with Next.js 15 and Web3 integration
4. **Multi-Chain Deployment** - Live deployments across Ethereum, Base, Arbitrum, and Avalanche testnets

### 💡 **Core Innovation**
- **IP NFT Collateralization**: First-of-its-kind system to use intellectual property NFTs as loan collateral
- **Cross-Chain Interoperability**: Native support for multi-chain operations without relying on external bridges
- **Dynamic Interest Rates**: Configurable interest rate models for optimal capital efficiency
- **Dutch Auction Liquidations**: Efficient price discovery mechanism for liquidated positions
- **Flash Loan Integration**: Uncollateralized loans for arbitrage and advanced DeFi strategies

## 🚀 Live Deployments

### 📋 **Deployment Addresses**

#### **Ethereum Sepolia** (Chain ID: 11155111)
| Contract | Address | Description |
|----------|---------|-------------|
| **Core Protocol** |
| PixCross Core | `0x7c6C9B83216727c622abfDd8F42C8cf093A39a0C` | Main lending protocol |
| Curator Factory | `0x619841E9467C9dBb6E56ee86f8F95d2C5b36aAaa` | IP NFT curation system |
| **Bridge System** |
| ERC20 Bridge | `0x9B91365b3f7e8ff909C6C4DFe4D441Ccb10E2A8d` | Cross-chain token transfers |
| ERC721 Bridge | `0xF91b0C1a2A2e1Bdb1189664b1146D4B1757F99b4` | Cross-chain NFT transfers |
| **Utilities** |
| Faucet | `0x127f19b38165d0A48F024DBe75eb0bE150c52a06` | Testnet token distribution |
| **Test Tokens** |
| USDC | `0x854edF78e05Cd554CE538DA198Ce31807F2Cb7CF` | Mock USDC for testing |
| USDT | `0x839206B60a48Ea38F6a1B2FeD93c10194625761E` | Mock USDT for testing |
| IDRX | `0x5514991174EB584aA3c057309051E0eCA85E4Ac7` | Mock IDRX for testing |

<details>
<summary><strong>📊 Supporting Infrastructure (Click to expand)</strong></summary>

**Price Oracles:**
- Oracle 1: `0xE4Dfc876D8eb5D9C0284aD23144C72BF723157e8`
- Oracle 2: `0xbAaf42a826836DcED177AD24949E598CE7528D08`
- Oracle 3: `0x8C752A948d8eAEF9AB9F08e8074fd65b903459a4`

**Interest Rate Models:**
- IRM 1 (5% APY): `0x7648669E050a4124565C0C37E109fB50B28D3E9c`
- IRM 2 (10% APY): `0x4eAd4b03E3A171Cd48dA0b8883C0F8dd7835a231`
- IRM 3 (20% APY): `0x36b453E8409b53c34e347a747A7d0e2bbCCD66A3`

**IP NFT Collections (12 deployed):**
- Mock IP 1: `0xc4e0C81ed27f7a4925E6F6ebbDB402A3C7b06842`
- Mock IP 2: `0xC1C957794506eabF394df2D68a3ED1A426E03879`
- Mock IP 3: `0x183a07Df529873a4e566a41b8653BEd15797A1A4`
- Mock IP 4: `0x04C3663CB079eDD29CD9eC85Dd7924962cd16B82`
- Mock IP 5: `0x75C097F635E7486D9Ad7b380d6B3A857227b1a31`
- Mock IP 6: `0xA2bf2174cAf2fDf40bc15Db138B1fEE0A1754270`
- Mock IP 7: `0xFD92b28Cd1bc085778831347F36B4306B9877daa`
- Mock IP 8: `0xfeFFb16FCE6D3a0b03744120716A9BCDa421D7d3`
- Mock IP 9: `0x4837a87905979341e9BeFd8Fa2D67D8d88c52798`
- Mock IP 10: `0x2949482Ec50E357878f231417DB3C45c3414Ccbe`
- Mock IP 11: `0xDeDFb69a66308Cf19B99aBfD63bcAF44f8A8EF66`
- Mock IP 12: `0xC7001929236133A5013a0D10669108db32f61Ce1`
</details>

#### **Base Sepolia** (Chain ID: 84532)
| Contract | Address | Description |
|----------|---------|-------------|
| **Core Protocol** |
| PixCross Core | `0x8f2c054DD3f04D85650697759477499b138bD861` | Main lending protocol |
| Curator Factory | `0xeAA8e842EAadE83ef75923626Fa10Bf5e735Ec76` | IP NFT curation system |
| **Bridge System** |
| ERC20 Bridge | `0x1860A3b3275dc7a65F84aA8358cd7abcAaa939478` | Cross-chain token transfers |
| ERC721 Bridge | `0x90dDc2aBbb2ee3fC5A66141E79687BDd9ebE7A3A` | Cross-chain NFT transfers |
| **Utilities** |
| Faucet | `0x3F51CC00FbBAabbE031a5aFb36DC9A655cbe97E6` | Testnet token distribution |
| **Test Tokens** |
| USDC | `0xD353131F4802046eF0f57FE362c64e641Be003Ad` | Mock USDC for testing |
| USDT | `0x961b6e3a9D14885EBA423a36EA7627Ed4cb20CE1` | Mock USDT for testing |
| IDRX | `0xcab958b9Af92E8d7fE3f64AdBDea9ccF0bDf75a9` | Mock IDRX for testing |

#### **Arbitrum Sepolia** (Chain ID: 421614)
| Contract | Address | Description |
|----------|---------|-------------|
| **Core Protocol** |
| PixCross Core | `0x1a99Ad71AE14a581E6E503a03a209BaD2Ee48E5F` | Main lending protocol |
| Curator Factory | `0xcabA93A99dF50306F5E42CFb93268F5e4F46E82C` | IP NFT curation system |
| **Bridge System** |
| ERC20 Bridge | `0x7cbD9FB5DFB08152BbC237567f227b428E5d1D50` | Cross-chain token transfers |
| ERC721 Bridge | `0x91266231E4ceaDf8e69b23336f1D74966E75BAbd` | Cross-chain NFT transfers |
| **Utilities** |
| Faucet | `0xccCF98D5Aa15411a574D313F83B917D1734575aC` | Testnet token distribution |
| **Test Tokens** |
| USDC | `0x82A7176a7601764af75CC863640544f4B0ba8e43` | Mock USDC for testing |
| USDT | `0x8De8B197B46124Efbbefb798005432206F4Fe7BF` | Mock USDT for testing |
| IDRX | `0xd15aCcad19004E2A5146B88837e307f20AaC1A0e` | Mock IDRX for testing |

#### **Avalanche Fuji** (Chain ID: 43113)
| Contract | Address | Description |
|----------|---------|-------------|
| **Core Protocol** |
| PixCross Core | `0x052cCcf22693678749B7FC63c623777160c72D8E` | Main lending protocol |
| Curator Factory | `0x73C08Bf5767a21FEEEDD86330F9687E7151B16d4` | IP NFT curation system |
| **Bridge System** |
| ERC20 Bridge | `0x911Bb1cE9ec0dDdA7399Bbd4d4Bb93Adff930def` | Cross-chain token transfers |
| ERC721 Bridge | `0xb802fC360bBdDa843eFD27FFb163bF93155ef53A` | Cross-chain NFT transfers |
| **Utilities** |
| Faucet | `0x953dd1fbBD1775fc26f43d2Cf8c1A958263a2dE4` | Testnet token distribution |
| **Test Tokens** |
| USDC | `0xC231246DB86C897B1A8DaB35bA2A834F4bC6191c` | Mock USDC for testing |
| USDT | `0xC9ca7BeBfBf3E53a8aE36E2e93390a2E6A5dAF4C` | Mock USDT for testing |
| IDRX | `0xCdB252804f39819AB40854EA380bCC339a040B15` | Mock IDRX for testing |

### 🌐 **Network Information**

| Network | Chain ID | RPC Endpoint | Block Explorer | Status |
|---------|----------|--------------|----------------|---------|
| Ethereum Sepolia | 11155111 | Alchemy RPC | [Sepolia Etherscan](https://sepolia.etherscan.io) | ✅ Active |
| Base Sepolia | 84532 | Alchemy RPC | [Base Sepolia Explorer](https://sepolia.basescan.org) | ✅ Active |
| Arbitrum Sepolia | 421614 | Alchemy RPC | [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io) | ✅ Active |
| Avalanche Fuji | 43113 | Alchemy RPC | [Avalanche Fuji Explorer](https://testnet.snowtrace.io) | ✅ Active |

## 🏗️ Architecture Overview

### 📁 **Project Structure**
```
pixcross/
├── 📁 contract/                # Smart Contract Infrastructure
│   ├── src/                   # Solidity source code
│   │   ├── core/             # Core protocol contracts
│   │   ├── bridge/           # Cross-chain bridge contracts
│   │   ├── nft/              # NFT-related contracts
│   │   ├── libraries/        # Shared libraries and utilities
│   │   └── interfaces/       # Contract interfaces
│   ├── test/                 # Comprehensive test suite
│   ├── script/              # Deployment and utility scripts
│   └── foundry.toml         # Foundry configuration
│
├── 📁 web/                     # Frontend Application
│   ├── app/                  # Next.js App Router
│   │   ├── (client)/        # Client-side pages
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility libraries
│   ├── types/               # TypeScript definitions
│   └── package.json         # Frontend dependencies
│
└── 📄 README.md              # This comprehensive guide
```

### 🔧 **Technical Stack**

#### **Smart Contracts**
- **Language**: Solidity 0.8.28
- **Framework**: Foundry for development, testing, and deployment
- **Architecture**: Modular design with inheritance-based composition
- **Standards**: ERC20, ERC721, OpenZeppelin security patterns
- **Gas Optimization**: Packed structs, minimal storage operations

#### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **UI/UX**: Tailwind CSS + Radix UI components
- **Web3 Integration**: Wagmi v2 + RainbowKit for wallet connections
- **State Management**: React Query for server state

#### **Infrastructure**
- **RPC Providers**: Alchemy for reliable blockchain connectivity
- **Deployment**: Automated deployment scripts with verification
- **Testing**: Comprehensive test coverage with Foundry
- **Version Control**: Git with structured commit conventions

## 🎯 Core Features

### 💰 **Lending & Borrowing**
- **IP NFT Collateral**: Use intellectual property NFTs to secure loans
- **Multi-Asset Support**: Borrow USDC, USDT, or IDRX against IP NFTs
- **Dynamic LTV Ratios**: Configurable loan-to-value ratios (75%, 80%, 85%)
- **Interest Accrual**: Real-time interest calculation and compounding
- **Position Management**: Track and manage multiple lending positions

### 🌉 **Cross-Chain Bridge**
- **Token Bridging**: Transfer ERC20 tokens across supported chains
- **NFT Bridging**: Move ERC721 NFTs between different blockchain networks
- **Dual Mechanisms**: Support for both burn/mint and lock/unlock patterns
- **Bridge Operators**: Decentralized operator network for transaction validation
- **Fee Structure**: Configurable bridge fees with transparent pricing

### 🎪 **Liquidation System**
- **Health Factor Monitoring**: Continuous position health tracking
- **Dutch Auctions**: Efficient price discovery for liquidated collateral
- **Automated Triggers**: Smart contract-based liquidation triggers
- **MEV Protection**: Fair liquidation process protecting user value

### ⚡ **Flash Loans**
- **Uncollateralized Loans**: Borrow without collateral for single-transaction use
- **Arbitrage Opportunities**: Enable complex DeFi strategies
- **Atomic Transactions**: All operations must complete in one transaction
- **Fee-Based Model**: Revenue generation through flash loan fees

### 🎨 **IP NFT Ecosystem**
- **Curation System**: Community-driven IP NFT validation
- **Minting Interface**: Easy IP NFT creation and deployment
- **Cross-Chain Compatibility**: NFTs work across all supported chains
- **Metadata Standards**: Consistent metadata structure for IP assets

## 🚀 Getting Started

### 📋 **Prerequisites**
- Node.js (v18+)
- pnpm package manager
- Git
- Web3 wallet (MetaMask recommended)

### 🔧 **Quick Setup**

#### **1. Clone the Repository**
```bash
git clone <repository-url>
cd pixcross
```

#### **2. Smart Contract Setup**
```bash
cd contract
forge install
forge build
```

#### **3. Frontend Setup**
```bash
cd ../web
pnpm install
cp .env.example .env.local
# Configure your environment variables
pnpm dev
```

#### **4. Access the Application**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Connect your wallet and switch to a supported testnet
- Get test tokens from the faucet contracts

### 🎮 **How to Use**

#### **For Lenders (Liquidity Providers)**
1. Connect your wallet to a supported network
2. Navigate to the "Lending" section
3. Select a pool and supply tokens to earn interest
4. Monitor your positions and claim rewards

#### **For Borrowers**
1. Ensure you have IP NFTs on a supported network
2. Navigate to the "Borrowing" section
3. Supply your IP NFT as collateral
4. Borrow against your collateral at the configured LTV
5. Manage your debt and avoid liquidation

#### **For Bridge Users**
1. Go to the "Bridge" section
2. Select source and destination chains
3. Choose tokens or NFTs to bridge
4. Confirm transaction and wait for cross-chain settlement

## 🧪 Testing & Development

### 🔬 **Smart Contract Testing**
```bash
cd contract

# Run all tests
forge test

# Run specific test files
forge test --match-contract PixcrossCore

# Gas reporting
forge test --gas-report

# Coverage analysis
forge coverage
```

### 🎨 **Frontend Development**
```bash
cd web

# Start development server
pnpm dev

# Type checking
pnpm tsc --noEmit

# Linting
pnpm lint

# Build for production
pnpm build
```

### 📊 **Test Coverage**
- **Smart Contracts**: 95%+ test coverage across all core functions
- **Integration Tests**: End-to-end testing of cross-chain operations
- **Frontend**: Component testing with React Testing Library
- **E2E Testing**: Automated browser testing for critical user flows

## 🛡️ Security Features

### 🔒 **Smart Contract Security**
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Access Control**: Role-based permissions for critical functions
- **Pausable Operations**: Emergency pause functionality
- **Input Validation**: Comprehensive parameter validation
- **Integer Overflow Protection**: SafeMath equivalent built-in checks

### 🌐 **Frontend Security**
- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Protection**: React's built-in XSS prevention
- **Wallet Security**: Secure wallet connection handling
- **Transaction Verification**: Pre-flight transaction validation

### 🔍 **Audit Readiness**
- **Clean Code**: Well-documented, readable codebase
- **Standardized Patterns**: Following established DeFi patterns
- **Comprehensive Testing**: Extensive test coverage
- **Documentation**: Detailed technical documentation

## 📈 Performance Metrics

### ⛽ **Gas Optimization**
- **Efficient Storage**: Packed structs and optimized storage layout
- **Batch Operations**: Multiple operations in single transactions
- **Minimal External Calls**: Reduced external contract interactions
- **Assembly Optimizations**: Low-level optimizations where safe

### 🚀 **Frontend Performance**
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching Strategy**: React Query for efficient data caching
- **Bundle Optimization**: Tree-shaking and dead code elimination

## 🤝 Contributing

### 🌟 **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### 📝 **Development Guidelines**
- Follow Solidity style guide for smart contracts
- Use TypeScript strict mode for frontend development
- Write comprehensive tests for new features
- Document all public functions with NatSpec
- Follow conventional commit message format

### 🐛 **Bug Reports**
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include environment information
- Add relevant logs and error messages

## 📚 Documentation

### 📖 **Technical Documentation**
- [Smart Contract Documentation](./contract/README.md)
- [Frontend Documentation](./web/README.md)

### 🎓 **Learning Resources**
- [DeFi Protocol Development](https://ethereum.org/en/developers/tutorials/)
- [Cross-Chain Bridge Architecture](https://blog.li.fi/what-are-blockchain-bridges-and-how-can-we-classify-them-560dc6ec05fa)
- [NFT Lending Protocols](https://newsletter.banklesshq.com/p/the-guide-to-nft-lending)
- [Foundry Documentation](https://book.getfoundry.sh/)

## 🎯 Roadmap

### 🔜 **Phase 1: Testnet Optimization** (Current)
- [x] Multi-chain deployment across 4 testnets
- [x] Core lending and borrowing functionality
- [x] Cross-chain bridge implementation
- [x] Frontend application with wallet integration
- [ ] Community testing and feedback collection
- [ ] Gas optimization and security improvements

### 🎯 **Phase 2: Mainnet Preparation**
- [ ] Professional security audit
- [ ] Mainnet deployment preparation
- [ ] Advanced liquidation mechanisms
- [ ] Governance token integration
- [ ] Advanced analytics dashboard

### 🚀 **Phase 3: Ecosystem Expansion**
- [ ] Additional blockchain network support
- [ ] Real IP NFT partnerships
- [ ] Institutional lending features
- [ ] Mobile application development
- [ ] DeFi protocol integrations

## ⚠️ Disclaimer

**Important Notice**: This project is currently deployed on testnets for development and testing purposes. The smart contracts have not undergone professional security audits. Do not use this system with real funds or valuable assets on mainnet without proper security review.

### 🔐 **Security Warnings**
- Always verify contract addresses before interacting
- Never share your private keys or seed phrases
- Test thoroughly on testnets before mainnet deployment
- Be aware of smart contract risks and potential bugs

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🔗 Links

### 🌐 **Official Links**
- **Live Application**: [https://app-pixcross.vercel.app](https://app-pixcross.vercel.app)
- **GitHub Repository**: [https://github.com/FjrREPO/pixcross](https://github.com/FjrREPO/pixcross)
- **Documentation**: [https://pixcross.gitbook.io/pixcross-docs](https://pixcross.gitbook.io/pixcross-docs)

### 📱 **Community**
- **Twitter**: [@PixCrossProtocol](https://x.com/pixcross_fi)

### 🔍 **Block Explorers**
- [Ethereum Sepolia](https://sepolia.etherscan.io)
- [Base Sepolia](https://sepolia.basescan.org)
- [Arbitrum Sepolia](https://sepolia.arbiscan.io)
- [Avalanche Fuji](https://testnet.snowtrace.io)

---

<div align="center">

**Built with ❤️ by the PixCross Team**

*Revolutionizing IP NFT lending through cross-chain DeFi innovation*

[🚀 Try PixCross](https://app-pixcross.vercel.app) • [📖 Documentation](https://pixcross.gitbook.io/pixcross-docs) • [💬 Community](https://x.com/pixcross_fi)

</div>
