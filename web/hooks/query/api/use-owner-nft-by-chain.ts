import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { contractAddresses } from "@/lib/constants";
import { NFTSchemaType } from "@/types/api/nft.type";

interface QueryData {
  ownedNfts: NFTSchemaType[];
}

export const useOwnerNFTByChain = ({ chainId }: { chainId: number }) => {
  const { address } = useAccount();

  const chainIds = [chainId];

  const {
    data: allNfts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ownedNfts", address, chainId],
    enabled: !!address,
    queryFn: async () => {
      const allResults = await Promise.all(
        chainIds.map(async (chainId) => {
          const contracts =
            contractAddresses[chainId as keyof typeof contractAddresses].ips;
          const contractParam = contracts.join(",");

          const res = await fetch(
            `/api/nft?ownerAddress=${address}&contractAddress=${contractParam}&chainId=${chainId}`,
          );

          if (!res.ok)
            throw new Error(`Failed to fetch NFTs from chain ${chainId}`);

          const json: QueryData = await res.json();

          const enrichedNfts = json.ownedNfts.map((nft) => ({
            ...nft,
            chainId,
          }));

          return enrichedNfts;
        }),
      );

      return allResults.flat();
    },
    refetchInterval: 10 * 60 * 1000,
  });

  const data: NFTSchemaType[] = allNfts || [];

  return { data, isLoading, refetch };
};
