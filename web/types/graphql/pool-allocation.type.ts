import { z } from "zod";

export const PoolAllocationSchema = z.object({
  allocation: z.string(),
  poolId: z.string(),
  curator: z.object({
    id: z.string(),
  }),
  pool: z.object({
    collateralAddress: z.string(),
    loanAddress: z.string(),
  }),
  chainId: z.number().optional(),
});

export type PoolAllocation = z.infer<typeof PoolAllocationSchema>;
