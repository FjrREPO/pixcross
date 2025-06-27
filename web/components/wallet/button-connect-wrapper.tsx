import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { useAccount } from "wagmi";

import { Button } from "../ui/button";

export default function ButtonConnectWrapper({
  children,
  className = "",
  variant = "default",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}) {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    <React.Fragment>
      {!isConnected ? (
        <Button
          className={className}
          variant={variant}
          onClick={openConnectModal}
        >
          Connect Wallet
        </Button>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </React.Fragment>
  );
}
