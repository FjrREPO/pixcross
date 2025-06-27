"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { DataTableColumnHeader } from "./column-header";

import { PoolType } from "@/types/graphql/pool.type";
import { formatNumber } from "@/lib/helper/helper";
import { TokenSymbol } from "@/components/token/token-symbol";
import { chainMetaMap } from "@/data/chains.data";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { normalize } from "@/lib/helper/bignumber";

export function columns(): ColumnDef<PoolType>[] {
  return [
    {
      accessorKey: "collateralToken",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-start"
          column={column}
          title="Collateral"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-start items-center gap-2 py-3 pl-5">
            <TokenImageCustom
              address={row.original.collateralToken.collateralToken || ""}
              className="w-6 h-6"
            />
            <TokenSymbol address={row.original.collateralAddress || ""} />
          </div>
        );
      },
    },
    {
      accessorKey: "loanToken",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Loan Token"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-2 py-3">
            {row.original.loanToken ? (
              <>
                <TokenImageCustom
                  address={row.original.loanToken.loanToken || ""}
                  className="w-6 h-6"
                />
                <TokenSymbol address={row.original.loanToken.loanToken || ""} />
              </>
            ) : (
              <span>No Token</span>
            )}
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
      accessorKey: "totalSupplyAssets",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-end pr-5"
          column={column}
          title="Total Supplied"
        />
      ),
      cell: ({ row }) => {
        const totalSupply = row.original.totalSupplyAssets;

        return (
          <div className="flex justify-end items-center gap-2 py-3 pr-5">
            <span className="font-medium">
              {formatNumber(normalize(totalSupply, 18), {
                decimals: 2,
                compact: true,
              })}
            </span>
          </div>
        );
      },
    },
  ];
}
