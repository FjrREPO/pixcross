import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { BridgeERC721Type } from "@/types/graphql/bridge-erc721.type";
import { queryBridgesERC721ByAddress } from "@/graphql/bridges-erc721.query";

type QueryData = {
  erc721BridgeTransactions: BridgeERC721Type[];
};

type EnhancedBridgeTransaction = BridgeERC721Type & {
  chainId: number;
  bridgeId?: string;
  relatedTransaction?: EnhancedBridgeTransaction;
  bridgeDirection?: "source" | "target";
  isComplete?: boolean;
};

export type BridgeGroup = {
  id: string;
  sourceTransaction: EnhancedBridgeTransaction;
  targetTransaction?: EnhancedBridgeTransaction;
  status: "INITIATED" | "COMPLETED" | "FAILED";
  tokenId: string;
  user: string;
  sourceChain: number;
  targetChain?: number;
  createdAt: string;
  completedAt?: string;
  tokenAddress: string;
};

export const useBridgesERC721ByAddress = () => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<{
    transactions: EnhancedBridgeTransaction[];
    bridgeGroups: BridgeGroup[];
  }>({
    queryKey: ["bridges-erc721-by-address", address],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(
            entry.url,
            queryBridgesERC721ByAddress(address as string),
          ).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allTransactions: EnhancedBridgeTransaction[] = responses.flatMap(
        (response) =>
          (response as QueryData).erc721BridgeTransactions.map(
            (transaction) => ({
              ...transaction,
              chainId: response.chainId,
            }),
          ),
      );

      const { enhancedTransactions, bridgeGroups } =
        processBridgeTransactions(allTransactions);

      return {
        transactions: enhancedTransactions,
        bridgeGroups: bridgeGroups,
      };
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.transactions || [],
    bridgeGroups: data?.bridgeGroups || [],
    isLoading,
  };
};

function processBridgeTransactions(transactions: EnhancedBridgeTransaction[]): {
  enhancedTransactions: EnhancedBridgeTransaction[];
  bridgeGroups: BridgeGroup[];
} {
  const transactionsByHash = new Map<string, EnhancedBridgeTransaction>();
  const transactionsByTxHash = new Map<string, EnhancedBridgeTransaction>();

  transactions.forEach((tx) => {
    if (tx.transactionHash) {
      transactionsByHash.set(tx.transactionHash, tx);
    }
    if (tx.txHash) {
      transactionsByTxHash.set(tx.txHash, tx);
    }
  });

  const bridgeGroups: BridgeGroup[] = [];
  const processedTransactions = new Set<string>();
  const enhancedTransactions: EnhancedBridgeTransaction[] = [];

  transactions.forEach((tx) => {
    if (processedTransactions.has(tx.id)) return;

    let sourceTransaction: EnhancedBridgeTransaction;
    let targetTransaction: EnhancedBridgeTransaction | undefined;

    if (tx.status === "INITIATED" && tx.lockedAt && !tx.mintedAt) {
      sourceTransaction = {
        ...tx,
        bridgeDirection: "source",
        bridgeId: tx.transactionHash || tx.id,
      };

      if (tx.transactionHash) {
        const relatedTx = transactionsByTxHash.get(tx.transactionHash);

        if (relatedTx && isValidBridgePair(tx, relatedTx)) {
          targetTransaction = {
            ...relatedTx,
            bridgeDirection: "target",
            bridgeId: tx.transactionHash,
            relatedTransaction: sourceTransaction,
          };
          sourceTransaction.relatedTransaction = targetTransaction;
          processedTransactions.add(relatedTx.id);
        }
      }
    } else if (
      tx.status === "COMPLETED" &&
      tx.mintedAt &&
      !tx.lockedAt &&
      tx.txHash
    ) {
      const sourceTx = transactionsByHash.get(tx.txHash);

      if (sourceTx && !processedTransactions.has(sourceTx.id)) {
        sourceTransaction = {
          ...sourceTx,
          bridgeDirection: "source",
          bridgeId: tx.txHash,
        };
        targetTransaction = {
          ...tx,
          bridgeDirection: "target",
          bridgeId: tx.txHash,
          relatedTransaction: sourceTransaction,
        };
        sourceTransaction.relatedTransaction = targetTransaction;
        processedTransactions.add(sourceTx.id);
      } else {
        sourceTransaction = {
          ...tx,
          bridgeDirection: "target",
          bridgeId: tx.txHash || tx.id,
        };
      }
    } else {
      sourceTransaction = {
        ...tx,
        bridgeDirection: tx.lockedAt ? "source" : "target",
        bridgeId: tx.transactionHash || tx.txHash || tx.id,
      };
    }

    processedTransactions.add(tx.id);

    enhancedTransactions.push(sourceTransaction);
    if (targetTransaction) {
      enhancedTransactions.push(targetTransaction);
    }

    const bridgeGroup: BridgeGroup = {
      id: sourceTransaction.bridgeId!,
      sourceTransaction,
      targetTransaction,
      status: targetTransaction
        ? "COMPLETED"
        : sourceTransaction.status === "INITIATED"
          ? "INITIATED"
          : "FAILED",
      tokenId: sourceTransaction.tokenId,
      user: sourceTransaction.user,
      sourceChain:
        sourceTransaction.bridgeDirection === "source"
          ? sourceTransaction.chainId
          : sourceTransaction.sourceChainId
            ? parseInt(sourceTransaction.sourceChainId)
            : sourceTransaction.chainId,
      targetChain:
        targetTransaction?.chainId ||
        (sourceTransaction.targetChainId
          ? parseInt(sourceTransaction.targetChainId)
          : undefined),
      createdAt: sourceTransaction.createdAt,
      completedAt: targetTransaction?.createdAt,
      tokenAddress: sourceTransaction.token || "",
    };

    bridgeGroups.push(bridgeGroup);
  });

  return { enhancedTransactions, bridgeGroups };
}

function isValidBridgePair(
  tx1: EnhancedBridgeTransaction,
  tx2: EnhancedBridgeTransaction,
): boolean {
  return (
    tx1.tokenId === tx2.tokenId &&
    tx1.user.toLowerCase() === tx2.user.toLowerCase() &&
    tx1.chainId !== tx2.chainId &&
    Math.abs(parseInt(tx1.createdAt) - parseInt(tx2.createdAt)) < 3600 &&
    ((tx1.status === "INITIATED" && tx2.status === "COMPLETED") ||
      (tx1.status === "COMPLETED" && tx2.status === "INITIATED"))
  );
}
