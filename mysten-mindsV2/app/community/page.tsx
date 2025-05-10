"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TelegramGroups } from "@/components/telegram-groups"
import { MobileNav } from "@/components/mobile-nav"
import { useWallet } from "@/hooks/use-wallet"
import { useTranslation } from "react-i18next"

export default function CommunityPage() {
  const { isConnected } = useWallet()
  const { t } = useTranslation()

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
            <h1 className="text-xl font-bold">{t("community")}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <TelegramGroups />
        </div>
      </main>

      <MobileNav isConnected={isConnected} />
    </div>
  )
}
