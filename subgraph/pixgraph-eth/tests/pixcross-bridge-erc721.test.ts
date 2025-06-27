import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { TokenLocked } from "../generated/schema"
import { TokenLocked as TokenLockedEvent } from "../generated/PixcrossBridgeERC721/PixcrossBridgeERC721"
import { handleTokenLocked } from "../src/pixcross-bridge-erc721"
import { createTokenLockedEvent } from "./pixcross-bridge-erc721-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let tokenId = BigInt.fromI32(234)
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let targetChainId = BigInt.fromI32(234)
    let targetAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newTokenLockedEvent = createTokenLockedEvent(
      token,
      tokenId,
      user,
      targetChainId,
      targetAddress
    )
    handleTokenLocked(newTokenLockedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("TokenLocked created and stored", () => {
    assert.entityCount("TokenLocked", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "TokenLocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TokenLocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )
    assert.fieldEquals(
      "TokenLocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "TokenLocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "targetChainId",
      "234"
    )
    assert.fieldEquals(
      "TokenLocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "targetAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

