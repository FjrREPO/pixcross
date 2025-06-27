import { NextResponse } from "next/server";

export async function GET() {
  const payload = {
    columns: [
      "name",
      "type",
      "typespecs",
      "exchange",
      "description",
      "logoid",
      "base_currency_logoid",
      "currency_logoid",
      "country_code",
      "maturity_date",
      "yield_to_maturity",
      "root",
      "close",
    ],
    filter: [
      {
        left: "crypto_common_categories",
        operation: "has",
        right: ["smart-contract-platforms"],
      },
      {
        left: "is_primary",
        operation: "equal",
        right: true,
      },
    ],
    ignore_unknown_fields: true,
    options: {
      lang: "id_ID",
    },
    range: [0, 11],
    sort: {
      sortBy: "crypto_total_rank",
      sortOrder: "asc",
    },
    filter2: {
      operator: "or",
      operands: [
        {
          expression: {
            left: "name",
            operation: "nequal",
            right: "ETHUSD",
          },
        },
        {
          expression: {
            left: "exchange",
            operation: "nequal",
            right: "BITSTAMP",
          },
        },
      ],
    },
  };

  try {
    const res = await fetch(
      "https://scanner.tradingview.com/coin/scan?label-product=related-symbols",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
