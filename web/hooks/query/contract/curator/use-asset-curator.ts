import { useReadContract } from "wagmi";

import { curatorABI } from "@/lib/abis/curator.abi";

export const useAssetCurator = ({
  curatorAddress,
  chainId,
}: {
  curatorAddress: HexAddress;
  chainId: ChainSupported;
}) => {
  const { data, isLoading } = useReadContract({
    abi: curatorABI,
    address: curatorAddress,
    functionName: "asset",
    args: [],
    chainId,
  });

  return {
    data,
    isLoading,
  };
};
