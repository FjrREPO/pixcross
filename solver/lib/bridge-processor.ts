import { ethers } from 'ethers';
import { TokenLocked, TokenBurned } from '../graphql/query-bridge-request';
import { ContractTokenLocked, ContractTokenBurned } from './contract-events';
import { ChainConfig, getChainConfig } from './chains';
import { mapTokenAddress, getTokenCollectionName } from './token-mapping';

export class BridgeProcessor {
  private contracts: Map<number, ethers.Contract>;
  private processedEvents: Set<string>;
  private maxRetries: number;
  private log: (message: string, level?: 'info' | 'warn' | 'error') => void;

  constructor(
    contracts: Map<number, ethers.Contract>,
    processedEvents: Set<string>,
    maxRetries: number,
    logger: (message: string, level?: 'info' | 'warn' | 'error') => void
  ) {
    this.contracts = contracts;
    this.processedEvents = processedEvents;
    this.maxRetries = maxRetries;
    this.log = logger;
  }

  async processLockedToken(sourceConfig: ChainConfig, lockedToken: TokenLocked): Promise<void> {
    const eventId = `locked_${lockedToken.id}`;
    
    if (this.processedEvents.has(eventId)) {
      return; // Already processed
    }

    const targetChainId = parseInt(lockedToken.targetChainId);
    const targetConfig = getChainConfig(targetChainId);
    
    if (!targetConfig) {
      this.log(`Unsupported target chain: ${targetChainId}`, 'warn');
      return;
    }

    const targetContract = this.contracts.get(targetChainId);
    if (!targetContract) {
      this.log(`No contract available for target chain: ${targetConfig.name}`, 'warn');
      return;
    }

    this.log(`Processing locked token: ${lockedToken.tokenId} from ${sourceConfig.name} to ${targetConfig.name}`);

    try {
      // Check if transaction was already processed
      const txHash = lockedToken.transactionHash;
      const isProcessed = await targetContract.isTransactionProcessed(txHash);
      
      if (isProcessed) {
        this.log(`Transaction ${txHash} already processed on ${targetConfig.name}`);
        this.processedEvents.add(eventId);
        return;
      }

      // Mint token on target chain
      await this.mintTokenOnTargetChain(
        targetContract,
        lockedToken.token,
        lockedToken.tokenId,
        lockedToken.targetAddress,
        sourceConfig.chainId,
        txHash
      );

      this.processedEvents.add(eventId);
      this.log(`Successfully processed locked token ${lockedToken.tokenId}`);
    } catch (error) {
      this.log(`Error processing locked token ${lockedToken.tokenId}: ${error}`, 'error');
    }
  }

  async processContractLockedToken(sourceConfig: ChainConfig, lockedToken: ContractTokenLocked): Promise<void> {
    const eventId = `contract_locked_${lockedToken.id}`;
    
    if (this.processedEvents.has(eventId)) {
      return; // Already processed
    }

    const targetChainId = parseInt(lockedToken.targetChainId);
    const targetConfig = getChainConfig(targetChainId);
    
    if (!targetConfig) {
      this.log(`Unsupported target chain: ${targetChainId}`, 'warn');
      return;
    }

    const targetContract = this.contracts.get(targetChainId);
    if (!targetContract) {
      this.log(`No contract available for target chain: ${targetConfig.name}`, 'warn');
      return;
    }

    this.log(`Processing contract locked token: ${lockedToken.tokenId} from ${sourceConfig.name} to ${targetConfig.name}`);

    try {
      // Check if transaction was already processed
      const txHash = lockedToken.transactionHash;
      const isProcessed = await targetContract.isTransactionProcessed(txHash);
      
      if (isProcessed) {
        this.log(`Transaction ${txHash} already processed on ${targetConfig.name}`);
        this.processedEvents.add(eventId);
        return;
      }

      // Mint token on target chain
      await this.mintTokenOnTargetChain(
        targetContract,
        lockedToken.token,
        lockedToken.tokenId,
        lockedToken.targetAddress,
        sourceConfig.chainId,
        txHash
      );

      this.processedEvents.add(eventId);
      this.log(`Successfully processed contract locked token ${lockedToken.tokenId}`);
    } catch (error) {
      this.log(`Error processing contract locked token ${lockedToken.tokenId}: ${error}`, 'error');
    }
  }

