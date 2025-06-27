"use client";

import { useEffect, useState } from "react";

import { DataTable } from "./table-data";
import { columns } from "./columns";

import { CuratorType } from "@/types/graphql/curator.type";

export default function TableCuratorsPortfolio({
  data,
  isLoading,
}: {
  data?: CuratorType[];
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
      <DataTable columns={columns()} data={data || []} isLoading={isLoading} />
    </div>
  );
}
