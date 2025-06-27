import { BigInt, log } from "@graphprotocol/graph-ts";
import { CuratorDeployed as CuratorDeployedEvent } from "../generated/PixcrossCuratorFactory/PixcrossCuratorFactory";
import { Curator, Pool } from "../generated/schema";
import { Curator as CuratorTemplate } from "../generated/templates";
import { getOrCreateAccount } from "./helpers";

function findOrCreateCurator(curatorAddress: string): Curator {
  let curator = Curator.load(curatorAddress);

  if (!curator) {
    curator = new Curator(curatorAddress);
  }

  return curator;
}

export function handleCuratorDeployed(event: CuratorDeployedEvent): void {
  let curatorAddress = event.params.curator;

  log.info("Curator deployed: {}", [curatorAddress.toHexString()]);

  let curator = findOrCreateCurator(curatorAddress.toHexString());
  let creator = getOrCreateAccount(event.transaction.from);

  curator.creator = creator.id;
  curator.curator = curatorAddress;
  curator.symbol = event.params.symbol;
  curator.name = event.params.name;
  curator.asset = event.params.asset;
  curator.allocations = event.params.allocations;
  curator.totalAssets = BigInt.fromI32(0);
  curator.totalShares = BigInt.fromI32(0);
  curator.feePercentage = BigInt.fromI32(0);
  curator.paused = false;
  curator.currentLendAPR = BigInt.fromI32(0);
  curator.blockNumber = event.block.number;
  curator.blockTimestamp = event.block.timestamp;
  curator.transactionHash = event.transaction.hash;
  curator.pools = event.params.pools.map<string>((poolAddress) => {
    return poolAddress.toHexString();
  });

  curator.save();
  CuratorTemplate.create(curatorAddress);
}
