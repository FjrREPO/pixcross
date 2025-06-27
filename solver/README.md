# PixCross Bridge Solver And Auction Liquidate

A TypeScript application that monitors bridge events and processes cross-chain NFT transfers for the PixCross Bridge protocol.

## Features

- **Direct Contract Event Reading**: Reads events directly from smart contracts instead of relying on subgraphs
- **Multi-chain Support**: Supports Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, and Avalanche Fuji
- **Automatic Processing**: Automatically detects and processes bridge requests (lock/burn → mint/unlock)
- **Error Handling**: Robust retry mechanisms and error handling
- **Real-time Monitoring**: Continuous polling with configurable intervals
- **Automatic Liquidation**: Monitors lending pools and automatically liquidates undercollateralized positions

## Architecture

### Contract Event Reading

The solver has been updated to read events directly from the bridge contracts instead of using subgraphs. This approach provides:

- **Better Reliability**: No dependency on external subgraph infrastructure
- **Real-time Data**: Direct access to blockchain events without indexing delays
- **Reduced Complexity**: Fewer external dependencies
- **Cost Efficiency**: No need to maintain subgraph infrastructure

### Key Components

1. **ContractEventReader** (`lib/contract-events.ts`): Reads events directly from bridge contracts
2. **BridgeProcessor** (`lib/bridge-processor.ts`): Processes bridge events and executes cross-chain transactions
3. **LiquidationProcessor** (`lib/liquidation-processor.ts`): Monitors and executes automatic liquidations
4. **ChainConfig** (`lib/chains.ts`): Chain configuration management
5. **TokenMapping** (`lib/token-mapping.ts`): Maps token addresses across chains

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Bridge operator private key
- Bridge contract addresses for all supported chains

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pixcross-bridge-solver

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env
```

### Configuration

Edit the `.env` file with your configuration:

```env
# Bridge Operator Private Key (required)
PRIVATE_KEY=your_private_key_here

# Bridge Contract Addresses (required)
ETH_SEPOLIA_BRIDGE_ADDRESS=0x...
BASE_SEPOLIA_BRIDGE_ADDRESS=0x...
ARB_SEPOLIA_BRIDGE_ADDRESS=0x...
AVAX_FUJI_BRIDGE_ADDRESS=0x...

# Optional: Custom RPC URLs
# ETHEREUM_SEPOLIA_RPC_URL=https://your-custom-rpc-url
# BASE_SEPOLIA_RPC_URL=https://your-custom-rpc-url
# ARBITRUM_SEPOLIA_RPC_URL=https://your-custom-rpc-url
# AVALANCHE_FUJI_RPC_URL=https://your-custom-rpc-url

# Configuration
POLLING_INTERVAL=30000  # 30 seconds
MAX_RETRIES=3
DEBUG_MODE=false
```

### Bridge Operator Setup

The private key you provide must be registered as a bridge operator on all chains. You can verify this using the status command:

```bash
npm run dev
```

The solver will check and display the bridge operator status for each chain during startup.

### Liquidation Configuration (Optional)

To enable automatic liquidation of undercollateralized positions:

```env
# Pixcross Contract Addresses (required for liquidation)
ETH_SEPOLIA_PIXCROSS_ADDRESS=0x...
BASE_SEPOLIA_PIXCROSS_ADDRESS=0x...
ARB_SEPOLIA_PIXCROSS_ADDRESS=0x...
AVAX_FUJI_PIXCROSS_ADDRESS=0x...

# Liquidation Configuration
LIQUIDATION_ENABLED=true  # Set to true to enable automatic liquidation
LIQUIDATION_POOLS=pool1,pool2,pool3  # Comma-separated list of pool IDs to monitor
LIQUIDATION_MAX_TOKENS=100  # Maximum tokens to check per liquidation call
LIQUIDATION_CHECK_INTERVAL=60000  # Check interval in milliseconds (1 minute)

