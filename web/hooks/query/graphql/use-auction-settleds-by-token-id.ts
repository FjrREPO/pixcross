import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { AuctionSettledsType } from "@/types/graphql/auction-settleds.type";
import { queryAuctionSettledsByTokenId } from "@/graphql/auction-settleds.query";

type QueryData = {
  auctionSettleds: AuctionSettledsType[];
};

export const useAuctionSettledsByTokenId = ({
  tokenId,
}: {
  tokenId: number;
}) => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<AuctionSettledsType[]>({
    queryKey: ["auction-settleds-by-token-id", tokenId, address],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(
            entry.url,
            queryAuctionSettledsByTokenId(tokenId as number),
          ).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allPositions = responses.flatMap((response) =>
        (response as QueryData).auctionSettleds.map((position) => ({
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
