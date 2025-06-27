"use client";

import { useEffect, useState } from "react";

import { DataTable } from "./table-data";
import { columns } from "./columns";

import { BridgeTransactionType } from "@/types/graphql/bridge.type";
import { CCIPTransactionType } from "@/types/api/ccip-transaction.type";

export default function TableBridgeHistory({
  data,
  ccipData,
  isLoading = false,
}: {
  data?: BridgeTransactionType[];
  ccipData?: CCIPTransactionType[];
  isLoading: boolean;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="w-full space-y-4 h-auto z-10">
      <DataTable
        columns={columns(ccipData || [])}
        data={data || []}
        isLoading={isLoading}
      />
    </div>
  );
}
