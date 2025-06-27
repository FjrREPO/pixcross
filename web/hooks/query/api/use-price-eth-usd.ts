import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const PriceItemSchema = z.object({
  s: z.literal("CRYPTO:ETHUSD"),
  d: z.tuple([
    z.string(),
    z.string(),
    z.array(z.string()),
    z.string(),
    z.string(),
    z.string(),
    z.string().nullable(),
    z.string().nullable(),
    z.string().nullable(),
    z.any(),
    z.any(),
    z.any(),
    z.number(),
  ]),
});

const PriceResponseSchema = z.object({
  data: z.array(PriceItemSchema),
});

type PriceItem = z.infer<typeof PriceItemSchema>;

export const usePriceETHUSD = () => {
  const { data, isLoading, refetch } = useQuery<PriceItem | null>({
    queryKey: ["priceETHUSD"],
    queryFn: async () => {
      const res = await fetch("/api/token/price/eth-usd");

      if (!res.ok) throw new Error("Failed to fetch ETH price");

      const json = await res.json();

      const parsed = PriceResponseSchema.safeParse(json);

      if (!parsed.success) {
        throw new Error("Invalid ETH price response format");
      }

      const ethItem =
        parsed.data.data.find((item) => item.s === "CRYPTO:ETHUSD") ?? null;

      return ethItem;
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
