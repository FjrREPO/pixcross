import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { BidType } from "@/types/graphql/auction-bid.type";
import { queryAuctionBidsByPoolIdAndTokenId } from "@/graphql/bids.query";

type QueryData = {
  bids: BidType[];
};

export const useAuctionBidsByPoolIdAndTokenId = ({
  poolId,
  tokenId,
}: {
  poolId: string;
  tokenId: number;
}) => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<BidType[]>({
    queryKey: ["bids-by-pool-id-and-token-id", poolId, tokenId, address],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(
            entry.url,
            queryAuctionBidsByPoolIdAndTokenId(
              poolId as string,
              tokenId as number,
            ),
          ).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allPositions = responses.flatMap((response) =>
        (response as QueryData).bids.map((position) => ({
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
