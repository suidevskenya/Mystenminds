"use client"

import { Home, MessageSquare, Wallet, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useSidebar } from "@/app/context/SidebarContext"

interface MobileNavProps {
  isConnected: boolean
}

export function MobileNav({ isConnected }: MobileNavProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { toggleSidebar } = useSidebar()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1040] border-t border-gray-800 sm:flex md:hidden lg:hidden">
      <div className="flex h-16 items-center justify-around">
        <button
          className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          onClick={() => router.push("/")}
        >
          <Home size={20} />
          <span className="mt-1">{t("nav_home")}</span>
        </button>

        <button
          className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          onClick={() => router.push("/chat")}
        >
          <MessageSquare size={20} />
          <span className="mt-1">{t("nav_chat")}</span>
        </button>

        <button
          className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          onClick={() => router.push("/wallet")}
        >
          <Wallet size={20} />
          <span className="mt-1">{t("nav_wallet")}</span>
        </button>

        <button
          className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
          <span className="mt-1">{t("nav_menu")}</span>
        </button>
      </div>
    </div>
  )
}