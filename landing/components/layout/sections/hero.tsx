"use client";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge className="text-sm py-2" variant="outline">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Pixcross </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Unlock the full
              <span className="text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                potential
              </span>
              of your IP.
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            {`Pixcross is the cross-chain lending protocol for intellectual property. Supply NFTs, borrow stablecoins, earn yield, manage risk, and participate in auctions.`}
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
              <Link
                className="flex items-center justify-center w-full h-full"
                href="https://pixcross.gitbook.io/pixcross-docs/"
                target="_blank"
              >
                Docs
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              className="w-5/6 md:w-1/4 font-bold"
              variant="secondary"
            >
              <Link href="https://github.com/FjrREPO/pixcross" target="_blank">
                Github
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl" />
          <Image
            alt="dashboard"
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            height={1200}
            src={
              theme === "light"
                ? "/hero-image-dark.png"
                : "/hero-image-dark.png"
            }
            width={1200}
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg" />
        </div>
      </div>
    </section>
  );
};
