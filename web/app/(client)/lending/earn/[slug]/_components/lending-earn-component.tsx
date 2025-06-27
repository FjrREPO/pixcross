"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  DollarSign,
  Percent,
  ArrowDownRight,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import CardSupply from "./card-supply";
import CardWithdraw from "./card-withdraw";

import { useEarnById } from "@/hooks/query/graphql/use-earn-by-id";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TableLendingPool from "@/components/table/lending/pools/table-lending-pools";
import { chainMetaMap } from "@/data/chains.data";
import Loading from "@/components/loader/loading";
import { TokenSymbol } from "@/components/token/token-symbol";
import { TokenImageCustom } from "@/components/token/token-image-custom";
import { Badge } from "@/components/ui/badge";
import { formatNumber, urlExplorer } from "@/lib/helper/helper";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { normalize } from "@/lib/helper/bignumber";
import { useCryptoToken } from "@/hooks/query/api/use-crypto-token";
import { useBalanceByAddressAndCurator } from "@/hooks/query/graphql/use-balance-by-address-and-curator";
import { usePoolAllocationsByCurator } from "@/hooks/query/graphql/use-pool-allocations-by-curator";

const chartData = [
  { name: "Jan", supply: 4000, borrow: 2400, apy: 3.2 },
  { name: "Feb", supply: 3000, borrow: 1398, apy: 3.5 },
  { name: "Mar", supply: 2000, borrow: 9800, apy: 4.1 },
  { name: "Apr", supply: 2780, borrow: 3908, apy: 3.8 },
  { name: "May", supply: 1890, borrow: 4800, apy: 4.3 },
  { name: "Jun", supply: 2390, borrow: 3800, apy: 3.9 },
];

interface LendingEarnComponentProps {
  id: string;
  chainId: ChainSupported;
}

export default function LendingEarnComponent({
  id,
  chainId,
}: LendingEarnComponentProps) {
  const { data, isLoading: isLoadingData } = useEarnById({ id, chainId });
  const { data: balanceUser, isLoading: isLoadingAccount } =
    useBalanceByAddressAndCurator({
      curator: id as HexAddress,
      chainId,
    });

  const isLoading = isLoadingData || isLoadingAccount;

  const [hideBalances, setHideBalances] = useState(false);

  const avgUtilization =
    data?.pools && data.pools.length > 0
      ? data.pools.reduce(
          (sum, pool) => sum + parseFloat(pool.utilizationRate || "0"),
          0,
        ) / data.pools.length
      : 0;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 18)}...${address.slice(-4)}`;
  };

  const findChain = chainId !== undefined ? chainMetaMap[chainId] : undefined;

  const { data: token } = useCryptoToken();

  const tokenSymbolByAddress = (address: string) =>
    token?.find(
      (token) =>
        address &&
        token.contract_address
          .map((addr) => addr.contract_address.toLowerCase())
          .includes(address.toLowerCase()),
    )?.symbol;

  const { data: allocations } = usePoolAllocationsByCurator({
    curator: id as HexAddress,
    chainId,
  });

  const pieData = (Array.isArray(data?.pools) ? data.pools : [])
    .map((pool, index) => ({
      id: `${pool.id}_${chainId}`,
      name:
        `Pool ${tokenSymbolByAddress(pool.collateralAddress)}` ||
        `Pool ${index + 1}`,
      value: Number(
        allocations?.find((allocation) => allocation.poolId === pool.id)
          ?.allocation ?? 0,
      ),
      color: ["#8b5cf6", "#06b6d4", "#10b981", "#f97316"][index % 4],
    }))
    .filter((item) => item.value > 0);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <WalletWrapper currentChainId={chainId}>
      <div className="pt-30 pb-20 max-w-7xl mx-auto">
        <div className="px-4 md:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {data?.name || "Lending Pool"}
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  href={urlExplorer({ chainId, address: data?.curator || "" })}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Badge className="mt-2" variant="default">
                    {formatAddress(data?.curator || "")}
                    <ExternalLink className="inline ml-1 w-4 h-4" />
                  </Badge>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setHideBalances(!hideBalances)}
              >
                {hideBalances ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
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
                  Total Supply
                </CardTitle>
                <DollarSign className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                  {hideBalances
                    ? "****"
                    : formatNumber(normalize(Number(data?.totalAssets), 18), {
                        compact: true,
                        decimals: 2,
                      })}
                </div>
                <p className="text-xs text-violet-600 dark:text-violet-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                  Asset
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TokenImageCustom address={data?.asset} className="w-7 h-7" />
                  <TokenSymbol
                    address={data?.asset || ""}
                    className="text-xl font-bold"
                  />
                </div>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center mt-1">
                  Asset for lending
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
                  {avgUtilization.toFixed(1)}%
                </div>
                <Progress className="mt-2 h-2" value={avgUtilization} />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Active Pools
                </CardTitle>
                <Wallet className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {data?.pools?.length || 0}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  All pools active
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSupply data={data} />
            <CardWithdraw
              balanceUser={balanceUser}
              data={data}
              isLoading={isLoading}
            />
          </div>

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
                <CardTitle>Pool Allocation</CardTitle>
                <CardDescription>Distribution across pools</CardDescription>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <ResponsiveContainer height={300} width="100%">
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        data={pieData}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No allocation data available
                  </p>
                )}
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                        <Link
                          className="text-white-500 hover:underline"
                          href={`/borrowing/pool/${item.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pools</CardTitle>
              <CardDescription>
                All allocation pools for lending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableLendingPool data={data?.pools} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </WalletWrapper>
  );
}
