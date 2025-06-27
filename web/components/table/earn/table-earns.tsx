"use client";

import { useEffect, useState } from "react";

import { DataTable } from "./table-data";
import { columns } from "./columns";

import { useEarns } from "@/hooks/query/graphql/use-earns";

export default function TableEarn() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data, isLoading } = useEarns();

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="w-full space-y-4 h-auto z-10">
      <DataTable columns={columns()} data={data || []} isLoading={isLoading} />
    </div>
  );
}
