import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  TokenLocked as TokenLockedEvent,
  TokenBurned as TokenBurnedEvent,
  TokenMinted as TokenMintedEvent,
  TokenUnlocked as TokenUnlockedEvent,
  BridgeOperatorAdded as BridgeOperatorAddedEvent,
  BridgeOperatorRemoved as BridgeOperatorRemovedEvent,
  SupportedTokenAdded as SupportedTokenAddedEvent,
  SupportedTokenRemoved as SupportedTokenRemovedEvent,
  ChainSupportAdded as ChainSupportAddedEvent,
  ChainSupportRemoved as ChainSupportRemovedEvent,
} from "../generated/PixcrossBridgeERC721/PixcrossBridgeERC721"

import {
  TokenLocked,
  TokenBurned,
  TokenMinted,
  TokenUnlocked,
  BridgeOperatorAdded,
  BridgeOperatorRemoved,
  SupportedTokenAdded,
  SupportedTokenRemoved,
  ChainSupportAdded,
  ChainSupportRemoved,
  ERC721BridgeTransaction,
  ERC721BridgeRequest,
} from "../generated/schema"

import { NetworkConfig } from "./network-config"

export function handleTokenLocked(event: TokenLockedEvent): void {
  let entity = new TokenLocked(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.token = event.params.token
  entity.tokenId = event.params.tokenId
  entity.user = event.params.user
  entity.targetChainId = event.params.targetChainId
  entity.targetAddress = event.params.targetAddress
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Create comprehensive bridge request tracking
  createOrUpdateBridgeRequest(event, "LOCK_MINT", true)

  // Create legacy bridge transaction for backwards compatibility
  createLegacyBridgeTransaction(event, "INITIATED")
}

export function handleTokenBurned(event: TokenBurnedEvent): void {
  let entity = new TokenBurned(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.token = event.params.token
  entity.tokenId = event.params.tokenId
  entity.user = event.params.user
  entity.targetChainId = event.params.targetChainId
  entity.targetAddress = event.params.targetAddress
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Create comprehensive bridge request tracking
  createOrUpdateBridgeRequestForBurn(event, "BURN_MINT")

  // Create legacy bridge transaction for backwards compatibility
  createLegacyBridgeTransactionForBurn(event, "INITIATED")
}

export function handleTokenMinted(event: TokenMintedEvent): void {
  let entity = new TokenMinted(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.token = event.params.token
  entity.tokenId = event.params.tokenId
  entity.user = event.params.user
  entity.sourceChainId = event.params.sourceChainId
  entity.txHash = event.params.txHash
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Create comprehensive bridge request for inbound mint
  createBridgeRequestForMint(event)

  // Create legacy bridge transaction for backwards compatibility
  createLegacyBridgeTransactionForMint(event)
}

export function handleTokenUnlocked(event: TokenUnlockedEvent): void {
  let entity = new TokenUnlocked(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.token = event.params.token
  entity.tokenId = event.params.tokenId
  entity.user = event.params.user
  entity.sourceChainId = event.params.sourceChainId
  entity.txHash = event.params.txHash
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Create comprehensive bridge request for inbound unlock
  createBridgeRequestForUnlock(event)

  // Create legacy bridge transaction for backwards compatibility
  createLegacyBridgeTransactionForUnlock(event)
}

export function handleBridgeOperatorAdded(event: BridgeOperatorAddedEvent): void {
  let entity = new BridgeOperatorAdded(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.operator = event.params.operator
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// Helper function to determine current chain ID based on network
function getCurrentChainId(): BigInt {
  // Use the NetworkConfig class to get the chain ID
  // This allows for easier configuration management
  return NetworkConfig.getChainId()
}

// Create or update comprehensive bridge request for locked tokens
function createOrUpdateBridgeRequest(
  event: TokenLockedEvent,
  bridgeType: string,
  isLocked: boolean
): void {
  let requestId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()

  let bridgeRequest = ERC721BridgeRequest.load(requestId)
  if (bridgeRequest == null) {
    bridgeRequest = new ERC721BridgeRequest(requestId)
    bridgeRequest.createdAt = event.block.timestamp
  }

  // Core information
  bridgeRequest.token = event.params.token
  bridgeRequest.tokenId = event.params.tokenId
  bridgeRequest.user = event.params.user

  // Chain information
  bridgeRequest.sourceChainId = getCurrentChainId()
  bridgeRequest.destinationChainId = event.params.targetChainId
  bridgeRequest.currentChainId = getCurrentChainId()

  // Bridge configuration
  bridgeRequest.bridgeType = bridgeType
  bridgeRequest.direction = "OUTBOUND"
  bridgeRequest.targetAddress = event.params.targetAddress

  // Status tracking
  bridgeRequest.status = "INITIATED"

  // Timestamps
  bridgeRequest.initiatedAt = event.block.timestamp
  bridgeRequest.lastUpdatedAt = event.block.timestamp

  // Transaction information
  bridgeRequest.sourceTransactionHash = event.transaction.hash
  bridgeRequest.sourceBlockNumber = event.block.number

  // Generate cross-chain correlation hash
  bridgeRequest.crossChainTxHash = generateCrossChainHash(
    event.params.token,
    event.params.tokenId,
    event.params.user,
    getCurrentChainId(),
    event.params.targetChainId,
    event.block.timestamp
  )

  // Set bridge fee using NetworkConfig default
  bridgeRequest.bridgeFee = NetworkConfig.getBridgeFeeDefault()

  // Initialize retry count
  bridgeRequest.retryCount = BigInt.fromI32(0)

  // Set expiration using NetworkConfig
  bridgeRequest.expiresAt = event.block.timestamp.plus(NetworkConfig.getExpirationTime())

  bridgeRequest.save()

  // Note: Cross-chain transaction correlation can be added later
}

// Generate cross-chain correlation hash
function generateCrossChainHash(
  token: Bytes,
  tokenId: BigInt,
  user: Bytes,
  sourceChain: BigInt,
  destChain: BigInt,
  timestamp: BigInt
): Bytes {
  // Create a deterministic hash for cross-chain correlation
  let hashString = token.toHexString() +
    tokenId.toHexString().slice(2) +
    user.toHexString().slice(2) +
    sourceChain.toHexString().slice(2) +
    destChain.toHexString().slice(2)
  return Bytes.fromHexString(hashString)
}


// Create bridge request for burn events
function createOrUpdateBridgeRequestForBurn(
  event: TokenBurnedEvent,
  bridgeType: string
): void {
  let requestId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()

  let bridgeRequest = ERC721BridgeRequest.load(requestId)
  if (bridgeRequest == null) {
    bridgeRequest = new ERC721BridgeRequest(requestId)
    bridgeRequest.createdAt = event.block.timestamp
  }

  // Core information
  bridgeRequest.token = event.params.token
  bridgeRequest.tokenId = event.params.tokenId
  bridgeRequest.user = event.params.user

  // Chain information
  bridgeRequest.sourceChainId = getCurrentChainId()
  bridgeRequest.destinationChainId = event.params.targetChainId
  bridgeRequest.currentChainId = getCurrentChainId()

  // Bridge configuration
  bridgeRequest.bridgeType = bridgeType
  bridgeRequest.direction = "OUTBOUND"
  bridgeRequest.targetAddress = event.params.targetAddress

  // Status tracking
  bridgeRequest.status = "INITIATED"

  // Timestamps
  bridgeRequest.initiatedAt = event.block.timestamp
  bridgeRequest.lastUpdatedAt = event.block.timestamp

  // Transaction information
  bridgeRequest.sourceTransactionHash = event.transaction.hash
  bridgeRequest.sourceBlockNumber = event.block.number

  // Generate cross-chain correlation hash
  bridgeRequest.crossChainTxHash = generateCrossChainHash(
    event.params.token,
    event.params.tokenId,
    event.params.user,
    getCurrentChainId(),
    event.params.targetChainId,
    event.block.timestamp
  )

  // Set bridge fee using NetworkConfig
  bridgeRequest.bridgeFee = NetworkConfig.getBridgeFeeDefault()

  // Initialize retry count
  bridgeRequest.retryCount = BigInt.fromI32(0)

  // Set expiration using NetworkConfig
  bridgeRequest.expiresAt = event.block.timestamp.plus(NetworkConfig.getExpirationTime())

  bridgeRequest.save()

  // Note: Cross-chain transaction correlation can be added later
}

// Create legacy bridge transaction for locked tokens
function createLegacyBridgeTransaction(
  event: TokenLockedEvent,
  status: string
): void {
  let bridgeTransactionId = event.params.token.toHexString() + "-" +
    event.params.tokenId.toString() + "-" +
    event.params.user.toHexString() + "-" +
    event.params.targetChainId.toString()

  let bridgeTransaction = ERC721BridgeTransaction.load(bridgeTransactionId)
  if (bridgeTransaction == null) {
    bridgeTransaction = new ERC721BridgeTransaction(bridgeTransactionId)
    bridgeTransaction.createdAt = event.block.timestamp
  }

  bridgeTransaction.token = event.params.token
  bridgeTransaction.tokenId = event.params.tokenId
  bridgeTransaction.user = event.params.user
  bridgeTransaction.targetChainId = event.params.targetChainId
  bridgeTransaction.targetAddress = event.params.targetAddress
  bridgeTransaction.status = status
  bridgeTransaction.lockedAt = event.block.timestamp
  bridgeTransaction.updatedAt = event.block.timestamp
  bridgeTransaction.blockNumber = event.block.number
  bridgeTransaction.transactionHash = event.transaction.hash

  bridgeTransaction.save()
}

// Create legacy bridge transaction for burned tokens
function createLegacyBridgeTransactionForBurn(
  event: TokenBurnedEvent,
  status: string
): void {
  let bridgeTransactionId = event.params.token.toHexString() + "-" +
    event.params.tokenId.toString() + "-" +
    event.params.user.toHexString() + "-" +
    event.params.targetChainId.toString()

  let bridgeTransaction = ERC721BridgeTransaction.load(bridgeTransactionId)
  if (bridgeTransaction == null) {
    bridgeTransaction = new ERC721BridgeTransaction(bridgeTransactionId)
    bridgeTransaction.createdAt = event.block.timestamp
  }

  bridgeTransaction.token = event.params.token
  bridgeTransaction.tokenId = event.params.tokenId
  bridgeTransaction.user = event.params.user
  bridgeTransaction.targetChainId = event.params.targetChainId
  bridgeTransaction.targetAddress = event.params.targetAddress
  bridgeTransaction.status = status
  bridgeTransaction.burnedAt = event.block.timestamp
  bridgeTransaction.updatedAt = event.block.timestamp
  bridgeTransaction.blockNumber = event.block.number
  bridgeTransaction.transactionHash = event.transaction.hash
  bridgeTransaction.save()
}

// Create bridge request for inbound mint events
function createBridgeRequestForMint(event: TokenMintedEvent): void {
  let requestId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()

  let bridgeRequest = ERC721BridgeRequest.load(requestId)
  if (bridgeRequest == null) {
    bridgeRequest = new ERC721BridgeRequest(requestId)
    bridgeRequest.createdAt = event.block.timestamp
  }

  // Core information
  bridgeRequest.token = event.params.token
  bridgeRequest.tokenId = event.params.tokenId
  bridgeRequest.user = event.params.user

  // Chain information
  bridgeRequest.sourceChainId = event.params.sourceChainId
  bridgeRequest.destinationChainId = getCurrentChainId()
  bridgeRequest.currentChainId = getCurrentChainId()

  // Bridge configuration
  bridgeRequest.bridgeType = "LOCK_MINT" // Assuming lock/mint for now
  bridgeRequest.direction = "INBOUND"
  bridgeRequest.targetAddress = event.params.user // User receiving the minted token

  // Status tracking
  bridgeRequest.status = "COMPLETED"

  // Timestamps
  bridgeRequest.processedAt = event.block.timestamp
  bridgeRequest.completedAt = event.block.timestamp
  bridgeRequest.lastUpdatedAt = event.block.timestamp

  // Transaction information
  bridgeRequest.destinationTransactionHash = event.transaction.hash
  bridgeRequest.destinationBlockNumber = event.block.number
  bridgeRequest.crossChainTxHash = event.params.txHash

  // Set bridge fee
  bridgeRequest.bridgeFee = BigInt.fromI32(0)

  // Initialize retry count
  bridgeRequest.retryCount = BigInt.fromI32(0)

  bridgeRequest.save()

  // Note: Cross-chain transaction correlation can be added later
}

// Create legacy bridge transaction for minted tokens
function createLegacyBridgeTransactionForMint(event: TokenMintedEvent): void {
  let bridgeTransactionId = event.params.txHash.toHexString()

  let bridgeTransaction = ERC721BridgeTransaction.load(bridgeTransactionId)
  if (bridgeTransaction == null) {
    bridgeTransaction = new ERC721BridgeTransaction(bridgeTransactionId)
    bridgeTransaction.token = event.params.token
    bridgeTransaction.tokenId = event.params.tokenId
    bridgeTransaction.user = event.params.user
    bridgeTransaction.sourceChainId = event.params.sourceChainId
    bridgeTransaction.status = "COMPLETED"
    bridgeTransaction.createdAt = event.block.timestamp
  } else {
    bridgeTransaction.status = "COMPLETED"
  }

  bridgeTransaction.txHash = event.params.txHash
  bridgeTransaction.mintedAt = event.block.timestamp
  bridgeTransaction.updatedAt = event.block.timestamp
  bridgeTransaction.blockNumber = event.block.number
  bridgeTransaction.transactionHash = event.transaction.hash

  bridgeTransaction.save()
}


export function handleBridgeOperatorRemoved(event: BridgeOperatorRemovedEvent): void {
  let entity = new BridgeOperatorRemoved(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.operator = event.params.operator
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSupportedTokenAdded(event: SupportedTokenAddedEvent): void {
  let entity = new SupportedTokenAdded(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.token = event.params.token
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSupportedTokenRemoved(event: SupportedTokenRemovedEvent): void {
  let entity = new SupportedTokenRemoved(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.token = event.params.token
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChainSupportAdded(event: ChainSupportAddedEvent): void {
  let entity = new ChainSupportAdded(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.chainId = event.params.chainId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleChainSupportRemoved(event: ChainSupportRemovedEvent): void {
  let entity = new ChainSupportRemoved(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )

  entity.chainId = event.params.chainId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// Create bridge request for inbound unlock events
function createBridgeRequestForUnlock(event: TokenUnlockedEvent): void {
  let requestId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()

  let bridgeRequest = ERC721BridgeRequest.load(requestId)
  if (bridgeRequest == null) {
    bridgeRequest = new ERC721BridgeRequest(requestId)
    bridgeRequest.createdAt = event.block.timestamp
  }

  // Core information
  bridgeRequest.token = event.params.token
  bridgeRequest.tokenId = event.params.tokenId
  bridgeRequest.user = event.params.user

  // Chain information
  bridgeRequest.sourceChainId = event.params.sourceChainId
  bridgeRequest.destinationChainId = getCurrentChainId()
  bridgeRequest.currentChainId = getCurrentChainId()

  // Bridge configuration
  bridgeRequest.bridgeType = "BURN_UNLOCK" // Assuming burn/unlock for now
  bridgeRequest.direction = "INBOUND"
  bridgeRequest.targetAddress = event.params.user // User receiving the unlocked token

  // Status tracking
  bridgeRequest.status = "COMPLETED"

  // Timestamps
  bridgeRequest.processedAt = event.block.timestamp
  bridgeRequest.completedAt = event.block.timestamp
  bridgeRequest.lastUpdatedAt = event.block.timestamp

  // Transaction information
  bridgeRequest.destinationTransactionHash = event.transaction.hash
  bridgeRequest.destinationBlockNumber = event.block.number
  bridgeRequest.crossChainTxHash = event.params.txHash

  // Set bridge fee
  bridgeRequest.bridgeFee = BigInt.fromI32(0)

  // Initialize retry count
  bridgeRequest.retryCount = BigInt.fromI32(0)

  bridgeRequest.save()

  // Note: Cross-chain transaction correlation can be added later
}

// Create legacy bridge transaction for unlocked tokens
function createLegacyBridgeTransactionForUnlock(event: TokenUnlockedEvent): void {
  let bridgeTransactionId = event.params.txHash.toHexString()

  let bridgeTransaction = ERC721BridgeTransaction.load(bridgeTransactionId)
  if (bridgeTransaction == null) {
    bridgeTransaction = new ERC721BridgeTransaction(bridgeTransactionId)
    bridgeTransaction.token = event.params.token
    bridgeTransaction.tokenId = event.params.tokenId
    bridgeTransaction.user = event.params.user
    bridgeTransaction.sourceChainId = event.params.sourceChainId
    bridgeTransaction.status = "COMPLETED"
    bridgeTransaction.createdAt = event.block.timestamp
  } else {
    bridgeTransaction.status = "COMPLETED"
  }

  bridgeTransaction.txHash = event.params.txHash
  bridgeTransaction.unlockedAt = event.block.timestamp
  bridgeTransaction.updatedAt = event.block.timestamp
  bridgeTransaction.blockNumber = event.block.number
  bridgeTransaction.transactionHash = event.transaction.hash

  bridgeTransaction.save()
}

