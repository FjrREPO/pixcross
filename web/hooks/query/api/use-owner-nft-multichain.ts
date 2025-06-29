import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { contractAddresses } from "@/lib/constants";
import { NFTSchemaType } from "@/types/api/nft.type";

interface QueryData {
  ownedNfts: NFTSchemaType[];
}

export const useOwnerNFTMultichain = () => {
  const { address } = useAccount();

  const chainIds = Object.keys(contractAddresses).map(Number);

  const {
    data: allNfts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ownedNfts-b=multichain", address],
    enabled: !!address,
    queryFn: async () => {
      const allResults = await Promise.all(
        chainIds.map(async (chainId) => {
          try {
            const contracts =
              contractAddresses[chainId as keyof typeof contractAddresses].ips;
            const contractParam = contracts.join(",");

            const res = await fetch(
              `/api/nft?ownerAddress=${address}&contractAddress=${contractParam}&chainId=${chainId}`,
            );

            if (!res.ok) {
              return [];
            }

            const json: QueryData = await res.json();

            const enrichedNfts = json.ownedNfts.map((nft) => ({
              ...nft,
              chainId,
            }));

            return enrichedNfts;
          } catch {
            return [];
          }
        }),
      );

      return allResults.flat();
    },
    refetchInterval: 30 * 60 * 1000,
  });

  const data: NFTSchemaType[] = allNfts || [];

  return { data, isLoading, refetch };
};
