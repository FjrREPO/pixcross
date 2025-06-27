import { z } from "zod";

export const PoolSchema = z.object({
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  borrowAPY: z.string(),
  borrowRate: z.string(),
  collateralAddress: z.string(),
  collateralToken: z.object({
    collateralToken: z.string(),
    id: z.string(),
  }),
  id: z.string(),
  irm: z.string(),
  lendingRate: z.string(),
  loanAddress: z.string(),
  loanToken: z.object({
    id: z.string(),
    loanToken: z.string(),
  }),
  lth: z.string(),
  ltv: z.string(),
  oracle: z.string(),
  supplyAPY: z.string(),
  supplyAssets: z.array(
    z.object({
      amount: z.string(),
      id: z.string(),
      sender: z.string(),
      shares: z.string(),
      poolId: z.string(),
      onBehalfOf: z.string(),
      blockNumber: z.string(),
      blockTimestamp: z.string(),
      transactionHash: z.string(),
    }),
  ),
  totalBorrowAssets: z.string(),
  totalBorrowShares: z.string(),
  totalSupplyAssets: z.string(),
  totalSupplyShares: z.string(),
  transactionHash: z.string(),
  utilizationRate: z.string(),
  chainId: z.number().optional(),
});

export type PoolType = z.infer<typeof PoolSchema>;
