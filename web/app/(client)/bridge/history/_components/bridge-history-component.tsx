"use client";
import { useState } from "react";

import { useCCIPTransactionsByAddress } from "@/hooks/query/api/use-ccip-transactions-by-address";
import { useBridgesByAddress } from "@/hooks/query/graphql/use-bridges-by-address";
import TableBridgeHistory from "@/components/table/bridge/erc20/table-bridge-history";
import TableBridgeERC721History from "@/components/table/bridge/erc721/table-bridge-erc721-history";
import { useBridgesERC721ByAddress } from "@/hooks/query/graphql/use-bridges-erc721-by-address";

type TabType = "ccip" | "erc721";

export default function BridgeHistoryComponent() {
  const [activeTab, setActiveTab] = useState<TabType>("ccip");
  const { data, isLoading } = useBridgesByAddress();
  const { data: ccipData, isLoading: ccipLoading } =
    useCCIPTransactionsByAddress();
  const { data: bERC721Data, isLoading: bERC721Loading } =
    useBridgesERC721ByAddress();

  const tabs = [
    {
      id: "ccip" as TabType,
      label: "Assets Bridges",
      icon: "",
      description: "Cross-Chain Interoperability Protocol transactions",
    },
    {
      id: "erc721" as TabType,
      label: "NFT Bridges",
      icon: "",
      description: "NFT bridge transactions",
    },
  ];

  const isLoadingData = isLoading || ccipLoading;

  return (
    <div className="pt-30 w-full mx-auto max-w-7xl">
      <div className="w-full mx-auto px-5 sm:px-10">
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav aria-label="Tabs" className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  className={`
                    group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-all duration-200 cursor-pointer
                    ${
                      activeTab === tab.id
                        ? "border-foreground text-foreground dark:text-foreground"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }
                  `}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === "ccip" && (
            <div className="animate-fadeIn">
              <TableBridgeHistory
                ccipData={ccipData}
                data={data}
                isLoading={isLoadingData}
              />
            </div>
          )}

          {activeTab === "erc721" && (
            <div className="animate-fadeIn">
              <TableBridgeERC721History
                data={bERC721Data}
                isLoading={bERC721Loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
