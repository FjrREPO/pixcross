import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { CuratorDeployed } from "../generated/schema"
import { CuratorDeployed as CuratorDeployedEvent } from "../generated/PixcrossCuratorFactory/PixcrossCuratorFactory"
import { handleCuratorDeployed } from "../src/pixcross-curator-factory"
import { createCuratorDeployedEvent } from "./pixcross-curator-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let curator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let name = "Example string value"
    let symbol = "Example string value"
    let asset = Address.fromString("0x0000000000000000000000000000000000000001")
    let pools = [Bytes.fromI32(1234567890)]
    let allocations = [BigInt.fromI32(234)]
    let newCuratorDeployedEvent = createCuratorDeployedEvent(
      curator,
      name,
      symbol,
      asset,
      pools,
      allocations
    )
    handleCuratorDeployed(newCuratorDeployedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("CuratorDeployed created and stored", () => {
    assert.entityCount("CuratorDeployed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CuratorDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "curator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CuratorDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "CuratorDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "symbol",
      "Example string value"
    )
    assert.fieldEquals(
      "CuratorDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "asset",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CuratorDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pools",
      "[1234567890]"
    )
    assert.fieldEquals(
      "CuratorDeployed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "allocations",
      "[234]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
