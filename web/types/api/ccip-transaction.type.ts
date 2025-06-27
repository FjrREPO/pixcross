import { z } from "zod";

const tokenAmountSchema = z.object({
  token: z.string(),
  amount: z.string(),
});

export const ccipTransactionSchema = z.object({
  messageId: z.string(),
  state: z.number(),
  transactionHash: z.string(),
  onrampAddress: z.string(),
  sender: z.string(),
  origin: z.string(),
  receiver: z.string(),
  blockTimestamp: z.string(),
  receiptTimestamp: z.string(),
  sourceNetworkName: z.string(),
  destNetworkName: z.string(),
  tokenAmounts: z.array(tokenAmountSchema),
  feeToken: z.string(),
  feeTokenAmount: z.string(),
  nonce: z.number(),
  strict: z.boolean(),
  data: z.string(),
  gasLimit: z.string(),
  sequenceNumber: z.number(),
  destTransactionHash: z.string(),
  offrampAddress: z.string(),
  commitStoreAddress: z.string(),
  infoRaw: z.string(),
});

export type CCIPTransactionType = z.infer<typeof ccipTransactionSchema>;
