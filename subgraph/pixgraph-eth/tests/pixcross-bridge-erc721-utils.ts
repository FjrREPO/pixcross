import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
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
  ChainSupportRemoved
} from "../generated/PixcrossBridgeERC721/PixcrossBridgeERC721"

export function createTokenLockedEvent(
  token: Address,
  tokenId: BigInt,
  user: Address,
  targetChainId: BigInt,
  targetAddress: Address
): TokenLocked {
  let tokenLockedEvent = changetype<TokenLocked>(newMockEvent())

  tokenLockedEvent.parameters = new Array()

  tokenLockedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenLockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenLockedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokenLockedEvent.parameters.push(
    new ethereum.EventParam(
      "targetChainId",
      ethereum.Value.fromUnsignedBigInt(targetChainId)
    )
  )
  tokenLockedEvent.parameters.push(
    new ethereum.EventParam(
      "targetAddress",
      ethereum.Value.fromAddress(targetAddress)
    )
  )

  return tokenLockedEvent
}

export function createTokenBurnedEvent(
  token: Address,
  tokenId: BigInt,
  user: Address,
  targetChainId: BigInt,
  targetAddress: Address
): TokenBurned {
  let tokenBurnedEvent = changetype<TokenBurned>(newMockEvent())

  tokenBurnedEvent.parameters = new Array()

  tokenBurnedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenBurnedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokenBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "targetChainId",
      ethereum.Value.fromUnsignedBigInt(targetChainId)
    )
  )
  tokenBurnedEvent.parameters.push(
    new ethereum.EventParam(
      "targetAddress",
      ethereum.Value.fromAddress(targetAddress)
    )
  )

  return tokenBurnedEvent
}

export function createTokenMintedEvent(
  token: Address,
  tokenId: BigInt,
  user: Address,
  sourceChainId: BigInt,
  txHash: Bytes
): TokenMinted {
  let tokenMintedEvent = changetype<TokenMinted>(newMockEvent())

  tokenMintedEvent.parameters = new Array()

  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "sourceChainId",
      ethereum.Value.fromUnsignedBigInt(sourceChainId)
    )
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("txHash", ethereum.Value.fromFixedBytes(txHash))
  )

  return tokenMintedEvent
}

export function createTokenUnlockedEvent(
  token: Address,
  tokenId: BigInt,
  user: Address,
  sourceChainId: BigInt,
  txHash: Bytes
): TokenUnlocked {
  let tokenUnlockedEvent = changetype<TokenUnlocked>(newMockEvent())

  tokenUnlockedEvent.parameters = new Array()

  tokenUnlockedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenUnlockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenUnlockedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  tokenUnlockedEvent.parameters.push(
    new ethereum.EventParam(
      "sourceChainId",
      ethereum.Value.fromUnsignedBigInt(sourceChainId)
    )
  )
  tokenUnlockedEvent.parameters.push(
    new ethereum.EventParam("txHash", ethereum.Value.fromFixedBytes(txHash))
  )

  return tokenUnlockedEvent
}

export function createBridgeOperatorAddedEvent(
  operator: Address
): BridgeOperatorAdded {
  let bridgeOperatorAddedEvent = changetype<BridgeOperatorAdded>(
    newMockEvent()
  )

  bridgeOperatorAddedEvent.parameters = new Array()

  bridgeOperatorAddedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )

  return bridgeOperatorAddedEvent
}

export function createSupportedTokenAddedEvent(
  token: Address
): SupportedTokenAdded {
  let supportedTokenAddedEvent = changetype<SupportedTokenAdded>(
    newMockEvent()
  )

  supportedTokenAddedEvent.parameters = new Array()

  supportedTokenAddedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return supportedTokenAddedEvent
}

export function createChainSupportAddedEvent(
  chainId: BigInt
): ChainSupportAdded {
  let chainSupportAddedEvent = changetype<ChainSupportAdded>(newMockEvent())

  chainSupportAddedEvent.parameters = new Array()

  chainSupportAddedEvent.parameters.push(
    new ethereum.EventParam(
      "chainId",
      ethereum.Value.fromUnsignedBigInt(chainId)
    )
  )

  return chainSupportAddedEvent
}

