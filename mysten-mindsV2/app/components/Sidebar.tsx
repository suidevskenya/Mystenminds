"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  MessageSquare, 
  Wallet, 
  ChevronLeft, 
  ChevronRight,
  HelpCircle,
  History,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Users,
  CalendarSearch,
  FolderOpenDot,
  Handshake,
  Laptop,
  Book,
  MessageCircle,
  Twitter,
  Bus,
  Gamepad2,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = "" }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>([]) // Track expanded parent items
  const { t } = useTranslation()
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const menuItems = [
    {
      id: "home",
      label: t("home"),
      icon: <Home size={20} />,
      href: "/",
    },
    {
      id: "chats",
      label: t("chats"),
      icon: <MessageSquare size={20} />,
      href: "/",
      requiresAuth: true,
    },
    {
      id: "communities",
      label: t("communities"),
      icon: <Users size={20} />,
      children: [
        {
          id: "telegram",
          label: t("telegram"),
          icon: <MessageCircle size={16} />,
          href: "/telegram",
        },
        {
          id: "twitter",
          label: t("X"),
          icon: <Twitter size={16} />,
          href: "/x-account",
        },
      ],
    },
    {
      id: "events",
      label: t("events"),
      icon: <CalendarSearch size={20} />,
      children: [
        {
          id: "IRL",
          label: t("IRL events"),
          icon: <Handshake size={16} />,
          href:"/lumaevent"
        },
        {
          id:"Hackathons",
          label:t("hackathons"),
          icon: <Laptop size={16} />,
          href:"/sui-hackathon"
        },
        {
          id:"Bootcamps",
          label:t('bootcamps'),
          icon: <Book size={16} />,
          href:"/bootcamps"
        },
        {
          id:"Campustours",
          label:t('campustours'),
          icon: <Bus size={16} />,
          href:"/campustours"
        },
        {
          id:"Gaming",
          label:t('Gaming events'),
          icon: < Gamepad2 size={16} />,
          href:"/gaming-events"
        }
      ]
    },
    {
      id: "projects",
      label: t("projects"),
      icon: <FolderOpenDot size={20} />,
      href: "/",
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
              const isParentExpanded = expandedItems.includes(item.id)
              return (
                <li key={item.id}>
                  <div
                    className={`flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                    ${
                      isExpanded 
                        ? "justify-start" 
                        : "justify-center"
                    }
                    hover:bg-[#2a1a8a] hover:text-blue-300`}
                    onClick={() => item.children && toggleItem(item.id)}
                  >
                    <span className={isExpanded ? "" : "mx-auto"}>
                      {item.icon}
                    </span>
                    {isExpanded && (
                      <>
                        <span className="ml-3 text-sm">{item.label}</span>
                        {item.children && (
                          <span className="ml-auto">
                            {isParentExpanded ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {item.children && isParentExpanded && isExpanded && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href} passHref>
                            <div
                              className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-all
                              hover:bg-[#2a1a8a] hover:text-blue-300`}
                            > 
                              {child.icon && (
                                <span className="text-gray-400">{child.icon}</span>
                              )}
                              <span className="ml-3">{child.label}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
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