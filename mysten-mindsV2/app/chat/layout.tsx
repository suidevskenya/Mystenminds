"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getFullnodeUrl } from "@mysten/sui/client"
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit"
import { SidebarProvider } from '../context/SidebarContext'
import { Sidebar } from '../components/Sidebar'
import { MobileNav } from "../../components/mobile-nav"

// Create a client
const queryClient = new QueryClient()

// Define networks
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  devnet: { url: getFullnodeUrl('devnet') }
}

export default function ChatIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <SidebarProvider>
            <div className="min-h-screen bg-[#2a1a8a] text-white flex">
              <div className="w-64 fixed top-0 left-0 bottom-0 z-40">
                <Sidebar />
              </div>
              <div className="flex-1 ml-64 flex flex-col">
                {children}
                <MobileNav isConnected={false} />
              </div>
            </div>
          </SidebarProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}