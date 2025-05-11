'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getFullnodeUrl } from "@mysten/sui/client"
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit"

const queryClient = new QueryClient();

const networks = {
	testnet: { url: getFullnodeUrl('testnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
  devnet:{url: getFullnodeUrl('devnet')}
};


export function SuiProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
            <WalletProvider>
                 {children}
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
  );
}
