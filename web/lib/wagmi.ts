import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  sepolia,
} from "wagmi/chains";

import { siteConfig } from "@/config/site";

const config = getDefaultConfig({
  appName: siteConfig.name,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
  chains: [sepolia, baseSepolia, arbitrumSepolia, avalancheFuji],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/EB6qgZ7mRkqjUt7xoI_d3V_AjZuUkFpg",
    ),
    [baseSepolia.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/EB6qgZ7mRkqjUt7xoI_d3V_AjZuUkFpg",
    ),
    [arbitrumSepolia.id]: http(
      "https://arb-sepolia.g.alchemy.com/v2/EB6qgZ7mRkqjUt7xoI_d3V_AjZuUkFpg",
    ),
    [avalancheFuji.id]: http(
      "https://avax-fuji.g.alchemy.com/v2/EB6qgZ7mRkqjUt7xoI_d3V_AjZuUkFpg",
    ),
  },
});

export { config };
