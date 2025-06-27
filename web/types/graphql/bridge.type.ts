import { z } from "zod";

export const BridgeTransactionSchema = z.object({
  amount: z.string(),
  blockNumber: z.number(),
  bridgedAt: z.string().datetime().or(z.string().nullable()),
  createdAt: z.string().datetime(),
  destinationChain: z.string(),
  fee: z.string(),
  id: z.string(),
  messageId: z.string().optional().nullable(),
  receivedAt: z.string().datetime().nullable(),
  receiver: z.string(),
  sender: z.string(),
  sourceChain: z.string(),
  status: z.string(),
  token: z.string(),
  transactionHash: z.string(),
  updatedAt: z.string().datetime(),
});

export type BridgeTransactionType = z.infer<typeof BridgeTransactionSchema>;
