import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { queryAccountsCuratorsByAddress } from "@/graphql/accounts.query";
import { CuratorType } from "@/types/graphql/curator.type";

type QueryData = {
  account: {
    createdCurators: CuratorType[];
  };
};

export const useAccountCuratorsByAddress = () => {
  const { address } = useAccount();

  const { data: res, isLoading } = useQuery<QueryData>({
    queryKey: ["account-curator-by-address", address],
    enabled: !!address,
    queryFn: async () => {
      const validEntries = urlsSubgraph.filter(
        (entry): entry is { url: string; chainId: number } =>
          typeof entry.url === "string" && entry.url !== undefined,
      );

      const responses = await Promise.allSettled(
        validEntries.map((entry) =>
          request(entry.url, queryAccountsCuratorsByAddress(address!)).then(
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

      const allCurators = successfulResponses.flatMap((response) =>
        response.account.createdCurators.map((curator: CuratorType) => ({
          ...curator,
          chainId: response.chainId,
        })),
      );

      return {
        account: {
          createdCurators: allCurators,
        },
      };
    },
    refetchInterval: 3600000,
    refetchOnWindowFocus: false,
  });

  const data = res?.account.createdCurators || [];

  return { data, isLoading };
};
