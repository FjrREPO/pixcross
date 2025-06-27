"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { DataTableColumnHeader } from "./column-header";

import { chainMetaMap } from "@/data/chains.data";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { formatCompactNumber, formatPercentage } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { AccountEarnType } from "@/types/graphql/account.type";

export function columns(): ColumnDef<AccountEarnType>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-start pl-5"
          column={column}
          title="Name"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-start items-center gap-2 py-3 pl-5">
            <span className="font-medium">
              {row.original.curatorEntity.name || ""}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "chainId",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Chain"
        />
      ),
      cell: ({ row }) => {
        const chainId = row.original.chainId;
        const findChain =
          chainId !== undefined ? chainMetaMap[chainId] : undefined;

        return (
          <div className="flex justify-center py-3">
            <div className="flex items-center justify-center gap-2 text-center w-full">
              <Image
                alt={findChain?.name || "Chain Icon"}
                className="rounded-full"
                height={24}
                src={findChain?.icon || ""}
                width={24}
              />
              <span className="font-medium">
                {findChain ? findChain.name : "Unknown Chain"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "shares",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Shares"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-2 py-3">
            <TokenImageCustom
              address={row.original.curatorEntity.asset || ""}
              className="w-6 h-6"
            />
            <span className="font-medium">
              {formatCompactNumber(normalize(row.original.shares || 0, 18))}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "apr",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Lend APR"
        />
      ),
      cell: ({ row }) => (
        <LendAPRCell apr={row.original.curatorEntity.currentLendAPR} />
      ),
    },
    {
      accessorKey: "tvl",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-end pr-5"
          column={column}
          title="TVL"
        />
      ),
      cell: TVLCell,
    },
  ];
}

const TVLCell = ({ row }: { row: any }) => {
  const normalizedTVL = normalize(row.original.totalShares || 0, 18);

  return (
    <div className="flex justify-end items-center gap-2 py-3 pr-10">
      <span className="font-medium">{formatCompactNumber(normalizedTVL)}</span>
    </div>
  );
};

const LendAPRCell = ({ apr }: { apr: string }) => {
  return (
    <div className="flex justify-center items-center py-3">
      <span className="font-medium">{formatPercentage(apr)}</span>
    </div>
  );
};
