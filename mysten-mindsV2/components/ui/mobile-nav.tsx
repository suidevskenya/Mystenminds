"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, Home, MessageSquare, Wallet, Settings, Info, History, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  isConnected: boolean
}

export function MobileNav({ isConnected }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Chat",
      href: isConnected ? "/chat-history" : "/connect",
      icon: MessageSquare,
    },
    {
      name: "Wallet",
      href: isConnected ? "/wallet" : "/connect",
      icon: Wallet,
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
    },
    {
      name: "History",
      href: "/chat-history",
      icon: History,
      requiresAuth: true,
    },
    {
      name: "About",
      href: "/about",
      icon: Info,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  // Filter out items that require authentication if not connected
  const filteredNavItems = navItems.filter((item) => !item.requiresAuth || (item.requiresAuth && isConnected))

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1040] rounded-t-3xl overflow-hidden shadow-2xl md:hidden"
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300/30 rounded-full" />
            </div>
            <nav className="p-4">
              <ul className="grid grid-cols-3 gap-4">
                {filteredNavItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-xl transition-colors",
                        pathname === item.href
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70",
                      )}
                    >
                      <item.icon size={20} />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#1a1040]/90 backdrop-blur-md border-t border-gray-800 md:hidden">
        <nav className="px-2 py-1">
          <ul className="flex justify-around">
            {filteredNavItems.slice(0, 3).map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                    pathname === item.href ? "text-blue-400" : "text-gray-400 hover:text-gray-300",
                  )}
                >
                  <item.icon size={20} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
