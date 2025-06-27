import {
  Address,
  BigInt,
  Bytes,
  crypto,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

import {
  Accrued,
  Account,
  AuctionSettled,
  Balance,
  Bid,
  Borrow,
  BorrowAPR,
  Collateral,
  InterestRateModel,
  LendAPR,
  LoanToken,
  LTV,
  Pool,
  Position,
  Repay,
  Supply,
  SupplyCollateral,
  Token,
  Withdraw,
  WithdrawCollateral,
} from "../generated/schema";

export const BIGINT_18_DECIMAL = new BigInt(10).pow(18);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export class GetOrCreateResult<T> {
  entity: T | null;
  created: boolean;

  constructor(entity: T | null, created: boolean) {
    this.entity = entity;
    this.created = created;
  }
}

export function getOrCreatePool(id: string): Pool {
  let pool = Pool.load(id);

  if (pool == null) {
    pool = new Pool(id);
    pool.totalSupplyAssets = BigInt.fromI32(0);
    pool.totalBorrowAssets = BigInt.fromI32(0);
    pool.borrowRate = BigInt.fromI32(0);
    pool.utilizationRate = BigInt.fromI32(0);
    pool.lendingRate = BigInt.fromI32(0);

    return pool;
  }

  return pool;
}

export function getOrCreateInterestRateModel(id: string): InterestRateModel {
  let model = InterestRateModel.load(id);

  if (model == null) {
    model = new InterestRateModel(id);

    return model;
  }

  return model;
}

export function getOrCreateLTV(id: string): LTV {
  let ltv = LTV.load(id);

  if (ltv == null) {
    ltv = new LTV(id);

    return ltv;
  }

  return ltv;
}

/**
 * Updates pool metrics and rates based on current supply and borrow totals
 * @param pool Pool entity to update
 */
export function updatePoolMetrics(pool: Pool): void {
  // Calculate utilization rate as percentage (multiply by 100)
  if (pool.totalSupplyAssets.gt(BigInt.fromI32(0))) {
    pool.utilizationRate = pool.totalBorrowAssets
      .times(BigInt.fromI32(100))
      .div(pool.totalSupplyAssets);
  } else {
    pool.utilizationRate = BigInt.fromI32(0);
  }

  // Calculate lending rate based on borrow rate and utilization
  if (pool.utilizationRate.gt(BigInt.fromI32(0))) {
    pool.lendingRate = pool.borrowRate
      .times(pool.utilizationRate)
      .div(BigInt.fromI32(100));
  } else {
    pool.lendingRate = BigInt.fromI32(0);
  }

  // Update APY calculations
  pool.supplyAPY = pool.lendingRate;
}

/**
 * Validates that a pool exists before processing events
 * @param poolId Pool ID to validate
 * @param eventType Type of event being processed for logging
 * @returns Pool entity or null if not found
 */
export function validatePool(poolId: string, eventType: string): Pool | null {
  let pool = Pool.load(poolId);
  
  if (pool == null) {
    log.error("Pool {} not found for {} event", [poolId, eventType]);
    return null;
  }
  
  return pool;
}

/**
 * Safely subtracts an amount from a BigInt value, ensuring it doesn't go below zero
 * @param currentValue Current value
 * @param subtractAmount Amount to subtract
 * @param fieldName Name of the field for logging purposes
 * @param entityId Entity ID for logging purposes
 * @returns New value after subtraction
 */
export function safeSubtract(
  currentValue: BigInt, 
  subtractAmount: BigInt, 
  fieldName: string, 
  entityId: string
): BigInt {
  if (currentValue.ge(subtractAmount)) {
    return currentValue.minus(subtractAmount);
  } else {
    log.warning("{} amount {} exceeds current {} {} for entity {}", [
      fieldName,
      subtractAmount.toString(),
      fieldName.toLowerCase(),
      currentValue.toString(),
      entityId
    ]);
    return BigInt.fromI32(0);
  }
}

/**
 * Gets or creates a Collateral entity with dynamic updates
 * @param address Collateral token address
 * @returns Collateral entity
 */
export function getOrCreateCollateral(address: Address): Collateral {
  let collateral = Collateral.load(address.toHexString());
  
  if (collateral == null) {
    collateral = new Collateral(address.toHexString());
    collateral.collateralToken = address;
    collateral.save();
    
    log.info("New collateral token created: {}", [address.toHexString()]);
  }
  
  return collateral;
}

/**
 * Gets or creates a LoanToken entity with dynamic updates
 * @param address Loan token address
 * @returns LoanToken entity
 */
export function getOrCreateLoanToken(address: Address): LoanToken {
  let loanToken = LoanToken.load(address.toHexString());
  
  if (loanToken == null) {
    loanToken = new LoanToken(address.toHexString());
    loanToken.loanToken = address;
    loanToken.save();
    
    log.info("New loan token created: {}", [address.toHexString()]);
  }
  
  return loanToken;
}

/**
 * Gets or creates an Account entity with dynamic updates
 * @param address Account address
 * @returns Account entity
 */
export function getOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHexString());
  
  if (account == null) {
    account = new Account(address.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
    
    log.info("New account created: {}", [address.toHexString()]);
  }
  
  return account;
}

/**
 * Gets or creates a Position entity with dynamic updates
 * @param poolId Pool ID
 * @param tokenId Token ID
 * @param account Account address
 * @returns Position entity
 */
