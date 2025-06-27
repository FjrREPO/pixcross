import React from "react";
import Image from "next/image";

import Navbar from "../navbar";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <div
        data-framer-background-image-wrapper="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          minHeight: "100vh",
        }}
      >
        <Image
          fill
          priority
          alt=""
          sizes="100vw"
          src="https://framerusercontent.com/images/XVN0C76bAiEHmtZ2Obx8d8teKk.png"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
      <Navbar />
      <div className="mx-auto">{children}</div>
    </div>
  );
}
