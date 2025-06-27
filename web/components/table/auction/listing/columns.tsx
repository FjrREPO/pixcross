"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./column-header";

import { normalize } from "@/lib/helper/bignumber";
import { BidType } from "@/types/graphql/auction-bid.type";
import { formatAddress } from "@/lib/helper/helper";
import { TokenImageCustom } from "@/components/token/token-image-custom";

export function columns(): ColumnDef<BidType>[] {
  return [
    {
      accessorKey: "blockTimestamp",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-start pl-5"
          column={column}
          title="Time"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-start items-center gap-2 py-3 pl-5">
            <span className="font-medium">
              {new Date(
                Number(row.original.blockTimestamp) * 1000,
              ).toLocaleString()}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "bidder",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Bidder"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-2 py-3">
            <span className="font-medium">
              {formatAddress(row.original.bidder || "")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-end"
          column={column}
          title="Amount"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-end items-center gap-2 py-3 pr-10">
            <div className="flex items-center gap-1">
              <TokenImageCustom
                address={row.original.loanToken || ""}
                className="w-4 h-4"
              />
              <span className="font-medium">
                {normalize(row.original.amount || "", 18)}
              </span>
            </div>
          </div>
        );
      },
    },
  ];
}
