import { z } from "zod";

export const CollateralTokenSchema = z.object({
  id: z.string(),
  collateralToken: z.string(),
  chainId: z.number().optional(),
});

export type CollateralTokenType = z.infer<typeof CollateralTokenSchema>;
