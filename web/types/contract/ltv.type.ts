import z from "zod";

export const ltvSchema = z.object({
  blockNumber: z.number(),
  blockTimestamp: z.number(),
  id: z.string(),
  ltv: z.number(),
  transactionHash: z.string(),
  chainId: z.number().optional(),
});

export type LTVType = z.infer<typeof ltvSchema>;
