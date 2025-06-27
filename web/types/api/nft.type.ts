import { z } from "zod";

const OpenSeaMetadataSchema = z.object({
  floorPrice: z.number(),
  collectionName: z.string(),
  collectionSlug: z.string(),
  safelistRequestStatus: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  externalUrl: z.null(),
  twitterUsername: z.null(),
  discordUrl: z.null(),
  bannerImageUrl: z.null(),
  lastIngestedAt: z.string(),
});

const ImageSchema = z.object({
  cachedUrl: z.string(),
  thumbnailUrl: z.string(),
  pngUrl: z.string(),
  contentType: z.string(),
  size: z.number(),
  originalUrl: z.string(),
});

const RawMetadataSchema = z.object({
  tokenUri: z.string(),
  metadata: z.object({
    image: z.string(),
    external_url: z.string(),
    is_normalized: z.boolean(),
    image_url: z.string(),
    name: z.string(),
    description: z.string(),
    attributes: z.array(
      z.object({
        value: z.union([z.string(), z.boolean(), z.number()]),
        trait_type: z.string(),
        display_type: z.optional(z.string()),
      }),
    ),
    version: z.number(),
    url: z.string(),
  }),
  error: z.null(),
});

const CollectionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  externalUrl: z.null(),
  bannerImageUrl: z.null(),
});

const MintSchema = z.object({
  mintAddress: z.null(),
  blockNumber: z.null(),
  timestamp: z.null(),
  transactionHash: z.null(),
});

const ContractSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  totalSupply: z.null(),
  tokenType: z.string(),
  contractDeployer: z.string(),
  deployedBlockNumber: z.number(),
  openSeaMetadata: OpenSeaMetadataSchema,
  isSpam: z.null(),
  spamClassifications: z.array(z.string()),
});

export const NFTSchema = z.object({
  contract: ContractSchema,
  tokenId: z.string(),
  tokenType: z.string(),
  name: z.string(),
  description: z.string(),
  tokenUri: z.string(),
  image: ImageSchema,
  raw: RawMetadataSchema,
  collection: CollectionSchema,
  mint: MintSchema,
  owners: z.null(),
  timeLastUpdated: z.string(),
  balance: z.string(),
  acquiredAt: z.object({
    blockTimestamp: z.null(),
    blockNumber: z.null(),
  }),
  chainId: z.number().optional(),
});

export type NFTSchemaType = z.infer<typeof NFTSchema>;
