import { useQuery } from "@tanstack/react-query";

import { NFTMetadataType } from "@/types/api/nft-metadata.type";

export const useNFTMetadataByAddress = ({
  contractAddress,
  chainId,
}: {
  contractAddress: string;
  chainId: ChainSupported;
}) => {
  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery<NFTMetadataType>({
    queryKey: ["CURRENT-NFT-METADATA-MULTICHAIN", contractAddress, chainId],
    queryFn: async () => {
      const url = `/api/nft/metadata?contractAddress=${contractAddress}&chainId=${chainId}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch NFT metadata");
      }

      const json: NFTMetadataType = await res.json();

      return {
        ...json,
        chainId,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  const data: NFTMetadataType | undefined = result;

  return { data, isLoading, refetch };
};
