import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { LTVType } from "@/types/contract/ltv.type";
import { queryLTVs } from "@/graphql/ltvs.query";

type QueryData = {
  ltvs: LTVType[];
};

export const useLTVs = () => {
  const { data, isLoading } = useQuery<LTVType[]>({
    queryKey: ["ltvs"],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(entry.url, queryLTVs()).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

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
