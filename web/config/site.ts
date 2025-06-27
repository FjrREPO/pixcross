export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Pixcross",
  description:
    "Pixcross is a DeFi platform for cross chain lending and borrowing with ip nft as collateral.",
  url:
    process.env.NODE_ENV === "production"
      ? "https://app-pixcross.vercel.app"
      : "http://localhost:3000",
  links: {
    github: "https://github.com/FjrREPO/pixcross",
  },
};
