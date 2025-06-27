import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { queryCurators } from "@/graphql/curators.query";
import { CuratorType } from "@/types/graphql/curator.type";

type QueryData = {
  curators: CuratorType[];
};

export const useEarns = () => {
  const { data, isLoading } = useQuery<CuratorType[]>({
    queryKey: ["earns"],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(entry.url, queryCurators()).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allCurators = responses.flatMap((response) =>
        (response as QueryData).curators.map((curator) => ({
          ...curator,
          chainId: response.chainId,
        })),
      );

      return allCurators;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
