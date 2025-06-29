import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { FAQSection } from "@/components/layout/sections/faq";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { SponsorsSection } from "@/components/layout/sections/sponsors";

export const metadata = {
  title: "Pixcross",
  description:
    "Pixcross is the cross-chain lending protocol for intellectual property. Supply NFTs, borrow stablecoins, earn yield, manage risk, and participate in auctions.",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Pixcross",
    description:
      "Pixcross is the cross-chain lending protocol for intellectual property. Supply NFTs, borrow stablecoins, earn yield, manage risk, and participate in auctions.",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Pixcross",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Pixcross",
    description:
      "Pixcross is the cross-chain lending protocol for intellectual property. Supply NFTs, borrow stablecoins, earn yield, manage risk, and participate in auctions.",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <CommunitySection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
