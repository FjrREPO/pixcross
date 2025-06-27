import { contractAddresses } from "@/lib/constants";
import { CoinMarketCapType } from "@/types/api/cmc.type";

const [
  ip1EthSpolia,
  ip2EthSpolia,
  ip3EthSpolia,
  ip4EthSpolia, //Cool Cats - COOL
  ip5EthSpolia, //CryptoPunks - PUNK
  ip6EthSpolia, //Doodles - DOODLE
  ip7EthSpolia, //Lazy Lions - LION
  ip8EthSpolia, //Lil Pudgys - LILPUDGYS
  ip9EthSpolia, //Mutant Ape Yacht Club - MAYC ]
  ip10EthSpolia, //Milady Maker - MILADY ]
  ip11EthSpolia, //Mocaverse - MOCA ]
  ip12EthSpolia, //Moonbirds - MOON ]
] = contractAddresses[11155111].ips;
const [
  ip1BaseSepolia,
  ip2BaseSepolia,
  ip3BaseSepolia,
  ip4BaseSepolia,
  ip5BaseSepolia,
  ip6BaseSepolia,
  ip7BaseSepolia,
  ip8BaseSepolia,
  ip9BaseSepolia,
  ip10BaseSepolia,
  ip11BaseSepolia,
  ip12BaseSepolia,
] = contractAddresses[84532].ips;
const [
  ip1ArbitrumSepolia,
  ip2ArbitrumSepolia,
  ip3ArbitrumSepolia,
  ip4ArbitrumSepolia,
  ip5ArbitrumSepolia,
  ip6ArbitrumSepolia,
  ip7ArbitrumSepolia,
  ip8ArbitrumSepolia,
  ip9ArbitrumSepolia,
  ip10ArbitrumSepolia,
  ip11ArbitrumSepolia,
  ip12ArbitrumSepolia,
] = contractAddresses[421614].ips;
const [
  ip1AvalancheFuji,
  ip2AvalancheFuji,
  ip3AvalancheFuji,
  ip4AvalancheFuji,
  ip5AvalancheFuji,
  ip6AvalancheFuji,
  ip7AvalancheFuji,
  ip8AvalancheFuji,
  ip9AvalancheFuji,
  ip10AvalancheFuji,
  ip11AvalancheFuji,
  ip12AvalancheFuji,
] = contractAddresses[43113].ips;
const usdcEthSpolia = contractAddresses[11155111].usdc;
const usdcBaseSepolia = contractAddresses[84532].usdc;
const usdcArbitrumSepolia = contractAddresses[421614].usdc;
const usdcAvalancheFuji = contractAddresses[43113].usdc;
const usdtEthSpolia = contractAddresses[11155111].usdt;
const usdtBaseSepolia = contractAddresses[84532].usdt;
const usdtArbitrumSepolia = contractAddresses[421614].usdt;
const usdtAvalancheFuji = contractAddresses[43113].usdt;
const idrxEthSpolia = contractAddresses[11155111].idrx;
const idrxBaseSepolia = contractAddresses[84532].idrx;
const idrxArbitrumSepolia = contractAddresses[421614].idrx;
const idrxAvalancheFuji = contractAddresses[43113].idrx;

