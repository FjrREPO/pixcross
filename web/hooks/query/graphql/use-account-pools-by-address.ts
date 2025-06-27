import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { PoolType } from "@/types/graphql/pool.type";
import { queryAccountsPoolsByAddress } from "@/graphql/accounts.query";

type QueryData = {
  account: {
    createdPools: PoolType[];
  };
};

export const useAccountPoolsByAddress = () => {
  const { address } = useAccount();

  const { data: res, isLoading } = useQuery<QueryData>({
    queryKey: ["account-pool-by-address", address],
    enabled: !!address,
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.allSettled(
        validEntries.map((entry) =>
          request(entry.url, queryAccountsPoolsByAddress(address!)).then(
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

      const allPools = successfulResponses.flatMap((response) =>
        response.account.createdPools.map((pool: PoolType) => ({
          ...pool,
          chainId: response.chainId,
        })),
      );

      return {
        account: {
          createdPools: allPools,
        },
      };
    },
    refetchInterval: 3600000,
    refetchOnWindowFocus: false,
  });

  const data = res?.account.createdPools || [];

  return { data, isLoading };
};
