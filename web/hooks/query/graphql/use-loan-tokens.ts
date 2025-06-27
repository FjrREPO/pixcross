import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { LoanTokenType } from "@/types/graphql/loan-token.type";
import { queryLoanTokens } from "@/graphql/loan-tokens.query";

type QueryData = {
  loanTokens: LoanTokenType[];
};

export const useLoanTokens = () => {
  const { data, isLoading, error } = useQuery<LoanTokenType[]>({
    queryKey: ["loan-tokens"],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(entry.url, queryLoanTokens()).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allTokens = responses.flatMap((response) =>
        (response as QueryData).loanTokens.map((token) => ({
          ...token,
          chainId: response.chainId,
        })),
      );

      return allTokens;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error };
};
