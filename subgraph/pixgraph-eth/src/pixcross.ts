import { BigInt, Bytes, Entity, log, store } from "@graphprotocol/graph-ts";
import {
  InterestAccrued as AccruedEvent,
  AuctionSettled as AuctionSettledEvent,
  Bid as BidEvent,
  Borrow as BorrowEvent,
  InterestRateModelChanged as InterestRateModelChangedEvent,
  LTVChanged as LTVChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolCreated as PoolCreatedEvent,
  Repay as RepayEvent,
  Supply as SupplyEvent,
  SupplyCollateral as SupplyCollateralEvent,
  Withdraw as WithdrawEvent,
  WithdrawCollateral as WithdrawCollateralEvent,
  AuctionStarted as AuctionStartedEvent,
  FlashLoan as FlashLoanEvent,
  OperatorSet as OperatorSetEvent,
} from "../generated/Pixcross/Pixcross";
import {
  Account,
  Accrued,
  AuctionSettled,
  AuctionStarted,
  Bid,
  Borrow,
  BorrowAPR,
  Collateral,
  FlashLoan,
  InterestRateModel,
  LendAPR,
  LoanToken,
  LTV,
  OperatorSet,
  Pool,
  Position,
  Repay,
  Supply,
  SupplyCollateral,
  Token,
  Withdraw,
  WithdrawCollateral,
} from "../generated/schema";
import {
  BIGINT_18_DECIMAL,
  getOrCreateInterestRateModel,
  getOrCreatePool,
  ZERO_ADDRESS,
  updatePoolMetrics,
  validatePool,
  safeSubtract,
  getOrCreateCollateral,
  getOrCreateLoanToken,
  getOrCreateAccount,
  getOrCreatePosition,
  getOrCreateToken,
  getOrCreateBalance,
  updatePoolStatistics,
  createOrUpdateBorrowAPR,
  createOrUpdateLendAPR,
} from "./helpers";

export function handleAuctionStarted(event: AuctionStartedEvent): void {
  let entity = new AuctionStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.tokenId = event.params.tokenId
  entity.owner = event.params.owner
  entity.collateralToken = event.params.collateralToken
  entity.loanToken = event.params.loanToken
  entity.startTime = event.params.startTime
  entity.endTime = event.params.endTime
  entity.debtAmount = event.params.debtAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
  
  // Update the position with auction data
  let position = Position.load(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  )
  
  if (position != null) {
    position.endTime = event.params.endTime;
    position.save();
  }
}

export function handleAccrued(event: AccruedEvent): void {
  // Create unique accrued entity with transaction hash and timestamp
  let entityId = `${event.params.id.toHexString()}-${event.transaction.hash.toHexString()}-${event.block.timestamp.toString()}`;
  let entity = new Accrued(entityId);
  
  entity.poolId = event.params.id;
  entity.borrowRate = event.params.borrowRate;
  entity.interest = event.params.interest;
  entity.feeShares = event.params.feeShares;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Update pool using dynamic validation
  let pool = validatePool(event.params.id.toHexString(), "InterestAccrued");
  if (pool == null) {
    return;
  }

  // Add accrued interest to both supply and borrow assets
  pool.totalSupplyAssets = pool.totalSupplyAssets.plus(event.params.interest);
  pool.totalBorrowAssets = pool.totalBorrowAssets.plus(event.params.interest);
  
  // Add fee shares to total supply shares (protocol earns from fees)
  pool.totalSupplyShares = pool.totalSupplyShares.plus(event.params.feeShares);

  // Update current borrow rate
  pool.borrowRate = event.params.borrowRate;

  // Use dynamic helper to update all pool metrics
  updatePoolMetrics(pool);
  
  // Update APY calculations specifically for accrued interest
  pool.borrowAPY = event.params.borrowRate;
  pool.supplyAPY = pool.lendingRate;
  
  // Create or update APR entities for accrued interest
  createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);

  pool.save();

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "InterestAccrued");

  log.info("Interest accrued: Pool {} - Interest: {} - New Total Supply: {} - New Total Borrow: {} - Utilization: {}%", [
    pool.id,
    event.params.interest.toString(),
    pool.totalSupplyAssets.toString(),
    pool.totalBorrowAssets.toString(),
    pool.utilizationRate.toString()
  ]);
}

