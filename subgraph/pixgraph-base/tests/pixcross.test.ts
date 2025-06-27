import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { AuctionSettled } from "../generated/schema"
import { AuctionSettled as AuctionSettledEvent } from "../generated/Pixcross/Pixcross"
import { handleAuctionSettled } from "../src/pixcross"
import { createAuctionSettledEvent } from "./pixcross-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = Bytes.fromI32(1234567890)
    let tokenId = BigInt.fromI32(234)
    let bidder = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let debtAmount = BigInt.fromI32(234)
    let bidAmount = BigInt.fromI32(234)
    let excess = BigInt.fromI32(234)
    let newAuctionSettledEvent = createAuctionSettledEvent(
      id,
      tokenId,
      bidder,
      debtAmount,
      bidAmount,
      excess
    )
    handleAuctionSettled(newAuctionSettledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AuctionSettled created and stored", () => {
    assert.entityCount("AuctionSettled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AuctionSettled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "AuctionSettled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bidder",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AuctionSettled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "debtAmount",
      "234"
    )
    assert.fieldEquals(
      "AuctionSettled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bidAmount",
      "234"
    )
    assert.fieldEquals(
      "AuctionSettled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "excess",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
