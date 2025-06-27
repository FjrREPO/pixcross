import { BigInt, Bytes, log, store, Address } from "@graphprotocol/graph-ts";
import { Account, Balance, Curator, Pool, PoolAllocation, CuratorLendAPR } from "../generated/schema";
import { Curator as CuratorTemplate } from "../generated/templates";
import {
  Approval,
  CuratorDeposit,
  CuratorUpdated,
  Deposit,
  PublicDeposit,
  AllocationSetup,
  AllocationBatchSetup,
  Transfer,
  Withdraw,
  UserBalanceUpdated,
  Curator as CuratorContract,
} from "../generated/templates/Curator/Curator";

export function handleApproval(event: Approval): void {
  return;
}

export function handleDeposit(event: Deposit): void {
  log.info("Deposit event sender: {}", [event.params.sender.toHexString()]);
  log.info("Deposit event owner: {}", [event.params.owner.toHexString()]);
  log.info("Deposit event address: {}", [event.address.toHexString()]);
  log.info("Deposit event assets: {}", [event.params.assets.toString()]);
  log.info("Deposit event shares: {}", [event.params.shares.toString()]);

  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Update curator totals using contract functions
  let contract = CuratorContract.bind(event.address);
  curator.totalAssets = contract.totalAssets();
  curator.totalShares = contract.totalSupply();
  
  // Update curator lend APR after deposit changes
  updateCuratorLendAPR(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
  
  curator.save();

  // Create or load account
  let account = Account.load(event.params.owner.toHexString());
  if (!account) {
    account = new Account(event.params.owner.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
  }

  let balance = Balance.load(
    `${event.address.toHexString()}-${event.params.owner.toHexString()}`
  );

  if (!balance) {
    balance = new Balance(
      `${event.address.toHexString()}-${event.params.owner.toHexString()}`
    );

    balance.balance = BigInt.fromI32(0);
    balance.shares = BigInt.fromI32(0);
    balance.totalDeposited = BigInt.fromI32(0);
    balance.totalWithdrawn = BigInt.fromI32(0);
    balance.account = account.id;
    balance.curator = event.address;
    balance.curatorEntity = event.address.toHexString(); // Reference to the Curator object
  }

  // Update balance fields
  balance.balance = balance.balance.plus(event.params.assets);
  balance.shares = balance.shares.plus(event.params.shares);
  balance.totalDeposited = balance.totalDeposited.plus(event.params.assets);
  balance.save();
}

export function handleCuratorDeposit(event: CuratorDeposit): void {
  log.info("CuratorDeposit event curator: {}", [event.params.curator.toHexString()]);
  log.info("CuratorDeposit event receiver: {}", [event.params.receiver.toHexString()]);
  log.info("CuratorDeposit event assets: {}", [event.params.assets.toString()]);
  log.info("CuratorDeposit event shares: {}", [event.params.shares.toString()]);

  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Update curator totals using contract functions
  let contract = CuratorContract.bind(event.address);
  curator.totalAssets = contract.totalAssets();
  curator.totalShares = contract.totalSupply();
  
  // Update curator lend APR after deposit changes
  updateCuratorLendAPR(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
  
  curator.save();

  // Create or load account
  let account = Account.load(event.params.receiver.toHexString());
  if (!account) {
    account = new Account(event.params.receiver.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
  }

  let balance = Balance.load(
    `${event.address.toHexString()}-${event.params.receiver.toHexString()}`
  );

  if (!balance) {
    balance = new Balance(
      `${event.address.toHexString()}-${event.params.receiver.toHexString()}`
    );

    balance.balance = BigInt.fromI32(0);
    balance.shares = BigInt.fromI32(0);
    balance.totalDeposited = BigInt.fromI32(0);
    balance.totalWithdrawn = BigInt.fromI32(0);
    balance.account = account.id;
    balance.curator = event.address;
    balance.curatorEntity = event.address.toHexString(); // Reference to the Curator object
  }

  // Update balance fields
  balance.balance = balance.balance.plus(event.params.assets);
  balance.shares = balance.shares.plus(event.params.shares);
  balance.totalDeposited = balance.totalDeposited.plus(event.params.assets);
  balance.save();
}

export function handlePublicDeposit(event: PublicDeposit): void {
  log.info("PublicDeposit event depositor: {}", [event.params.depositor.toHexString()]);
  log.info("PublicDeposit event receiver: {}", [event.params.receiver.toHexString()]);
  log.info("PublicDeposit event assets: {}", [event.params.assets.toString()]);
  log.info("PublicDeposit event shares: {}", [event.params.shares.toString()]);

  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Update curator totals using contract functions
  let contract = CuratorContract.bind(event.address);
  curator.totalAssets = contract.totalAssets();
  curator.totalShares = contract.totalSupply();
  
  // Update curator lend APR after deposit changes
  updateCuratorLendAPR(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
  
  curator.save();

  // Create or load account
  let account = Account.load(event.params.receiver.toHexString());
  if (!account) {
    account = new Account(event.params.receiver.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
  }

  let balance = Balance.load(
    `${event.address.toHexString()}-${event.params.receiver.toHexString()}`
  );

  if (!balance) {
    balance = new Balance(
      `${event.address.toHexString()}-${event.params.receiver.toHexString()}`
    );

    balance.balance = BigInt.fromI32(0);
    balance.shares = BigInt.fromI32(0);
    balance.totalDeposited = BigInt.fromI32(0);
    balance.totalWithdrawn = BigInt.fromI32(0);
    balance.account = account.id;
    balance.curator = event.address;
    balance.curatorEntity = event.address.toHexString(); // Reference to the Curator object
  }

  // Update balance fields
  balance.balance = balance.balance.plus(event.params.assets);
  balance.shares = balance.shares.plus(event.params.shares);
  balance.totalDeposited = balance.totalDeposited.plus(event.params.assets);
  balance.save();
}

export function handleCuratorUpdated(event: CuratorUpdated): void {
  log.info("CuratorUpdated event curator: {}", [event.params.curator.toHexString()]);
  log.info("CuratorUpdated event isCurator: {}", [event.params.isCurator.toString()]);
  
  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Update curator authorization status if needed
  // The event indicates if an address is authorized as a curator
  // This could be used to track curator permissions
  curator.save();
}

/**
 * Calculate and update curator's weighted lend APR based on pool allocations
 * This function should be called whenever allocations change
 */
function updateCuratorLendAPR(
  curatorAddress: Bytes,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes
): void {
  let curator = Curator.load(curatorAddress.toHexString());
  if (!curator) {
    return;
  }

  let contract = CuratorContract.bind(Address.fromBytes(curatorAddress));
  
  // Calculate weighted APR based on pool allocations and lending rates
  let totalWeightedAPR = BigInt.fromI32(0);
  let totalAllocated = BigInt.fromI32(0);
  
  // Get curator's total assets
  let curatorTotalAssets = contract.totalAssets();
  
  if (curator.pools && curatorTotalAssets.gt(BigInt.fromI32(0))) {
    for (let i = 0; i < curator.pools!.length; i++) {
      let poolId = curator.pools![i];
      let pool = Pool.load(poolId);
      
      if (pool) {
        // Get allocation for this pool
        let allocation = contract.try_poolAllocations(Bytes.fromHexString(poolId) as Bytes);
        if (!allocation.reverted && allocation.value.gt(BigInt.fromI32(0))) {
          // Add to total allocated
          totalAllocated = totalAllocated.plus(allocation.value);
          
          // Calculate weighted contribution: allocation * pool lending rate
          let weightedContribution = allocation.value.times(pool.lendingRate);
          totalWeightedAPR = totalWeightedAPR.plus(weightedContribution);
        }
      }
    }
  }
  
  // Calculate final weighted APR
  let weightedAPR = BigInt.fromI32(0);
  if (totalAllocated.gt(BigInt.fromI32(0))) {
    weightedAPR = totalWeightedAPR.div(totalAllocated);
  }

  // Update curator's current lend APR
  curator.currentLendAPR = weightedAPR;
  curator.save();

  // Create a new CuratorLendAPR entry for historical tracking
  let aprId = `${curatorAddress.toHexString()}-lend-${blockTimestamp.toString()}`;
  let curatorLendAPR = new CuratorLendAPR(aprId);
  
  curatorLendAPR.curator = curator.id;
  curatorLendAPR.apr = weightedAPR;
  curatorLendAPR.totalAllocated = totalAllocated;
  curatorLendAPR.blockNumber = blockNumber;
  curatorLendAPR.blockTimestamp = blockTimestamp;
  curatorLendAPR.transactionHash = transactionHash;
  curatorLendAPR.save();
  
  log.info("Curator lend APR updated for {}: {} basis points with {} allocated", [
    curatorAddress.toHexString(),
    weightedAPR.toString(),
    totalAllocated.toString()
  ]);
}

function createOrUpdatePoolAllocation(
  curatorAddress: Bytes,
  poolId: Bytes,
  allocation: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes
): void {
  let poolAllocationId = `${curatorAddress.toHexString()}-${poolId.toHexString()}`;
  let poolAllocation = PoolAllocation.load(poolAllocationId);
  
  if (!poolAllocation) {
    poolAllocation = new PoolAllocation(poolAllocationId);
    poolAllocation.curator = curatorAddress.toHexString();
    poolAllocation.pool = poolId.toHexString();
    poolAllocation.poolId = poolId;
  }
  
  poolAllocation.allocation = allocation;
  poolAllocation.isActive = allocation.gt(BigInt.fromI32(0));
  poolAllocation.lastUpdated = blockTimestamp;
  poolAllocation.blockNumber = blockNumber;
  poolAllocation.blockTimestamp = blockTimestamp;
  poolAllocation.transactionHash = transactionHash;
  
  // Calculate allocation percentage if curator exists
  let curator = Curator.load(curatorAddress.toHexString());
  if (curator && curator.totalAssets.gt(BigInt.fromI32(0))) {
    // Calculate percentage as (allocation * 10000) / totalAssets to get basis points
    poolAllocation.allocationPercentage = allocation.times(BigInt.fromI32(10000)).div(curator.totalAssets);
  } else {
    poolAllocation.allocationPercentage = BigInt.fromI32(0);
  }
  
  poolAllocation.save();
}

export function handleAllocationSetup(event: AllocationSetup): void {
  log.info("AllocationSetup event poolId: {}", [event.params.poolId.toHexString()]);
  log.info("AllocationSetup event allocation: {}", [event.params.allocation.toString()]);
  
  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Check if the pool exists and add it to curator's pools if not already included
  let poolId = event.params.poolId.toHexString();
  let pool = Pool.load(poolId);
  
  if (pool) {
    let currentPools: string[] = [];
    if (curator.pools != null) {
      currentPools = curator.pools as string[];
    }
    if (!currentPools.includes(poolId)) {
      currentPools.push(poolId);
      curator.pools = currentPools;
    }
  }
  
  // Create or update PoolAllocation entity
  createOrUpdatePoolAllocation(
    event.address,
    event.params.poolId,
    event.params.allocation,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
  
  // Update curator lend APR after allocation changes
  updateCuratorLendAPR(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
  
  curator.save();
}

export function handleAllocationBatchSetup(event: AllocationBatchSetup): void {
  log.info("AllocationBatchSetup event poolIds length: {}", [event.params.poolIds.length.toString()]);
  log.info("AllocationBatchSetup event allocations length: {}", [event.params.allocations.length.toString()]);
  
  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Update allocations array in curator
  curator.allocations = event.params.allocations;
  
  // Update pools array and create/update PoolAllocation entities
  let poolIds: string[] = [];
  for (let i = 0; i < event.params.poolIds.length; i++) {
    let poolId = event.params.poolIds[i].toHexString();
    let pool = Pool.load(poolId);
    if (pool) {
      poolIds.push(poolId);
    }
    
    // Create or update PoolAllocation entity for each pool
    if (i < event.params.allocations.length) {
      createOrUpdatePoolAllocation(
        event.address,
        event.params.poolIds[i],
        event.params.allocations[i],
        event.block.number,
        event.block.timestamp,
        event.transaction.hash
      );
    }
  }
  curator.pools = poolIds;
  
  curator.save();
}

export function handleUserBalanceUpdated(event: UserBalanceUpdated): void {
  log.info("UserBalanceUpdated event user: {}", [event.params.user.toHexString()]);
  log.info("UserBalanceUpdated event newBalance: {}", [event.params.newBalance.toString()]);
  log.info("UserBalanceUpdated event totalDeposited: {}", [event.params.totalDeposited.toString()]);
  log.info("UserBalanceUpdated event totalWithdrawn: {}", [event.params.totalWithdrawn.toString()]);

  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Create or load account
  let account = Account.load(event.params.user.toHexString());
  if (!account) {
    account = new Account(event.params.user.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
  }

  let balance = Balance.load(
    `${event.address.toHexString()}-${event.params.user.toHexString()}`
  );

  if (!balance) {
    balance = new Balance(
      `${event.address.toHexString()}-${event.params.user.toHexString()}`
    );
    balance.balance = BigInt.fromI32(0);
    balance.shares = BigInt.fromI32(0);
    balance.totalDeposited = BigInt.fromI32(0);
    balance.totalWithdrawn = BigInt.fromI32(0);
    balance.account = account.id;
    balance.curator = event.address;
    balance.curatorEntity = event.address.toHexString(); // Reference to the Curator object
  }

  // Update all balance fields from the event
  balance.balance = event.params.newBalance;
  balance.totalDeposited = event.params.totalDeposited;
  balance.totalWithdrawn = event.params.totalWithdrawn;
  balance.save();
}

export function handleTransfer(event: Transfer): void {
  log.info("Transfer event from: {}", [event.params.from.toHexString()]);
  log.info("Transfer event to: {}", [event.params.to.toHexString()]);
  log.info("Transfer event value: {}", [event.params.value.toString()]);
  
  // Handle share transfers between accounts
  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Skip mint/burn transfers (from/to zero address)
  let zeroAddress = "0x0000000000000000000000000000000000000000";
  if (event.params.from.toHexString() == zeroAddress || event.params.to.toHexString() == zeroAddress) {
    return;
  }

  // Update balances for both from and to accounts
  if (event.params.from.toHexString() != zeroAddress) {
    let fromAccount = Account.load(event.params.from.toHexString());
    if (!fromAccount) {
      fromAccount = new Account(event.params.from.toHexString());
      fromAccount.positions = [];
      fromAccount.lend = [];
      fromAccount.save();
    }
    
    let fromBalance = Balance.load(
      `${event.address.toHexString()}-${event.params.from.toHexString()}`
    );
    if (fromBalance) {
      fromBalance.shares = fromBalance.shares.minus(event.params.value);
      fromBalance.save();
    }
  }
  
  if (event.params.to.toHexString() != zeroAddress) {
    let toAccount = Account.load(event.params.to.toHexString());
    if (!toAccount) {
      toAccount = new Account(event.params.to.toHexString());
      toAccount.positions = [];
      toAccount.lend = [];
      toAccount.save();
    }
    
    let toBalance = Balance.load(
      `${event.address.toHexString()}-${event.params.to.toHexString()}`
    );
    if (!toBalance) {
      toBalance = new Balance(
        `${event.address.toHexString()}-${event.params.to.toHexString()}`
      );
      toBalance.balance = BigInt.fromI32(0);
      toBalance.shares = BigInt.fromI32(0);
      toBalance.totalDeposited = BigInt.fromI32(0);
      toBalance.totalWithdrawn = BigInt.fromI32(0);
      toBalance.account = toAccount.id;
      toBalance.curator = event.address;
      toBalance.curatorEntity = event.address.toHexString(); // Reference to the Curator object
    }
    
    toBalance.shares = toBalance.shares.plus(event.params.value);
    toBalance.save();
  }
}

export function handleWithdraw(event: Withdraw): void {
  log.info("Withdraw event sender: {}", [event.params.sender.toHexString()]);
  log.info("Withdraw event receiver: {}", [event.params.receiver.toHexString()]);
  log.info("Withdraw event owner: {}", [event.params.owner.toHexString()]);
  log.info("Withdraw event assets: {}", [event.params.assets.toString()]);
  log.info("Withdraw event shares: {}", [event.params.shares.toString()]);

  let curator = Curator.load(event.address.toHexString());
  if (!curator) {
    log.info("Curator not found: {}", [event.address.toHexString()]);
    return;
  }

  // Update curator totals using contract functions
  let contract = CuratorContract.bind(event.address);
  curator.totalAssets = contract.totalAssets();
  curator.totalShares = contract.totalSupply();
  
  // Update curator lend APR after withdrawal changes
  updateCuratorLendAPR(
    event.address,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash
  );
  
  curator.save();

  // Create or load account
  let account = Account.load(event.params.owner.toHexString());
  if (!account) {
    account = new Account(event.params.owner.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
  }

  let balance = Balance.load(
    `${event.address.toHexString()}-${event.params.owner.toHexString()}`
  );

  if (balance) {
    // Update balance fields
    balance.balance = balance.balance.minus(event.params.assets);
    balance.shares = balance.shares.minus(event.params.shares);
    balance.totalWithdrawn = balance.totalWithdrawn.plus(event.params.assets);
    balance.save();
  }
}
