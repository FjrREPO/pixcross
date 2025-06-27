import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { AuctionStartedType } from "@/types/graphql/auction-starteds.type";
import { queryAuctionStartedsByAddress } from "@/graphql/auction-starteds.query";

type QueryData = {
  auctionStarteds: AuctionStartedType[];
};

export const useAuctionStartedsByAddress = () => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<AuctionStartedType[]>({
    queryKey: ["auction-starteds-by-address", address],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(
            entry.url,
            queryAuctionStartedsByAddress(address as string),
          ).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allPositions = responses.flatMap((response) =>
        (response as QueryData).auctionStarteds.map((position) => ({
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
