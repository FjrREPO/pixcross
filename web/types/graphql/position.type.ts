import { z } from "zod";

import { PoolSchema } from "./pool.type";

export const PositionSchema = z.object({
  bidder: z.string(),
  borrowShares: z.string(),
  id: z.string(),
  tokenId: z.string(),
  endTime: z.string(),
  pool: PoolSchema,
  chainId: z.number().optional(),
});

export type PositionType = z.infer<typeof PositionSchema>;
