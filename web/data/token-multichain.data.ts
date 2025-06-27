import { contractAddresses } from "@/lib/constants";
import { CoinMarketCapType } from "@/types/api/cmc.type";

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

export const tokenMultichainData: CoinMarketCapType[] = [
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
];
