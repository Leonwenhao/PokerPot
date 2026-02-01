"use client";

import type { ReactNode } from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ArbitrumSepolia, BaseSepoliaTestnet } from "@thirdweb-dev/chains";

export default function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

  return (
    <ThirdwebProvider
      clientId={clientId}
      activeChain={BaseSepoliaTestnet}
      supportedChains={[BaseSepoliaTestnet, ArbitrumSepolia]}
    >
      {children}
    </ThirdwebProvider>
  );
}
