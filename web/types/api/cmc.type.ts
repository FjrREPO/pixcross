import z from "zod";

const ContractAddressMarketCap = z.object({
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

export const CoinMarketCapSchema = z.object({
  id: z.number(),
  name: z.string(),
  symbol: z.string(),
  category: z.string(),
  description: z.string(),
  slug: z.string().optional(),
  logo: z.string().url(),
  subreddit: z.string().optional(),
  notice: z.string().optional(),
  tags: z.array(z.string()).nullable().optional(),
  "tag-names": z.array(z.string()).nullable().optional(),
  "tag-groups": z.array(z.string()).nullable().optional(),
  urls: z
    .object({
      website: z.array(z.string().url()).optional(),
      twitter: z.array(z.string().url()).optional(),
      message_board: z.array(z.string().url()).optional(),
      chat: z.array(z.string().url()).optional(),
      facebook: z.array(z.string().url()).optional(),
      explorer: z.array(z.string().url()).optional(),
      reddit: z.array(z.string().url()).optional(),
      technical_doc: z.array(z.string().url()).optional(),
      source_code: z.array(z.string().url()).optional(),
      announcement: z.array(z.string().url()).optional(),
    })
    .optional(),
  platform: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      symbol: z.string(),
      token_address: z.string(),
    })
    .optional(),
  date_added: z.string(),
  twitter_username: z.string().optional(),
  is_hidden: z.number().optional(),
  date_launched: z.string().nullable(),
  contract_address: z.array(ContractAddressMarketCap),
  self_reported_circulating_supply: z.number().nullable().optional(),
  self_reported_tags: z.array(z.string()).nullable().optional(),
  self_reported_market_cap: z.number().nullable().optional(),
  infinite_supply: z.boolean().optional(),
});

export type CoinMarketCapType = z.infer<typeof CoinMarketCapSchema>;
