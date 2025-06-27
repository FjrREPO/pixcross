import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { BridgeTransactionType } from "@/types/graphql/bridge.type";
import { queryBridgesByAddress } from "@/graphql/bridges.query";

type QueryData = {
  bridgeTransactions: BridgeTransactionType[];
};

export const useBridgesByAddress = () => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<BridgeTransactionType[]>({
    queryKey: ["bridges-by-address", address],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(entry.url, queryBridgesByAddress(address as string)).then(
            (res) => ({
              ...(res as QueryData),
              chainId: entry.chainId,
            }),
          ),
        ),
      );

      const allPositions = responses.flatMap((response) =>
        (response as QueryData).bridgeTransactions.map((position) => ({
          ...position,
          chainId: response.chainId,
        })),
      );

      return allPositions;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
