"use client";

import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import Image from "next/image";

interface sponsorsProps {
  icon: string;
  src: string;
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    icon: "Crown",
    src: "/brands/ethereum.png",
    name: "Ethereum",
  },
  {
    icon: "Vegan",
    src: "/brands/base.png",
    name: "Base",
  },
  {
    icon: "Ghost",
    src: "/brands/arbitrum.png",
    name: "Arbitrum",
  },
  {
    icon: "Puzzle",
    src: "/brands/avalanche.png",
    name: "Avalanche",
  },
  {
    icon: "Squirrel",
    src: "/brands/chainlink.png",
    name: "Chainlink",
  },
];

export const SponsorsSection = () => {
  return (
    <section className="max-w-[75%] mx-auto pb-24 sm:pb-32" id="sponsors">
      <h2 className="text-lg md:text-xl text-center mb-6">Built in</h2>

      <div className="mx-auto">
        <Marquee
          fade
          pauseOnHover
          className="gap-[3rem]"
          innerClassName="gap-[3rem]"
        >
          {sponsors.map(({ src, name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              <Image
                alt={name}
                className="mr-2"
                height={32}
                src={src}
                width={32}
              />
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
