import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { LTVType } from "@/types/contract/ltv.type";
import { queryLTVs } from "@/graphql/ltvs.query";

type QueryData = {
  ltvs: LTVType[];
};

export const useLTVsByChainId = ({ chainId }: { chainId: ChainSupported }) => {
  const { data, isLoading } = useQuery<LTVType[]>({
    queryKey: ["ltvs", chainId],
    queryFn: async () => {
      const entry = urlsSubgraph.find(
        (entry) =>
          entry.chainId === chainId &&
          typeof entry.url === "string" &&
          entry.url !== undefined,
      );

      if (!entry?.url) {
        return [];
      }

      const res = await request(entry.url, queryLTVs());
      const responses = [
        {
          ...(res as QueryData),
          chainId: entry.chainId,
        },
      ];

      const allPools = responses.flatMap((response) =>
        (response as QueryData).ltvs.map((pool) => ({
          ...pool,
          chainId: response.chainId,
        })),
      );

      return allPools;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
