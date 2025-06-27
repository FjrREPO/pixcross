import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  CuratorDeployed,
  PixcrossApprovalSet
} from "../generated/PixcrossCuratorFactory/PixcrossCuratorFactory"

export function createCuratorDeployedEvent(
  curator: Address,
  name: string,
  symbol: string,
  asset: Address,
  pools: Array<Bytes>,
  allocations: Array<BigInt>
): CuratorDeployed {
  let curatorDeployedEvent = changetype<CuratorDeployed>(newMockEvent())

  curatorDeployedEvent.parameters = new Array()

  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("curator", ethereum.Value.fromAddress(curator))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("pools", ethereum.Value.fromFixedBytesArray(pools))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "allocations",
      ethereum.Value.fromUnsignedBigIntArray(allocations)
    )
  )

  return curatorDeployedEvent
}

export function createPixcrossApprovalSetEvent(
  curator: Address,
  amount: BigInt
): PixcrossApprovalSet {
  let pixcrossApprovalSetEvent = changetype<PixcrossApprovalSet>(newMockEvent())

  pixcrossApprovalSetEvent.parameters = new Array()

  pixcrossApprovalSetEvent.parameters.push(
    new ethereum.EventParam("curator", ethereum.Value.fromAddress(curator))
  )
  pixcrossApprovalSetEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return pixcrossApprovalSetEvent
}
