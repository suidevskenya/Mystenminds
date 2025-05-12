"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, ExternalLink, LogOut, RefreshCw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useTranslation } from "react-i18next"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import {SidebarProvider} from '@/app/context/SidebarContext'

export default function WalletPage() {
  const { isConnected, walletAddress, balance, disconnect } = useWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()

  if (!isConnected) {
    router.push("/connect")
    return null
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const refreshBalance = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const transactions = [
    {
      id: "0x1",
      type: "Send",
      amount: "10.5 SUI",
      to: "0x8d7f...2e1a",
      date: "2 hours ago",
      status: "Completed",
    },
    {
      id: "0x2",
      type: "Receive",
      amount: "5.2 SUI",
      from: "0x9e2c...1f5b",
      date: "Yesterday",
      status: "Completed",
    },
    {
      id: "0x3",
      type: "Swap",
      amount: "2.1 SUI",
      for: "42 USDC",
      date: "3 days ago",
      status: "Completed",
    },
  ]

  return (
    <div className="min-h-screen bg-[#2a1a8a] text-white">
      <header className="sticky top-0 z-10 bg-[#1a1040] backdrop-blur-md border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{t("wallet_title")}</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={refreshBalance}>
            <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20">
        <div className="wallet-card bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-sm font-medium text-blue-100">{t("total_balance")}</h2>
              <div className="text-3xl font-bold mt-1">{balance} SUI</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/10 text-white rounded-full h-10 w-10"
              onClick={() => window.open(`https://explorer.sui.io/address/${walletAddress}`, "_blank")}
            >
              <ExternalLink size={18} />
            </Button>
          </div>

          <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-blue-500" />
              </div>
              <div className="text-sm font-medium">{truncateAddress(walletAddress)}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8"
              onClick={() => copyToClipboard(walletAddress)}
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button className="bg-blue-600 hover:bg-blue-700 py-6 rounded-xl flex flex-col items-center gap-2">
            <Send size={24} />
            <span>{t("send")}</span>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 py-6 rounded-xl flex flex-col items-center gap-2">
            <RefreshCw size={24} />
            <span>{t("swap")}</span>
          </Button>
        </div>

        <div className="bg-[#1a1040] rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">{t("recent_transactions")}</h2>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === "Send"
                          ? "bg-red-500/20"
                          : tx.type === "Receive"
                            ? "bg-green-500/20"
                            : "bg-blue-500/20"
                      }`}
                    >
                      {tx.type === "Send" ? (
                        <Send size={16} className="text-red-400" />
                      ) : tx.type === "Receive" ? (
                        <Send size={16} className="text-green-400 transform rotate-180" />
                      ) : (
                        <RefreshCw size={16} className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{tx.type}</div>
                      <div className="text-xs text-gray-400">{tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tx.amount}</div>
                    <div className="text-xs text-gray-400">{tx.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            {t("view_all_transactions")}
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={disconnect}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("disconnect_wallet")}
        </Button>
      </main>
      <SidebarProvider>
            <MobileNav isConnected={isConnected} />
      </SidebarProvider>  
      
    </div>
  )
}
