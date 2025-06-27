import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { contractAddresses } from "@/lib/constants";
import { NFTSchemaType } from "@/types/api/nft.type";

interface QueryData {
  ownedNfts: NFTSchemaType[];
}

export const useNFTMultichain = () => {
  const chainIds = useMemo(
    () => Object.keys(contractAddresses).map(Number),
    [],
  );

  const interestProvidersMap = useMemo(() => {
    return chainIds.map((chainId) => ({
      chainId,
      interestProviders:
        contractAddresses[chainId as keyof typeof contractAddresses].ips,
      pixcross:
        contractAddresses[chainId as keyof typeof contractAddresses].pixcross,
    }));
  }, [chainIds]);

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["NFT-MULTICHAIN"],
    queryFn: async () => {
      const allNfts = await Promise.all(
        interestProvidersMap.map(
          async ({ chainId, interestProviders, pixcross }) => {
            const contractAddressParam = interestProviders.join(",");

            const res = await fetch(
              `/api/nft?ownerAddress=${pixcross}&contractAddress=${contractAddressParam}&chainId=${chainId}`,
            );

            if (!res.ok)
              throw new Error(`Failed to fetch NFTs for chain ${chainId}`);

            const json: QueryData = await res.json();

            return json.ownedNfts;
          },
        ),
      );

      return allNfts.flat();
    },
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const data: NFTSchemaType[] = result || [];

  return { data, isLoading, refetch };
};
