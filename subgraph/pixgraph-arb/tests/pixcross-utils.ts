import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AuctionSettled,
  AuctionStarted,
  Bid,
  Borrow,
  FlashLoan,
  InterestAccrued,
  InterestRateModelChanged,
  LTVChanged,
  OperatorSet,
  OwnershipTransferred,
  PoolCreated,
  Repay,
  Supply,
  SupplyCollateral,
  Withdraw,
  WithdrawCollateral
} from "../generated/Pixcross/Pixcross"

export function createAuctionSettledEvent(
  id: Bytes,
  tokenId: BigInt,
  bidder: Address,
  debtAmount: BigInt,
  bidAmount: BigInt,
  excess: BigInt
): AuctionSettled {
  let auctionSettledEvent = changetype<AuctionSettled>(newMockEvent())

  auctionSettledEvent.parameters = new Array()

  auctionSettledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam(
      "debtAmount",
      ethereum.Value.fromUnsignedBigInt(debtAmount)
    )
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam("excess", ethereum.Value.fromUnsignedBigInt(excess))
  )

  return auctionSettledEvent
}

export function createAuctionStartedEvent(
  id: Bytes,
  tokenId: BigInt,
  owner: Address,
  startTime: BigInt,
  endTime: BigInt,
  debtAmount: BigInt
): AuctionStarted {
  let auctionStartedEvent = changetype<AuctionStarted>(newMockEvent())

  auctionStartedEvent.parameters = new Array()

  auctionStartedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  auctionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  auctionStartedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  auctionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "startTime",
      ethereum.Value.fromUnsignedBigInt(startTime)
    )
  )
  auctionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  auctionStartedEvent.parameters.push(
    new ethereum.EventParam(
      "debtAmount",
      ethereum.Value.fromUnsignedBigInt(debtAmount)
    )
  )

  return auctionStartedEvent
}

export function createBidEvent(
  id: Bytes,
  tokenId: BigInt,
  bidder: Address,
  amount: BigInt,
  previousBidder: Address,
  previousBid: BigInt
): Bid {
  let bidEvent = changetype<Bid>(newMockEvent())

  bidEvent.parameters = new Array()

  bidEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  bidEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  bidEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  bidEvent.parameters.push(
    new ethereum.EventParam(
      "previousBidder",
      ethereum.Value.fromAddress(previousBidder)
    )
  )
  bidEvent.parameters.push(
    new ethereum.EventParam(
      "previousBid",
      ethereum.Value.fromUnsignedBigInt(previousBid)
    )
  )

  return bidEvent
}

export function createBorrowEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address,
  receiver: Address,
  amount: BigInt,
  shares: BigInt
): Borrow {
  let borrowEvent = changetype<Borrow>(newMockEvent())

  borrowEvent.parameters = new Array()

  borrowEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return borrowEvent
}

export function createFlashLoanEvent(
  caller: Address,
  receiver: Address,
  token: Address,
  amount: BigInt,
  fee: BigInt
): FlashLoan {
  let flashLoanEvent = changetype<FlashLoan>(newMockEvent())

  flashLoanEvent.parameters = new Array()

  flashLoanEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  flashLoanEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return flashLoanEvent
}

export function createInterestAccruedEvent(
  id: Bytes,
  borrowRate: BigInt,
  interest: BigInt,
  timeElapsed: BigInt,
  feeShares: BigInt
): InterestAccrued {
  let interestAccruedEvent = changetype<InterestAccrued>(newMockEvent())

  interestAccruedEvent.parameters = new Array()

  interestAccruedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  interestAccruedEvent.parameters.push(
    new ethereum.EventParam(
      "borrowRate",
      ethereum.Value.fromUnsignedBigInt(borrowRate)
    )
  )
  interestAccruedEvent.parameters.push(
    new ethereum.EventParam(
      "interest",
      ethereum.Value.fromUnsignedBigInt(interest)
    )
  )
  interestAccruedEvent.parameters.push(
    new ethereum.EventParam(
      "timeElapsed",
      ethereum.Value.fromUnsignedBigInt(timeElapsed)
    )
  )
  interestAccruedEvent.parameters.push(
    new ethereum.EventParam(
      "feeShares",
      ethereum.Value.fromUnsignedBigInt(feeShares)
    )
  )

  return interestAccruedEvent
}

export function createInterestRateModelChangedEvent(
  irm: Address,
  enabled: boolean
): InterestRateModelChanged {
  let interestRateModelChangedEvent =
    changetype<InterestRateModelChanged>(newMockEvent())

  interestRateModelChangedEvent.parameters = new Array()

  interestRateModelChangedEvent.parameters.push(
    new ethereum.EventParam("irm", ethereum.Value.fromAddress(irm))
  )
  interestRateModelChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )

  return interestRateModelChangedEvent
}

export function createLTVChangedEvent(
  ltv: BigInt,
  enabled: boolean
): LTVChanged {
  let ltvChangedEvent = changetype<LTVChanged>(newMockEvent())

  ltvChangedEvent.parameters = new Array()

  ltvChangedEvent.parameters.push(
    new ethereum.EventParam("ltv", ethereum.Value.fromUnsignedBigInt(ltv))
  )
  ltvChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )

  return ltvChangedEvent
}

export function createOperatorSetEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): OperatorSet {
  let operatorSetEvent = changetype<OperatorSet>(newMockEvent())

  operatorSetEvent.parameters = new Array()

  operatorSetEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  operatorSetEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  operatorSetEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return operatorSetEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPoolCreatedEvent(
  id: Bytes,
  collateralToken: Address,
  loanToken: Address,
  oracle: Address,
  irm: Address,
  ltv: BigInt,
  lth: BigInt
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "collateralToken",
      ethereum.Value.fromAddress(collateralToken)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("loanToken", ethereum.Value.fromAddress(loanToken))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("oracle", ethereum.Value.fromAddress(oracle))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("irm", ethereum.Value.fromAddress(irm))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("ltv", ethereum.Value.fromUnsignedBigInt(ltv))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("lth", ethereum.Value.fromUnsignedBigInt(lth))
  )

  return poolCreatedEvent
}

export function createRepayEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address,
  amount: BigInt,
  shares: BigInt
): Repay {
  let repayEvent = changetype<Repay>(newMockEvent())

  repayEvent.parameters = new Array()

  repayEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return repayEvent
}

export function createSupplyEvent(
  id: Bytes,
  sender: Address,
  onBehalfOf: Address,
  amount: BigInt,
  shares: BigInt
): Supply {
  let supplyEvent = changetype<Supply>(newMockEvent())

  supplyEvent.parameters = new Array()

  supplyEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return supplyEvent
}

export function createSupplyCollateralEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address
): SupplyCollateral {
  let supplyCollateralEvent = changetype<SupplyCollateral>(newMockEvent())

  supplyCollateralEvent.parameters = new Array()

  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )

  return supplyCollateralEvent
}

export function createWithdrawEvent(
  id: Bytes,
  sender: Address,
  onBehalfOf: Address,
  receiver: Address,
  amount: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}

export function createWithdrawCollateralEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address,
  receiver: Address
): WithdrawCollateral {
  let withdrawCollateralEvent = changetype<WithdrawCollateral>(newMockEvent())

  withdrawCollateralEvent.parameters = new Array()

  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )

  return withdrawCollateralEvent
}
