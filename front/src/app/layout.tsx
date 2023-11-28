"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiProvider } from "@/utils/wagmi";
import Apollo from "@/shared/Apollo";
import { Auth } from "@/shared/Auth";
import { Config } from "@/shared/Config";
import { Eas } from "@/shared/Eas";
import "bulma/css/bulma.min.css";
import { CssBaseline, NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Sismo Connect - Onchain Tutorial",
//   description: "A medical research platform built on zk technology",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>ZKcare</title>
      </head>

      <body className={inter.className}>
        <Apollo>
          <NextUIProvider>
            <WagmiProvider>
              <Config>
                <Auth>
                  <Eas>{children}</Eas>
                </Auth>
              </Config>
            </WagmiProvider>
          </NextUIProvider>
        </Apollo>
      </body>
    </html>
  );
}
