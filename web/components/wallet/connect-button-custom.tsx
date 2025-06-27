import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const ChainIcon = ({
  iconUrl,
  name,
  background,
  size = 20,
}: {
  iconUrl?: string;
  name?: string;
  background?: string;
  size?: number;
}) => (
  <div
    style={{
      background,
      width: size,
      height: size,
      borderRadius: 999,
      overflow: "hidden",
      marginRight: 4,
    }}
  >
    {iconUrl && (
      <Image
        alt={`${name ?? "Chain"} icon`}
        height={size}
        src={iconUrl}
        style={{ width: size, height: size }}
        width={size}
      />
    )}
  </div>
);

const ButtonCustom = ({
  children,
  onClick,
  variant = "outline",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "ghost";
}) => (
  <Button
    className="flex items-center justify-center px-4 py-7 !font-ibm-plex-mono font-normal uppercase tracking-caption font-base truncate text-dark-500 light:text-light-500"
    variant={variant}
    onClick={onClick}
  >
    {children}
  </Button>
);

export const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        if (!mounted) {
          return (
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          );
        }

        const connected = account && chain;

        if (!connected) {
          return (
            <ButtonCustom variant="outline" onClick={openConnectModal}>
              Connect Wallet
            </ButtonCustom>
          );
        }

        if (chain?.unsupported) {
          return (
            <ButtonCustom onClick={openChainModal}>Wrong network</ButtonCustom>
          );
        }

        return (
          <div className="flex-row flex gap-3 z-50">
            <ButtonCustom onClick={openChainModal}>
              {chain.hasIcon && (
                <div className="min-w-5">
                  <ChainIcon
                    background={chain.iconBackground}
                    iconUrl={chain.iconUrl}
                    name={chain.name}
                  />
                </div>
              )}
              <span className="max-w-32 truncate">{chain.name}</span>
            </ButtonCustom>

            <ButtonCustom onClick={openAccountModal}>
              {account.displayName}
            </ButtonCustom>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
