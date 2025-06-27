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
  private poolsByChain: Map<number, Set<string>> = new Map(); // Chain-specific pool IDs
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
    
// Properly configure and start chain-specific liquidation loops for each enabled pool
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
    
    // DEBUG: Log current state of poolsByChain
    this.log(`DEBUG: Total chains in poolsByChain: ${this.poolsByChain.size}`);
    for (const [chainId, pools] of this.poolsByChain) {
      this.log(`DEBUG: Chain ${chainId} has pools: [${Array.from(pools).slice(0, 3).join(', ')}${pools.size > 3 ? '...' : ''}] (${pools.size} total)`);
    }

    // Only process on chains that actually have this pool
    for (const [chainId, contract] of this.contracts) {
      try {
        // Check if this pool exists on this specific chain
        const chainPools = this.poolsByChain.get(chainId);
        this.log(`DEBUG: Chain ${chainId} - chainPools exists: ${!!chainPools}, has pool ${poolConfig.poolId}: ${chainPools?.has(poolConfig.poolId)}`);
        
        if (!chainPools || !chainPools.has(poolConfig.poolId)) {
          // Skip this chain if the pool doesn't exist on it
          this.log(`DEBUG: Skipping chain ${chainId} for pool ${poolConfig.poolId} - not found in chain-specific pools`);
          continue;
        }
        
        this.log(`DEBUG: Processing pool ${poolConfig.poolId} on chain ${chainId}`);

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
        
        // First check if pool exists
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
        
        // Check for liquidatable collateral
        let liquidatableTokenIds: bigint[] = [];
        let useNewBatchMethod = true;
        
        try {
          this.log(`Checking liquidatable collateral for pool ${poolId}...`);
          const checkResult = await contract.checkLiquidatableCollateral(
            poolIdBytes32,
            startTokenId,
            startTokenId + maxTokensToCheck
          );
          
          liquidatableTokenIds = checkResult.liquidatableTokenIds || [];
          this.log(`Found ${liquidatableTokenIds.length} liquidatable tokens`);
          
          // If no liquidatable tokens found, return early - DON'T use fallback
          if (liquidatableTokenIds.length === 0) {
            this.log(`No liquidatable tokens found for pool ${poolId} on chain ${chainId}`);
            return {
              success: true,
              liquidatedCount: 0,
              liquidatedTokenIds: [],
              transactionHash: '',
            };
          }
        } catch (checkError: any) {
          // Only fall back to autoLiquidatePool if the function doesn't exist or has serious errors
          const errorMessage = checkError.message || checkError.toString();
          
          this.log(`DEBUG: checkLiquidatableCollateral error - Code: ${checkError.code}, Message: ${errorMessage}`, 'warn');
          
          if (errorMessage.includes('function does not exist') ||
              errorMessage.includes('not implemented') ||
              errorMessage.includes('unknown function') ||
              errorMessage.includes('contract function doesn\'t exist') ||
              checkError.code === 'CALL_EXCEPTION') {
            this.log(`checkLiquidatableCollateral not available, using fallback autoLiquidatePool`, 'warn');
            useNewBatchMethod = false;
          } else {
            // For other errors, log and return early instead of using fallback
            this.log(`Non-function-availability error in checkLiquidatableCollateral: ${errorMessage}`, 'warn');
            return {
              success: false,
              liquidatedCount: 0,
              liquidatedTokenIds: [],
              transactionHash: '',
            };
          }
        }
        
        // If we need to use the fallback method
        if (!useNewBatchMethod) {
          return await this.executeFallbackLiquidation(contract, poolIdBytes32, startTokenId, maxTokensToCheck, attempt, chainId, poolId);
        }
        
        // At this point, we have liquidatable tokens and should use the new batch method
        // Convert bigint array to number array for logging
        const tokenIds = liquidatableTokenIds.map(id => Number(id));
        this.log(`Proceeding with batch liquidation for ${tokenIds.length} tokens: [${tokenIds.join(', ')}]`);
        
        // Estimate gas for the batch liquidation call
        let gasEstimate: bigint;
        try {
          gasEstimate = await contract.batchLiquidateAndStartAuctions.estimateGas(
            poolIdBytes32,
            liquidatableTokenIds
          );
        } catch (gasError: any) {
          this.log(`Gas estimation failed for batch liquidation: ${gasError.message}`, 'warn');
          // If batchLiquidateAndStartAuctions is not available, fall back to autoLiquidatePool
          if (gasError.message.includes('function does not exist') ||
              gasError.message.includes('not implemented') ||
              gasError.message.includes('unknown function') ||
              gasError.code === 'CALL_EXCEPTION') {
            this.log(`batchLiquidateAndStartAuctions not available, using fallback autoLiquidatePool`, 'warn');
            return await this.executeFallbackLiquidation(contract, poolIdBytes32, startTokenId, maxTokensToCheck, attempt, chainId, poolId);
          }
          throw gasError; // Re-throw other gas estimation errors
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

        // Execute batch liquidation with discovered token IDs
        const tx = await contract.batchLiquidateAndStartAuctions(
          poolIdBytes32,
          liquidatableTokenIds,
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

    let totalDiscoveredPools = 0;

    // Query each chain for available pools
    for (const [chainId, contract] of this.contracts) {
      try {
        this.log(`Querying pools on chain ${chainId}...`);
        
        // Call the listPool function
        const poolIds: string[] = await contract.listPool();
        
        this.log(`Found ${poolIds.length} pools on chain ${chainId}`);
        
        // Store pools per chain
        if (!this.poolsByChain.has(chainId)) {
          this.poolsByChain.set(chainId, new Set());
        }
        
        const chainPools = this.poolsByChain.get(chainId)!;
        for (const poolId of poolIds) {
          chainPools.add(poolId);
        }
        
        totalDiscoveredPools += poolIds.length;
        
        // Update configuration for this chain's pools
        await this.updateConfigurationFromChainPools(chainId, poolIds);
        
      } catch (error) {
        this.log(`Error discovering pools on chain ${chainId}: ${error}`, 'warn');
      }
    }
    
    this.log(`Pool discovery completed. Total discovered pools: ${totalDiscoveredPools}`);
  }

  /**
   * Updates the liquidation configuration based on discovered pools from a specific chain
   */
  private async updateConfigurationFromChainPools(chainId: number, poolIds: string[]): Promise<void> {
    const existingPoolIds = new Set(this.config.map(c => c.poolId));
    const newPools: string[] = [];

    // Find new pools that aren't in our current configuration
    for (const poolId of poolIds) {
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
   * Gets all discovered pool IDs across all chains
   */
  public getAllDiscoveredPools(): string[] {
    const allPools = new Set<string>();
    for (const chainPools of this.poolsByChain.values()) {
      for (const poolId of chainPools) {
        allPools.add(poolId);
      }
    }
    return Array.from(allPools);
  }

  /**
   * Forces a refresh of pool discovery
   */
  public async refreshPoolDiscovery(): Promise<void> {
    this.lastPoolDiscovery = 0; // Reset timestamp to force refresh
    await this.discoverPoolsAutomatically();
  }

  /**
   * Fallback liquidation method using the original autoLiquidatePool function
   */
  private async executeFallbackLiquidation(
    contract: ethers.Contract,
    poolIdBytes32: string,
    startTokenId: number,
    maxTokensToCheck: number,
    attempt: number,
    chainId: number,
    poolId: string
  ): Promise<LiquidationResult> {
    try {
      this.log(`Using fallback autoLiquidatePool for pool ${poolId} on chain ${chainId}`);
      
      // Estimate gas for the autoLiquidatePool call
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
      
      // Increase gas price by 10% per retry attempt
      if (attempt > 1) {
        const multiplier = BigInt(100 + (attempt - 1) * 10);
        gasPrice = (gasPrice || 0n) * multiplier / 100n;
      }

      // Add 50% buffer to gas estimate
      const gasLimit = gasEstimate * 150n / 100n;

      // Prepare transaction options
      const txOptions: any = { gasLimit };
      
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        txOptions.maxFeePerGas = gasPrice;
        txOptions.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * BigInt(100 + (attempt - 1) * 10) / 100n;
      } else {
        txOptions.gasPrice = gasPrice;
      }

      // Execute fallback liquidation
      const tx = await contract.autoLiquidatePool(
        poolIdBytes32,
        startTokenId,
        maxTokensToCheck,
        txOptions
      );

      this.log(`Fallback liquidation transaction submitted: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), 300000)
        )
      ]) as ethers.ContractTransactionReceipt | null;
      
      if (receipt?.status === 1) {
        // Parse the liquidation results from the transaction receipt
        const result = await this.parseFallbackLiquidationResult(contract, receipt, tx.hash);
        return result;
      } else {
        throw new Error(`Transaction failed: ${tx.hash}`);
      }
    } catch (error: any) {
      this.log(`Fallback liquidation failed: ${error.message}`, 'warn');
      throw error;
    }
  }

  /**
   * Parse liquidation results from autoLiquidatePool transaction
   */
  private async parseFallbackLiquidationResult(
    contract: ethers.Contract,
    receipt: ethers.ContractTransactionReceipt,
    txHash: string
  ): Promise<LiquidationResult> {
    try {
      // Look for AuctionStarted events in the receipt (autoLiquidatePool starts auctions)
      const auctionEvents = receipt.logs
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
        .filter(event => event && event.name === 'AuctionStarted');

      if (auctionEvents.length > 0) {
        const liquidatedTokenIds = auctionEvents.map(event => {
          if (event && event.args) {
            return Number(event.args.tokenId);
          }
          return 0;
        }).filter(id => id > 0);

        return {
          success: true,
          liquidatedCount: liquidatedTokenIds.length,
          liquidatedTokenIds,
          transactionHash: txHash,
        };
      }

      return {
        success: true,
        liquidatedCount: 0,
        liquidatedTokenIds: [],
        transactionHash: txHash,
      };
    } catch (error) {
      this.log(`Error parsing fallback liquidation result: ${error}`, 'warn');
      return {
        success: true,
        liquidatedCount: 0,
        liquidatedTokenIds: [],
        transactionHash: txHash,
      };
    }
  }
}
