import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixcross",
  description:
    "Pixcross is the cross-chain lending protocol for intellectual property. Supply NFTs, borrow stablecoins, earn yield, manage risk, and participate in auctions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="pt-br">
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="dark"
        >
          <Navbar />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
