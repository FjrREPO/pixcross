import { z } from "zod";

export const BridgeERC721RequestSchema = z.object({
  bridgeFee: z.string(),
  bridgeType: z.string(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  crossChainTxHash: z.string().nullable(),
  currentChainId: z.string(),
  destinationBlockNumber: z.string().nullable(),
  destinationChainId: z.string(),
  destinationTransactionHash: z.string().nullable(),
  direction: z.string(),
  expiresAt: z.string().nullable(),
  id: z.string(),
  initiatedAt: z.string(),
  lastUpdatedAt: z.string(),
  processedAt: z.string().nullable(),
  requestNonce: z.string(),
  sourceBlockNumber: z.string(),
  sourceChainId: z.string(),
  sourceTransactionHash: z.string(),
  status: z.string(),
  targetAddress: z.string(),
  token: z.string(),
  tokenId: z.string(),
  user: z.string(),
});

export const BridgeERC721Schema = z.object({
  blockNumber: z.string(),
  burnedAt: z.string().nullable(),
  createdAt: z.string(),
  id: z.string(),
  lockedAt: z.string().nullable(),
  mintedAt: z.string().nullable(),
  sourceChainId: z.string(),
  status: z.enum(["INITIATED", "COMPLETED"]),
  targetAddress: z.string(),
  targetChainId: z.string(),
  token: z.string(),
  tokenId: z.string(),
  transactionHash: z.string(),
  txHash: z.string(),
  unlockedAt: z.string().nullable(),
  updatedAt: z.string(),
  user: z.string(),
  bridgeRequest: BridgeERC721RequestSchema,
  chainId: z.number().optional(),
});

export type BridgeERC721RequestType = z.infer<typeof BridgeERC721RequestSchema>;
export type BridgeERC721Type = z.infer<typeof BridgeERC721Schema>;
