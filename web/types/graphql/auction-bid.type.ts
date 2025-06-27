import { z } from "zod";

export const bidSchema = z.object({
  amount: z.string(),
  bidder: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  collateralToken: z.string(),
  id: z.string(),
  loanToken: z.string(),
  poolId: z.string(),
  previousBid: z.string(),
  previousBidder: z.string(),
  tokenId: z.string(),
  transactionHash: z.string(),
  chainId: z.number().optional(),
});

export type BidType = z.infer<typeof bidSchema>;
