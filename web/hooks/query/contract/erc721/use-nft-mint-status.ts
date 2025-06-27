import { useAccount, useReadContract } from "wagmi";

import { IPAbi } from "@/lib/abis/ip.abi";

export const useNFTMintStatus = ({
  address,
  chainId,
}: {
  address: HexAddress;
  chainId: ChainSupported;
}) => {
  const { address: userAddress } = useAccount();

  const {
    data: res,
    isLoading,
    refetch,
  } = useReadContract({
    address,
    abi: IPAbi,
    functionName: "balanceOf",
    args: [userAddress as HexAddress],
    chainId,
    query: {
      enabled: !!userAddress && !!address,
    },
  });

  const data = res ? Number(res as bigint) : 0;

  return { data, isLoading, refetch };
};
