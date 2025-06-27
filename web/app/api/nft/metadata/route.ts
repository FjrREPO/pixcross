import { NextRequest, NextResponse } from "next/server";

const API_KEYS = [
  process.env.NEXT_PUBLIC_ALCHEMY_KEY_3,
  process.env.NEXT_PUBLIC_ALCHEMY_KEY_2,
  process.env.NEXT_PUBLIC_ALCHEMY_KEY,
];

export const GET = async (request: NextRequest) => {
  const contractAddress = request.nextUrl.searchParams.get("contractAddress");
  const chainId = request.nextUrl.searchParams.get("chainId");
  let chainSlug: string;

  if (!contractAddress) {
    return NextResponse.json(
      { error: "At least one contractAddress is required" },
      { status: 400 },
    );
  }

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

  let lastError: Response | null = null;

  for (const apiKey of API_KEYS) {
    if (!apiKey) continue;

    const url = `https://${chainSlug}.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=1&refreshCache=false`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();

        return NextResponse.json(data);
      } else {
        lastError = response;
      }
    } catch (err) {
      return NextResponse.json(
        { error: `Error fetching NFT metadata: ${err}` },
        { status: 500 },
      );
    }
  }

  if (lastError) {
    return NextResponse.json(
      { error: `All keys failed. Last error: ${lastError.statusText}` },
      { status: lastError.status || 500 },
    );
  }

  return NextResponse.json(
    { error: "Unexpected error fetching NFT metadata" },
    { status: 500 },
  );
};
