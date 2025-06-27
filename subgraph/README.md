# Pixcross Subgraph

A comprehensive GraphQL subgraph implementation for the Pixcross protocol, providing indexed access to cross-chain DeFi lending, NFT bridging, and curation functionality across multiple EVM-compatible networks.

## 🏗️ Project Structure

```
subgraph/
├── pixgraph-arb/      # Arbitrum Sepolia deployment
├── pixgraph-avax/     # Avalanche deployment
├── pixgraph-base/     # Base deployment
├── pixgraph-eth/      # Ethereum deployment
└── README.md          # This file
```

Each network-specific subgraph maintains an identical structure with network-specific configurations.

## 📋 Overview

Pixcross is a cross-chain protocol that combines:
- **DeFi Lending**: Collateralized lending with auction-based liquidations
- **Cross-Chain Bridging**: ERC20 and ERC721 token bridges
- **NFT Curation**: Community-driven curation system
- **Flash Loans**: Instant liquidity without collateral

The subgraphs index on-chain events to provide efficient GraphQL queries for:
- Lending pool activities
- Bridge transactions
- Auction mechanisms
- Curator activities
- Interest accrual and liquidations

## 🔧 Core Components

### Smart Contracts Indexed

| Contract | Purpose | Events Tracked |
|----------|---------|----------------|
| **Pixcross** | Main lending protocol | Pools, Lending, Borrowing, Auctions, Flash Loans |
| **PixcrossBridgeERC20** | ERC20 token bridging | Token transfers, Fee updates, Bridge status |
| **PixcrossBridgeERC721** | NFT cross-chain bridging | Token locks/unlocks, Minting/burning |
| **PixcrossCuratorFactory** | Curator deployment | Curator creation, Approval management |
| **Curator** | Individual curator instances | Dynamic template-based indexing |

### Key Entities

- **Lending Operations**: `Supply`, `Borrow`, `Repay`, `Withdraw`
- **Auctions**: `AuctionStarted`, `AuctionSettled`, `Bid`
- **Bridge Transactions**: `TokensBridged`, `TokensReceived`, `BridgeTransaction`
- **Collateral Management**: `SupplyCollateral`, `WithdrawCollateral`
- **Protocol Parameters**: `InterestRateModel`, `LTV`, `PoolCreated`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Graph CLI (`npm install -g @graphprotocol/graph-cli`)

### Installation

Navigate to any network-specific subgraph directory:

```bash
cd pixgraph-arb  # or pixgraph-eth, pixgraph-base, pixgraph-avax
yarn install
```

### Development Workflow

1. **Generate Types**
   ```bash
   yarn codegen
   ```

2. **Build Subgraph**
   ```bash
   yarn build
   ```

3. **Deploy to Graph Studio**
   ```bash
   yarn deploy
   ```

4. **Local Development**
   ```bash
   # Start local Graph Node (requires Docker)
   docker-compose up -d
   
   # Create local subgraph
   yarn create-local
   
   # Deploy locally
   yarn deploy-local
   ```

5. **Testing**
   ```bash
   yarn test
   ```

## 🌐 Network Deployments

| Network | Subgraph | Graph Studio |
|---------|----------|-------------|
| Arbitrum Sepolia | `pixgraph-arb` | `pixcross-arb` |
| Ethereum | `pixgraph-eth` | `pixcross-eth` |
| Base | `pixgraph-base` | `pixcross-base` |
| Avalanche | `pixgraph-avax` | `pixcross-avax` |

### Contract Addresses (Arbitrum Sepolia Example)

```yaml
Pixcross: 0x1a99Ad71AE14a581E6E503a03a209BaD2Ee48E5F
PixcrossCuratorFactory: 0xcabA93A99dF50306F5E42CFb93268F5e4F46E82C
PixcrossBridgeERC20: 0x7cbD9FB5DFB08152BbC237567f227b428E5d1D50
PixcrossBridgeERC721: 0x91266231E4ceaDf8e69b23336f1D74966E75BAbd
```

