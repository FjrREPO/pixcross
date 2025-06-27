import { z } from "zod";

import { PoolSchema } from "./pool.type";
import { CuratorSchema } from "./curator.type";

export const AccountEarnSchema = z.object({
  balance: z.string(),
  curator: z.string(),
  curatorEntity: CuratorSchema,
  id: z.string(),
  shares: z.string(),
  totalDeposited: z.string(),
  totalWithdrawn: z.string(),
  chainId: z.number().optional(),
});

export const AccountLendSchema = z.object({
  amount: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  id: z.string(),
  onBehalfOf: z.string(),
  poolId: z.string(),
  sender: z.string(),
  shares: z.string(),
  transactionHash: z.string(),
  pool: PoolSchema,
  chainId: z.number().optional(),
});

export const AccountSchema = z.object({
  id: z.string(),
  createdPools: z.array(PoolSchema),
  earn: z.array(AccountEarnSchema),
  lend: z.array(AccountLendSchema),
  chainId: z.number().optional(),
});

export type AccountType = z.infer<typeof AccountSchema>;
export type AccountEarnType = z.infer<typeof AccountEarnSchema>;
