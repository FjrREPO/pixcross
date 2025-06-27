import { z } from "zod";

export const auctionStartedSchema = z.object({
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  debtAmount: z.string(),
  endTime: z.string(),
  id: z.string(),
  internal_id: z.string(),
  owner: z.string(),
  startTime: z.string(),
  tokenId: z.string(),
  transactionHash: z.string(),
  collateralToken: z.string(),
  loanToken: z.string(),
  chainId: z.number().optional(),
});

export type AuctionStartedType = z.infer<typeof auctionStartedSchema>;
