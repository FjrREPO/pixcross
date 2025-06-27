import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

import { urlsSubgraph } from "@/lib/constants";
import { queryCuratorById } from "@/graphql/curators.query";
import { CuratorType } from "@/types/graphql/curator.type";

type QueryData = {
  curator: CuratorType;
};

export const useEarnById = ({
  id,
  chainId,
}: {
  id: string;
  chainId: ChainSupported;
}) => {
  const url = urlsSubgraph.find((entry) => entry.chainId === chainId)?.url;

  const { data: curatorData, isLoading } = useQuery<QueryData>({
    queryKey: ["earn", id, chainId],
    queryFn: async () => {
      if (!url) {
        throw new Error("Subgraph URL not found for the specified chainId");
      }

      const res: QueryData = await request(url, queryCuratorById(id));

      if (res.curator.pools) {
        res.curator.pools = res.curator.pools.map((pool) => ({
          ...pool,
          chainId: chainId,
        }));
      }

      res.curator.chainId = chainId;

      return res;
    },
    refetchInterval: 600000,
    refetchOnWindowFocus: false,
  });

  const data: CuratorType | undefined = curatorData?.curator;

  return { data, isLoading };
};
