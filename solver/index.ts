// Load environment variables first, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import {
  GET_ALL_BRIDGE_EVENTS,
  BridgeData,
} from './graphql/query-bridge-request';
import { pixcrossBridgeERC721ABI } from './abis/pixcross-bridge-erc721.abi';
import { getAllChainConfigs, getChainConfig, ChainConfig } from './lib/chains';
import { BridgeProcessor } from './lib/bridge-processor';
import { LiquidationProcessor } from './lib/liquidation-processor';
import { loadLiquidationConfig, validateLiquidationConfig } from './lib/liquidation-config';

interface ProcessedEvent {
  id: string;
  sourceChainId: number;
  targetChainId: number;
  processed: boolean;
}

class BridgeSolver {
  private providers: Map<number, ethers.JsonRpcProvider> = new Map();
  private contracts: Map<number, ethers.Contract> = new Map();
  private graphqlClients: Map<number, GraphQLClient> = new Map();
  private wallet!: ethers.Wallet;
  private lastProcessedTimestamp: Map<number, string> = new Map();
  private processedEvents: Set<string> = new Set();
  private isRunning = false;
  private pollingInterval: number;
  private maxRetries: number;
  private debugMode: boolean;
  private liquidationProcessor?: LiquidationProcessor;
  private liquidationEnabled: boolean;

  constructor() {
    this.pollingInterval = parseInt(process.env.POLLING_INTERVAL || '30000');
    this.maxRetries = parseInt(process.env.MAX_RETRIES || '3');
    this.debugMode = process.env.DEBUG_MODE === 'true';
    this.liquidationEnabled = process.env.LIQUIDATION_ENABLED === 'true';
    
    this.validateEnvironment();
    this.initializeConnections();
    this.initializeLiquidationProcessor();
  }

  private validateEnvironment(): void {
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }

    const requiredBridgeAddresses = [
      'ETH_SEPOLIA_BRIDGE_ADDRESS',
      'BASE_SEPOLIA_BRIDGE_ADDRESS',
      'ARB_SEPOLIA_BRIDGE_ADDRESS',
      'AVAX_FUJI_BRIDGE_ADDRESS',
    ];

