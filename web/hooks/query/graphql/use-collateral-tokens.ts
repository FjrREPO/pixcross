import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { queryCollaterals } from "@/graphql/collaterals.query";
import { CollateralTokenType } from "@/types/graphql/collateral-token.type";

type QueryData = {
  collateralTokens: CollateralTokenType[];
};

export const useCollateralTokens = () => {
  const { data, isLoading } = useQuery<CollateralTokenType[]>({
    queryKey: ["collateral-tokens"],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(entry.url, queryCollaterals()).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allTokens = responses.flatMap((response) =>
        (response as QueryData).collateralTokens.map((token) => ({
          ...token,
          chainId: response.chainId,
        })),
      );

      return allTokens;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
