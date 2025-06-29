import { NextRequest, NextResponse } from "next/server";

const API_KEYS = [
  process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  process.env.NEXT_PUBLIC_ALCHEMY_KEY_2,
  process.env.NEXT_PUBLIC_ALCHEMY_KEY_3,
];

export const GET = async (request: NextRequest) => {
  const ownerAddress = request.nextUrl.searchParams.get("ownerAddress");
  const contractAddresses =
    request.nextUrl.searchParams.getAll("contractAddress");
  const chainId = request.nextUrl.searchParams.get("chainId");

  if (!ownerAddress) {
    return NextResponse.json(
      { error: "ownerAddress is required" },
      { status: 400 },
    );
  }

  if (contractAddresses.length === 0) {
    return NextResponse.json(
      { error: "At least one contractAddress is required" },
      { status: 400 },
    );
  }

  let chainSlug: string;

  switch (chainId) {
    case "11155111":
      chainSlug = "eth-sepolia";
      break;
    case "84532":
      chainSlug = "base-sepolia";
      break;
    case "421614":
      chainSlug = "arb-sepolia";
      break;
    case "43113":
      chainSlug = "avax-fuji";
      break;
    case "1":
      chainSlug = "eth-mainnet";
      break;
    case "8453":
      chainSlug = "base-mainnet";
      break;
    case "42161":
      chainSlug = "arb-mainnet";
      break;
    default:
      return NextResponse.json({ error: "Chain not found" }, { status: 400 });
  }

  // Build query parameters
  const params = new URLSearchParams();

  params.append("owner", ownerAddress);
  params.append("withMetadata", "true");
  params.append("pageSize", "100");

  contractAddresses.forEach((address) => {
    params.append("contractAddresses[]", address);
  });

  let lastError: any = null;
  let lastResponse: Response | null = null;

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];

    if (!apiKey) {
      continue;
    }

    const url = `https://${chainSlug}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        return NextResponse.json(data);
      } else {
        lastResponse = response;
        try {
          const errorData = await response.json();

          lastError = errorData;
        } catch {
          lastError = { message: response.statusText };
        }
      }
    } catch (err) {
      return NextResponse.json(
        { error: `Error fetching NFT metadata: ${err}` },
        { status: 500 },
      );
    }
  }

  if (lastResponse) {
    return NextResponse.json(
      {
        error: `All keys failed. Last error: ${lastResponse.statusText}`,
        details: lastError,
        debug: {
          chainSlug,
          ownerAddress,
          contractAddresses,
          queryString: params.toString(),
        },
      },
      { status: lastResponse.status || 500 },
    );
  }

  return NextResponse.json(
    { error: "Unexpected error fetching NFTs for owner" },
    { status: 500 },
  );
};
