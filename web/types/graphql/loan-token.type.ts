import { z } from "zod";

export const LoanTokenSchema = z.object({
  id: z.string(),
  loanToken: z.string(),
  chainId: z.number().optional(),
});

export type LoanTokenType = z.infer<typeof LoanTokenSchema>;