# Per-pool settings (optional)
LIQUIDATION_MAX_TOKENS_POOL1=50
LIQUIDATION_CHECK_INTERVAL_POOL1=30000
LIQUIDATION_ENABLED_POOL1=true
```

**Liquidation Safety Notes:**
- Liquidation is disabled by default for safety
- Ensure you have sufficient gas funds on all chains
- Monitor liquidation activity and adjust parameters as needed
- Test liquidation on testnets before enabling on mainnet

## Usage

### Development

```bash
# Run in development mode with auto-reload
npm run dev
```

### Production

```bash
# Build and run
npm run build
npm start
```

## How It Works

### Event Processing Flow

1. **Block Scanning**: The solver continuously scans for new blocks on all supported chains
2. **Event Detection**: Identifies relevant bridge events (TokenLocked, TokenBurned)
3. **Cross-chain Processing**: Processes events by minting/unlocking tokens on target chains
4. **Duplicate Prevention**: Tracks processed events to prevent duplicate processing

### Event Types

- **TokenLocked**: When a user locks an NFT on the source chain (needs minting on target)
- **TokenBurned**: When a user burns an NFT on the source chain (needs minting on target)
- **TokenMinted**: When an NFT is minted on the target chain (informational)
- **TokenUnlocked**: When an NFT is unlocked on the source chain (informational)

### Block Processing Strategy

- **Initial Sync**: Starts from 100 blocks ago to avoid processing all historical events
- **Batch Processing**: Processes up to 1000 blocks at a time to avoid RPC limits
- **State Persistence**: Tracks the last processed block for each chain
- **Error Recovery**: Continues from the last successfully processed block after errors

### Liquidation Processing Flow

1. **Pool Monitoring**: Continuously monitors configured lending pools for liquidatable positions
2. **Position Scanning**: Calls `autoLiquidatePool` with configurable batch sizes to check for liquidations
3. **Automatic Execution**: Executes liquidations when undercollateralized positions are found
4. **Event Parsing**: Parses `BatchLiquidationExecuted` events to track successful liquidations
5. **Multi-chain Support**: Operates across all configured chains simultaneously

### Liquidation Configuration Options

- **Pool-specific Settings**: Configure different parameters for each pool
- **Batch Size Control**: Limit the number of tokens checked per liquidation call
- **Interval Management**: Set custom check intervals for each pool
- **Selective Enablement**: Enable/disable liquidation per pool or globally

## Contract Event vs Subgraph Comparison

| Aspect | Contract Events | Subgraph |
|--------|----------------|----------|
| **Reliability** | Direct blockchain access | Depends on indexer uptime |
| **Latency** | Real-time | Indexing delay |
| **Setup** | Minimal | Requires subgraph deployment |
| **Cost** | RPC costs only | Subgraph hosting costs |
| **Maintenance** | Low | Requires subgraph updates |
| **Data Integrity** | Always current | May have sync issues |

## Configuration Options

### Environment Variables

- `PRIVATE_KEY`: Bridge operator private key (required)
- `*_BRIDGE_ADDRESS`: Bridge contract addresses (required)
- `*_RPC_URL`: Custom RPC URLs (optional)
- `POLLING_INTERVAL`: Polling interval in milliseconds (default: 30000)
- `MAX_RETRIES`: Maximum retry attempts (default: 3)
- `DEBUG_MODE`: Enable debug logging (default: false)

### Supported Chains

- **Ethereum Sepolia** (Chain ID: 11155111)
- **Base Sepolia** (Chain ID: 84532)
- **Arbitrum Sepolia** (Chain ID: 421614)
- **Avalanche Fuji** (Chain ID: 43113)

## Monitoring and Logging

The solver provides comprehensive logging:

```
[2024-01-01T00:00:00.000Z] [INFO] Initializing bridge solver connections...
[2024-01-01T00:00:01.000Z] [INFO] ✓ Verified as bridge operator on Ethereum Sepolia
[2024-01-01T00:00:02.000Z] [INFO] Processing blocks 12345-12355 on Base Sepolia
[2024-01-01T00:00:03.000Z] [INFO] Processing contract locked token: 123 from Ethereum Sepolia to Base Sepolia
[2024-01-01T00:00:04.000Z] [INFO] ✓ Token 123 minted successfully. Tx: 0x...
```

## Error Handling

- **RPC Failures**: Automatic retry with exponential backoff
- **Transaction Failures**: Retry with increased gas limits
- **Network Issues**: Continue processing other chains
- **Invalid Events**: Skip and log invalid or unsupported events

## Security Considerations

- Store private keys securely (consider using hardware wallets for production)
- Use dedicated RPC endpoints for production
- Monitor bridge operator permissions regularly
- Implement proper access controls for the solver environment

## Troubleshooting

### Quick RPC Test

Test your RPC endpoints before running the solver:

```bash
node test-rpc.js
```

This will test all RPC endpoints for `eth_getLogs` support and connectivity.

### Common Issues

1. **"eth_getLogs is unavailable"**: Your RPC endpoint doesn't support event querying
   - See `TROUBLESHOOTING.md` for detailed solutions
   - Use the updated Avalanche Fuji RPC or get a dedicated endpoint

2. **"Not a bridge operator"**: Ensure your address is registered as a bridge operator

3. **"No bridge address configured"**: Set the bridge contract addresses in your .env file

4. **Rate limiting errors**: Increase `POLLING_INTERVAL` or use dedicated RPC endpoints

5. **Transaction failures**: Ensure sufficient gas and proper token mappings

### Debug Mode

Enable debug mode for verbose logging:

```env
DEBUG_MODE=true
```

### Detailed Troubleshooting

For comprehensive troubleshooting, including RPC endpoint issues, rate limiting, and chain-specific problems, see:

**[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

