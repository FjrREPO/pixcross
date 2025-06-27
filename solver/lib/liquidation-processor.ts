import { ethers } from 'ethers';
import { pixcrossABI } from '../abis/pixcross.abi';
import { ChainConfig } from './chains';

export interface LiquidationConfig {
  poolId: string; // Pool ID to monitor
  maxTokensToCheck: number; // Maximum tokens to check per liquidation call
  checkInterval: number; // Interval between liquidation checks in milliseconds
  enabled: boolean; // Whether liquidation is enabled for this pool
}

export interface LiquidationResult {
  success: boolean;
  liquidatedCount: number;
  liquidatedTokenIds: number[];
  transactionHash: string;
  error?: string;
}

export class LiquidationProcessor {
  private providers: Map<number, ethers.JsonRpcProvider> = new Map();
  private contracts: Map<number, ethers.Contract> = new Map();
  private wallet!: ethers.Wallet;
  private config: LiquidationConfig[];
  private isRunning = false;
  private log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  private maxRetries: number;
  private chainConfigs: ChainConfig[];
  private allPoolIds: Set<string> = new Set(); // Cache for discovered pool IDs
  private lastPoolDiscovery: number = 0; // Timestamp of last pool discovery
  private poolDiscoveryInterval: number = 300000; // 5 minutes

  constructor(
    providers: Map<number, ethers.JsonRpcProvider>,
    wallet: ethers.Wallet,
    chainConfigs: ChainConfig[],
    config: LiquidationConfig[],
    maxRetries: number,
    logger: (message: string, level?: 'info' | 'warn' | 'error') => void
  ) {
    this.providers = providers;
    this.wallet = wallet;
    this.chainConfigs = chainConfigs;
    this.config = config;
    this.maxRetries = maxRetries;
    this.log = logger;
    
    this.initializeContracts();
  }

  private initializeContracts(): void {
    this.log('Initializing liquidation contracts...');
    
    for (const chainConfig of this.chainConfigs) {
      const provider = this.providers.get(chainConfig.chainId);
      if (!provider) {
        this.log(`No provider found for chain ${chainConfig.name}`, 'warn');
        continue;
      }

      // Get Pixcross main contract address from environment
      const contractAddress = this.getPixcrossContractAddress(chainConfig.chainId);
      if (!contractAddress) {
        this.log(`No Pixcross contract address configured for ${chainConfig.name}`, 'warn');
        continue;
      }

      // Initialize wallet for this provider
      const wallet = new ethers.Wallet(this.wallet.privateKey, provider);

      // Initialize contract
      const contract = new ethers.Contract(
        contractAddress,
        pixcrossABI,
        wallet
      );
      this.contracts.set(chainConfig.chainId, contract);

      this.log(`Initialized liquidation contract for ${chainConfig.name}`);
    }
  }

  private getPixcrossContractAddress(chainId: number): string | undefined {
    // Environment variable names for different chains
    const envVarMap: Record<number, string> = {
      11155111: 'ETH_SEPOLIA_PIXCROSS_ADDRESS',
      84532: 'BASE_SEPOLIA_PIXCROSS_ADDRESS',
      421614: 'ARB_SEPOLIA_PIXCROSS_ADDRESS',
      43113: 'AVAX_FUJI_PIXCROSS_ADDRESS',
    };

    const envVar = envVarMap[chainId];
    return envVar ? process.env[envVar] : undefined;
  }