## 📊 GraphQL Schema Highlights

### Lending Protocol Queries

```graphql
# Get all active lending pools
query GetActivePools {
  poolCreateds {
    poolId
    collateralToken
    loanToken
    ltv
    liquidationFee
  }
}

# Track borrowing activity
query GetBorrowHistory($user: Bytes!) {
  borrows(where: { onBehalfOf: $user }) {
    poolId
    amount
    shares
    blockTimestamp
  }
}
```

### Bridge Transaction Monitoring

```graphql
# Monitor cross-chain transfers
query GetBridgeTransactions {
  bridgeTransactions {
    messageId
    status
    sourceChain
    destinationChain
    token
    amount
    sender
    receiver
  }
}

# Track ERC721 bridge activity
query GetNFTBridges {
  tokenLockeds {
    token
    tokenId
    owner
    destinationChain
  }
}
```

### Auction System

```graphql
# Active auctions
query GetActiveAuctions {
  auctionStarteds {
    tokenId
    owner
    collateralToken
    loanToken
    startTime
    endTime
    debtAmount
  }
}

# Bidding history
query GetBids($tokenId: BigInt!) {
  bids(where: { tokenId: $tokenId }) {
    bidder
    amount
    blockTimestamp
  }
}
```

## 🏛️ Architecture

### Event Handling

```typescript
// Example: Pixcross lending event handler
export function handleSupply(event: SupplyEvent): void {
  let entity = new Supply(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  
  entity.poolId = event.params.poolId;
  entity.caller = event.params.caller;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  
  entity.save();
}
```

### Dynamic Template Support

The subgraph uses dynamic templates for curator contracts:

```yaml
templates:
  - name: Curator
    kind: ethereum/contract
    source:
      abi: Curator
    mapping:
      eventHandlers:
        - event: CurationAction(...)
          handler: handleCurationAction
```

## 🔧 Configuration

### Network-Specific Settings

Each subgraph directory contains:

- `subgraph.yaml`: Network-specific contract addresses and start blocks
- `networks.json`: Alternative network configurations
- `schema.graphql`: Shared GraphQL schema
- `src/`: TypeScript mapping functions

### Environment Variables

```bash
# Graph Studio deployment
GRAPH_STUDIO_DEPLOY_KEY=your_deploy_key

# Local development
GRAPH_NODE_URL=http://localhost:8020
IPFS_URL=http://localhost:5001
```

## 🧪 Testing

Run unit tests using Matchstick:

```bash
yarn test
```

Test files are located in the `tests/` directory and cover:
- Event handler logic
- Entity relationships
- Data transformations
- Edge cases

## 📈 Monitoring & Analytics

### Key Metrics to Track

- **TVL (Total Value Locked)**: Sum of all collateral supplies
- **Bridge Volume**: Cross-chain transaction volumes
- **Liquidation Events**: Auction settlements and outcomes
- **Interest Accrual**: Protocol revenue generation
- **Active Users**: Unique addresses interacting with protocol

### Performance Considerations

- **Indexing Speed**: Optimized event handlers for fast sync
- **Query Efficiency**: Indexed entities for common access patterns
- **Data Retention**: Immutable event entities for audit trails

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** in the appropriate network directory
4. **Test thoroughly**: `yarn test && yarn build`
5. **Submit pull request** with detailed description

### Development Guidelines

- Follow existing code patterns and naming conventions
- Add comprehensive tests for new functionality
- Update schema documentation for new entities
- Ensure compatibility across all network deployments

## 📚 Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [GraphQL Query Language](https://graphql.org/learn/)
- [AssemblyScript Guide](https://www.assemblyscript.org/)

## 📄 License

This project is licensed under UNLICENSED - see individual package.json files for details.

## 🆘 Support

For technical support or questions:
- Open an issue in the repository
- Contact the development team

---

**Note**: This subgraph implementation provides a unified data layer for the Pixcross protocol across multiple chains. Each network deployment maintains consistency while adapting to network-specific contract addresses and configurations.