export function getOrCreatePosition(poolId: Bytes, tokenId: BigInt, account: Address): Position {
  let positionId = poolId.toHexString() + "-" + tokenId.toString();
  let position = Position.load(positionId);
  
  if (position == null) {
    // Create or get the token entity
    let token = getOrCreateToken(poolId, tokenId);
    
    // Create or get the account entity
    let accountEntity = getOrCreateAccount(account);
    
    position = new Position(positionId);
    position.account = accountEntity.id;
    position.pool = poolId.toHexString();
    position.tokenId = tokenId;
    position.token = token.id;
    position.borrowShares = BigInt.fromI32(0);
    position.bid = BigInt.fromI32(0);
    position.endTime = BigInt.fromI32(0);
    position.save();
    
    // Update account positions
    let positions = accountEntity.positions;
    positions.push(position.id);
    accountEntity.positions = positions;
    accountEntity.save();
    
    log.info("New position created: {} for account: {}", [positionId, account.toHexString()]);
  }
  
  return position;
}

/**
 * Gets or creates a Token entity with dynamic updates
 * @param poolId Pool ID
 * @param tokenId Token ID
 * @returns Token entity
 */
export function getOrCreateToken(poolId: Bytes, tokenId: BigInt): Token {
  let tokenEntityId = poolId.toHexString() + "-" + tokenId.toString();
  let token = Token.load(tokenEntityId);
  
  if (token == null) {
    token = new Token(tokenEntityId);
    token.tokenId = tokenId;
    token.pool = poolId.toHexString();
    token.save();
    
    log.info("New token created: {} for pool: {}", [tokenEntityId, poolId.toHexString()]);
  }
  
  return token;
}

/**
 * Gets or creates a Balance entity for curator-account relationship
 * @param curator Curator address
 * @param account Account address
 * @returns Balance entity
 */
export function getOrCreateBalance(curator: Address, account: Address): Balance {
  let balanceId = curator.toHexString() + "-" + account.toHexString();
  let balance = Balance.load(balanceId);
  
  if (balance == null) {
    // Create or get the account entity
    let accountEntity = getOrCreateAccount(account);
    
    balance = new Balance(balanceId);
    balance.curator = curator;
    balance.curatorEntity = curator.toHexString(); // Reference to the Curator object
    balance.account = accountEntity.id;
    balance.balance = BigInt.fromI32(0);
    balance.shares = BigInt.fromI32(0);
    balance.totalDeposited = BigInt.fromI32(0);
    balance.totalWithdrawn = BigInt.fromI32(0);
    balance.save();
    
    log.info("New balance created: {} for curator: {} and account: {}", [
      balanceId,
      curator.toHexString(),
      account.toHexString()
    ]);
  }
  
  return balance;
}

/**
 * Creates or updates BorrowAPR entity with latest rate
 * @param pool Pool entity
 * @param blockNumber Block number
 * @param blockTimestamp Block timestamp
 * @param transactionHash Transaction hash
 * @returns BorrowAPR entity
 */
export function createOrUpdateBorrowAPR(
  pool: Pool, 
  blockNumber: BigInt, 
  blockTimestamp: BigInt, 
  transactionHash: Bytes
): BorrowAPR {
  // Create unique ID for this APR update
  let aprId = `${pool.id}-borrow-${blockTimestamp.toString()}`;
  let borrowAPR = new BorrowAPR(aprId);
  
  borrowAPR.pool = pool.id;
  borrowAPR.apr = pool.borrowRate; // Use current borrow rate as APR
  borrowAPR.blockNumber = blockNumber;
  borrowAPR.blockTimestamp = blockTimestamp;
  borrowAPR.transactionHash = transactionHash;
  borrowAPR.save();
  
  // Update pool's current borrow APR reference
  pool.currentBorrowAPR = borrowAPR.id;
  
  log.info("Borrow APR updated for pool {}: {}", [
    pool.id,
    borrowAPR.apr.toString()
  ]);
  
  return borrowAPR;
}

/**
 * Creates or updates LendAPR entity with latest rate
 * @param pool Pool entity
 * @param blockNumber Block number
 * @param blockTimestamp Block timestamp
 * @param transactionHash Transaction hash
 * @returns LendAPR entity
 */
export function createOrUpdateLendAPR(
  pool: Pool, 
  blockNumber: BigInt, 
  blockTimestamp: BigInt, 
  transactionHash: Bytes
): LendAPR {
  // Create unique ID for this APR update
  let aprId = `${pool.id}-lend-${blockTimestamp.toString()}`;
  let lendAPR = new LendAPR(aprId);
  
  lendAPR.pool = pool.id;
  lendAPR.apr = pool.lendingRate; // Use current lending rate as APR
  lendAPR.blockNumber = blockNumber;
  lendAPR.blockTimestamp = blockTimestamp;
  lendAPR.transactionHash = transactionHash;
  lendAPR.save();
  
  // Update pool's current lend APR reference
  pool.currentLendAPR = lendAPR.id;
  
  log.info("Lend APR updated for pool {}: {}", [
    pool.id,
    lendAPR.apr.toString()
  ]);
  
  return lendAPR;
}

/**
 * Updates pool statistics after any transaction
 * @param poolId Pool ID
 * @param eventType Type of event for logging
 */
export function updatePoolStatistics(poolId: string, eventType: string): void {
  let pool = Pool.load(poolId);
  
  if (pool == null) {
    log.error("Cannot update statistics for non-existent pool: {}", [poolId]);
    return;
  }
  
  // Update pool metrics
  updatePoolMetrics(pool);
  pool.save();
  
  log.info("Pool {} statistics updated after {} event - Supply: {} - Borrow: {} - Utilization: {}%", [
    poolId,
    eventType,
    pool.totalSupplyAssets.toString(),
    pool.totalBorrowAssets.toString(),
    pool.utilizationRate.toString()
  ]);
}
