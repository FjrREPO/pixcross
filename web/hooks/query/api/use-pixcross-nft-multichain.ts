import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { contractAddresses } from "@/lib/constants";
import { NFTSchemaType } from "@/types/api/nft.type";

interface QueryData {
  ownedNfts: NFTSchemaType[];
}

export const usePixcrossNFTMultichain = () => {
  const { address } = useAccount();
  const chainIds = Object.keys(contractAddresses).map(Number);

  const {
    data: allNfts,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["pixcrossNfts-multichain", address],
    enabled: !!address,
    queryFn: async () => {
      const allResults = await Promise.all(
        chainIds.map(async (chainId) => {
          const contracts = contractAddresses[chainId as ChainSupported]?.ips;
          const pixcrossAddress =
            contractAddresses[chainId as ChainSupported]?.pixcross;

          if (!contracts || contracts.length === 0) return [];

          const contractParam = contracts.join(",");

          const res = await fetch(
            `/api/nft?ownerAddress=${pixcrossAddress}&contractAddress=${contractParam}&chainId=${chainId}`,
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

  return { data, isLoading, refetch, error };
};
