import { z } from "zod";

export const balanceSchema = z.object({
  id: z.string(),
  shares: z.string(),
  totalDeposited: z.string(),
  totalWithdrawn: z.string(),
  balance: z.string(),
  curator: z.string(),
  account: z.object({
    id: z.string(),
  }),
  chainId: z.number().optional(),
});

export type BalanceType = z.infer<typeof balanceSchema>;
