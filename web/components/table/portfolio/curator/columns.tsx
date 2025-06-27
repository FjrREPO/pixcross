"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { DataTableColumnHeader } from "./column-header";

import { TokenSymbol } from "@/components/token/token-symbol";
import { chainMetaMap } from "@/data/chains.data";
import { CuratorType } from "@/types/graphql/curator.type";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { formatCompactNumber, formatPercentage } from "@/lib/helper/number";
import { normalize } from "@/lib/helper/bignumber";
import { usePoolAllocationsByCurator } from "@/hooks/query/graphql/use-pool-allocations-by-curator";
import { PoolType } from "@/types/graphql/pool.type";

export function columns(): ColumnDef<CuratorType>[] {
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
            <span className="font-medium">{row.original.name || ""}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "symbol",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Symbol"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-2 py-3">
            <span className="font-medium">{row.original.symbol || ""}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "asset",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Asset"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center gap-2 py-3">
            <TokenImageCustom
              address={row.original.asset || ""}
              className="w-6 h-6"
            />
            <TokenSymbol address={row.original.asset || ""} />
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
            <div className="flex items-center gap-2 text-left">
              <Image
                alt={findChain?.name || "Chain Icon"}
                className="rounded-full w-7 h-7"
                height={24}
                src={findChain?.icon || ""}
                width={24}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "pools",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Pool Allocations"
        />
      ),
      cell: ({ row }) => <PoolsCell row={row} />,
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
      cell: ({ row }) => <LendAPRCell apr={row.original.currentLendAPR} />,
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

const PoolsCell = ({ row }: { row: any }) => {
  const pools = row.original.pools;
  const { data: allocations } = usePoolAllocationsByCurator({
    curator: row.original.curator,
    chainId: row.original.chainId,
  });

  return (
    <div className="flex justify-center items-center py-3 gap-2">
      {pools && pools.length > 0 ? (
        <>
          {pools.slice(0, 2).map((pool: PoolType, idx: number) => {
            const findAllocation = allocations
              ? allocations.find((allocation) => allocation.poolId === pool.id)
              : null;

            return (
              <div
                key={idx}
                className="flex justify-center items-center gap-2 bg-foreground rounded-full w-[75px] py-1"
              >
                <TokenImageCustom
                  address={pool.collateralToken.collateralToken || ""}
                  className="w-7 h-7"
                />
                <span className="text-background text-xs font-bold">
                  {findAllocation ? findAllocation.allocation : 0}%
                </span>
              </div>
            );
          })}
          {pools.length > 2 && (
            <div className="flex justify-center items-center gap-2 bg-foreground rounded-full w-[33px] h-[33px] py-1">
              <span className="text-background text-xs font-bold">
                +{pools.length - 2}
              </span>
            </div>
          )}
        </>
      ) : (
        <span className="text-sm font-medium">No Pools</span>
      )}
    </div>
  );
};

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
