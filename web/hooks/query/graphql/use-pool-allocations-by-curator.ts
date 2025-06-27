import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

import { urlsSubgraph } from "@/lib/constants";
import { PoolAllocation } from "@/types/graphql/pool-allocation.type";
import { queryPoolAllocations } from "@/graphql/pool-allocations.query";

type QueryData = {
  poolAllocations: PoolAllocation[];
};

export const usePoolAllocationsByCurator = ({
  curator,
  chainId,
}: {
  curator: HexAddress;
  chainId: ChainSupported;
}) => {
  const { address } = useAccount();

  const { data, isLoading } = useQuery<PoolAllocation[]>({
    queryKey: ["pool-allocation-by-curator", address, curator],
    queryFn: async () => {
      const entry = urlsSubgraph.find(
        (entry) =>
          entry.chainId === chainId &&
          typeof entry.url === "string" &&
          entry.url !== undefined,
      );

      if (!entry?.url) {
        throw new Error(`Subgraph URL not found for chain ID: ${chainId}`);
      }

      const query = queryPoolAllocations(curator);
      const response = await request<QueryData>(entry.url, query);

      return response.poolAllocations.map((allocation) => ({
        ...allocation,
        chainId: chainId,
      }));
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
};
