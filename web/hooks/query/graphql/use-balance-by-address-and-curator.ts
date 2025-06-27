import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { BalanceType } from "@/types/graphql/balance.type";
import { queryBalanceByAddressAndCurator } from "@/graphql/balances.query";

type QueryData = {
  balance: BalanceType;
};

export const useBalanceByAddressAndCurator = ({
  curator,
  chainId,
}: {
  curator: HexAddress;
  chainId: ChainSupported;
}) => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<BalanceType>({
    queryKey: ["balance-by-curator", address, curator],
    queryFn: async () => {
      const findSubgraphUrl = urlsSubgraph.find(
        (entry) => entry.chainId === chainId,
      );

      if (!findSubgraphUrl?.url) {
        throw new Error("Subgraph URL not found for the specified chainId");
      }

      const res: QueryData = await request(
        findSubgraphUrl.url,
        queryBalanceByAddressAndCurator({
          address: address as HexAddress,
          curator: curator as HexAddress,
        }),
      );

      const balance = res.balance;

      if (balance) {
        balance.chainId = chainId;
      }

      return balance;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
