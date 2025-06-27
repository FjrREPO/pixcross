import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { AccountType } from "@/types/graphql/account.type";
import { queryAccountsLendByAddress } from "@/graphql/accounts.query";

type QueryData = {
  account: AccountType[];
};

export const useLendByAddress = () => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<AccountType[]>({
    queryKey: ["lend-by-address", address],
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.all(
        validEntries.map((entry) =>
          request(
            entry.url,
            queryAccountsLendByAddress(address as string),
          ).then((res) => ({
            ...(res as QueryData),
            chainId: entry.chainId,
          })),
        ),
      );

      const allPositions = responses.flatMap((response) =>
        (response as QueryData).account.map((position) => ({
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
