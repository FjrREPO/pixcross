import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { queryAccountsEarnByAddress } from "@/graphql/accounts.query";
import { AccountEarnType } from "@/types/graphql/account.type";

type QueryData = {
  account: {
    earn: AccountEarnType[];
  };
};

export const useAccountEarnsByAddress = () => {
  const { address } = useAccount();

  const { data: res, isLoading } = useQuery<QueryData>({
    queryKey: ["account-earn-by-address", address],
    enabled: !!address,
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.allSettled(
        validEntries.map((entry) =>
          request(entry.url, queryAccountsEarnByAddress(address!)).then(
            (res) => ({
              ...(res as QueryData),
              chainId: entry.chainId,
            }),
          ),
        ),
      );

      const successfulResponses = responses
        .filter(
          (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled",
        )
        .map((r) => r.value);

      interface SuccessfulResponse {
        account: {
          earn: AccountEarnType[];
        };
        chainId: number;
      }

      interface PoolWithChainId extends AccountEarnType {
        chainId: number;
      }

      const allPools: PoolWithChainId[] = successfulResponses.flatMap(
        (response: SuccessfulResponse) =>
          response.account.earn.map((pool: AccountEarnType) => ({
            ...pool,
            chainId: response.chainId,
          })),
      );

      return {
        account: {
          earn: allPools,
        },
      };
    },
    refetchInterval: 3600000,
    refetchOnWindowFocus: false,
  });

  const data = res?.account.earn || [];

  return { data, isLoading };
};
