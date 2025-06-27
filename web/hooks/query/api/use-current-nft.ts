import { useQuery } from "@tanstack/react-query";

import { contractAddresses } from "@/lib/constants";
import { NFTMetadataType } from "@/types/api/nft-metadata.type";

export const useCurrentNFT = () => {
  const chainId: ChainSupported = 84532;
  const contractAddress = contractAddresses[chainId]?.ips?.[5];

  const fetchNFTMetadata = async (): Promise<NFTMetadataType> => {
    if (!contractAddress) {
      throw new Error("Contract address is undefined for Azuki NFT");
    }

    const url = `/api/nft/metadata?contractAddress=${contractAddress}&chainId=${chainId}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch NFT metadata");
    }

    const json = await res.json();

    return {
      ...json,
      chainId,
    };
  };

  const { data, isLoading, error, isError, refetch } =
    useQuery<NFTMetadataType>({
      queryKey: ["AZUKI-METADATA-MULTICHAIN", chainId],
      queryFn: fetchNFTMetadata,
      staleTime: 5 * 60 * 1000,
      refetchInterval: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
      enabled: !!contractAddress,
    });

  return { data, isLoading, error, isError, refetch };
};
