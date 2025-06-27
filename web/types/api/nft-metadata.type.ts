import { z } from "zod";

const contractAddress = z.object({
  contract_address: z.string(),
  platform: z.object({
    name: z.string(),
    coin: z.object({
      id: z.string(),
      name: z.string(),
      symbol: z.string(),
      slug: z.string(),
    }),
  }),
  chainId: z.number().optional(),
});

export const NFTMetadataSchema = z.object({
  contract_address: z.array(contractAddress).optional(),
  contract: z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    totalSupply: z.nullable(z.any()),
    tokenType: z.string(),
    contractDeployer: z.string().nullable(),
    deployedBlockNumber: z.number().nullable(),
    openSeaMetadata: z.object({
      floorPrice: z.nullable(z.any()),
      collectionName: z.nullable(z.string()),
      collectionSlug: z.nullable(z.string()),
      safelistRequestStatus: z.nullable(z.string()),
      imageUrl: z.nullable(z.string()),
      description: z.nullable(z.string()),
      externalUrl: z.nullable(z.string()),
      twitterUsername: z.nullable(z.string()),
      discordUrl: z.nullable(z.string()),
      bannerImageUrl: z.nullable(z.string()),
      lastIngestedAt: z.nullable(z.string()),
    }),
    isSpam: z.nullable(z.boolean()),
    spamClassifications: z.array(z.any()),
  }),
  tokenId: z.string(),
  tokenType: z.string(),
  name: z.string(),
  description: z.string(),
  tokenUri: z.string(),
  image: z.object({
    cachedUrl: z.string(),
    thumbnailUrl: z.string().nullable(),
    pngUrl: z.string().nullable(),
    contentType: z.string().nullable(),
    size: z.number().nullable(),
    originalUrl: z.string().nullable(),
  }),
  animation: z.object({
    cachedUrl: z.nullable(z.string()),
    contentType: z.nullable(z.string()),
    size: z.nullable(z.number()),
    originalUrl: z.nullable(z.string()),
  }),
  raw: z.object({
    tokenUri: z.string(),
    metadata: z.object({
      name: z.string(),
      description: z.string(),
      image: z.string(),
      attributes: z.array(
        z.object({
          value: z.string(),
          trait_type: z.string(),
        }),
      ),
    }),
    error: z.nullable(z.any()),
  }),
  collection: z.nullable(z.any()),
  mint: z.object({
    mintAddress: z.string().nullable(),
    blockNumber: z.number().nullable(),
    timestamp: z.string().nullable(),
    transactionHash: z.string().nullable(),
  }),
  owners: z.nullable(z.any()),
  timeLastUpdated: z.string(),
  chainId: z.number().optional(),
});

export type NFTMetadataType = z.infer<typeof NFTMetadataSchema>;
