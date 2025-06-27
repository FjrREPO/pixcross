import { ethers } from 'ethers';
import { pixcrossBridgeERC721ABI } from '../abis/pixcross-bridge-erc721.abi';
import { ChainConfig } from './chains';

export interface ContractTokenLocked {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  targetChainId: string;
  targetAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ContractTokenBurned {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  targetChainId: string;
  targetAddress: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ContractTokenMinted {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  sourceChainId: string;
  txHash: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ContractTokenUnlocked {
  id: string;
  token: string;
  tokenId: string;
  user: string;
  sourceChainId: string;
  txHash: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ContractBridgeData {
  tokenLockeds: ContractTokenLocked[];
  tokenBurneds: ContractTokenBurned[];
  tokenMinteds: ContractTokenMinted[];
  tokenUnlockeds: ContractTokenUnlocked[];
}

export class ContractEventReader {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private config: ChainConfig;
  private log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 1000; // 1 second between requests
  
  constructor(
    provider: ethers.JsonRpcProvider,
    config: ChainConfig,
    logger: (message: string, level?: 'info' | 'warn' | 'error') => void
  ) {
    this.provider = provider;
    this.config = config;
    this.log = logger;
    
    if (!config.bridgeAddress) {
      throw new Error(`No bridge address configured for chain ${config.name}`);
    }
    
    // Create contract instance for reading events
    this.contract = new ethers.Contract(
      config.bridgeAddress,
      pixcrossBridgeERC721ABI,
      provider
    );
  }
  
  async getBridgeEvents(fromBlock: number, toBlock?: number): Promise<ContractBridgeData> {
    try {
      // Rate limiting
      await this.ensureRateLimit();
      
      const currentBlock = await this.provider.getBlockNumber();
      const endBlock = toBlock || currentBlock;
      
      if (fromBlock > endBlock) {
        return {
          tokenLockeds: [],
          tokenBurneds: [],
          tokenMinteds: [],
          tokenUnlockeds: []
        };
      }
      
      // Limit block range to avoid overwhelming RPC endpoints
      const maxBlockRange = 100;
      if (endBlock - fromBlock > maxBlockRange) {
        const adjustedEndBlock = fromBlock + maxBlockRange;
        this.log(`Limiting block range from ${fromBlock}-${endBlock} to ${fromBlock}-${adjustedEndBlock} on ${this.config.name}`, 'warn');
        return this.getBridgeEvents(fromBlock, adjustedEndBlock);
      }
      
      this.log(`Fetching events from block ${fromBlock} to ${endBlock} on ${this.config.name}`);
      
      // Fetch all event types sequentially to avoid rate limits
      const lockedEvents = await this.getTokenLockedEvents(fromBlock, endBlock);
      await this.ensureRateLimit();
      
      const burnedEvents = await this.getTokenBurnedEvents(fromBlock, endBlock);
      await this.ensureRateLimit();
      
      const mintedEvents = await this.getTokenMintedEvents(fromBlock, endBlock);
      await this.ensureRateLimit();
      
      const unlockedEvents = await this.getTokenUnlockedEvents(fromBlock, endBlock);
      
      return {
        tokenLockeds: lockedEvents,
        tokenBurneds: burnedEvents,
        tokenMinteds: mintedEvents,
        tokenUnlockeds: unlockedEvents
      };
    } catch (error: any) {
      // Check if this is an RPC method not supported error
      if (error.message && (error.message.includes('eth_getLogs') || error.message.includes('Method not found'))) {
        this.log(`RPC endpoint for ${this.config.name} doesn't support event querying. Consider using a different RPC endpoint.`, 'warn');
        return {
          tokenLockeds: [],
          tokenBurneds: [],
          tokenMinteds: [],
          tokenUnlockeds: []
        };
      }
      
      this.log(`Error fetching events from ${this.config.name}: ${error}`, 'error');
      return {
        tokenLockeds: [],
        tokenBurneds: [],
        tokenMinteds: [],
        tokenUnlockeds: []
      };
    }
  }
  
  private async getTokenLockedEvents(fromBlock: number, toBlock: number): Promise<ContractTokenLocked[]> {
    try {
      const filter = this.contract.filters.TokenLocked();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
      
      const results: ContractTokenLocked[] = [];
      
      for (const event of events) {
        // Type guard to check if it's an EventLog
        if (!('args' in event) || !('logIndex' in event) || !event.args) continue;
        
        const block = await this.provider.getBlock(event.blockNumber);
        if (!block) continue;
        
        results.push({
          id: `${event.transactionHash}-${event.logIndex}`,
          token: event.args.token,
          tokenId: event.args.tokenId.toString(),
          user: event.args.user,
          targetChainId: event.args.targetChainId.toString(),
          targetAddress: event.args.targetAddress,
          blockNumber: event.blockNumber.toString(),
          blockTimestamp: block.timestamp.toString(),
          transactionHash: event.transactionHash
        });
      }
      
      return results;
    } catch (error) {
      this.log(`Error fetching TokenLocked events: ${error}`, 'error');
      return [];
    }
  }
  
  private async getTokenBurnedEvents(fromBlock: number, toBlock: number): Promise<ContractTokenBurned[]> {
    try {
      const filter = this.contract.filters.TokenBurned();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
      
      const results: ContractTokenBurned[] = [];
      
      for (const event of events) {
        // Type guard to check if it's an EventLog
        if (!('args' in event) || !('logIndex' in event) || !event.args) continue;
        
        const block = await this.provider.getBlock(event.blockNumber);
        if (!block) continue;
        
        results.push({
          id: `${event.transactionHash}-${event.logIndex}`,
          token: event.args.token,
          tokenId: event.args.tokenId.toString(),
          user: event.args.user,
          targetChainId: event.args.targetChainId.toString(),
          targetAddress: event.args.targetAddress,
          blockNumber: event.blockNumber.toString(),
          blockTimestamp: block.timestamp.toString(),
          transactionHash: event.transactionHash
        });
      }
      
      return results;
    } catch (error) {
      this.log(`Error fetching TokenBurned events: ${error}`, 'error');
      return [];
    }
  }
  
  private async getTokenMintedEvents(fromBlock: number, toBlock: number): Promise<ContractTokenMinted[]> {
    try {
      const filter = this.contract.filters.TokenMinted();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
      
      const results: ContractTokenMinted[] = [];
      
      for (const event of events) {
        // Type guard to check if it's an EventLog
        if (!('args' in event) || !('logIndex' in event) || !event.args) continue;
        
        const block = await this.provider.getBlock(event.blockNumber);
        if (!block) continue;
        
        results.push({
          id: `${event.transactionHash}-${event.logIndex}`,
          token: event.args.token,
          tokenId: event.args.tokenId.toString(),
          user: event.args.user,
          sourceChainId: event.args.sourceChainId.toString(),
          txHash: event.args.txHash,
          blockNumber: event.blockNumber.toString(),
          blockTimestamp: block.timestamp.toString(),
          transactionHash: event.transactionHash
        });
      }
      
      return results;
    } catch (error) {
      this.log(`Error fetching TokenMinted events: ${error}`, 'error');
      return [];
    }
  }
  
  private async getTokenUnlockedEvents(fromBlock: number, toBlock: number): Promise<ContractTokenUnlocked[]> {
    try {
      const filter = this.contract.filters.TokenUnlocked();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
      
      const results: ContractTokenUnlocked[] = [];
      
      for (const event of events) {
        // Type guard to check if it's an EventLog
        if (!('args' in event) || !('logIndex' in event) || !event.args) continue;
        
        const block = await this.provider.getBlock(event.blockNumber);
        if (!block) continue;
        
        results.push({
          id: `${event.transactionHash}-${event.logIndex}`,
          token: event.args.token,
          tokenId: event.args.tokenId.toString(),
          user: event.args.user,
          sourceChainId: event.args.sourceChainId.toString(),
          txHash: event.args.txHash,
          blockNumber: event.blockNumber.toString(),
          blockTimestamp: block.timestamp.toString(),
          transactionHash: event.transactionHash
        });
      }
      
      return results;
    } catch (error) {
      this.log(`Error fetching TokenUnlocked events: ${error}`, 'error');
      return [];
    }
  }
  
  private async ensureRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  async getLatestBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }
  
  async getBlockTimestamp(blockNumber: number): Promise<number> {
    const block = await this.provider.getBlock(blockNumber);
    return block ? block.timestamp : 0;
  }
}

