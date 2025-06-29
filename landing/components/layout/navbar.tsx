"use client";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export const Navbar = () => {
  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link className="font-bold text-lg flex items-center" href="/">
        <Image
          priority
          alt="Pixcross Logo"
          className="w-12 h-12 rounded-full"
          height={32}
          src="/logo-white.png"
          width={32}
        />
        Pixcross
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                className="text-base px-2 bg-primary/60 text-primary-foreground hover:bg-primary/50 rounded-xl p-2 flex gap-1"
                href="https://app-pixcross.vercel.app/"
                target="_blank"
              >
                <span>Launch App</span>
                <ArrowUpRight />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
