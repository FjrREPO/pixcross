"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet, Percent, ExternalLink } from "lucide-react";
import Image from "next/image";
// import CardSupply from "./card-supply";
// import CardWithdraw from "./card-withdraw";
import Link from "next/link";

import CardSupplyCollateral from "./card-supply-collateral";
import CardPosition from "./card-position";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { chainMetaMap } from "@/data/chains.data";
import Loading from "@/components/loader/loading";
import { TokenSymbol } from "@/components/token/token-symbol";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { usePoolById } from "@/hooks/query/graphql/use-pool-by-id";
import { formatAddress, formatNumber, urlExplorer } from "@/lib/helper/helper";
import {
  calculateAvailableLiquidity,
  calculateBorrowAPR,
  calculateLendAPR,
  calculateReserveSize,
  calculateUtilizationRate,
} from "@/lib/helper/math";
import { usePositionsByAddress } from "@/hooks/query/graphql/use-positions-by-address";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { useOwnerNFTMultichain } from "@/hooks/query/api/use-owner-nft-multichain";
import { normalize } from "@/lib/helper/bignumber";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { name: "Jan", supply: 4000, borrow: 2400, apy: 3.2 },
  { name: "Feb", supply: 3000, borrow: 1398, apy: 3.5 },
  { name: "Mar", supply: 2000, borrow: 9800, apy: 4.1 },
  { name: "Apr", supply: 2780, borrow: 3908, apy: 3.8 },
  { name: "May", supply: 1890, borrow: 4800, apy: 4.3 },
  { name: "Jun", supply: 2390, borrow: 3800, apy: 3.9 },
];

export default function BorrowingPoolComponent({
  chainId,
  id,
}: {
  chainId: ChainSupported;
  id: string;
}) {
  const { data, isLoading } = usePoolById({ id, chainId });
  const { data: positions, refetch: rPositions } = usePositionsByAddress();

  const { data: ownerNfts } = useOwnerNFTMultichain();

  const totalSupplyAssets = parseInt(data?.totalSupplyAssets || "0");
  const utilizationRate = parseFloat(data?.utilizationRate || "0");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const findChain = chainId !== undefined ? chainMetaMap[chainId] : undefined;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <WalletWrapper currentChainId={chainId}>
      <div className="pt-30 pb-20 max-w-7xl mx-auto px-5 sm:px-10">
        <div className="px-4 md:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                <TokenSymbol
                  address={data?.collateralAddress || ""}
                  className="inline-block mr-2"
                />
                <span>-</span>
                <TokenSymbol
                  address={data?.loanAddress || ""}
                  className="inline-block ml-2"
                />
              </h1>
            </div>
            <div className="flex items-center gap-3">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  Collateral Token
                </CardTitle>
                <Link
                  href={urlExplorer({
                    address: data?.collateralToken.collateralToken,
                    chainId: chainId,
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Badge className="p-1" variant="outline">
                    <span>Explorer</span>
                    <ExternalLink className="h-full w-full text-foreground" />
                  </Badge>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TokenImageCustom
                    address={data?.collateralToken.collateralToken}
                    className="w-7 h-7"
                  />
                  <TokenSymbol
                    address={data?.collateralToken.collateralToken || ""}
                    className="text-xl font-bold"
                  />
                </div>
                <p className="text-xs text-violet-600 dark:text-violet-400 flex items-center mt-1">
                  Collateral for borrowing
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  Asset
                </CardTitle>
                <Link
                  href={urlExplorer({
                    address: data?.loanToken.loanToken,
                    chainId: chainId,
                  })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Badge className="p-1" variant="outline">
                    <span>Explorer</span>
                    <ExternalLink className="h-full w-full text-foreground" />
                  </Badge>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TokenImageCustom
                    address={data?.loanAddress}
                    className="w-7 h-7"
                  />
                  <TokenSymbol
                    address={data?.loanAddress || ""}
                    className="text-xl font-bold"
                  />
                </div>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center mt-1">
                  Asset available for borrowing
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Avg Utilization
                </CardTitle>
                <Percent className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {calculateUtilizationRate(
                    Number(data?.totalBorrowAssets),
                    Number(data?.totalSupplyAssets),
                  )}
                  %
                </div>
                <Progress className="mt-2 h-2" value={utilizationRate} />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Total Supplied
                </CardTitle>
                <Wallet className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatNumber(normalize(totalSupplyAssets, 18), {
                    compact: true,
                    decimals: 2,
                  })}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Total assets supplied to the pool
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSupplyCollateral
              chainId={chainId}
              data={data}
              ownerNfts={ownerNfts}
              poolId={id}
              rPositions={rPositions}
            />
            <CardPosition data={data} positions={positions} />
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSupply data={data} />
            <CardWithdraw data={data} />
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Trends ( Chart still maintenance )</CardTitle>
                <CardDescription>
                  Historical data for the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer height={300} width="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      className="opacity-30"
                      strokeDasharray="3 3"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgb(var(--background))",
                        border: "1px solid rgb(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      dataKey="supply"
                      name="Supply"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pool Details</CardTitle>
                <CardDescription>
                  Detailed information about the pool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pool ID:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatAddress(data?.id || "") || "Pool"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reserve Size:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(
                      Number(
                        calculateReserveSize(Number(data?.totalSupplyAssets)),
                      ),
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Available Liquidity:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(
                      Number(
                        calculateAvailableLiquidity(
                          Number(data?.totalSupplyAssets),
                          Number(data?.totalBorrowAssets),
                        ),
                      ),
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Borrow APR:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {calculateBorrowAPR(Number(data?.borrowRate))}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lend APR:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {calculateLendAPR({
                      borrowRate: Number(data?.borrowRate),
                      totalBorrowAssets: Number(data?.totalBorrowAssets),
                      totalSupplyAssets: Number(data?.totalSupplyAssets),
                    })}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Max LTH:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {data?.lth}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Max LTV:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {data?.ltv}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WalletWrapper>
  );
}