export function handleAuctionSettled(event: AuctionSettledEvent): void {
  let entity = new AuctionSettled(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  );

  entity.poolId = event.params.id.toHexString();
  entity.tokenId = event.params.tokenId;
  entity.bidder = event.params.winner;
  entity.collateralToken = event.params.collateralToken;
  entity.loanToken = event.params.loanToken;
  entity.debtAmount = event.params.outstandingDebt;
  entity.bidAmount = event.params.bidAmount;
  entity.excess = event.params.excess;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  
  // Update the position to clear auction data
  let position = Position.load(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  );
  
  if (position != null) {
    // Reset auction data after settlement
    position.bidder = null;
    position.bid = BigInt.fromI32(0);
    position.endTime = BigInt.fromI32(0);
    position.borrowShares = BigInt.fromI32(0); // Debt is settled
    position.save();
  }
}

export function handleBid(event: BidEvent): void {
  let entity = new Bid(
    `${event.params.tokenId}-${event.transaction.hash.toHexString()}`
  );
  entity.tokenId = event.params.tokenId;
  entity.bidder = event.params.bidder;
  entity.collateralToken = event.params.collateralToken;
  entity.loanToken = event.params.loanToken;
  entity.amount = event.params.amount;
  entity.previousBidder = event.params.previousBidder;
  entity.previousBid = event.params.previousBid;
  entity.poolId = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
  
  // Update the position with latest bid data
  let position = Position.load(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  );
  
  if (position != null) {
    position.bidder = event.params.bidder;
    position.bid = event.params.amount;
    position.save();
  }
}

export function handleBorrow(event: BorrowEvent): void {
  // Create unique borrow entity ID with transaction hash
  let entityId = `${event.params.id.toHexString()}-${event.params.tokenId.toString()}-${event.transaction.hash.toHexString()}`;
  let entity = new Borrow(entityId);
  
  entity.tokenId = event.params.tokenId;
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.receiver = event.params.receiver;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update pool borrow metrics using dynamic validation
  let pool = validatePool(event.params.id.toHexString(), "Borrow");
  if (pool == null) {
    return;
  }

  // Update total borrow assets and shares
  pool.totalBorrowAssets = pool.totalBorrowAssets.plus(event.params.amount);
  pool.totalBorrowShares = pool.totalBorrowShares.plus(event.params.shares);

  // Use dynamic helper to update pool metrics
  updatePoolMetrics(pool);
  
  // Create or update APR entities for borrow event
  createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  
  pool.save();

  // Use dynamic helper to get or create position
  let position = getOrCreatePosition(event.params.id, event.params.tokenId, event.params.onBehalfOf);
  position.borrowShares = position.borrowShares.plus(event.params.shares);
  position.save();

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "Borrow");

  log.info("Borrow processed: Pool {} - Amount: {} - New Total Borrow: {}", [
    pool.id,
    event.params.amount.toString(),
    pool.totalBorrowAssets.toString()
  ]);
}

