import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const sender = request.nextUrl.searchParams.get("sender");
  const first = request.nextUrl.searchParams.get("first") || "100";
  const offset = request.nextUrl.searchParams.get("offset") || "0";

  if (!sender) {
    return NextResponse.json(
      { error: "Sender address is required" },
      { status: 400 },
    );
  }

  const url = `https://ccip.chain.link/api/h/atlas/transactions?first=${first}&offset=${offset}&sender=${sender}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    let message = "An unknown error occurred";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
};
