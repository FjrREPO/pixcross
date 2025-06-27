import type { Metadata } from "next";

import { Cabin } from "next/font/google";

import "./globals.css";
import DefaultLayout from "@/components/layout/default";
import Providers from "@/components/providers";
import { siteConfig } from "@/config/site";

const robotoMono = Cabin({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${robotoMono.className} antialiased`}>
        <Providers>
          <DefaultLayout>{children}</DefaultLayout>
        </Providers>
      </body>
    </html>
  );
}
