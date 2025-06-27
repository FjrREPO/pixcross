import { z } from "zod";

export const auctionSettledsSchema = z.object({
  transactionHash: z.string(),
  tokenId: z.string(),
  poolId: z.string(),
  loanToken: z.string(),
  id: z.string(),
  excess: z.string(),
  debtAmount: z.string(),
  collateralToken: z.string(),
  blockTimestamp: z.string(),
  blockNumber: z.string(),
  bidder: z.string(),
  bidAmount: z.string(),
  chainId: z.number().optional(),
});

export type AuctionSettledsType = z.infer<typeof auctionSettledsSchema>;
