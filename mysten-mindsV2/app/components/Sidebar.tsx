"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Home, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Users,
  CalendarSearch,
  FolderOpenDot,
  MessageCircle,
  Twitter,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { EventsDialog } from "@/components/EventsDialog"
import { ProjectsDialog } from "@/components/ProjectsDialog"
import { ChatsDialog } from "@/components/ChatsDialog"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = "" }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>([]) // Track expanded parent items
  const { t } = useTranslation()
  const [isEventsDialogOpen, setIsEventsDialogOpen] = useState(false)
  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false)
  const [isChatsDialogOpen, setIsChatsDialogOpen] = useState(false)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const openEventsDialog = () => {
    setIsEventsDialogOpen(true)
  }

  const closeEventsDialog = () => {
    setIsEventsDialogOpen(false)
  }

  const openProjectsDialog = () => {
    setIsProjectsDialogOpen(true)
  }

  const closeProjectsDialog = () => {
    setIsProjectsDialogOpen(false)
  }

  const openChatsDialog = () => {
    setIsChatsDialogOpen(true)
  }

  const closeChatsDialog = () => {
    setIsChatsDialogOpen(false)
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
      onClick: openChatsDialog,
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
      onClick: openEventsDialog,
    },
    {
      id: "projects",
      label: t("projects"),
      icon: <FolderOpenDot size={20} />,
      onClick: openProjectsDialog,
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
              const content = (
                <div
                  className={`flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                  ${
                    isExpanded 
                      ? "justify-start" 
                      : "justify-center"
                  }
                  hover:bg-[#2a1a8a] hover:text-blue-300`}
                  onClick={() => {
                    if (item.children) {
                      toggleItem(item.id)
                    } else if (item.onClick) {
                      item.onClick()
                    }
                  }}
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
              )
              return (
                <li key={item.id}>
                  {item.href && !item.children ? (
                    <Link href={item.href} passHref>
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                  {item.id === "events" && isExpanded && (
                    <EventsDialog open={isEventsDialogOpen} onOpen={() => setIsEventsDialogOpen(true)} onClose={closeEventsDialog} />
                  )}
                  {item.id === "projects" && isExpanded && (
                    <ProjectsDialog open={isProjectsDialogOpen} onOpen={() => setIsProjectsDialogOpen(true)} onClose={closeProjectsDialog} />
                  )}
                  {item.id === "chats" && isExpanded && (
                    <ChatsDialog open={isChatsDialogOpen} onOpen={() => setIsChatsDialogOpen(true)} onClose={closeChatsDialog} />
                  )}
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
  </div>
  )
}
