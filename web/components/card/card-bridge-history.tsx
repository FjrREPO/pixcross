import {
  // CheckCircle,
  // Clock,
  // AlertCircle,
  // XCircle,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
// import { useState } from "react";

import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

// import { chainData, ChainData } from "@/data/chains.data";

const CardBridgeHistory = () => {
  // const [fromNetwork, setFromNetwork] = useState<ChainData>(chainData[0]);
  // const [toNetwork, setToNetwork] = useState<ChainData>(chainData[1]);

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "completed":
  //       return <CheckCircle className="h-4 w-4 text-green-500" />;
  //     case "pending":
  //       return <Clock className="h-4 w-4 text-yellow-500" />;
  //     case "processing":
  //       return <AlertCircle className="h-4 w-4 text-blue-500" />;
  //     case "failed":
  //       return <XCircle className="h-4 w-4 text-red-500" />;
  //     default:
  //       return <Clock className="h-4 w-4 text-gray-500" />;
  //   }
  // };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "completed":
  //       return "text-green-600 bg-green-50";
  //     case "pending":
  //       return "text-yellow-600 bg-yellow-50";
  //     case "processing":
  //       return "text-blue-600 bg-blue-50";
  //     case "failed":
  //       return "text-red-600 bg-red-50";
  //     default:
  //       return "text-gray-600 bg-gray-50";
  //   }
  // };

  // const handleTransactionClick = () => {
  //   // Navigate to detailed history page
  //   window.location.href = `/bridge/assets/history`;
  // };

  return (
    <Card className="shadow-lg h-ful">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-blue-600" />
          Bridge History
        </CardTitle>
        <Button
          className="text-gray-600 hover:text-blue-600 text-sm"
          size="sm"
          variant="link"
          onClick={() => {
            window.location.href = "/bridge/assets/history";
          }}
        >
          View All
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center justify-center h-32">
          <span className="font-bold">Coming Soon!</span>
        </div>
        {/* <div className="space-y-0 max-h-72 overflow-y-auto">
          {bridgeHistory.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-foreground/10 cursor-pointer border-b border-gray-100 transition-colors"
              role="button"
              tabIndex={0}
              onClick={() => handleTransactionClick()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTransactionClick();
                }
              }}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(transaction.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {transaction.fromChain} → {transaction.toChain}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {transaction.amount}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {transaction.timestamp}
                    </span>
                    <span className="text-xs text-gray-400">
                      {transaction.txHash}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {bridgeHistory.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-gray-500">No bridge transactions yet</p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default CardBridgeHistory;
