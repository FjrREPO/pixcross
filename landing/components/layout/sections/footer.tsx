import { Book, Github, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";

export const FooterSection = () => {
  return (
    <footer className="container py-24 sm:py-32" id="footer">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="flex flex-row justify-between gap-y-8">
          <div className="col-span-full xl:col-span-2">
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
          </div>

          <div className="flex flex-row gap-5 items-center">
            <Link href="https://github.com/FjrREPO/pixcross" target="_blank">
              <Github />
            </Link>

            <Link href="https://x.com/pixcross_fi" target="_blank">
              <Twitter />
            </Link>

            <Link
              href="https://pixcross.gitbook.io/pixcross-docs/"
              target="_blank"
            >
              <Book />
            </Link>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; 2025 <span className="text-primary">Pixcross</span>
          </h3>
        </section>
      </div>
    </footer>
  );
};
