"use client";

import React from "react";

import TablePool from "@/components/table/pools/table-pools";

export default function BorrowComponent() {
  return (
    <div className="pt-30 max-w-7xl mx-auto">
      <div className="px-4 md:px-8">
        <TablePool />
      </div>
    </div>
  );
}
