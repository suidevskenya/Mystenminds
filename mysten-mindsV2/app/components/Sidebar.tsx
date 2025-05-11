"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  MessageSquare, 
  Wallet, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  History,
  Bookmark,
  Users,
  Info
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = "" }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { t } = useTranslation()
  const router = useRouter()
  const { isConnected } = useWallet()

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const menuItems = [
    {
      id: "events",
      label: t("menu_home"),
      icon: <Home size={20} />,
      href: "/",
    },
    {
      id: "bootcamps",
      label: t("menu_chat"),
      icon: <MessageSquare size={20} />,
      href: "/chat",
      requiresAuth: true,
    },
    {
      id: "hackathons",
      label: t("menu_hackathons"),
      icon: <History size={20} />,
      href: "/history",
      requiresAuth: true,
    },
    {
      id: "bookmarks",
      label: t("menu_bookmarks"),
      icon: <Bookmark size={20} />,
      href: "/bookmarks",
      requiresAuth: true,
    },
    {
      id: "community",
      label: t("menu_community"),
      icon: <Users size={20} />,
      href: "/community",
    },
    {
      id: "wallet",
      label: t("menu_wallet"),
      icon: <Wallet size={20} />,
      href: "/wallet",
      requiresAuth: true,
    },
    {
      id: "help",
      label: t("menu_help"),
      icon: <HelpCircle size={20} />,
      href: "/help",
    },
    {
      id: "about",
      label: t("menu_about"),
      icon: <Info size={20} />,
      href: "/about",
    },
    {
      id: "settings",
      label: t("menu_settings"),
      icon: <Settings size={20} />,
      href: "/settings",
    },
  ]

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-full transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } ${className}`}
    >
      <div className="flex h-full flex-col bg-[#1a1040] border-r border-gray-800">
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold robot-logo">
              M
            </div>
            {isExpanded && (
              <span className="font-bold text-white">MysteinMinds</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={toggleSidebar}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 flex-1 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              if (item.requiresAuth && !isConnected) {
                return null
              }
              
              return (
                <li key={item.id}>
                  <Link href={item.href} passHref>
                    <div
                      className={`flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                      ${
                        isExpanded 
                          ? "justify-start" 
                          : "justify-center"
                      }
                      hover:bg-[#2a1a8a] hover:text-blue-300`}
                    >
                      <span className={isExpanded ? "" : "mx-auto"}>
                        {item.icon}
                      </span>
                      {isExpanded && (
                        <span className="ml-3 text-sm">{item.label}</span>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Connection Status */}
        <div className="mb-4 px-3 py-2">
          {isConnected ? (
            <div className={`flex items-center ${
              isExpanded ? "justify-start" : "justify-center"
            } rounded-lg bg-[#2a1a8a] px-3 py-2 text-xs`}>
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              {isExpanded && (
                <span className="text-green-300">{t("status_connected")}</span>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className={`w-full bg-transparent border-blue-600 text-blue-300 hover:bg-blue-900 hover:text-blue-100 ${
                !isExpanded && "px-0"
              }`}
              onClick={() => router.push("/wallet")}
            >
              <Wallet size={16} className={!isExpanded ? "mx-auto" : "mr-2"} />
              {isExpanded && t("connect")}
            </Button>
          )}
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 rounded-full bg-blue-700 hover:bg-blue-600 text-white shadow-lg border border-blue-500 lg:hidden"
        onClick={toggleSidebar}
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </Button>
    </div>
  )
}