export function handleFlashLoan(event: FlashLoanEvent): void {
  let entity = new FlashLoan(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.caller = event.params.caller
  entity.receiver = event.params.receiver
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInterestRateModelChanged(
  event: InterestRateModelChangedEvent
): void {
  let irmId = event.params.irm.toHexString();
  let irm = getOrCreateInterestRateModel(irmId);

  if (event.params.enabled == false) {
    if (irm != null) {
      store.remove("InterestRateModel", irmId);
    }
    return;
  }

  if (irm == null) {
    irm = new InterestRateModel(irmId);
  }

  irm.irm = event.params.irm;

  irm.blockNumber = event.block.number;
  irm.blockTimestamp = event.block.timestamp;
  irm.transactionHash = event.transaction.hash;

  irm.save();
}

export function handleLTVChanged(event: LTVChangedEvent): void {
  let ltvId = event.params.ltv.toHexString();
  let ltv = LTV.load(ltvId);

  if (event.params.enabled == false) {
    if (ltv != null) {
      store.remove("LTV", ltvId);
    }
    return;
  }

  if (ltv == null) {
    ltv = new LTV(ltvId);
  }

  ltv.ltv = event.params.ltv;
  ltv.blockNumber = event.block.number;
  ltv.blockTimestamp = event.block.timestamp;
  ltv.transactionHash = event.transaction.hash;

  ltv.save();
}

export function handleOperatorSet(event: OperatorSetEvent): void {
  let entity = new OperatorSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let poolId = event.params.id.toHexString();
  
  // Check if pool already exists to avoid overwriting existing data
  let pool = Pool.load(poolId);
  
  if (pool != null) {
    log.warning("Pool {} already exists, updating existing pool data", [poolId]);
    
    // Update existing pool with latest parameters if needed
    pool.oracle = event.params.oracle;
    pool.irm = event.params.irm;
    pool.ltv = event.params.ltv;
    pool.lth = event.params.lth;
    pool.blockNumber = event.block.number;
    pool.blockTimestamp = event.block.timestamp;
    pool.transactionHash = event.transaction.hash;
    
    // Update pool metrics dynamically
    updatePoolMetrics(pool);
    
    // Create or update APR entities for existing pool
    createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
    createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
    
    pool.save();
    
    // Update pool statistics
    updatePoolStatistics(poolId, "PoolCreated");
    return;
  }

  // Use dynamic helper functions to get or create entities
  let entityCollateral = getOrCreateCollateral(event.params.collateralToken);
  let entityLoan = getOrCreateLoanToken(event.params.loanToken);
  let creator = getOrCreateAccount(event.transaction.from);

  // Create new pool with all dynamic initialization
  pool = new Pool(poolId);
  pool.creator = creator.id;
  pool.oracle = event.params.oracle;
  pool.irm = event.params.irm;
  pool.ltv = event.params.ltv;
  pool.lth = event.params.lth;

  // Set token relationships using dynamic entities
  pool.collateralAddress = event.params.collateralToken;
  pool.collateralToken = entityCollateral.id;
  pool.loanAddress = event.params.loanToken;
  pool.loanToken = entityLoan.id;

  // Initialize all supply and borrow metrics to zero
  pool.totalSupplyAssets = BigInt.fromI32(0);
  pool.totalBorrowAssets = BigInt.fromI32(0);
  pool.totalSupplyShares = BigInt.fromI32(0);
  pool.totalBorrowShares = BigInt.fromI32(0);
  
  // Initialize rate metrics
  pool.borrowRate = BigInt.fromI32(0);
  pool.utilizationRate = BigInt.fromI32(0);
  pool.lendingRate = BigInt.fromI32(0);
  pool.borrowAPY = BigInt.fromI32(0);
  pool.supplyAPY = BigInt.fromI32(0);

  // Set block metadata
  pool.blockNumber = event.block.number;
  pool.blockTimestamp = event.block.timestamp;
  pool.transactionHash = event.transaction.hash;

  // Use dynamic helper to update metrics
  updatePoolMetrics(pool);
  
  // Create initial APR entities with dynamic auto-updates
  createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  
  pool.save();
  
  // Update pool statistics
  updatePoolStatistics(poolId, "PoolCreated");
  
  log.info("Pool created successfully with dynamic APR entities: {} - Collateral: {} - Loan: {} - Borrow Rate: {} - Lend Rate: {}", [
    poolId,
    entityCollateral.id,
    entityLoan.id,
    pool.borrowRate.toString(),
    pool.lendingRate.toString()
  ]);
}

export function handleRepay(event: RepayEvent): void {
  // Create unique repay entity ID with transaction hash  
  let entity = new Repay(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  
  entity.tokenId = event.params.tokenId;
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update pool borrow metrics using dynamic validation
  let pool = validatePool(event.params.id.toHexString(), "Repay");
  if (pool == null) {
    return;
  }

  // Use safe subtraction helpers
  pool.totalBorrowAssets = safeSubtract(
    pool.totalBorrowAssets,
    event.params.amount,
    "totalBorrowAssets",
    pool.id
  );

  pool.totalBorrowShares = safeSubtract(
    pool.totalBorrowShares,
    event.params.shares,
    "totalBorrowShares",
    pool.id
  );

  // Use dynamic helper to update pool metrics
  updatePoolMetrics(pool);
  
  // Create or update APR entities for repay event
  createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  
  pool.save();
  
  // Use dynamic helper to get or create position and update it
  let position = getOrCreatePosition(event.params.id, event.params.tokenId, event.params.onBehalfOf);
  position.borrowShares = safeSubtract(
    position.borrowShares,
    event.params.shares,
    "borrowShares",
    position.id
  );
  position.save();

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "Repay");

  log.info("Repay processed: Pool {} - Amount: {} - New Total Borrow: {}", [
    pool.id,
    event.params.amount.toString(),
    pool.totalBorrowAssets.toString()
  ]);
}

export function handleSupply(event: SupplyEvent): void {
  // Create unique supply entity ID with transaction hash to avoid conflicts
  let entityId = `${event.params.id.toHexString()}-${event.params.onBehalfOf.toHexString()}-${event.transaction.hash.toHexString()}`;
  let entity = new Supply(entityId);

  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id;
  entity.pool = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update pool supply metrics using dynamic validation
  let pool = validatePool(event.params.id.toHexString(), "Supply");
  if (pool == null) {
    return;
  }

  // Update total supply assets and shares
  pool.totalSupplyAssets = pool.totalSupplyAssets.plus(event.params.amount);
  pool.totalSupplyShares = pool.totalSupplyShares.plus(event.params.shares);

  // Use dynamic helper to update pool metrics
  updatePoolMetrics(pool);
  
  // Create or update APR entities for supply event
  createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  
  pool.save();

  // Use dynamic helper to get or create account
  let account = getOrCreateAccount(event.params.onBehalfOf);
  const lend: Array<string> = account.lend || [];
  lend.push(entity.id);
  account.lend = lend;
  account.save();

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "Supply");

  log.info("Supply processed: Pool {} - Amount: {} - New Total Supply: {}", [
    pool.id,
    event.params.amount.toString(),
    pool.totalSupplyAssets.toString()
  ]);
}

export function handleSupplyCollateral(event: SupplyCollateralEvent): void {
  // Use dynamic helper functions to get or create entities
  let token = getOrCreateToken(event.params.id, event.params.tokenId);
  let account = getOrCreateAccount(event.params.onBehalfOf);
  let position = getOrCreatePosition(event.params.id, event.params.tokenId, event.params.onBehalfOf);

  // Create new SupplyCollateral entity with a unique ID that includes transaction hash to ensure uniqueness
  let supplyCollateralId = `${event.params.id.toHexString()}-${event.params.tokenId.toString()}-${event.transaction.hash.toHexString()}`;
  let supplyCollateral = new SupplyCollateral(supplyCollateralId);

  // Set all required fields
  supplyCollateral.poolId = event.params.id;
  supplyCollateral.tokenId = event.params.tokenId;
  supplyCollateral.sender = event.params.sender;
  supplyCollateral.onBehalfOf = event.params.onBehalfOf;
  supplyCollateral.blockNumber = event.block.number;
  supplyCollateral.blockTimestamp = event.block.timestamp;
  supplyCollateral.transactionHash = event.transaction.hash;
  supplyCollateral.save();

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "SupplyCollateral");

  log.info("Supply collateral processed: Pool {} - Token ID: {} - Account: {}", [
    event.params.id.toHexString(),
    event.params.tokenId.toString(),
    event.params.onBehalfOf.toHexString()
  ]);
}

