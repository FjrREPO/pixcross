import { icons } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Banknote",
    title: "NFT-Backed Borrowing",
    description:
      "Access stablecoin liquidity using NFTs or tokenized intellectual property as collateral across supported chains.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Liquidation",
    description:
      "Transparent 24-hour auction mechanism protects lenders while giving borrowers fair liquidation terms.",
  },
  {
    icon: "Network",
    title: "Cross-Chain Interoperability",
    description:
      "Powered by Chainlink CCIP for seamless asset bridging and secure messaging across Ethereum, Base, Arbitrum, and Avalanche.",
  },
  {
    icon: "User",
    title: "Curator-Driven Lending",
    description:
      "Anyone can become a curator, allocating capital to lending pools and earning management fees based on performance.",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="container py-24 sm:py-32" id="benefits">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Features</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unlock the Power of Tokenized IP
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Pixcross is a cross-chain lending protocol that transforms NFTs and
            intellectual property into powerful financial tools—permissionless,
            transparent, and decentralized.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    className="mb-6 text-primary"
                    color="hsl(var(--primary))"
                    name={icon as keyof typeof icons}
                    size={32}
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
