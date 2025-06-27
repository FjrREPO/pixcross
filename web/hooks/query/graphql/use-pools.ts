import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { queryPools } from "@/graphql/pools.query";
import { PoolType } from "@/types/graphql/pool.type";
import { urlsSubgraph } from "@/lib/constants";

type QueryData = {
  pools: PoolType[];
};

export const usePools = () => {
  const { data, isLoading } = useQuery<PoolType[]>({
    queryKey: ["pools"],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(entry.url, queryPools()).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allPools = responses.flatMap((response) =>
        (response as QueryData).pools.map((pool) => ({
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
