import { z } from "zod";

import { PoolSchema } from "./pool.type";

export const CuratorSchema = z.object({
  allocations: z.array(z.string()),
  asset: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  curator: z.string(),
  currentLendAPR: z.string(),
  feePercentage: z.string(),
  feeRecipient: z.string(),
  id: z.string(),
  name: z.string(),
  paused: z.boolean(),
  symbol: z.string(),
  totalShares: z.string(),
  totalAssets: z.string(),
  transactionHash: z.string(),
  lendAPRHistory: z.array(
    z.object({
      apr: z.string(),
      blockNumber: z.string(),
      blockTimestamp: z.string(),
      totalAllocated: z.string(),
    }),
  ),
  pools: z.array(PoolSchema),
  chainId: z.number().optional(),
});

export const LendAPRHistorySchema = z.object({
  apr: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  totalAllocated: z.string(),
});

export type CuratorType = z.infer<typeof CuratorSchema>;
export type CuratorLendAPRType = z.infer<typeof LendAPRHistorySchema>;