export function handleWithdraw(event: WithdrawEvent): void {
  // Create unique withdraw entity ID with transaction hash
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.receiver = event.params.receiver;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update pool supply metrics using dynamic validation
  let pool = validatePool(event.params.id.toHexString(), "Withdraw");
  if (pool == null) {
    return;
  }

  // Use safe subtraction helpers
  pool.totalSupplyAssets = safeSubtract(
    pool.totalSupplyAssets,
    event.params.amount,
    "totalSupplyAssets",
    pool.id
  );

  pool.totalSupplyShares = safeSubtract(
    pool.totalSupplyShares,
    event.params.shares,
    "totalSupplyShares",
    pool.id
  );

  // Use dynamic helper to update pool metrics
  updatePoolMetrics(pool);
  
  // Create or update APR entities for withdraw event
  createOrUpdateBorrowAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  createOrUpdateLendAPR(pool, event.block.number, event.block.timestamp, event.transaction.hash);
  
  pool.save();

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "Withdraw");

  log.info("Withdraw processed: Pool {} - Amount: {} - New Total Supply: {}", [
    pool.id,
    event.params.amount.toString(),
    pool.totalSupplyAssets.toString()
  ]);
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent): void {
  // Create unique withdraw collateral entity ID with transaction hash
  let entityId = `${event.params.id.toHexString()}-${event.params.tokenId.toString()}-${event.transaction.hash.toHexString()}`;
  let entity = new WithdrawCollateral(entityId);
  
  entity.tokenId = event.params.tokenId;
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.receiver = event.params.receiver;
  entity.poolId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Use dynamic helper functions to ensure entities exist
  let token = getOrCreateToken(event.params.id, event.params.tokenId);
  let account = getOrCreateAccount(event.params.onBehalfOf);
  let position = getOrCreatePosition(event.params.id, event.params.tokenId, event.params.onBehalfOf);

  // Update pool statistics
  updatePoolStatistics(event.params.id.toHexString(), "WithdrawCollateral");

  log.info("Withdraw collateral processed: Pool {} - Token ID: {} - Account: {} - Receiver: {}", [
    event.params.id.toHexString(),
    event.params.tokenId.toString(),
    event.params.onBehalfOf.toHexString(),
    event.params.receiver.toHexString()
  ]);
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}
