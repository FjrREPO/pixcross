import { normalize } from "./bignumber";

const DEFAULT_DECIMAL = 1e18;
const RATE_DECIMAL_PLACES = 18;
const PERCENTAGE_MULTIPLIER = 100;

export const calculateMaxBorrowAmount = (
  priceOracle: number,
  ltv: number,
  decimal: number,
): number => {
  // Consistent validation pattern
  if (!priceOracle || !ltv || !decimal || priceOracle <= 0 || ltv <= 0) {
    return 0;
  }

  const maxBorrowAmount = normalize(ltv * priceOracle, decimal);

  return Number(maxBorrowAmount);
};

export const calculateReserveSize = (
  totalSupplyAssets?: number,
  decimal: number = DEFAULT_DECIMAL,
): string => {
  // Consistent validation pattern
  if (!totalSupplyAssets || totalSupplyAssets < 0 || !decimal || decimal <= 0) {
    return "0.00";
  }

  const reserveSize = String(totalSupplyAssets / decimal);

  return reserveSize;
};

export const calculateAvailableLiquidity = (
  totalSupplyAssets?: number,
  totalBorrowAssets?: number,
  decimal: number = DEFAULT_DECIMAL,
): string => {
  // Consistent validation pattern
  if (!decimal || decimal <= 0) {
    return "0.00";
  }

  const supply = totalSupplyAssets ?? 0;
  const borrow = totalBorrowAssets ?? 0;

  // Ensure non-negative result
  const liquidity = Math.max(0, supply - borrow);

  return (liquidity / decimal).toFixed(2);
};

export const calculateBorrowAPR = (borrowRate?: number): string => {
  // Consistent validation pattern
  if (!borrowRate || borrowRate < 0) {
    return "0.00";
  }

  // Convert rate to percentage: rate / 10^18 * 100
  const aprPercentage =
    (borrowRate / Math.pow(10, RATE_DECIMAL_PLACES)) * PERCENTAGE_MULTIPLIER;

  return aprPercentage.toFixed(2);
};

export const calculateLendAPR = ({
  borrowRate,
  totalBorrowAssets,
  totalSupplyAssets,
}: {
  // Optional parameters to allow flexible usage
  borrowRate?: number; // In base units (e.g., 1e18 for 100%)
  totalBorrowAssets?: number; // Total borrowed assets in base units
  totalSupplyAssets?: number; // Total supplied assets in base units
}): string => {
  // Consistent validation pattern
  if (
    !borrowRate ||
    !totalBorrowAssets ||
    !totalSupplyAssets ||
    borrowRate < 0 ||
    totalBorrowAssets < 0 ||
    totalSupplyAssets <= 0
  ) {
    return "0.00";
  }

  // Calculate utilization rate
  const utilizationRate = totalBorrowAssets / totalSupplyAssets;

  // Lend APR = Borrow APR * Utilization Rate
  const borrowAPR =
    (borrowRate / Math.pow(10, RATE_DECIMAL_PLACES)) * PERCENTAGE_MULTIPLIER;
  const lendAPR = borrowAPR * utilizationRate;

  return lendAPR.toFixed(2);
};

export const calculateUtilizationRate = (
  totalBorrowAssets?: number,
  totalSupplyAssets?: number,
): string => {
  // Consistent validation pattern
  if (
    !totalBorrowAssets ||
    !totalSupplyAssets ||
    totalBorrowAssets < 0 ||
    totalSupplyAssets <= 0
  ) {
    return "0.00";
  }

  // Calculate utilization rate as percentage
  const utilizationRate =
    (totalBorrowAssets / totalSupplyAssets) * PERCENTAGE_MULTIPLIER;

  // Cap at 100% for safety
  const cappedRate = Math.min(PERCENTAGE_MULTIPLIER, utilizationRate);

  return cappedRate.toFixed(2);
};

export const normalizeAllocation = ({
  allocation,
  decimals = 16,
}: {
  allocation: number;
  decimals?: number;
}): string => {
  // Consistent validation pattern
  if (allocation < 0 || !decimals || decimals <= 0) {
    return "0.00";
  }

  // Normalize allocation to specified decimal places
  const normalizedAllocation = normalize(allocation, decimals);

  return normalizedAllocation;
};
