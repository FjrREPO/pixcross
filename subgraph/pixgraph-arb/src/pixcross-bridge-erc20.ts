import { BigInt } from "@graphprotocol/graph-ts"
import {
  BridgeFeeUpdated as BridgeFeeUpdatedEvent,
  BridgePaused as BridgePausedEvent,
  BridgeUnpaused as BridgeUnpausedEvent,
  FeeCollectorUpdated as FeeCollectorUpdatedEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TokensBridged as TokensBridgedEvent,
  TokensReceived as TokensReceivedEvent,
  TransferLimitsUpdated as TransferLimitsUpdatedEvent,
} from "../generated/PixcrossBridgeERC20/PixcrossBridgeERC20"

import {
  BridgeFeeUpdated,
  BridgePaused,
  BridgeUnpaused,
  FeeCollectorUpdated,
  OwnershipTransferRequested,
  OwnershipTransferred,
  TokensBridged,
  TokensReceived,
  TransferLimitsUpdated,
  BridgeTransaction,
} from "../generated/schema"

export function handleBridgeFeeUpdated(event: BridgeFeeUpdatedEvent): void {
  let entity = new BridgeFeeUpdated(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.oldFee = event.params.oldFee
  entity.newFee = event.params.newFee
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}

export function handleBridgePaused(event: BridgePausedEvent): void {
  let entity = new BridgePaused(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}

export function handleBridgeUnpaused(event: BridgeUnpausedEvent): void {
  let entity = new BridgeUnpaused(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}

export function handleFeeCollectorUpdated(event: FeeCollectorUpdatedEvent): void {
  let entity = new FeeCollectorUpdated(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.oldCollector = event.params.oldCollector
  entity.newCollector = event.params.newCollector
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}

export function handleOwnershipTransferRequested(event: OwnershipTransferRequestedEvent): void {
  let entity = new OwnershipTransferRequested(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.from = event.params.from
  entity.to = event.params.to
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.from = event.params.from
  entity.to = event.params.to
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}

export function handleTokensBridged(event: TokensBridgedEvent): void {
  let entity = new TokensBridged(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.messageId = event.params.messageId
  entity.destinationChainSelector = event.params.destinationChainSelector
  entity.receiver = event.params.receiver
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.fee = event.params.fee
  entity.sender = event.params.sender
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
  
  // Create or update bridge transaction
  let bridgeTransaction = BridgeTransaction.load(event.params.messageId.toHexString())
  if (bridgeTransaction == null) {
    bridgeTransaction = new BridgeTransaction(event.params.messageId.toHexString())
    bridgeTransaction.createdAt = event.block.timestamp
  }
  
  bridgeTransaction.messageId = event.params.messageId
  bridgeTransaction.status = "PENDING"
  bridgeTransaction.destinationChain = event.params.destinationChainSelector
  bridgeTransaction.token = event.params.token
  bridgeTransaction.amount = event.params.amount
  bridgeTransaction.fee = event.params.fee
  bridgeTransaction.sender = event.params.sender
  bridgeTransaction.receiver = event.params.receiver
  bridgeTransaction.bridgedAt = event.block.timestamp
  bridgeTransaction.updatedAt = event.block.timestamp
  bridgeTransaction.blockNumber = event.block.number
  bridgeTransaction.transactionHash = event.transaction.hash
  
  bridgeTransaction.save()
}

export function handleTokensReceived(event: TokensReceivedEvent): void {
  let entity = new TokensReceived(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.messageId = event.params.messageId
  entity.sourceChainSelector = event.params.sourceChainSelector
  entity.sender = event.params.sender
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.receiver = event.params.receiver
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
  
  // Update bridge transaction status to completed
  let bridgeTransaction = BridgeTransaction.load(event.params.messageId.toHexString())
  if (bridgeTransaction == null) {
    // If no existing bridge transaction, create new one (receiving from another chain)
    bridgeTransaction = new BridgeTransaction(event.params.messageId.toHexString())
    bridgeTransaction.messageId = event.params.messageId
    bridgeTransaction.status = "COMPLETED"
    bridgeTransaction.sourceChain = event.params.sourceChainSelector
    bridgeTransaction.token = event.params.token
    bridgeTransaction.amount = event.params.amount
    bridgeTransaction.sender = event.params.sender
    bridgeTransaction.receiver = event.params.receiver
    bridgeTransaction.createdAt = event.block.timestamp
  } else {
    // Update existing transaction to completed
    bridgeTransaction.status = "COMPLETED"
  }
  
  bridgeTransaction.receivedAt = event.block.timestamp
  bridgeTransaction.updatedAt = event.block.timestamp
  bridgeTransaction.blockNumber = event.block.number
  bridgeTransaction.transactionHash = event.transaction.hash
  
  bridgeTransaction.save()
}

export function handleTransferLimitsUpdated(event: TransferLimitsUpdatedEvent): void {
  let entity = new TransferLimitsUpdated(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  )
  
  entity.token = BigInt.fromI32(event.params.token as i32)
  entity.minAmount = event.params.minAmount
  entity.maxAmount = event.params.maxAmount
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  
  entity.save()
}
