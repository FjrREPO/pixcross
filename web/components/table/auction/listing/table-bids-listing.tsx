"use client";

import { useEffect, useState } from "react";

import { DataTable } from "./table-data";
import { columns } from "./columns";

import { useAuctionBidsByPoolIdAndTokenId } from "@/hooks/query/graphql/use-auction-bids-by-pool-id-and-token-id";

export default function TableBidsListing({
  poolId,
  tokenId,
}: {
  poolId: string;
  tokenId: number;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data, isLoading } = useAuctionBidsByPoolIdAndTokenId({
    poolId,
    tokenId,
  });

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="w-full space-y-4 h-auto z-10">
      <DataTable columns={columns()} data={data || []} isLoading={isLoading} />
    </div>
  );
}
