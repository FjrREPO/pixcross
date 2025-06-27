import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { contractAddresses } from "@/lib/constants";
import { NFTMetadataType } from "@/types/api/nft-metadata.type";

export const useNFTMetadataMultichain = () => {
  const providerList = useMemo(() => {
    const list: { chainId: ChainSupported; contractAddress: string }[] = [];

    for (const [chainIdStr, entry] of Object.entries(contractAddresses)) {
      const chainId = Number(chainIdStr);

      if (entry?.ips && Array.isArray(entry.ips)) {
        for (const contractAddress of entry.ips) {
          list.push({ chainId: chainId as ChainSupported, contractAddress });
        }
      }
    }

    return list;
  }, []);

  const {
    data: result,
    isLoading,
    error,
    isError,
    refetch,
  } = useQuery<NFTMetadataType[]>({
    queryKey: ["NFT-METADATA-MULTICHAIN"],
    queryFn: async () => {
      const allNfts = await Promise.all(
        providerList.map(async ({ chainId, contractAddress }) => {
          try {
            const url = `/api/nft/metadata?contractAddress=${contractAddress}&chainId=${chainId}`;
            const res = await fetch(url);

            if (!res.ok) {
              return [];
            }

            const json = await res.json();

            const normalized = Array.isArray(json) ? json : [json];

            const typedJson: NFTMetadataType[] = normalized;

            return typedJson.map((nft) => ({ ...nft, chainId }));
          } catch {
            return [];
          }
        }),
      );

      return allNfts.flat();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    enabled: providerList.length > 0, // Only run query if we have providers
  });

  const data: NFTMetadataType[] = result ?? [];

  return {
    data,
    isLoading,
    error,
    isError,
    isEmpty: data.length === 0 && !isLoading,
    refetch,
  };
};
