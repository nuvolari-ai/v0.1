'use client';
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { TRPCReactProvider } from "@nuvolari/trpc/react"
import { darkTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider } from "@tanstack/react-query"
import { wagmiConfig } from "@nuvolari/wagmi"

import { QueryClient } from "@tanstack/react-query";
import { ModalProvider } from "@nuvolari/components/modal-provider";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TRPCReactProvider queryClient={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            <ModalProvider>
              {children}
            </ModalProvider>
          </RainbowKitProvider>
        </TRPCReactProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};