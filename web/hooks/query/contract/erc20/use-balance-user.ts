import { useAccount, useBalance } from "wagmi";

import { normalize } from "@/lib/helper/bignumber";

export const useBalanceUser = ({
  token,
  chainId,
  decimals = 18,
}: {
  token: HexAddress;
  chainId: ChainSupported;
  decimals?: number;
}) => {
  const { address } = useAccount();

  const {
    data: result,
    isLoading: bLoading,
    error: bError,
    refetch: bRefetch,
  } = useBalance({
    address: address,
    chainId: chainId,
    token: token as HexAddress,
    query: {
      enabled: !!address && !!token,
      refetchInterval: 5000,
    },
  });

  const bNormal = result?.value;
  const bNormalized = result?.value
    ? Number(normalize(result.value.toString(), decimals))
    : 0;

  return {
    bNormal,
    bNormalized,
    bLoading,
    bError,
    bRefetch,
  };
};
