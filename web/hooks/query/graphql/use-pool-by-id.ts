import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { PoolType } from "@/types/graphql/pool.type";
import { queryPoolById } from "@/graphql/pools.query";

type QueryData = {
  pool: PoolType;
};

export const usePoolById = ({
  id,
  chainId,
}: {
  id: string;
  chainId: ChainSupported;
}) => {
  const url = urlsSubgraph.find((entry) => entry.chainId === chainId)?.url;

  const { data: curatorData, isLoading } = useQuery<QueryData>({
    queryKey: ["pool", id, chainId],
    queryFn: async () => {
      if (!url) {
        throw new Error("Subgraph URL not found for the specified chainId");
      }

      const res: QueryData = await request(url, queryPoolById(id));

      if (res.pool) {
        res.pool = {
          ...res.pool,
          chainId: chainId,
        };
      }

      return res;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  const data: PoolType | undefined = curatorData?.pool;

  return { data, isLoading };
};
