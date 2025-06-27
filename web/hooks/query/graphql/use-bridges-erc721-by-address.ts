import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { BridgeERC721Type } from "@/types/graphql/bridge-erc721.type";
import { queryBridgesERC721ByAddress } from "@/graphql/bridges-erc721.query";

type QueryData = {
  erc721BridgeTransactions: BridgeERC721Type[];
};

export const useBridgesERC721ByAddress = () => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<BridgeERC721Type[]>({
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

      const allPositions = responses.flatMap((response) =>
        (response as QueryData).erc721BridgeTransactions.map((position) => ({
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
