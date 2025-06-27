import z from "zod";

export const createCuratorSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name is required")
      .max(10, "Name must be less than 10 characters"),
    symbol: z
      .string()
      .min(2, "Symbol is required")
      .max(8, "Symbol must be less than 8 characters")
      .toUpperCase(),
    asset: z.string().min(1, "Asset selection is required"),
    assetChainId: z.number({
      required_error: "Asset chain ID is required",
      invalid_type_error: "Asset chain ID must be a number",
    }),
    pools: z
      .array(
        z.object({
          id: z.string(),
          poolId: z.string(),
          allocation: z.number().min(0).max(100),
        }),
      )
      .min(1, "At least one pool must be selected"),
  })
  .refine(
    (data) => {
      const totalAllocation = data.pools.reduce(
        (sum, pool) => sum + pool.allocation,
        0,
      );

      return Math.abs(totalAllocation - 100) < 0.01;
    },
    {
      message: "Total allocation must equal 100%",
      path: ["pools"],
    },
  );

export type CreateCuratorType = z.infer<typeof createCuratorSchema>;
