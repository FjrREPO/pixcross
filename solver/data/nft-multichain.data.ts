import { contractAddresses } from "../lib/constants";

const [
  ip1EthSpolia, // Bored Ape Yacht Club - BAYC
  ip2EthSpolia, // Pudgy Penguins - PUDGY
  ip3EthSpolia, // Azuki Inu - AZUKI
  ip4EthSpolia, // Cool Cats - COOL
  ip5EthSpolia, // CryptoPunks - PUNK
  ip6EthSpolia, // Doodles - DOODLE
  ip7EthSpolia, // Lazy Lions - LION
  ip8EthSpolia, // Lil Pudgys - LILPUDGYS
  ip9EthSpolia, // Mutant Ape Yacht Club - MAYC
  ip10EthSpolia, // Milady Maker - MILADY
  ip11EthSpolia, // Mocaverse - MOCA
  ip12EthSpolia, // Moonbirds - MOON
] = contractAddresses[11155111].ips;
const [
  ip1BaseSepolia,
  ip2BaseSepolia, // Pudgy Penguins - PUDGY
  ip3BaseSepolia, // Azuki Inu - AZUKI
  ip4BaseSepolia, // Cool Cats - COOL
  ip5BaseSepolia, // CryptoPunks - PUNK
  ip6BaseSepolia, // Doodles - DOODLE
  ip7BaseSepolia, // Lazy Lions - LION
  ip8BaseSepolia, // Lil Pudgys - LILPUDGYS
  ip9BaseSepolia, // Mutant Ape Yacht Club - MAYC
  ip10BaseSepolia, // Milady Maker - MILADY
  ip11BaseSepolia, // Mocaverse - MOCA
  ip12BaseSepolia, // Moonbirds - MOON
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

export const nftMultichainData = [
  {
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
    contract: {
      address: "0x52795AF6FFAe8f528F8CC9eb6f84279a7f2D09E7",
      name: "Milady Maker",
      symbol: "MILADY",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: null,
      deployedBlockNumber: null,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Milady Maker",
    description:
      "Milady Maker is a collection of 10,000 unique anime-style NFTs, each with its own story and background.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmT7pRxWZSChTfrjgN8JqUS4BiAmhSppQZpCDXsSArdPuz",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/avax-fuji/32e38411eabfc42a6d7fc7e583e5cd43",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/avax-fuji/32e38411eabfc42a6d7fc7e583e5cd43",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/avax-fuji/32e38411eabfc42a6d7fc7e583e5cd43",
      contentType: "image/jpeg",
      size: 178164,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreiazofyabscezh3bqn5oshtq5dhdmxe7gol5iidiexyf3yxsi55tie",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmT7pRxWZSChTfrjgN8JqUS4BiAmhSppQZpCDXsSArdPuz",
      metadata: {
        name: "Milady Maker",
        description:
          "Milady Maker is a collection of 10,000 unique anime-style NFTs, each with its own story and background.",
        image:
          "ipfs://bafkreiazofyabscezh3bqn5oshtq5dhdmxe7gol5iidiexyf3yxsi55tie",
        attributes: [
          {
            value: "Milady Maker",
            trait_type: "Name",
          },
          {
            value:
              "Milady Maker is a collection of 10,000 unique anime-style NFTs, each with its own story and background.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 41478554,
      timestamp: "2025-06-08T06:59:43Z",
      transactionHash:
        "0xc3a0353cf1c344c383a2d96ccab6994bdf16878fb2327a40ff5bf422e99037e0",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:59:51.349Z",
    chainId: 43113,
  },
  {
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
    contract: {
      address: "0x11422Be71f90F3e45FA4F1D414a167C77B6d2B7E",
      name: "Mocaverse",
      symbol: "MOCA",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: null,
      deployedBlockNumber: null,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Mocaverse",
    description:
      "Mocaverse is a collection of 8,888 unique NFTs, each representing a different character in the Mocaverse universe.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmZi8mDT17oKSKwYivGF2ddiNJC9Ckk4nXzQ7Gx4bntipC",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/avax-fuji/329cb711e0d5d0b2eb90c398ec486b30",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/avax-fuji/329cb711e0d5d0b2eb90c398ec486b30",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/avax-fuji/329cb711e0d5d0b2eb90c398ec486b30",
      contentType: "image/png",
      size: 367347,
      originalUrl:
        "https://ipfs.io/ipfs/bafybeibyp2onminbxrva6lf35olobbgireh6uhd3abq3ujffdxctt4ae2m",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmZi8mDT17oKSKwYivGF2ddiNJC9Ckk4nXzQ7Gx4bntipC",
      metadata: {
        name: "Mocaverse",
        description:
          "Mocaverse is a collection of 8,888 unique NFTs, each representing a different character in the Mocaverse universe.",
        image:
          "ipfs://bafybeibyp2onminbxrva6lf35olobbgireh6uhd3abq3ujffdxctt4ae2m",
        attributes: [
          {
            value: "Mocaverse",
            trait_type: "Name",
          },
          {
            value:
              "Mocaverse is a collection of 8,888 unique NFTs, each representing a different character in the Mocaverse universe.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 41478543,
      timestamp: "2025-06-08T06:59:21Z",
      transactionHash:
        "0x5c96735cc5574bad61f44767a74003d9df480cd58b58b28122ec25e5de80954f",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:59:27.728Z",
    chainId: 43113,
  },
  {
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
    contract: {
      address: "0xD0fCf7f41cbbe4fB7AF31B5193eaDEB52f07D191",
      name: "Moonbirds",
      symbol: "MOON",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: null,
      deployedBlockNumber: null,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Moonbirds",
    description:
      "Moonbirds is a collection of 10,000 unique owl NFTs, each with its own distinct traits and characteristics.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/Qmcu2LpzU36EsMfCqsn5wmHr3j7JHX3HeryashC3VAGfkE",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/avax-fuji/e64a2a47d518ef1ff2cc78fc6e1a4389",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/avax-fuji/e64a2a47d518ef1ff2cc78fc6e1a4389",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/avax-fuji/e64a2a47d518ef1ff2cc78fc6e1a4389",
      contentType: "image/jpeg",
      size: 28425,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreidt2z7exmmf4lfchtkxcqhs2yv2rhivr77twbs5voko4ksv7rxydy",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://Qmcu2LpzU36EsMfCqsn5wmHr3j7JHX3HeryashC3VAGfkE",
      metadata: {
        name: "Moonbirds",
        description:
          "Moonbirds is a collection of 10,000 unique owl NFTs, each with its own distinct traits and characteristics.",
        image:
          "ipfs://bafkreidt2z7exmmf4lfchtkxcqhs2yv2rhivr77twbs5voko4ksv7rxydy",
        attributes: [
          {
            value: "Moonbirds",
            trait_type: "Name",
          },
          {
            value:
              "Moonbirds is a collection of 10,000 unique owl NFTs, each with its own distinct traits and characteristics.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 41478534,
      timestamp: "2025-06-08T06:59:02Z",
      transactionHash:
        "0x442a0d0bd382df020e36e542c8ecf9647b784d1012a3cee7afd3c66a368c885b",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:59:08.467Z",
    chainId: 43113,
  },
  {
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
    contract: {
      address: "0x7e7B432447b1b10131e5DB7b239256F4B636c62b",
      name: "Cool Cats",
      symbol: "COOL",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x49d50BFAC8995C5e625FA15A9dFEb802608837f0",
      deployedBlockNumber: 26793489,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Cool Cats",
    description:
      "Cool Cats is a collection of 9,999 unique cat NFTs, each with its own cool traits and accessories.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmNQY6q2k7xzSbHzjfh3Agq6N1iyeEJrWEY6QhFh8hxmzK",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/base-sepolia/560499cdffe49e171bb56cf3ac6f50c4",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/base-sepolia/560499cdffe49e171bb56cf3ac6f50c4",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/base-sepolia/560499cdffe49e171bb56cf3ac6f50c4",
      contentType: "image/jpeg",
      size: 33281,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreih2p3fhgw4xypukoqntpopctndws6jou3xrlr6b22jaju5ftuqwgm",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmNQY6q2k7xzSbHzjfh3Agq6N1iyeEJrWEY6QhFh8hxmzK",
      metadata: {
        name: "Cool Cats",
        description:
          "Cool Cats is a collection of 9,999 unique cat NFTs, each with its own cool traits and accessories.",
        image:
          "ipfs://bafkreih2p3fhgw4xypukoqntpopctndws6jou3xrlr6b22jaju5ftuqwgm",
        attributes: [
          {
            value: "Cool Cats",
            trait_type: "Name",
          },
          {
            value:
              "Cool Cats is a collection of 9,999 unique cat NFTs, each with its own cool traits and accessories.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: null,
      blockNumber: null,
      timestamp: null,
      transactionHash: null,
    },
    owners: null,
    timeLastUpdated: "2025-06-08T07:02:43.143Z",
    chainId: 84532,
  },
  {
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
    contract: {
      address: "0x61a23A445005e248BEd7f59c43f939e8aF04C4ED",
      name: "CryptoPunks",
      symbol: "PUNK",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x49d50BFAC8995C5e625FA15A9dFEb802608837f0",
      deployedBlockNumber: 26793489,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "CryptoPunks",
    description:
      "CryptoPunks is a collection of 10,000 unique 24x24 pixel art characters, each with its own distinct features.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmSvC9ZbDAS2u1ed15GTbtst9ZAgQwe99jNVermFhEpqMK",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/base-sepolia/0441e52bf13d46bf5901bc6fe58c09b5",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/base-sepolia/0441e52bf13d46bf5901bc6fe58c09b5",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/base-sepolia/0441e52bf13d46bf5901bc6fe58c09b5",
      contentType: "image/png",
      size: 7545,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreicjtgkfd3qptioq6gqx7d2d6dip7ptlktjrjduochfet2t6ln2kl4",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmSvC9ZbDAS2u1ed15GTbtst9ZAgQwe99jNVermFhEpqMK",
      metadata: {
        name: "CryptoPunks",
        description:
          "CryptoPunks is a collection of 10,000 unique 24x24 pixel art characters, each with its own distinct features.",
        image:
          "ipfs://bafkreicjtgkfd3qptioq6gqx7d2d6dip7ptlktjrjduochfet2t6ln2kl4",
        attributes: [
          {
            value: "CryptoPunks",
            trait_type: "Name",
          },
          {
            value:
              "CryptoPunks is a collection of 10,000 unique 24x24 pixel art characters, each with its own distinct features.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: null,
      blockNumber: null,
      timestamp: null,
      transactionHash: null,
    },
    owners: null,
    timeLastUpdated: "2025-06-08T07:02:28.429Z",
    chainId: 84532,
  },
  {
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
    contract: {
      address: "0x29351eC524695499f86f33B36b54c83fAD70258d",
      name: "Doodles",
      symbol: "DOODLE",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x49d50BFAC8995C5e625FA15A9dFEb802608837f0",
      deployedBlockNumber: 26793490,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Doodles",
    description:
      "Doodles is a collection of 10,000 unique hand-drawn NFTs, each with its own vibrant colors and traits.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmSmu6736cw9atfDCZPWRsbJw2V6gsCCPsSfChYUr14Q4q",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/base-sepolia/05c2682a8ec6b775d3e8309a9655ffde",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/base-sepolia/05c2682a8ec6b775d3e8309a9655ffde",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/base-sepolia/05c2682a8ec6b775d3e8309a9655ffde",
      contentType: "image/png",
      size: 612503,
      originalUrl:
        "https://ipfs.io/ipfs/bafybeigl56uezodp3nkikb4zyntyww7zbkmldcz2tj443bapfv6t6wvure",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmSmu6736cw9atfDCZPWRsbJw2V6gsCCPsSfChYUr14Q4q",
      metadata: {
        name: "Doodles",
        description:
          "Doodles is a collection of 10,000 unique hand-drawn NFTs, each with its own vibrant colors and traits.",
        image:
          "ipfs://bafybeigl56uezodp3nkikb4zyntyww7zbkmldcz2tj443bapfv6t6wvure",
        attributes: [
          {
            value: "Doodles",
            trait_type: "Name",
          },
          {
            value:
              "Doodles is a collection of 10,000 unique hand-drawn NFTs, each with its own vibrant colors and traits.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: null,
      blockNumber: null,
      timestamp: null,
      transactionHash: null,
    },
    owners: null,
    timeLastUpdated: "2025-06-08T07:02:15.420Z",
    chainId: 84532,
  },
  {
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
    contract: {
      address: "0x3F165bE02B9f67Fd7942c0200E7C5134fBa17e09",
      name: "Lazy Lions",
      symbol: "LION",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
      deployedBlockNumber: 161291841,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Lazy Lions",
    description:
      "Lazy Lions is a collection of 6,000 unique lion NFTs, each with its own lazy and relaxed traits.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmZkd6VYfW5GY2mjDKc8hhuTxxZuYTvzy7yKarzVoZdsAy",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/arb-sepolia/e6edce6c7bd1cc4d2f6166a613f0d649",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/arb-sepolia/e6edce6c7bd1cc4d2f6166a613f0d649",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/arb-sepolia/e6edce6c7bd1cc4d2f6166a613f0d649",
      contentType: "image/png",
      size: 614143,
      originalUrl:
        "https://ipfs.io/ipfs/bafybeiczv4wuptnkhw3pvgora2tsnroxskfbnq5cath3th7ogyidr6yscy",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmZkd6VYfW5GY2mjDKc8hhuTxxZuYTvzy7yKarzVoZdsAy",
      metadata: {
        name: "Lazy Lions",
        description:
          "Lazy Lions is a collection of 6,000 unique lion NFTs, each with its own lazy and relaxed traits.",
        image:
          "ipfs://bafybeiczv4wuptnkhw3pvgora2tsnroxskfbnq5cath3th7ogyidr6yscy",
        attributes: [
          {
            value: "Lazy Lions",
            trait_type: "Name",
          },
          {
            value:
              "Lazy Lions is a collection of 6,000 unique lion NFTs, each with its own lazy and relaxed traits.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: null,
      blockNumber: null,
      timestamp: null,
      transactionHash: null,
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:58:17.889Z",
    chainId: 421614,
  },
  {
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
    contract: {
      address: "0x6172d687d834615faAc6B7bd445db5Bb0cc62F4E",
      name: "Lil Pudgys",
      symbol: "LILPUDGY",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
      deployedBlockNumber: 161291872,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Lil Pudgys",
    description:
      "Lil Pudgys is a collection of 6,000 unique baby penguin NFTs, each with its own adorable traits.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmRtVNSoi7zq9vvcDJYubvhB24VkcZ4Hgmtmdm4i59r6kH",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/arb-sepolia/6bc11593b8faf4133f9cb4c82e82fd17",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/arb-sepolia/6bc11593b8faf4133f9cb4c82e82fd17",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/arb-sepolia/6bc11593b8faf4133f9cb4c82e82fd17",
      contentType: "image/jpeg",
      size: 22369,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreiezdv26tlgbf7eqfnqrzkhnb2xx4anvyacxcvly2tfc5pauhr2k4m",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmRtVNSoi7zq9vvcDJYubvhB24VkcZ4Hgmtmdm4i59r6kH",
      metadata: {
        name: "Lil Pudgys",
        description:
          "Lil Pudgys is a collection of 6,000 unique baby penguin NFTs, each with its own adorable traits.",
        image:
          "ipfs://bafkreiezdv26tlgbf7eqfnqrzkhnb2xx4anvyacxcvly2tfc5pauhr2k4m",
        attributes: [
          {
            value: "Lil Pudgys",
            trait_type: "Name",
          },
          {
            value:
              "Lil Pudgys is a collection of 6,000 unique baby penguin NFTs, each with its own adorable traits.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 161340642,
      timestamp: "2025-06-08T06:56:05Z",
      transactionHash:
        "0x84e83179dccf34e403870ddcdb9c67edeee9f187440ff763c61c025f56f9dddb",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:56:08.258Z",
    chainId: 421614,
  },
  {
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
    contract: {
      address: "0x0635aFD9d33AacD34D125ae111aa0dC7b56336Ef",
      name: "Mutant Ape Yacht Club",
      symbol: "MAYC",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
      deployedBlockNumber: 161291912,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Mutant Ape Yacht Club",
    description:
      "Mutant Ape Yacht Club is a collection of 20,000 unique mutant apes, each with its own distinct traits and characteristics.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmeWgy6RCLTyfVu6c2jUsr57Ld4KqGaSbRhVcKdNcprJ2D",
    image: {
      cachedUrl:
        "https://nft-cdn.alchemy.com/arb-sepolia/364e20a44d803e17cfd0214d5f4565a7",
      thumbnailUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/arb-sepolia/364e20a44d803e17cfd0214d5f4565a7",
      pngUrl:
        "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/arb-sepolia/364e20a44d803e17cfd0214d5f4565a7",
      contentType: "image/png",
      size: 226275,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreibfe4qjlxeuitrb26xurjf5flylst5kmlvqv5ah3xvbxjk3aawn44",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmeWgy6RCLTyfVu6c2jUsr57Ld4KqGaSbRhVcKdNcprJ2D",
      metadata: {
        name: "Mutant Ape Yacht Club",
        description:
          "Mutant Ape Yacht Club is a collection of 20,000 unique mutant apes, each with its own distinct traits and characteristics.",
        image:
          "ipfs://bafkreibfe4qjlxeuitrb26xurjf5flylst5kmlvqv5ah3xvbxjk3aawn44",
        attributes: [
          {
            value: "Mutant Ape Yacht Club",
            trait_type: "Name",
          },
          {
            value:
              "Mutant Ape Yacht Club is a collection of 20,000 unique mutant apes, each with its own distinct traits and characteristics.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 161340538,
      timestamp: "2025-06-08T06:55:38Z",
      transactionHash:
        "0x25078f2c8492348a3642ef3985f5a60d3d9b6a6e9e362e1927c5f2128519f865",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:55:42.516Z",
    chainId: 421614,
  },
  {
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
    contract: {
      address: "0x78e3feb1b6e9984BfADF01C4Cb39698Ec1EcB19E",
      name: "Bored Ape Yacht Club",
      symbol: "BAYC",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
      deployedBlockNumber: 8501137,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Bored Ape Yacht Club",
    description:
      "Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs, each with distinct traits and characteristics.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmZ9zZTS75F4d7NPt8QKUTXsP99R6sQo5HdoENS68mSM6Z",
    image: {
      cachedUrl:
        "https://ipfs.io/ipfs/bafkreid7mmuml4pi7ppi3433zwvfqbijl3sux247ik4ortj5p2nyqw3boq",
      thumbnailUrl: null,
      pngUrl: null,
      contentType: null,
      size: null,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreid7mmuml4pi7ppi3433zwvfqbijl3sux247ik4ortj5p2nyqw3boq",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmZ9zZTS75F4d7NPt8QKUTXsP99R6sQo5HdoENS68mSM6Z",
      metadata: {
        name: "Bored Ape Yacht Club",
        description:
          "Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs, each with distinct traits and characteristics.",
        image:
          "ipfs://bafkreid7mmuml4pi7ppi3433zwvfqbijl3sux247ik4ortj5p2nyqw3boq",
        attributes: [
          {
            value: "Bored Ape Yacht Club",
            trait_type: "Name",
          },
          {
            value:
              "Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs, each with distinct traits and characteristics.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 8502143,
      timestamp: "2025-06-08T06:51:48Z",
      transactionHash:
        "0xac8f564e7d20b652fd40e5fdca247414a4af9964a3c4217fa9b7f44a5a2df607",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:51:51.461Z",
    chainId: 11155111,
  },
  {
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
    contract: {
      address: "0x5614b60429B3C12D35f18b8c361a1BC8a1604771",
      name: "Pudgy Penguins",
      symbol: "PUDGY",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
      deployedBlockNumber: 8501137,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Pudgy Penguins",
    description:
      "Pudgy Penguins is a collection of 8,888 unique penguin NFTs, each with its own personality and style.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/Qmd4L7K3YTT2VEK8hto2GHpNNziHcLHAWfQaoLdUqfc9yS",
    image: {
      cachedUrl:
        "https://ipfs.io/ipfs/bafkreifyynuz3fqhxkrdvlxm4jaxotf6qxg37cy7gw75nepotkrlbcw7fe",
      thumbnailUrl: null,
      pngUrl: null,
      contentType: null,
      size: null,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreifyynuz3fqhxkrdvlxm4jaxotf6qxg37cy7gw75nepotkrlbcw7fe",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://Qmd4L7K3YTT2VEK8hto2GHpNNziHcLHAWfQaoLdUqfc9yS",
      metadata: {
        name: "Pudgy Penguins",
        description:
          "Pudgy Penguins is a collection of 8,888 unique penguin NFTs, each with its own personality and style.",
        image:
          "ipfs://bafkreifyynuz3fqhxkrdvlxm4jaxotf6qxg37cy7gw75nepotkrlbcw7fe",
        attributes: [
          {
            value: "Pudgy Penguins",
            trait_type: "Name",
          },
          {
            value:
              "Pudgy Penguins is a collection of 8,888 unique penguin NFTs, each with its own personality and style.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 8502141,
      timestamp: "2025-06-08T06:51:24Z",
      transactionHash:
        "0x252650423db15862c5f855882532c8e142007036e8a36cb345c711b352e1f120",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:51:27.863Z",
    chainId: 11155111,
  },
  {
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
    contract: {
      address: "0x46d6c4b38C979b3c5FBe55cD52948d65e03FE3Ed",
      name: "Azuki",
      symbol: "AZUKI",
      totalSupply: null,
      tokenType: "ERC721",
      contractDeployer: "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5",
      deployedBlockNumber: 8501137,
      openSeaMetadata: {
        floorPrice: null,
        collectionName: null,
        collectionSlug: null,
        safelistRequestStatus: null,
        imageUrl: null,
        description: null,
        externalUrl: null,
        twitterUsername: null,
        discordUrl: null,
        bannerImageUrl: null,
        lastIngestedAt: null,
      },
      isSpam: null,
      spamClassifications: [],
    },
    tokenId: "1",
    tokenType: "ERC721",
    name: "Azuki",
    description:
      "Azuki is a collection of 10,000 unique anime-style NFTs, each with its own story and background.",
    tokenUri:
      "https://alchemy.mypinata.cloud/ipfs/QmWzq3cVD7YWFMm12E9UDxBsnVLsQps5jQQQfSYhnSADXb",
    image: {
      cachedUrl:
        "https://ipfs.io/ipfs/bafkreidllo6nt5w5o5bq3oqzeufuvx5jb4smrw47gahcuakd6zx2457faq",
      thumbnailUrl: null,
      pngUrl: null,
      contentType: null,
      size: null,
      originalUrl:
        "https://ipfs.io/ipfs/bafkreidllo6nt5w5o5bq3oqzeufuvx5jb4smrw47gahcuakd6zx2457faq",
    },
    animation: {
      cachedUrl: null,
      contentType: null,
      size: null,
      originalUrl: null,
    },
    raw: {
      tokenUri: "ipfs://QmWzq3cVD7YWFMm12E9UDxBsnVLsQps5jQQQfSYhnSADXb",
      metadata: {
        name: "Azuki",
        description:
          "Azuki is a collection of 10,000 unique anime-style NFTs, each with its own story and background.",
        image:
          "ipfs://bafkreidllo6nt5w5o5bq3oqzeufuvx5jb4smrw47gahcuakd6zx2457faq",
        attributes: [
          {
            value: "Azuki",
            trait_type: "Name",
          },
          {
            value:
              "Azuki is a collection of 10,000 unique anime-style NFTs, each with its own story and background.",
            trait_type: "Description",
          },
          {
            value: "IP (Intellectual Property)",
            trait_type: "Type",
          },
        ],
      },
      error: null,
    },
    collection: null,
    mint: {
      mintAddress: "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5",
      blockNumber: 8502138,
      timestamp: "2025-06-08T06:50:48Z",
      transactionHash:
        "0x4e139a8c478c58e55888a1778d8fa2f61f9586e9006af44963dc8164fde7e662",
    },
    owners: null,
    timeLastUpdated: "2025-06-08T06:50:52.694Z",
    chainId: 11155111,
  },
];
