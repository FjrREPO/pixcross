"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { readContract } from "wagmi/actions";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";

import { TokenImageCustom } from "@/components/token/token-image-custom";
import { TokenSymbol } from "@/components/token/token-symbol";
import { chainMetaMap } from "@/data/chains.data";
import { useLoanTokens } from "@/hooks/query/graphql/use-loan-tokens";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WalletWrapper from "@/components/wallet/wallet-wrapper";
import { config } from "@/lib/wagmi";
import { normalize } from "@/lib/helper/bignumber";
import { formatCompactNumber } from "@/lib/helper/number";
import { cn } from "@/lib/utils";
import { useFaucetClaim } from "@/hooks/mutation/contract/faucet/use-faucet-claim";
import DialogTransaction from "@/components/dialog/dialog-transaction";
import { MultiStepLoader } from "@/components/loader/multi-step-loader";

interface SelectedToken {
  id: string;
  symbol: string;
  address: string;
  chainId: ChainSupported;
  balance: string;
  network: string;
  icon?: string;
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "balance" | "network";

export default function TokenSelectComponent() {
  const { data, isLoading } = useLoanTokens();
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(
    null,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  const [refreshingBalances, setRefreshingBalances] = useState(false);

  const { address } = useAccount();

  const TOKEN_DECIMALS = 18;

  // Initialize client-side only state
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchBalance = async (
    tokenAddress: string,
    chainId: ChainSupported,
  ) => {
    if (!address) return "0";

    try {
      const balance = await readContract(config, {
        address: tokenAddress as HexAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as HexAddress],
        chainId: chainId,
      });

      const normalized = normalize(Number(balance ?? 0), TOKEN_DECIMALS);
      const formattedBalance = normalized.toLocaleString();

      setBalances((prev) => ({
        ...prev,
        [tokenAddress]: formattedBalance,
      }));

      return formattedBalance;
    } catch {
      setBalances((prev) => ({
        ...prev,
        [tokenAddress]: "Error",
      }));

      return "Error";
    }
  };

  useEffect(() => {
    if (data && address && isClient) {
      data.forEach((token) => {
        if (token.chainId && token.loanToken) {
          fetchBalance(token.loanToken, token.chainId as ChainSupported);
        }
      });
    }
  }, [data, address, isClient]);

  const refreshAllBalances = async () => {
    if (!data || !address) return;

    setRefreshingBalances(true);

    const promises = data.map((token) => {
      if (token.chainId && token.loanToken) {
        return fetchBalance(token.loanToken, token.chainId as ChainSupported);
      }

      return Promise.resolve("0");
    });

    await Promise.all(promises);
    setRefreshingBalances(false);
  };

  // Get unique networks from tokens
  const availableNetworks = data
    ? Array.from(
        new Set(
          data
            .map((token) => token.chainId)
            .filter(Boolean)
            .map((chainId) => chainMetaMap[chainId!]?.name)
            .filter(Boolean),
        ),
      )
    : [];

  const filteredTokens = data
    ? data
        .filter((token) => {
          const network = token.chainId ? chainMetaMap[token.chainId] : null;
          const symbol = token.loanToken || "";

          const matchesSearch =
            symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (network?.name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesNetwork =
            selectedNetwork === "all" || network?.name === selectedNetwork;

          return matchesSearch && matchesNetwork;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "name":
              return (a.loanToken || "").localeCompare(b.loanToken || "");
            case "balance":
              const balanceA = parseFloat(balances[a.loanToken] || "0");
              const balanceB = parseFloat(balances[b.loanToken] || "0");

              return balanceB - balanceA;
            case "network":
              const networkA = a.chainId
                ? chainMetaMap[a.chainId]?.name || ""
                : "";
              const networkB = b.chainId
                ? chainMetaMap[b.chainId]?.name || ""
                : "";

              return networkA.localeCompare(networkB);
            default:
              return 0;
          }
        })
    : [];

  const handleTokenSelect = (token: any) => {
    const network = token.chainId ? chainMetaMap[token.chainId] : null;
    const balance = balances[token.loanToken] || "0";

    const selectedTokenData: SelectedToken = {
      id: token.id,
      symbol: token.loanToken,
      address: token.loanToken,
      chainId: token.chainId as ChainSupported,
      balance,
      network: network?.name || "Unknown",
      icon: network?.icon,
    };

    setSelectedToken(selectedTokenData);
  };

  const { mutation, txHash, loadingStates, currentStepIndex } =
    useFaucetClaim();

  const handleClaim = () => {
    if (!selectedToken) return;

    const { address, chainId } = selectedToken;

    mutation.mutate(
      {
        tokenAddress: address as HexAddress,
        amount: 10_000,
        decimals: TOKEN_DECIMALS,
        chainId: chainId as ChainSupported,
      },
      {
        onSuccess: () => {
          setShowDialog(true);
          refreshAllBalances();
          setSelectedToken(null);
          setSearchQuery("");
          setSelectedNetwork("all");
          setSortBy("name");
          setViewMode("grid");
        },
      },
    );
  };

  const TokenCard = ({
    token,
    isSelected = false,
  }: {
    token: any;
    isSelected?: boolean;
  }) => {
    const network = token.chainId ? chainMetaMap[token.chainId] : null;
    const balance = balances[token.loanToken] || "Loading...";

    return (
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          isSelected && "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20",
        )}
        onClick={() => handleTokenSelect(token)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="sup-asset-pair inline-flex relative pr-3">
                <div className="relative overflow-hidden rounded-full">
                  <Image
                    alt={network?.name || "Network Icon"}
                    className="object-cover object-center"
                    height={32}
                    src={network?.icon || "/placeholder.jpg"}
                    width={32}
                  />
                </div>
                <span className="sup-asset inline-flex rounded-full overflow-hidden h-6 w-6 absolute -bottom-1 -right-1">
                  <TokenImageCustom address={token.loanToken} />
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium truncate">
                  <TokenSymbol address={token.loanToken} />
                </h3>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge className="text-xs px-1.5 py-0.5" variant="outline">
                  {network?.name}
                </Badge>
                <span className="truncate">{formatCompactNumber(balance)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TokenListItem = ({
    token,
    isSelected = false,
  }: {
    token: any;
    isSelected?: boolean;
  }) => {
    const network = token.chainId ? chainMetaMap[token.chainId] : null;
    const balance = balances[token.loanToken] || "Loading...";

    return (
      <div
        className={cn(
          "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800",
          isSelected &&
            "bg-blue-50 dark:bg-blue-950/20 ring-1 ring-blue-200 dark:ring-blue-800",
        )}
        role="button"
        tabIndex={0}
        onClick={() => handleTokenSelect(token)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTokenSelect(token);
          }
        }}
      >
        <div className="relative">
          <div className="sup-asset-pair inline-flex relative pr-3">
            <div className="relative overflow-hidden rounded-full">
              <Image
                alt={network?.name || "Network Icon"}
                className="object-cover object-center"
                height={32}
                src={network?.icon || "/placeholder.jpg"}
                width={32}
              />
            </div>
            <span className="sup-asset inline-flex rounded-full overflow-hidden h-6 w-6 absolute -bottom-1 -right-1">
              <TokenImageCustom address={token.loanToken} />
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              <TokenSymbol address={token.loanToken} />
            </h3>
            {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
          </div>
          <p className="text-sm text-muted-foreground">{network?.name}</p>
        </div>

        <div className="text-right">
          <p className="font-medium">{formatCompactNumber(balance)}</p>
          <p className="text-xs text-muted-foreground">Balance</p>
        </div>
      </div>
    );
  };

  // Show loading while hydrating
  if (!isClient) {
    return (
      <WalletWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </WalletWrapper>
    );
  }

  if (isLoading) {
    return (
      <WalletWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </WalletWrapper>
    );
  }

  return (
    <WalletWrapper>
      <DialogTransaction
        chainId={selectedToken?.chainId as ChainSupported}
        isOpen={showDialog}
        processName="Faucet Claim"
        txHash={(txHash as HexAddress) || ""}
        onClose={() => {
          setShowDialog(false);
        }}
      />
      <MultiStepLoader
        loading={mutation.isPending}
        loadingStates={loadingStates}
        loop={false}
        value={currentStepIndex}
      />

      <div className="space-y-6 max-w-4xl mx-auto p-6 pt-30">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Select Token</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from your available tokens across different networks
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search tokens or networks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={selectedNetwork}
                onValueChange={setSelectedNetwork}
              >
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  {availableNetworks.map((network) => (
                    <SelectItem key={network} value={network}>
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortBy)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                </SelectContent>
              </Select>

              <Button
                disabled={refreshingBalances}
                size="icon"
                variant="outline"
                onClick={refreshAllBalances}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    refreshingBalances && "animate-spin",
                  )}
                />
              </Button>

              <div className="flex border rounded-md">
                <Button
                  className="rounded-r-none"
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  className="rounded-l-none border-l"
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Token Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTokens.map((token) => (
                <TokenCard
                  key={token.id}
                  isSelected={selectedToken?.id === token.id}
                  token={token}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <TokenListItem
                  key={token.id}
                  isSelected={selectedToken?.id === token.id}
                  token={token}
                />
              ))}
            </div>
          )}

          {filteredTokens.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tokens found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {selectedToken && (
          <div className="flex justify-center gap-4 pt-6">
            <Button variant="outline" onClick={() => setSelectedToken(null)}>
              Clear Selection
            </Button>
            <Button
              disabled={mutation.isPending || !selectedToken}
              onClick={handleClaim}
            >
              Claim{" "}
              <TokenImageCustom
                address={selectedToken.address}
                className="w-5 h-5 rounded-full"
              />
            </Button>
          </div>
        )}
      </div>
    </WalletWrapper>
  );
}
