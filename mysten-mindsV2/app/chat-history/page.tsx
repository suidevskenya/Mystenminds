"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { ArrowLeft, MessageSquare, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useTranslation } from "react-i18next"
import {SidebarProvider } from '@/app/context/SidebarContext'

export default function ChatHistoryPage() {
  const { isAuthenticated, chatSessions, currentChatId, setCurrentChatId, createNewChat } = useWallet()
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  // Redirect to connect page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/connect")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId)
    router.push(`/chat/${chatId}`)
  }

  const handleNewChat = () => {
    const newChatId = createNewChat()
    router.push(`/chat/${newChatId}`)
  }

  const toggleDeleteMode = () => {
    setIsDeleting(!isDeleting)
  }

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
            <h1 className="text-xl font-bold">{t("chat_history")}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`text-white ${isDeleting ? "bg-red-500/20" : ""}`}
              onClick={toggleDeleteMode}
            >
              <Trash2 size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={handleNewChat}>
              <Plus size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-20">
        {chatSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <MessageSquare size={48} className="text-gray-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">{t("no_chats_yet")}</h2>
            <p className="text-gray-400 mb-6">{t("start_new_chat_prompt")}</p>
            <Button onClick={handleNewChat} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              {t("new_chat")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {chatSessions
              .sort((a, b) => b.lastUpdated - a.lastUpdated)
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`bg-[#1a1040] rounded-xl p-4 border border-gray-800 transition-all ${
                    chat.id === currentChatId ? "border-blue-500" : ""
                  }`}
                  onClick={() => !isDeleting && handleChatSelect(chat.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-medium truncate">{chat.title}</h3>
                      <p className="text-sm text-gray-400 truncate">
                        {chat.messages.length > 1 ? chat.messages[chat.messages.length - 1].content : t("no_messages")}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(chat.lastUpdated), { addSuffix: true })}
                      </div>
                    </div>
                    {isDeleting && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="ml-2 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Delete chat logic would go here
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-20 right-4 z-30">
        <Button className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg" onClick={handleNewChat}>
          <Plus size={24} />
        </Button>
      </div>
      <SidebarProvider>
        <MobileNav isConnected={isAuthenticated} />
      </SidebarProvider>
      
    </div>
  )
}
