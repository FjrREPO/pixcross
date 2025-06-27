"use client";

import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChainData } from "@/data/chains.data";
import { CoinMarketCapType } from "@/types/api/cmc.type";

interface TokenNetworkOption {
  token: CoinMarketCapType;
  network: ChainData;
  chainId: ChainSupported;
  contractAddress: string;
}

interface DialogSelectionBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: TokenNetworkOption) => void;
  availableOptions: TokenNetworkOption[];
  selectedOption?: TokenNetworkOption | null;
  title: string;
  networks: ChainData[];
}

export default function DialogSelectionBridge({
  isOpen,
  onClose,
  onSelect,
  availableOptions,
  selectedOption,
  title,
  networks,
}: DialogSelectionBridgeProps) {
  const [selectedNetworkId, setSelectedNetworkId] = React.useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setSelectedNetworkId(null);
      setSearchQuery("");
    }
  }, [isOpen]);

  const availableNetworks = React.useMemo(() => {
    const networkIds = new Set(
      availableOptions.map((option) => option.chainId),
    );

    return networks.filter((network) =>
      networkIds.has(network.chainId as ChainSupported),
    );
  }, [availableOptions, networks]);

  const filteredOptions = React.useMemo(() => {
    let filtered = availableOptions;

    if (selectedNetworkId !== null) {
      filtered = filtered.filter(
        (option) => option.chainId === selectedNetworkId,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      filtered = filtered.filter(
        (option) =>
          option.token.symbol.toLowerCase().includes(query) ||
          option.token.name.toLowerCase().includes(query) ||
          option.network.name.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [availableOptions, selectedNetworkId, searchQuery]);

  const handleNetworkSelect = (networkId: number) => {
    setSelectedNetworkId(selectedNetworkId === networkId ? null : networkId);
  };

  const handleTokenSelect = (option: TokenNetworkOption) => {
    onSelect(option);
    onClose();
  };

  const clearFilters = () => {
    setSelectedNetworkId(null);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-auto">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 h-12"
                placeholder="Search tokens or networks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                Networks
              </span>
              {(selectedNetworkId !== null || searchQuery) && (
                <Button
                  className="h-6 text-xs"
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableNetworks.map((network) => (
                <Badge
                  key={network.chainId}
                  className={cn(
                    "cursor-pointer transition-all duration-200 px-3 py-1",
                    "hover:bg-primary/10 hover:border-primary/20",
                    selectedNetworkId === network.chainId &&
                      "bg-primary text-primary-foreground",
                  )}
                  variant={
                    selectedNetworkId === network.chainId
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleNetworkSelect(network.chainId)}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full overflow-hidden bg-background flex items-center justify-center">
                      <Image
                        alt={network.name}
                        className="w-full h-full object-cover"
                        height="16"
                        src={network.icon}
                        width="16"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;

                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2MzYzNzAiLz4KPHN2Zz4K";
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium">{network.name}</span>
                  </div>
                </Badge>
              ))}
            </div>
          </div>

          {filteredOptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-sm">
                {searchQuery || selectedNetworkId !== null
                  ? "No tokens found matching your filters"
                  : "No tokens available"}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <ScrollArea className="h-full p-4">
                {filteredOptions.map((option, index) => (
                  <button
                    key={`${option.token.symbol}-${option.chainId}-${index}`}
                    aria-selected={
                      selectedOption?.chainId === option.chainId &&
                      selectedOption?.token.symbol === option.token.symbol
                    }
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                      "hover:bg-muted/50 border border-transparent hover:border-border/50",
                      selectedOption?.chainId === option.chainId &&
                        selectedOption?.token.symbol === option.token.symbol &&
                        "bg-primary/10 border-primary/20",
                    )}
                    role="option"
                    tabIndex={0}
                    type="button"
                    onClick={() => handleTokenSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleTokenSelect(option);
                      }
                    }}
                  >
                    {/* Token Logo */}
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      <Image
                        alt={option.token.symbol}
                        className="w-full h-full object-cover"
                        height="40"
                        src={option.token.logo}
                        width="40"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;

                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2MzYzNzAiLz4KPHN2Zz4K";
                        }}
                      />
                    </div>

                    {/* Token Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {option.token.symbol}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {option.token.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <Image
                            alt={option.network.name}
                            className="w-full h-full object-cover"
                            height="16"
                            src={option.network.icon}
                            width="16"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;

                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2MzYzNzAiLz4KPHN2Zz4K";
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {option.network.name}
                        </span>
                        <Badge className="text-xs px-2 py-0" variant="outline">
                          {option.chainId}
                        </Badge>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedOption?.chainId === option.chainId &&
                      selectedOption?.token.symbol === option.token.symbol && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                  </button>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
