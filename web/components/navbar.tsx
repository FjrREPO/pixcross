"use client";

import Link from "next/link";
import { useState } from "react";
import { X, ChevronDown, ChevronUp, AlignRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { ConnectButtonCustom } from "./wallet/connect-button-custom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const navigationMenus = [
  {
    label: "Collect",
    items: [
      {
        title: "Open Editions",
        description: "Discover and mint multichain IP NFTs for testing.",
        href: "/collect/open-editions",
      },
      {
        title: "Collector Dashboard",
        description: "View your collected multichain IP NFTs.",
        href: "/collect/dashboard",
      },
    ],
  },
  {
    label: "Earn & Borrow",
    items: [
      {
        title: "Earn",
        description: "Earn royalties by supplying liquidity to IP NFT pools.",
        href: "/lending",
      },
      {
        title: "Borrowing",
        description: "Borrow assets using your IP NFTs as collateral.",
        href: "/borrowing",
      },
    ],
  },
  {
    label: "Auction",
    items: [
      {
        title: "Listings",
        description:
          "Browse and participate in listings and track bidding activity.",
        href: "/auction/listings",
      },
    ],
  },
  {
    label: "Bridge",
    items: [
      {
        title: "Assets Bridge",
        description: "Bridge multichain assets between different networks.",
        href: "/bridge/assets",
      },
      {
        title: "NFT Bridge",
        description: "Bridge multichain IP NFTs between different networks.",
        href: "/bridge/nft",
      },
      {
        title: "History",
        description: "View your bridge transaction history.",
        href: "/bridge/history",
      },
    ],
  },
  {
    label: "Create",
    items: [
      {
        title: "Create Curator",
        description:
          "Create a new curator for earning royalties by supplying pools.",
        href: "/create/curator",
      },
      {
        title: "Create Pool",
        description: "Create a new liquidity pool for collateralizing IP NFTs.",
        href: "/create/pool",
      },
    ],
  },
  {
    label: "Portfolio & Faucet",
    items: [
      {
        title: "Portfolio",
        description: "View and manage your portfolio of IP NFTs and assets.",
        href: "/manage/portfolio",
      },
      {
        title: "Faucet",
        description: "Get testing tokens for trying out Pixcross features.",
        href: "/manage/faucet",
      },
    ],
  },
];

interface DropdownMenuItemProps {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

function CustomDropdownMenuItem({
  title,
  description,
  href,
  onClick,
}: DropdownMenuItemProps) {
  const content = (
    <div className="flex flex-col p-5 cursor-pointer hover:bg-accent/10 transition-colors">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-neutral-400 text-sm">{description}</p>
    </div>
  );

  if (href) {
    return (
      <DropdownMenuItem asChild className="rounded-none p-0">
        <Link href={href}>{content}</Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem className="rounded-none p-0" onClick={onClick}>
      {content}
    </DropdownMenuItem>
  );
}

interface NavDropdownProps {
  label: string;
  items: Array<{
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
  }>;
}

function NavDropdown({ label, items }: NavDropdownProps) {
  const pathname = usePathname();
  let link = "";
  let link2 = "";

  if (label === "Create") {
    link = "/create";
  } else if (label === "Collect") {
    link = "/collect";
  } else if (label === "Earn & Borrow") {
    link = "/lending";
    link2 = "/borrowing";
  } else if (label === "Auction") {
    link = "/auction";
  } else if (label === "Bridge") {
    link = "/bridge";
  } else if (label === "Portfolio & Faucet") {
    link = "/manage";
  }
  const isActive =
    pathname.startsWith(link) || (link2 && pathname.startsWith(link2));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`relative text-md px-5 py-3 font-semibold cursor-pointer border-none bg-transparent ${
            isActive ? "text-black" : "text-white"
          }`}
        >
          {isActive && (
            <motion.span
              className="absolute inset-0 z-0 bg-foreground mix-blend-difference"
              layoutId="bubble"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-100 bg-background/80 backdrop-blur-sm border p-0 shadow-lg">
        {items.map((item, index) => (
          <CustomDropdownMenuItem
            key={`${label}-${index}`}
            description={item.description}
            href={item.href}
            title={item.title}
            onClick={item.onClick}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface MobileSectionProps {
  label: string;
  items: Array<{
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
  }>;
  onItemClick: () => void;
}

function MobileSection({ label, items, onItemClick }: MobileSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-pointer">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/10 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg font-medium">{label}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {isExpanded && (
        <div className="bg-accent/5 cursor-pointer">
          {items.map((item, index) => {
            const content = (
              <button
                aria-label={item.title}
                className="flex flex-col p-4 ml-4 border-l-2 border-accent/20 hover:bg-accent/10 transition-colors cursor-pointer text-left w-full"
                tabIndex={0}
                type="button"
                onClick={onItemClick}
              >
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-neutral-500 text-sm mt-1">
                  {item.description}
                </p>
              </button>
            );

            if (item.href) {
              return (
                <Link key={`mobile-${label}-${index}`} href={item.href}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={`mobile-${label}-${index}`}
                aria-label={item.title}
                className="w-full text-left bg-transparent border-none p-0 m-0"
                tabIndex={0}
                type="button"
                onClick={item.onClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    item.onClick && item.onClick();
                  }
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div
        aria-label="Close menu"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
      />

      <div className="fixed inset-y-0 right-0 w-full bg-background/80 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-3 px-6 border-b border-neutral-200 dark:border-neutral-800">
            <Link className="flex-shrink-0" href="/" onClick={onClose}>
              <Image
                alt="Pixcross Logo"
                className="h-20 w-fit"
                height={256}
                src="/logo-white.png"
                width={256}
              />
            </Link>
            <Button className="p-2" size="sm" variant="ghost" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {navigationMenus.map((menu) => (
              <MobileSection
                key={menu.label}
                items={menu.items}
                label={menu.label}
                onItemClick={onClose}
              />
            ))}
          </div>

          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="w-full">
              <ConnectButtonCustom />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="shadow-sm w-full fixed z-40 bg-background/10 backdrop-blur-[2px]">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 xl:px-8 py-5">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                aria-label="Pixcross Home"
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                href="/"
              >
                <Image
                  alt="Pixcross Logo"
                  className="h-20 w-fit"
                  height={256}
                  src="/logo-white.png"
                  width={256}
                />
              </Link>
            </div>

            <div className="hidden xl:flex items-center space-x-3">
              {navigationMenus.map((menu) => (
                <NavDropdown
                  key={menu.label}
                  items={menu.items}
                  label={menu.label}
                />
              ))}
            </div>

            <div className="hidden xl:flex items-center">
              <ConnectButtonCustom />
            </div>

            <div className="xl:hidden">
              <Button
                aria-label="Toggle mobile menu"
                className="p-2"
                size="sm"
                variant="ghost"
                onClick={toggleMobileMenu}
              >
                <AlignRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
