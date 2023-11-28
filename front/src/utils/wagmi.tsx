"use client";

import { useEffect, useState } from "react";
import {
  mainnet,
  goerli,
  sepolia,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  scrollTestnet,
  gnosis,
  polygon,
  polygonMumbai,
} from "viem/chains";
import { Chain, configureChains, createConfig } from "wagmi";
import { WagmiConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

export const mumbaiFork = {
  id: 420,
  name: "Optimism Goerli - Tutorial Sismo",
  network: "forkMumbaiTutoSismo",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://goerli.optimism.io:8545"],
      //http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://goerli.optimism.io:8545"],
      //http: ["http://127.0.0.1:8545"],
    },
  },
} as const satisfies Chain;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mumbaiFork,
    mainnet,
    goerli,
    sepolia,
    optimism,
    optimismGoerli,
    arbitrum,
    arbitrumGoerli,
    scrollTestnet,
    gnosis,
    polygon,
    polygonMumbai,
  ],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
}
