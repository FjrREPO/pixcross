import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { CCIPTransactionType } from "@/types/api/ccip-transaction.type";

export const useCCIPTransactionsByAddress = () => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useQuery<CCIPTransactionType[]>({
    queryKey: ["ccip-transactions"],
    queryFn: async () => {
      const res = await fetch(
        `/api/ccip/transactions?sender=${address?.toLowerCase()}`,
      );

      if (!res.ok) throw new Error("Failed to fetch CCIP transactions");

      return await res.json();
    },
    refetchInterval: 30000,
    staleTime: 10000,
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        error.message.includes("UnsupportedToken")
      ) {
        return false;
      }

      return failureCount < 3;
    },
  });

  return { data, isLoading, refetch };
};