export const dataCMC: CoinMarketCapType[] = [
  {
    id: 3408,
    name: "USDC",
    symbol: "USDC",
    category: "token",
    description:
      "USDC (USDC) is a cryptocurrency launched in 2025and operates on the Ethereum platform. USDC has a current supply of 61,176,582,421.5828785. The last known price of USDC is 0.99985343 USD and is up 0.01 over the last 24 hours. It is currently trading on 28416 active market(s) with $10,176,979,807.03 traded over the last 24 hours. More information can be found at https://bit.ly/3ZHzkIY.",
    slug: "usd-coin",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    subreddit: "",
    notice: "",
    tags: [
      "medium-of-exchange",
      "stablecoin",
      "asset-backed-stablecoin",
      "coinbase-ventures-portfolio",
      "usd-stablecoin",
      "ethereum-pow-ecosystem",
      "fiat-stablecoin",
      "tron20-ecosystem",
      "made-in-america",
      "world-liberty-financial-portfolio",
    ],
    "tag-names": [
      "Medium of Exchange",
      "Stablecoin",
      "Asset-Backed Stablecoin",
      "Coinbase Ventures Portfolio",
      "USD Stablecoin",
      "Ethereum PoW Ecosystem",
      "Fiat Stablecoin",
      "Tron20 Ecosystem",
      "Made in America",
      "World Liberty Financial Portfolio",
    ],
    "tag-groups": [
      "INDUSTRY",
      "CATEGORY",
      "CATEGORY",
      "CATEGORY",
      "CATEGORY",
      "PLATFORM",
      "CATEGORY",
      "PLATFORM",
      "CATEGORY",
      "CATEGORY",
    ],
    urls: {
      website: ["https://bit.ly/3ZHzkIY"],
      twitter: ["https://twitter.com/circle"],
      message_board: ["https://medium.com/centre-blog"],
      chat: ["https://prnt.sh/4ytwfcbg7o"],
      facebook: [],
      explorer: [
        "https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "https://app.nansen.ai/token-god-mode?chain=ethereum&tab=transactions&tokenAddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "https://explorer.solana.com/address/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "https://tronscan.org/#/token20/TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
      ],
      reddit: [],
      technical_doc: [
        "https://f.hubspotusercontent30.net/hubfs/9304636/PDF/centre-whitepaper.pdf",
      ],
      source_code: ["https://github.com/centrehq/centre-tokens"],
      announcement: [
        "https://blog.circle.com/2018/09/26/introducing-usd-coin/",
      ],
    },
    platform: {
      id: "1027",
      name: "Ethereum Sepolia",
      slug: "ethereum",
      symbol: "ETH",
      token_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    date_added: "2018-10-08T00:00:00.000Z",
    twitter_username: "circle",
    is_hidden: 0,
    date_launched: "2025-01-01T00:00:00.000Z",
    contract_address: [
      {
        contract_address: usdcEthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: usdcBaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: usdcArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: usdcAvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 60901219650.231,
    self_reported_tags: null,
    self_reported_market_cap: 60886438491.320915,
    infinite_supply: false,
  },
  {
    id: 825,
    name: "Tether USDt",
    symbol: "USDT",
    category: "token",
    description:
      "Tether USDt (USDT) is a cryptocurrency and operates on the Ethereum platform. Tether USDt has a current supply of 156,004,090,105.39133824 with 153,148,231,146.79190089 in circulation. The last known price of Tether USDt is 1.00039433 USD and is down -0.01 over the last 24 hours. It is currently trading on 131344 active market(s) with $67,188,349,094.47 traded over the last 24 hours. More information can be found at https://tether.to.",
    slug: "tether",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    subreddit: "",
    notice: "",
    tags: [
      "stablecoin",
      "asset-backed-stablecoin",
      "usd-stablecoin",
      "ethereum-pow-ecosystem",
      "fiat-stablecoin",
      "tron20-ecosystem",
      "rsk-rbtc-ecosystem",
      "world-liberty-financial-portfolio",
    ],
    "tag-names": [
      "Stablecoin",
      "Asset-Backed Stablecoin",
      "USD Stablecoin",
      "Ethereum PoW Ecosystem",
      "Fiat Stablecoin",
      "Tron20 Ecosystem",
      "RSK RBTC Ecosystem",
      "World Liberty Financial Portfolio",
    ],
    "tag-groups": [
      "CATEGORY",
      "CATEGORY",
      "CATEGORY",
      "PLATFORM",
      "CATEGORY",
      "PLATFORM",
      "PLATFORM",
      "CATEGORY",
    ],
    urls: {
      website: ["https://tether.to"],
      twitter: ["https://twitter.com/tether_to"],
      message_board: [],
      chat: ["https://t.me/OfficialTether"],
      facebook: [],
      explorer: [
        "https://solscan.io/token/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "https://app.nansen.ai/token-god-mode?chain=ethereum&tab=transactions&tokenAddress=0xdac17f958d2ee523a2206206994597c13d831ec7",
        "https://www.omniexplorer.info/asset/31",
        "https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7",
        "https://algoexplorer.io/asset/312769",
      ],
      reddit: [],
      technical_doc: [
        "https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf",
      ],
      source_code: [],
      announcement: ["https://tether.to/en/news"],
    },
    platform: {
      id: "1027",
      name: "Ethereum Sepolia",
      slug: "ethereum",
      symbol: "ETH",
      token_address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    date_added: "2015-02-25T00:00:00.000Z",
    twitter_username: "tether_to",
    is_hidden: 0,
    date_launched: null,
    contract_address: [
      {
        contract_address: usdtEthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: usdtBaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: usdtArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: usdtAvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: null,
    self_reported_tags: null,
    self_reported_market_cap: null,
    infinite_supply: true,
  },
  {
    id: 26732,
    name: "IDRX",
    symbol: "IDRX",
    category: "token",
    description:
      "IDRX (IDRX) is a cryptocurrency launched in 2023and operates on the Polygon platform. IDRX has a current supply of 12,399,583,754.27. The last known price of IDRX is 0.00006176 USD and is up 0.08 over the last 24 hours. It is currently trading on 15 active market(s) with $0.00 traded over the last 24 hours. More information can be found at https://idrx.co.",
    slug: "idrx",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/26732.png",
    subreddit: "",
    notice: "",
    tags: ["stablecoin", "binance-smart-chain"],
    "tag-names": [
      "Stablecoin",
      "[Deprecated] BNB Smart Chain -> BNB Chain Eco",
    ],
    "tag-groups": ["CATEGORY", "PLATFORM"],
    urls: {
      website: ["https://idrx.co"],
      twitter: ["https://twitter.com/nusa_finance"],
      message_board: [],
      chat: ["https://t.me/NusaFinanceIndonesia"],
      facebook: [],
      explorer: [
        "https://solscan.io/token/idrxTdNftk6tYedPv2M7tCFHBVCpk5rkiNRd8yUArhr",
        "https://app.nansen.ai/token-god-mode?chain=polygon&tab=transactions&tokenAddress=0x649a2DA7B28E0D54c13D5eFf95d3A660652742cC",
        "https://explorer.etherlink.com/token/0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
        "https://polygonscan.com/address/0x649a2DA7B28E0D54c13D5eFf95d3A660652742cC",
        "https://basescan.org/token/0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
      ],
      reddit: [],
      technical_doc: ["https://idrx.co/docs/Whitepaper%20IDRX.pdf"],
      source_code: [],
      announcement: [],
    },
    platform: {
      id: "28321",
      name: "POL (prev. MATIC)",
      slug: "polygon-ecosystem-token",
      symbol: "POL",
      token_address: "0x649a2DA7B28E0D54c13D5eFf95d3A660652742cC",
    },
    date_added: "2023-06-07T06:38:29.000Z",
    twitter_username: "nusa_finance",
    is_hidden: 0,
    date_launched: "2023-06-06T00:00:00.000Z",
    contract_address: [
      {
        contract_address: idrxEthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: idrxBaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: idrxArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: idrxAvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 2692623083,
    self_reported_tags: null,
    self_reported_market_cap: 166289.14284880544,
    infinite_supply: false,
  },
  {
    id: 36427,
    name: "Bored Ape Yacht Club",
    symbol: "BAYC",
    category: "token",
    description:
      "Bored Ape Yacht Club (BAYC) is a cryptocurrency launched in 2022 and operates on the Solana platform. BAYC has a current supply of 1,000,000,000 with 0 in circulation. The last known price of BAYC is 0.11800288 USD and is down -10.59 over the last 24 hours. It is currently trading on 4 active market(s) with $3,485,999.58 traded over the last 24 hours. More information can be found at https://bayc.io.",
    slug: "bayc",
    logo: "https://nft-cdn.alchemy.com/arb-sepolia/0d356bea21fed9e3ee280476e3e32c3a",
    subreddit: "",
    notice: "",
    tags: ["memes", "solana-ecosystem", "pump-fun-ecosystem"],
    "tag-names": ["Memes", "Solana Ecosystem", "Pump Fun Ecosystem"],
    "tag-groups": ["INDUSTRY", "PLATFORM", "CATEGORY"],
    urls: {
      website: ["https://bayc.io"],
      twitter: ["https://twitter.com/BAYCMiner"],
      message_board: [],
      chat: ["https://t.me/bayc_7537"],
      facebook: [],
      explorer: [
        "https://solscan.io/token/ArUyEVWGCzZMtAxcPmNH8nDFZ4kMjxrMbpsQf3NEpump",
        "https://app.nansen.ai/token-god-mode?chain=solana&tab=transactions&tokenAddress=ArUyEVWGCzZMtAxcPmNH8nDFZ4kMjxrMbpsQf3NEpump",
        "https://explorer.solana.com/address/ArUyEVWGCzZMtAxcPmNH8nDFZ4kMjxrMbpsQf3NEpump",
      ],
      reddit: [],
      technical_doc: [],
      source_code: [],
      announcement: [],
    },
    platform: {
      id: "5426",
      name: "Solana",
      slug: "solana",
      symbol: "SOL",
      token_address: "ArUyEVWGCzZMtAxcPmNH8nDFZ4kMjxrMbpsQf3NEpump",
    },
    date_added: "2025-05-06T10:11:17.000Z",
    twitter_username: "BAYCMiner",
    is_hidden: 0,
    date_launched: "2025-02-20T00:00:00.000Z",
    contract_address: [
      {
        contract_address: ip1EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip1BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip1ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip1AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 1000000000,
    self_reported_tags: null,
    self_reported_market_cap: 117973538.83555944,
    infinite_supply: false,
  },
  {
    id: 34466,
    name: "Pudgy Penguins",
    symbol: "PENGU",
    category: "token",
    description:
      "Pudgy Penguins (PENGU) is a cryptocurrency launched in 2024and operates on the Solana platform. Pudgy Penguins has a current supply of 88,888,888,888 with 62,860,396,090.04 in circulation. The last known price of Pudgy Penguins is 0.01108025 USD and is up 2.68 over the last 24 hours. It is currently trading on 337 active market(s) with $74,338,098.48 traded over the last 24 hours. More information can be found at https://www.pudgypenguins.com.",
    slug: "pudgy-penguins",
    logo: "https://nft-cdn.alchemy.com/arb-sepolia/c33482f8350453fe45fd20516b7216f6",
    subreddit: "",
    notice: "",
    tags: [
      "collectibles-nfts",
      "memes",
      "solana-ecosystem",
      "animal-memes",
      "ip-memes",
      "made-in-america",
      "binance-hodler-airdrops",
      "binance-ecosystem",
    ],
    "tag-names": [
      "Collectibles & NFTs",
      "Memes",
      "Solana Ecosystem",
      "Animal Memes",
      "IP Memes",
      "Made in America",
      "Binance HODLer Airdrops",
      "Binance Ecosystem",
    ],
    "tag-groups": [
      "CATEGORY",
      "INDUSTRY",
      "PLATFORM",
      "CATEGORY",
      "CATEGORY",
      "CATEGORY",
      "CATEGORY",
      "CATEGORY",
    ],
    urls: {
      website: ["https://www.pudgypenguins.com"],
      twitter: ["https://twitter.com/pudgypenguins"],
      message_board: ["https://www.tiktok.com/@pudgykindness"],
      chat: [
        "https://discord.gg/pudgypenguins",
        "https://instagram.com/pudgypenguins",
        "https://giphy.com/pudgypenguins/",
        "https://www.tiktok.com/@pudgypenguins",
      ],
      facebook: [],
      explorer: [
        "https://solscan.io/token/2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
        "https://app.nansen.ai/token-god-mode?chain=solana&tab=transactions&tokenAddress=2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
      ],
      reddit: [],
      technical_doc: [],
      source_code: [],
      announcement: [],
    },
    platform: {
      id: "5426",
      name: "Solana",
      slug: "solana",
      symbol: "SOL",
      token_address: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
    },
    date_added: "2024-12-17T14:00:00.000Z",
    twitter_username: "pudgypenguins",
    is_hidden: 0,
    date_launched: "2024-12-10T00:00:00.000Z",
    contract_address: [
      {
        contract_address: ip2EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip2BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip2ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip2AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 62860396090,
    self_reported_tags: null,
    self_reported_market_cap: 698136999.74119,
    infinite_supply: false,
  },
  {
    id: 7647,
    name: "Azuki",
    symbol: "AZUKI",
    category: "token",
    description:
      "Azuki (AZUKI) is a cryptocurrency and operates on the Ethereum platform. Azuki has a current supply of 11,310,690 with 11,284,984 in circulation. The last known price of Azuki is 0.00157526 USD and is up 3.43 over the last 24 hours. It is currently trading on 11 active market(s) with $53.06 traded over the last 24 hours. More information can be found at https://dokidoki.finance/.",
    slug: "azuki",
    logo: "https://nft-cdn.alchemy.com/arb-sepolia/9c6328c52c1cfea7639fabc10b908e48",
    date_added: "2020-11-11T00:00:00.000Z",
    date_launched: null,
    contract_address: [
      {
        contract_address: ip3EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip3BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip3ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip3AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
  },
  {
    id: 12345,
    name: "Cool Cats",
    symbol: "COOL",
    category: "token",
    description:
      "Cool Cats (COOL) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Cool Cats has a current supply of 10,000,000 with 0 in circulation. The last known price of Cool Cats is 0.00250000 USD and is down -5.00 over the last 24 hours. It is currently trading on 2 active market(s) with $1,250,000.00 traded over the last 24 hours. More information can be found at https://coolcats.com.",
    slug: "cool-cats",
    logo: "https://nft-cdn.alchemy.com/base-sepolia/560499cdffe49e171bb56cf3ac6f50c4",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    twitter_username: "coolcatsnft",
    is_hidden: 0,
    date_launched: null,
    contract_address: [
      {
        contract_address: ip4EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip4BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip4ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip4AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 10000000,
    self_reported_tags: null,
    self_reported_market_cap: 2500000,
    infinite_supply: false,
  },
  {
    id: 67890,
    name: "CryptoPunks",
    symbol: "PUNK",
    category: "token",
    description:
      "CryptoPunks (PUNK) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. CryptoPunks has a current supply of 10,000,000 with 0 in circulation. The last known price of CryptoPunks is 0.00500000 USD and is down -2.00 over the last 24 hours. It is currently trading on 3 active market(s) with $500,000.00 traded over the last 24 hours. More information can be found at https://cryptopunks.com.",
    slug: "cryptopunks",
    logo: "https://nft-cdn.alchemy.com/base-sepolia/0441e52bf13d46bf5901bc6fe58c09b5",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    twitter_username: "cryptopunksnft",
    is_hidden: 0,
    date_launched: null,
    contract_address: [
      {
        contract_address: ip5EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip5BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip5ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip5AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 10000000,
    self_reported_tags: null,
    self_reported_market_cap: 5000000,
    infinite_supply: false,
  },
  {
    id: 11223,
    name: "Doodles",
    symbol: "DOODLE",
    category: "token",
    description:
      "Doodles (DOODLE) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Doodles has a current supply of 10,000,000 with 0 in circulation. The last known price of Doodles is 0.00300000 USD and is down -3.00 over the last 24 hours. It is currently trading on 4 active market(s) with $300,000.00 traded over the last 24 hours. More information can be found at https://doodles.com.",
    slug: "doodles",
    logo: "https://nft-cdn.alchemy.com/base-sepolia/05c2682a8ec6b775d3e8309a9655ffde",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    twitter_username: "doodlesnft",
    is_hidden: 0,
    date_launched: null,
    contract_address: [
      {
        contract_address: ip6EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip6BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip6ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip6AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 10000000,
    self_reported_tags: null,
    self_reported_market_cap: 3000000,
    infinite_supply: false,
  },
  {
    id: 33445,
    name: "Lazy Lions",
    symbol: "LAZY",
    category: "token",
    description:
      "Lazy Lions (LAZY) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Lazy Lions has a current supply of 5,000,000 with 0 in circulation. The last known price of Lazy Lions is 0.00400000 USD and is down -4.00 over the last 24 hours. It is currently trading on 2 active market(s) with $200,000.00 traded over the last 24 hours. More information can be found at https://lazylions.com.",
    slug: "lazy-lions",
    logo: "https://nft-cdn.alchemy.com/arb-sepolia/e6edce6c7bd1cc4d2f6166a613f0d649",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    date_launched: null,
    contract_address: [
      {
        contract_address: ip7EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip7BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip7ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip7AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 5000000,
    self_reported_tags: null,
    self_reported_market_cap: 200000,
    infinite_supply: false,
  },
  {
    id: 44556,
    name: "Lil Pudgys",
    symbol: "LILPUDGY",
    category: "token",
    description:
      "Lil Pudgys (LILPUDGY) is a cryptocurrency launched in 2023 and operates on the Solana platform. Lil Pudgys has a current supply of 100,000,000 with 0 in circulation. The last known price of Lil Pudgys is 0.00100000 USD and is down -1.00 over the last 24 hours. It is currently trading on 1 active market(s) with $10,000.00 traded over the last 24 hours. More information can be found at https://lilpudgys.com.",
    slug: "lil-pudgys",
    logo: "https://nft-cdn.alchemy.com/arb-sepolia/6bc11593b8faf4133f9cb4c82e82fd17",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    date_launched: null,
    contract_address: [
      {
        contract_address: ip8EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip8BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip8ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip8AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 100000000,
    self_reported_tags: null,
    self_reported_market_cap: 100000,
    infinite_supply: false,
  },
  {
    id: 55667,
    name: "Mutant Ape Yacht Club",
    symbol: "MAYC",
    category: "token",
    description:
      "Mutant Ape Yacht Club (MAYC) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Mutant Ape Yacht Club has a current supply of 20,000,000 with 0 in circulation. The last known price of Mutant Ape Yacht Club is 0.00200000 USD and is down -2.50 over the last 24 hours. It is currently trading on 2 active market(s) with $50,000.00 traded over the last 24 hours. More information can be found at https://mayc.io.",
    slug: "mutant-ape-yacht-club",
    logo: "https://nft-cdn.alchemy.com/arb-sepolia/364e20a44d803e17cfd0214d5f4565a7",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    date_launched: null,
    contract_address: [
      {
        contract_address: ip9EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip9BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip9ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip9AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 20000000,
    self_reported_tags: null,
    self_reported_market_cap: 40000,
    infinite_supply: false,
  },
  {
    id: 66778,
    name: "Milady Maker",
    symbol: "MILADY",
    category: "token",
    description:
      "Milady Maker (MILADY) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Milady Maker has a current supply of 5,000,000 with 0 in circulation. The last known price of Milady Maker is 0.00550000 USD and is down -1.50 over the last 24 hours. It is currently trading on 1 active market(s) with $27,500.00 traded over the last 24 hours. More information can be found at https://miladymaker.com.",
    slug: "milady-maker",
    logo: "https://nft-cdn.alchemy.com/avax-fuji/32e38411eabfc42a6d7fc7e583e5cd43",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    date_launched: null,
    contract_address: [
      {
        contract_address: ip10EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip10BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip10ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip10AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 5000000,
    self_reported_tags: null,
    self_reported_market_cap: 27500,
    infinite_supply: false,
  },
  {
    id: 77889,
    name: "Mocaverse",
    symbol: "MOCA",
    category: "token",
    description:
      "Mocaverse (MOCA) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Mocaverse has a current supply of 1,000,000 with 0 in circulation. The last known price of Mocaverse is 0.01000000 USD and is down -2.00 over the last 24 hours. It is currently trading on 2 active market(s) with $20,000.00 traded over the last 24 hours. More information can be found at https://mocaverse.xyz.",
    slug: "mocaverse",
    logo: "https://nft-cdn.alchemy.com/avax-fuji/329cb711e0d5d0b2eb90c398ec486b30",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    date_launched: null,
    contract_address: [
      {
        contract_address: ip11EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip11BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip11ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip11AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 1000000,
    self_reported_tags: null,
    self_reported_market_cap: 20000,
    infinite_supply: false,
  },
  {
    id: 33445,
    name: "Moonbirds",
    symbol: "MOON",
    category: "token",
    description:
      "Moonbirds (MOON) is a cryptocurrency launched in 2023 and operates on the Ethereum platform. Moonbirds has a current supply of 10,000,000 with 0 in circulation. The last known price of Moonbirds is 0.00400000 USD and is down -4.00 over the last 24 hours. It is currently trading on 5 active market(s) with $400,000.00 traded over the last 24 hours. More information can be found at https://moonbirds.com.",
    slug: "moonbirds",
    logo: "https://nft-cdn.alchemy.com/avax-fuji/e64a2a47d518ef1ff2cc78fc6e1a4389",
    subreddit: "",
    notice: "",
    date_added: "2023-01-01T00:00:00.000Z",
    twitter_username: "moonbirds",
    is_hidden: 0,
    date_launched: null,
    contract_address: [
      {
        contract_address: ip12EthSpolia,
        platform: {
          name: "Ethereum Sepolia",
          coin: {
            id: "1027",
            name: "Ethereum Sepolia",
            symbol: "ETH",
            slug: "ethereum",
          },
        },
        chainId: 11155111,
      },
      {
        contract_address: ip12BaseSepolia,
        platform: {
          name: "Base Sepolia",
          coin: {
            id: "2570",
            name: "Base Sepolia",
            symbol: "BASE",
            slug: "base",
          },
        },
        chainId: 84532,
      },
      {
        contract_address: ip12ArbitrumSepolia,
        platform: {
          name: "Arbitrum Sepolia",
          coin: {
            id: "2570",
            name: "Arbitrum Sepolia",
            symbol: "ARB",
            slug: "arb",
          },
        },
        chainId: 421614,
      },
      {
        contract_address: ip12AvalancheFuji,
        platform: {
          name: "Avalanche Fuji",
          coin: {
            id: "43113",
            name: "Avalanche Fuji",
            symbol: "AVAX",
            slug: "avalanche-fuji",
          },
        },
        chainId: 43113,
      },
    ],
    self_reported_circulating_supply: 10000000,
    self_reported_tags: null,
    self_reported_market_cap: 4000000,
    infinite_supply: false,
  },
];
