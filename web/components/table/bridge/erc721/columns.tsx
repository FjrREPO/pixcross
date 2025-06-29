"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { DataTableColumnHeader } from "./column-header";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAddress, urlExplorer } from "@/lib/helper/helper";
import { chainMetaMap } from "@/data/chains.data";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { TokenSymbol } from "@/components/token/token-symbol";
import { BridgeGroup } from "@/hooks/query/graphql/use-bridges-erc721-by-address";

export function columns(): ColumnDef<BridgeGroup>[] {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      throw new Error("Failed to copy text: " + err);
    }
  };

  return [
    {
      accessorKey: "transactionHash",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-start pl-6"
          column={column}
          title="Tx Hash"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-start items-center gap-3 py-4 pl-6">
            <div className="flex items-center gap-2 group">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded-md border">
                {formatAddress(row.original.id)}
              </code>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="h-7 w-7 p-0"
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(row.original.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Message ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={urlExplorer({
                        address: row.original.id,
                        chainId: row.original.sourceChain as ChainSupported,
                      })}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button
                        className="h-7 w-7 p-0 ml-1"
                        size="sm"
                        variant="ghost"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Transaction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "token",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-start"
          column={column}
          title="NFT Token"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-start items-center gap-2 py-3 pl-5">
            <TokenImageCustom
              address={row.original.tokenAddress || ""}
              className="w-6 h-6"
            />
            <TokenSymbol address={row.original.tokenAddress || ""} />
          </div>
        );
      },
    },
    {
      accessorKey: "sourceChain",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Source Chain"
        />
      ),
      cell: ({ row }) => {
        const chainId = row.original.sourceChain as unknown as ChainSupported;
        const findChain =
          chainId !== undefined ? chainMetaMap[chainId] : undefined;

        return (
          <div className="flex justify-center items-center py-4">
            {findChain ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                <Image
                  alt={findChain.name}
                  className="rounded-full ring-2 ring-background"
                  height={20}
                  src={findChain.icon}
                  width={20}
                />
                <span className="text-sm font-medium text-foreground">
                  {findChain.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unknown Chain</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "destinationChain",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Destination Chain"
        />
      ),
      cell: ({ row }) => {
        const chainId = row.original.targetChain as unknown as ChainSupported;
        const findChain =
          chainId !== undefined ? chainMetaMap[chainId] : undefined;

        return (
          <div className="flex justify-center items-center py-4">
            {findChain ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
                <Image
                  alt={findChain.name}
                  className="rounded-full ring-2 ring-background"
                  height={20}
                  src={findChain.icon}
                  width={20}
                />
                <span className="text-sm font-medium text-foreground">
                  {findChain.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unknown Chain</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => {
        const isSuccess = row.original.status === "COMPLETED";

        return (
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <Badge
                  className="bg-green-500/50 hover:bg-green-600 text-white px-3 py-1"
                  variant="default"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Success
                </Badge>
              ) : (
                <Badge
                  className="bg-yellow-100/20 text-white border-yellow-200 px-3 py-1"
                  variant="secondary"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
  ];
}