  async processContractBurnedToken(sourceConfig: ChainConfig, burnedToken: ContractTokenBurned): Promise<void> {
    const eventId = `contract_burned_${burnedToken.id}`;
    
    if (this.processedEvents.has(eventId)) {
      return; // Already processed
    }

    const targetChainId = parseInt(burnedToken.targetChainId);
    const targetConfig = getChainConfig(targetChainId);
    
    if (!targetConfig) {
      this.log(`Unsupported target chain: ${targetChainId}`, 'warn');
      return;
    }

    const targetContract = this.contracts.get(targetChainId);
    if (!targetContract) {
      this.log(`No contract available for target chain: ${targetConfig.name}`, 'warn');
      return;
    }

    this.log(`Processing contract burned token: ${burnedToken.tokenId} from ${sourceConfig.name} to ${targetConfig.name}`);

    try {
      // Check if transaction was already processed
      const txHash = burnedToken.transactionHash;
      const isProcessed = await targetContract.isTransactionProcessed(txHash);
      
      if (isProcessed) {
        this.log(`Transaction ${txHash} already processed on ${targetConfig.name}`);
        this.processedEvents.add(eventId);
        return;
      }

      // Mint token on target chain
      await this.mintTokenOnTargetChain(
        targetContract,
        burnedToken.token,
        burnedToken.tokenId,
        burnedToken.targetAddress,
        sourceConfig.chainId,
        txHash
      );

      this.processedEvents.add(eventId);
      this.log(`Successfully processed contract burned token ${burnedToken.tokenId}`);
    } catch (error) {
      this.log(`Error processing contract burned token ${burnedToken.tokenId}: ${error}`, 'error');
    }
  }

  async processBurnedToken(sourceConfig: ChainConfig, burnedToken: TokenBurned): Promise<void> {
    const eventId = `burned_${burnedToken.id}`;
    
    if (this.processedEvents.has(eventId)) {
      return; // Already processed
    }

    const targetChainId = parseInt(burnedToken.targetChainId);
    const targetConfig = getChainConfig(targetChainId);
    
    if (!targetConfig) {
      this.log(`Unsupported target chain: ${targetChainId}`, 'warn');
      return;
    }

    const targetContract = this.contracts.get(targetChainId);
    if (!targetContract) {
      this.log(`No contract available for target chain: ${targetConfig.name}`, 'warn');
      return;
    }

    this.log(`Processing burned token: ${burnedToken.tokenId} from ${sourceConfig.name} to ${targetConfig.name}`);

    try {
      // Check if transaction was already processed
      const txHash = burnedToken.transactionHash;
      const isProcessed = await targetContract.isTransactionProcessed(txHash);
      
      if (isProcessed) {
        this.log(`Transaction ${txHash} already processed on ${targetConfig.name}`);
        this.processedEvents.add(eventId);
        return;
      }

      // Mint token on target chain
      await this.mintTokenOnTargetChain(
        targetContract,
        burnedToken.token,
        burnedToken.tokenId,
        burnedToken.targetAddress,
        sourceConfig.chainId,
        txHash
      );

      this.processedEvents.add(eventId);
      this.log(`Successfully processed burned token ${burnedToken.tokenId}`);
    } catch (error) {
      this.log(`Error processing burned token ${burnedToken.tokenId}: ${error}`, 'error');
    }
  }

  private async mintTokenOnTargetChain(
    targetContract: ethers.Contract,
    sourceTokenAddress: string,
    tokenId: string,
    userAddress: string,
    sourceChainId: number,
    txHash: string
  ): Promise<void> {
    // Get the target chain ID from the contract's target
    const targetChainId = Number(await targetContract.currentChainId());
    
    // Map source token address to target chain token address
    const targetTokenAddress = mapTokenAddress(sourceChainId, targetChainId, sourceTokenAddress);
    
    if (!targetTokenAddress) {
      throw new Error(`No token mapping found for ${sourceTokenAddress} from chain ${sourceChainId} to chain ${targetChainId}`);
    }
    
    this.log(`Token mapping: ${sourceTokenAddress} (chain ${sourceChainId}) → ${targetTokenAddress} (chain ${targetChainId})`);
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.log(`Attempting to mint token ${tokenId} (attempt ${attempt}/${this.maxRetries})`);
        
        // Estimate gas
        const gasEstimate = await targetContract.mintToken.estimateGas(
          targetTokenAddress,
          tokenId,
          userAddress,
          sourceChainId,
          txHash
        );

        // Add 20% buffer to gas estimate
        const gasLimit = gasEstimate * 120n / 100n;

        // Execute mint transaction
        const tx = await targetContract.mintToken(
          targetTokenAddress,
          tokenId,
          userAddress,
          sourceChainId,
          txHash,
          { gasLimit }
        );

        this.log(`Mint transaction submitted: ${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        if (receipt?.status === 1) {
          this.log(`✓ Token ${tokenId} minted successfully. Tx: ${tx.hash}`);
          return;
        } else {
          throw new Error(`Transaction failed: ${tx.hash}`);
        }
      } catch (error: any) {
        this.log(`Attempt ${attempt} failed: ${error.message}`, 'warn');
        
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
}