  public start(): void {
    if (this.isRunning) {
      this.log('Liquidation processor is already running', 'warn');
      return;
    }

    this.isRunning = true;
    this.log('Starting liquidation processor...');
    
    // Discover pools automatically
    this.discoverPoolsAutomatically();
    
    // Start liquidation loops for each enabled pool
    for (const poolConfig of this.config) {
      if (poolConfig.enabled) {
        this.startLiquidationLoop(poolConfig);
      }
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.log('Stopping liquidation processor...');
  }

  private async startLiquidationLoop(poolConfig: LiquidationConfig): Promise<void> {
    this.log(`Starting liquidation loop for pool ${poolConfig.poolId}`);
    
    while (this.isRunning) {
      try {
        await this.processPoolLiquidations(poolConfig);
      } catch (error) {
        this.log(`Error in liquidation loop for pool ${poolConfig.poolId}: ${error}`, 'error');
      }
      
      // Wait for the check interval
      await new Promise(resolve => setTimeout(resolve, poolConfig.checkInterval));
    }
  }

  private async processPoolLiquidations(poolConfig: LiquidationConfig): Promise<void> {
    this.log(`Checking liquidations for pool ${poolConfig.poolId}...`);

    // Process liquidations on all chains that have the contract
    for (const [chainId, contract] of this.contracts) {
      try {
        const result = await this.executeLiquidation(
          contract,
          poolConfig.poolId,
          poolConfig.maxTokensToCheck,
          chainId
        );

        if (result.success && result.liquidatedCount > 0) {
          this.log(
            `✓ Liquidated ${result.liquidatedCount} tokens on chain ${chainId}. ` +
            `Token IDs: [${result.liquidatedTokenIds.join(', ')}]. Tx: ${result.transactionHash}`
          );
        }
      } catch (error) {
        this.log(`Error processing liquidations on chain ${chainId}: ${error}`, 'error');
      }
    }
  }

  private async executeLiquidation(
    contract: ethers.Contract,
    poolId: string,
    maxTokensToCheck: number,
    chainId: number
  ): Promise<LiquidationResult> {
    let startTokenId = 0; // Start from token ID 0, could be made configurable
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.log(`Attempting liquidation for pool ${poolId} (attempt ${attempt}/${this.maxRetries})`);
        
        // Convert poolId string to bytes32 if needed
        const poolIdBytes32 = this.stringToBytes32(poolId);
        
        // First check if pool exists and has liquidatable positions
        let poolExists = false;
        try {
          poolExists = await contract.isPoolExist(poolIdBytes32);
          if (!poolExists) {
            this.log(`Pool ${poolId} does not exist on chain ${chainId}`, 'warn');
            return {
              success: true,
              liquidatedCount: 0,
              liquidatedTokenIds: [],
              transactionHash: '',
            };
          }
        } catch (checkError) {
          this.log(`Error checking pool existence: ${checkError}`, 'warn');
          // Continue with liquidation attempt
        }
        
        // Estimate gas for the liquidation call
        let gasEstimate: bigint;
        try {
          gasEstimate = await contract.autoLiquidatePool.estimateGas(
            poolIdBytes32,
            startTokenId,
            maxTokensToCheck
          );
        } catch (gasError: any) {
          // Handle common gas estimation errors
          if (gasError.message.includes('custom error') || 
              gasError.message.includes('execution reverted') ||
              gasError.data?.startsWith('0x51aeee6c')) { // Custom error selector
            this.log(`No liquidations available for pool ${poolId} on chain ${chainId}`);
            return {
              success: true,
              liquidatedCount: 0,
              liquidatedTokenIds: [],
              transactionHash: '',
            };
          }
          throw gasError;
        }

        // Get current gas price with dynamic adjustment
        const provider = contract.runner?.provider as ethers.JsonRpcProvider;
        const feeData = await provider.getFeeData();
        let gasPrice = feeData.gasPrice;
        
        // Increase gas price by 10% per retry attempt to avoid "replacement fee too low"
        if (attempt > 1) {
          const multiplier = BigInt(100 + (attempt - 1) * 10); // 110%, 120%, 130% etc.
          gasPrice = (gasPrice || 0n) * multiplier / 100n;
        }

        // Add 50% buffer to gas estimate for complex liquidations
        const gasLimit = gasEstimate * 150n / 100n;

        // Prepare transaction options
        const txOptions: any = { gasLimit };
        
        // Add gas price/fee data
        if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
          // EIP-1559 transaction
          txOptions.maxFeePerGas = gasPrice;
          txOptions.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(100 + (attempt - 1) * 10) / 100n;
        } else {
          // Legacy transaction
          txOptions.gasPrice = gasPrice;
        }

        // Execute liquidation
        const tx = await contract.autoLiquidatePool(
          poolIdBytes32,
          startTokenId,
          maxTokensToCheck,
          txOptions
        );

        this.log(`Liquidation transaction submitted: ${tx.hash}`);
        
        // Wait for confirmation with timeout
        const receipt = await Promise.race([
          tx.wait(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction timeout')), 300000) // 5 minute timeout
          )
        ]) as ethers.ContractTransactionReceipt | null;
        
        if (receipt?.status === 1) {
          // Parse the liquidation results from the transaction receipt
          const result = await this.parseLiquidationResult(contract, receipt, tx.hash);
          return result;
        } else {
          throw new Error(`Transaction failed: ${tx.hash}`);
        }
      } catch (error: any) {
        // Handle specific error cases
        const errorMessage = error.message || error.toString();
        
        // Check for common "no liquidations" scenarios
        if (errorMessage.includes('No positions available for liquidation') ||
            errorMessage.includes('custom error') ||
            errorMessage.includes('0x51aeee6c')) {
          return {
            success: true,
            liquidatedCount: 0,
            liquidatedTokenIds: [],
            transactionHash: '',
          };
        }
        
        // Check for temporary/retryable errors
        const isRetryableError = errorMessage.includes('replacement fee too low') ||
                                errorMessage.includes('transaction underpriced') ||
                                errorMessage.includes('timeout') ||
                                errorMessage.includes('network error') ||
                                errorMessage.includes('NETWORK_ERROR');

        this.log(`Liquidation attempt ${attempt} failed: ${errorMessage}`, 'warn');
        
        if (attempt === this.maxRetries || !isRetryableError) {
          return {
            success: false,
            liquidatedCount: 0,
            liquidatedTokenIds: [],
            transactionHash: '',
            error: errorMessage,
          };
        }
        
        // Wait before retry with exponential backoff (longer for gas price issues)
        const baseDelay = errorMessage.includes('replacement fee too low') ? 5000 : 2000;
        await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
      }
    }

    return {
      success: false,
      liquidatedCount: 0,
      liquidatedTokenIds: [],
      transactionHash: '',
      error: 'Max retries exceeded',
    };
  }

  private async parseLiquidationResult(
    contract: ethers.Contract,
    receipt: ethers.ContractTransactionReceipt,
    txHash: string
  ): Promise<LiquidationResult> {
    try {
      // Look for BatchLiquidationExecuted events in the receipt
      const liquidationEvents = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog({
              topics: log.topics as string[],
              data: log.data
            });
          } catch {
            return null;
          }
        })
        .filter(event => event && event.name === 'BatchLiquidationExecuted');

      if (liquidationEvents.length > 0) {
        const event = liquidationEvents[0];
        if (event && event.args) {
          const liquidatedCount = Number(event.args.liquidatedCount);
          const liquidatedTokenIds = event.args.tokenIds.map((id: bigint) => Number(id));

          return {
            success: true,
            liquidatedCount,
            liquidatedTokenIds,
            transactionHash: txHash,
          };
        }
      }

      // If no liquidation events found, assume no liquidations occurred
      return {
        success: true,
        liquidatedCount: 0,
        liquidatedTokenIds: [],
        transactionHash: txHash,
      };
    } catch (error) {
      this.log(`Error parsing liquidation result: ${error}`, 'warn');
      return {
        success: true,
        liquidatedCount: 0,
        liquidatedTokenIds: [],
        transactionHash: txHash,
      };
    }
  }

  private stringToBytes32(str: string): string {
    // If the string is already a valid bytes32 (0x followed by 64 hex chars), return as is
    if (str.startsWith('0x') && str.length === 66) {
      return str;
    }
    
    // Otherwise, convert string to bytes32
    return ethers.id(str);
  }

  public updateConfig(newConfig: LiquidationConfig[]): void {
    this.config = newConfig;
    this.log('Liquidation configuration updated');
  }

  public getStatus(): { isRunning: boolean; enabledPools: number; totalPools: number } {
    const enabledPools = this.config.filter(pool => pool.enabled).length;
    return {
      isRunning: this.isRunning,
      enabledPools,
      totalPools: this.config.length,
    };
  }

  public async testLiquidation(poolId: string, chainId: number): Promise<LiquidationResult> {
    const contract = this.contracts.get(chainId);
    if (!contract) {
      throw new Error(`No contract available for chain ${chainId}`);
    }

    this.log(`Testing liquidation for pool ${poolId} on chain ${chainId}...`);
    
    return await this.executeLiquidation(contract, poolId, 50, chainId); // Test with max 50 tokens
  }

  /**
   * Automatically discovers pools using the listPool function and updates the configuration
   */
  private async discoverPoolsAutomatically(): Promise<void> {
    const now = Date.now();
    
    // Check if we need to refresh pool discovery
    if (now - this.lastPoolDiscovery < this.poolDiscoveryInterval) {
      return;
    }

    this.log('Discovering pools automatically...');
    this.lastPoolDiscovery = now;

    const discoveredPools = new Set<string>();

    // Query each chain for available pools
    for (const [chainId, contract] of this.contracts) {
      try {
        this.log(`Querying pools on chain ${chainId}...`);
        
        // Call the listPool function
        const poolIds: string[] = await contract.listPool();
        
        this.log(`Found ${poolIds.length} pools on chain ${chainId}`);
        
        // Add discovered pools to our set
        for (const poolId of poolIds) {
          discoveredPools.add(poolId);
          this.allPoolIds.add(poolId);
        }
        
      } catch (error) {
        this.log(`Error discovering pools on chain ${chainId}: ${error}`, 'warn');
      }
    }

    // Update configuration based on discovered pools
    await this.updateConfigurationFromDiscoveredPools(discoveredPools);
    
    this.log(`Pool discovery completed. Total discovered pools: ${this.allPoolIds.size}`);
  }

  /**
   * Updates the liquidation configuration based on discovered pools
   */
  private async updateConfigurationFromDiscoveredPools(discoveredPools: Set<string>): Promise<void> {
    const existingPoolIds = new Set(this.config.map(c => c.poolId));
    const newPools: string[] = [];

    // Find new pools that aren't in our current configuration
    for (const poolId of discoveredPools) {
      if (!existingPoolIds.has(poolId)) {
        newPools.push(poolId);
      }
    }

    if (newPools.length > 0) {
      this.log(`Adding ${newPools.length} new pools to liquidation configuration`);
      
      // Create configurations for new pools
      for (const poolId of newPools) {
        const newConfig: LiquidationConfig = {
          poolId,
          maxTokensToCheck: parseInt(process.env.LIQUIDATION_MAX_TOKENS || '100'),
          checkInterval: parseInt(process.env.LIQUIDATION_CHECK_INTERVAL || '60000'), // 1 minute default
          enabled: (process.env.AUTO_LIQUIDATION_ENABLED || 'true').toLowerCase() === 'true',
        };
        
        this.config.push(newConfig);
        this.log(`Added pool ${poolId} to liquidation configuration (enabled: ${newConfig.enabled})`);
      }

      // Start liquidation loops for newly added enabled pools
      for (const poolConfig of this.config) {
        if (newPools.includes(poolConfig.poolId) && poolConfig.enabled && this.isRunning) {
          this.startLiquidationLoop(poolConfig);
        }
      }
    }
  }

  /**
   * Gets all discovered pool IDs
   */
  public getAllDiscoveredPools(): string[] {
    return Array.from(this.allPoolIds);
  }

  /**
   * Forces a refresh of pool discovery
   */
  public async refreshPoolDiscovery(): Promise<void> {
    this.lastPoolDiscovery = 0; // Reset timestamp to force refresh
    await this.discoverPoolsAutomatically();
  }
}
