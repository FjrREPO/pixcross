"use client";

import { useState } from "react";
import { TrendingUp, Users, Droplets } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableCuratorsPortfolio from "@/components/table/portfolio/curator/table-curators-portfolio";
import TableEarnsPortfolio from "@/components/table/portfolio/earn/table-earns-portfolio";
import TablePoolsPortfolio from "@/components/table/portfolio/pools/table-pools-portfolio";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { useAccountPoolsByAddress } from "@/hooks/query/graphql/use-account-pools-by-address";
import { useAccountEarnsByAddress } from "@/hooks/query/graphql/use-account-earns-by-address";
import { useAccountCuratorsByAddress } from "@/hooks/query/graphql/use-account-curators-by-address";

export default function PortfolioComponent() {
  const [selectedTab, setSelectedTab] = useState("earnings");

  const { data: eData, isLoading: eLoading } = useAccountEarnsByAddress();
  const { data: pData, isLoading: pLoading } = useAccountPoolsByAddress();
  const { data: cData, isLoading: cLoading } = useAccountCuratorsByAddress();

  const totalPools = pData ? pData.length : 0;
  const totalCurators = cData ? cData.length : 0;

  const portfolioStats = {
    totalEarnings: "$0",
    activePools: totalPools,
    activeCurators: totalCurators,
  };

  return (
    <WalletWrapper>
      <div className="pt-30 pb-20 max-w-7xl mx-auto px-5 sm:px-10">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                      Portfolio
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Track your DeFi activities and manage your investments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Earnings
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {portfolioStats.totalEarnings}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">+0%</Badge>
                      <p className="text-xs text-muted-foreground">
                        vs last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Pools
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center">
                    <Droplets className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {portfolioStats.activePools}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active pools
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Curators
                  </CardTitle>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {portfolioStats.activeCurators}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active curations
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm p-0 py-0 pb-0">
              <Tabs
                className="w-full"
                value={selectedTab}
                onValueChange={setSelectedTab}
              >
                <CardHeader className="border-b px-0 [.border-b]:pb-0">
                  <TabsList className="grid w-full grid-cols-3 bg-transparent h-16">
                    <TabsTrigger
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-0 rounded-none h-full cursor-pointer"
                      value="earnings"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Earnings</span>
                    </TabsTrigger>
                    <TabsTrigger
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-0 rounded-none h-full cursor-pointer"
                      value="pools"
                    >
                      <Droplets className="h-4 w-4" />
                      <span className="hidden sm:inline">Pools</span>
                    </TabsTrigger>
                    <TabsTrigger
                      className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-0 rounded-none h-full cursor-pointer"
                      value="curators"
                    >
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Curators</span>
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-0">
                  <TabsContent className="m-0" value="earnings">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Earnings Overview
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Track your DeFi earnings and yield farming rewards
                        </p>
                      </div>
                      <TableEarnsPortfolio data={eData} isLoading={eLoading} />
                    </div>
                  </TabsContent>

                  <TabsContent className="m-0" value="pools">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-blue-600" />
                          Pools Created
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Manage your pools and track performance
                        </p>
                      </div>
                      <TablePoolsPortfolio data={pData} isLoading={pLoading} />
                    </div>
                  </TabsContent>

                  <TabsContent className="m-0" value="curators">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          Curator Created
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Overview of your curator activities and performance
                        </p>
                      </div>
                      <TableCuratorsPortfolio
                        data={cData}
                        isLoading={cLoading}
                      />
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </WalletWrapper>
  );
}