    for (const addr of requiredBridgeAddresses) {
      if (!process.env[addr]) {
        console.warn(`Warning: ${addr} not set in environment variables`);
      }
    }
  }

  private initializeConnections(): void {
    this.log('Initializing bridge solver connections...');
    
    const chainConfigs = getAllChainConfigs();
    
    for (const config of chainConfigs) {
      if (!config.bridgeAddress) {
        console.warn(`Skipping chain ${config.name} - no bridge address configured`);
        continue;
      }

      // Initialize provider
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      this.providers.set(config.chainId, provider);

      // Initialize wallet for this provider
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
      if (!this.wallet) {
        this.wallet = wallet;
      }

      // Initialize contract
      const contract = new ethers.Contract(
        config.bridgeAddress,
        pixcrossBridgeERC721ABI,
        wallet
      );
      this.contracts.set(config.chainId, contract);

      // Initialize GraphQL client
      const graphqlClient = new GraphQLClient(config.subgraphUrl);
      this.graphqlClients.set(config.chainId, graphqlClient);

      // Initialize last processed timestamp
      this.lastProcessedTimestamp.set(config.chainId, '0');

      this.log(`Initialized connections for ${config.name}`);
    }

    this.log('All connections initialized successfully');
  }

  private initializeLiquidationProcessor(): void {
    if (!this.liquidationEnabled) {
      this.log('Liquidation processor is disabled');
      return;
    }

    try {
      // Load liquidation configuration
      const liquidationConfig = loadLiquidationConfig();
      
      // Validate configuration
      const configErrors = validateLiquidationConfig(liquidationConfig);
      if (configErrors.length > 0) {
        this.log(`Liquidation configuration errors: ${configErrors.join(', ')}`, 'error');
        return;
      }

      // Check if auto-discovery is enabled
      const autoDiscoveryEnabled = (process.env.AUTO_POOL_DISCOVERY || 'true').toLowerCase() === 'true';
      
      if (liquidationConfig.length === 0 && !autoDiscoveryEnabled) {
        this.log('No liquidation pools configured and auto-discovery is disabled');
        return;
      }
      
      if (liquidationConfig.length === 0) {
        this.log('No liquidation pools configured');
        // Continue with initialization for auto-discovery
      }

      // Initialize liquidation processor
      this.liquidationProcessor = new LiquidationProcessor(
        this.providers,
        this.wallet,
        getAllChainConfigs(),
        liquidationConfig,
        this.maxRetries,
        this.log.bind(this)
      );

      this.log(`Liquidation processor initialized with ${liquidationConfig.length} pools`);
    } catch (error) {
      this.log(`Failed to initialize liquidation processor: ${error}`, 'error');
    }
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (level === 'error') {
      console.error(`${prefix} ${message}`);
    } else if (level === 'warn') {
      console.warn(`${prefix} ${message}`);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      this.log('Bridge solver is already running', 'warn');
      return;
    }

    this.isRunning = true;
    this.log('Starting bridge solver...');
    
    // Verify bridge operator status
    await this.verifyBridgeOperatorStatus();
    
    // Start liquidation processor if enabled
    if (this.liquidationProcessor) {
      this.liquidationProcessor.start();
      this.log('Liquidation processor started');
    }
    
    // Start the main processing loop
    this.processLoop();
  }

  public stop(): void {
    this.isRunning = false;
    this.log('Stopping bridge solver...');
    
    // Stop liquidation processor if running
    if (this.liquidationProcessor) {
      this.liquidationProcessor.stop();
      this.log('Liquidation processor stopped');
    }
  }

  private async verifyBridgeOperatorStatus(): Promise<void> {
    this.log('Verifying bridge operator status...');
    const walletAddress = await this.wallet.getAddress();
    
    const chainConfigs = getAllChainConfigs();
    
    for (const config of chainConfigs) {
      const contract = this.contracts.get(config.chainId);
      if (!contract) continue;

      try {
        const isOperator = await contract.bridgeOperators(walletAddress);
        if (isOperator) {
          this.log(`✓ Verified as bridge operator on ${config.name}`);
        } else {
          this.log(`✗ Not a bridge operator on ${config.name}`, 'warn');
        }
      } catch (error) {
        this.log(`Error checking operator status on ${config.name}: ${error}`, 'error');
      }
    }
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.processBridgeRequests();
      } catch (error) {
        this.log(`Error in process loop: ${error}`, 'error');
      }
      
      // Wait for the polling interval
      await new Promise(resolve => setTimeout(resolve, this.pollingInterval));
    }
  }

  private async processBridgeRequests(): Promise<void> {
    this.log('Processing bridge requests...');
    
    const chainConfigs = getAllChainConfigs();
    const processor = new BridgeProcessor(
      this.contracts,
      this.processedEvents,
      this.maxRetries,
      this.log.bind(this)
    );
    
    for (const sourceConfig of chainConfigs) {
      if (!this.graphqlClients.has(sourceConfig.chainId)) continue;
      
      try {
        await this.processChainEvents(sourceConfig, processor);
      } catch (error) {
        this.log(`Error processing events for ${sourceConfig.name}: ${error}`, 'error');
      }
    }
  }

  private async processChainEvents(sourceConfig: ChainConfig, processor: BridgeProcessor): Promise<void> {
    const graphqlClient = this.graphqlClients.get(sourceConfig.chainId);
    if (!graphqlClient) return;

    const lastProcessedTimestamp = this.lastProcessedTimestamp.get(sourceConfig.chainId) || '0';
    
    try {
      // Fetch new events from the subgraph
      const data: BridgeData = await graphqlClient.request(GET_ALL_BRIDGE_EVENTS, {
        lastBlockTimestamp: lastProcessedTimestamp,
      });

      let latestTimestamp = lastProcessedTimestamp;

      // Process locked tokens (need to mint on target chain)
      for (const lockedToken of data.tokenLockeds) {
        await processor.processLockedToken(sourceConfig, lockedToken);
        if (lockedToken.blockTimestamp > latestTimestamp) {
          latestTimestamp = lockedToken.blockTimestamp;
        }
      }

      // Process burned tokens (need to mint on target chain)  
      for (const burnedToken of data.tokenBurneds) {
        await processor.processBurnedToken(sourceConfig, burnedToken);
        if (burnedToken.blockTimestamp > latestTimestamp) {
          latestTimestamp = burnedToken.blockTimestamp;
        }
      }

      // Update last processed timestamp
      if (latestTimestamp > lastProcessedTimestamp) {
        this.lastProcessedTimestamp.set(sourceConfig.chainId, latestTimestamp);
      }
      
      const totalEvents = data.tokenLockeds.length + data.tokenBurneds.length + 
                         data.tokenMinteds.length + data.tokenUnlockeds.length;
      
      if (totalEvents > 0) {
        this.log(`Processed ${totalEvents} events from ${sourceConfig.name}`);
      }
    } catch (error) {
      this.log(`Error fetching events from ${sourceConfig.name}: ${error}`, 'error');
    }
  }

  public async getStatus(): Promise<void> {
    this.log('=== Bridge Solver Status ===');
    this.log(`Running: ${this.isRunning}`);
    this.log(`Polling Interval: ${this.pollingInterval}ms`);
    this.log(`Max Retries: ${this.maxRetries}`);
    this.log(`Debug Mode: ${this.debugMode}`);
    
    const walletAddress = await this.wallet.getAddress();
    this.log(`Wallet Address: ${walletAddress}`);
    
    this.log('\n=== Chain Status ===');
    const chainConfigs = getAllChainConfigs();
    
    for (const config of chainConfigs) {
      const provider = this.providers.get(config.chainId);
      if (provider) {
        try {
          const blockNumber = await provider.getBlockNumber();
          const balance = await provider.getBalance(walletAddress);
          this.log(`${config.name}:`);
          this.log(`  - Block: ${blockNumber}`);
          this.log(`  - Balance: ${ethers.formatEther(balance)} ETH`);
          this.log(`  - Bridge: ${config.bridgeAddress}`);
        } catch (error) {
          this.log(`${config.name}: Connection error`);
        }
      }
    }
    
    this.log(`\nProcessed events: ${this.processedEvents.size}`);
    
    // Liquidation status
    this.log('\n=== Liquidation Status ===');
    if (this.liquidationProcessor) {
      const liquidationStatus = this.liquidationProcessor.getStatus();
      const discoveredPools = this.liquidationProcessor.getAllDiscoveredPools();
      
      this.log(`Liquidation Enabled: ${this.liquidationEnabled}`);
      this.log(`Liquidation Running: ${liquidationStatus.isRunning}`);
      this.log(`Enabled Pools: ${liquidationStatus.enabledPools}`);
      this.log(`Total Configured Pools: ${liquidationStatus.totalPools}`);
      this.log(`Auto-Discovered Pools: ${discoveredPools.length}`);
      
      if (discoveredPools.length > 0) {
        this.log(`Discovered Pool IDs: ${discoveredPools.slice(0, 5).join(', ')}${discoveredPools.length > 5 ? '...' : ''}`);
      }
    } else {
      this.log(`Liquidation Enabled: ${this.liquidationEnabled}`);
      this.log('Liquidation Processor: Not initialized');
    }
  }
}

// Main execution
async function main() {
  const solver = new BridgeSolver();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    solver.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    solver.stop();
    process.exit(0);
  });
  
  // Start the solver
  try {
    await solver.getStatus();
    await solver.start();
  } catch (error) {
    console.error('Failed to start bridge solver:', error);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}

export default BridgeSolver;

