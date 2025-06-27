import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { contractAddresses } from "@/lib/constants";
import { NFTMetadataType } from "@/types/api/nft-metadata.type";

const listNFTETHSEPOLIA = contractAddresses[11155111].ips;
const listNFTBASESEPOLIA = contractAddresses[84532].ips;
const listNFTARBSEPOLIA = contractAddresses[421614].ips;
const listNFTAVAXFUJI = contractAddresses[43113].ips;

export const useNFTMetadataMultichainCollectPage = () => {
  const providerList = useMemo(() => {
    const list: { chainId: ChainSupported; contractAddress: string }[] = [];

    const chainMapping = {
      11155111: listNFTETHSEPOLIA.slice(0, 3),
      84532: listNFTBASESEPOLIA.slice(3, 6),
      421614: listNFTARBSEPOLIA.slice(6, 9),
      43113: listNFTAVAXFUJI.slice(9, 12),
    };

    for (const [chainIdStr, contractAddresses] of Object.entries(
      chainMapping,
    )) {
      const chainId = Number(chainIdStr);

      for (const contractAddress of contractAddresses) {
        list.push({ chainId: chainId as ChainSupported, contractAddress });
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
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    enabled: providerList.length > 0,
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
