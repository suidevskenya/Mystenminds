"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { useAIChat } from "@/hooks/use-ai-chat"
import { MobileNav } from "@/components/mobile-nav"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { SidebarProvider } from "@/app/context/SidebarContext"

interface TelegramGroup {
  id: string
  name: string
  url: string
  description: string
  memberCount?: number
  language: string
  category: string
}

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { isAuthenticated, getChatById, addMessage, currentChatId, setCurrentChatId } = useWallet()
  const { processMessage, isProcessing } = useAIChat()

  const [input, setInput] = useState("")
  const [robotState, setRobotState] = useState("idle") // idle, thinking, speaking
  const [suggestedGroups, setSuggestedGroups] = useState<TelegramGroup[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get the chat session
  const chatId = Array.isArray(id) ? id[0] : id
  const chatSession = getChatById(chatId ?? "")

  // Redirect to connect page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/connect")
    }
  }, [isAuthenticated, router])

  // Redirect to chat history if chat doesn't exist
  useEffect(() => {
    if (isAuthenticated && !chatSession) {
      router.push("/chat-history")
    }
  }, [isAuthenticated, chatSession, router])

  // Set current chat ID
  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      setCurrentChatId(chatId)
    }
  }, [chatId, currentChatId, setCurrentChatId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatSession?.messages, suggestedGroups])

  const handleSend = async () => {
    if (!input.trim() || !isAuthenticated || isProcessing) return

    // Add user message
    addMessage({
      role: "user",
      content: input,
      timestamp: Date.now(),
    })

    const userMessage = input
    setInput("")

    // Show robot thinking
    setRobotState("thinking")
    setSuggestedGroups([])

    try {
      // Process the message with AI
      const response = await processMessage(userMessage)

      // Add AI response
      addMessage({
        role: "system",
        content: response.text,
        timestamp: Date.now(),
      })

      // Set suggested Telegram groups if any
      if (response.telegramGroups && response.telegramGroups.length > 0) {
        setSuggestedGroups(response.telegramGroups)
      } else {
        setSuggestedGroups([])
      }

      setRobotState("speaking")

      setTimeout(() => {
        setRobotState("idle")
      }, 1000)
    } catch (error) {
      console.error("Error processing message:", error)

      // Add error message
      addMessage({
        role: "system",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      })

      setRobotState("idle")
    }
  }

  if (!isAuthenticated || !chatSession) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#2a1a8a] text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-[#1a1040] backdrop-blur-md border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/chat-history">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-lg font-medium truncate max-w-[200px]">{chatSession.title}</h1>
          </div>
          <div className="robot-status-indicator">
            <div className={`robot-status ${robotState}`}>
              {robotState === "idle" && t("status_idle")}
              {robotState === "thinking" && t("status_thinking")}
              {robotState === "speaking" && t("status_speaking")}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 pb-20 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatSession.messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[85%] ${
                message.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700 mr-auto"
              }`}
            >
              <div>{message.content}</div>
            </div>
          ))}

          {/* Telegram Group Suggestions */}
          {suggestedGroups.length > 0 && (
            <div className="bg-gray-800/50 p-3 rounded-lg mr-auto max-w-[85%]">
              <h3 className="text-sm font-medium mb-2">{t("suggested_telegram_groups")}</h3>
              <div className="space-y-2">
                {suggestedGroups.map((group) => (
                  <Card key={group.id} className="bg-gray-700/50 border-gray-600">
                    <CardContent className="p-3">
                      <CardTitle className="text-sm mb-1">{group.name}</CardTitle>
                      <p className="text-xs text-gray-300 line-clamp-2">{group.description}</p>
                    </CardContent>
                    <CardFooter className="p-2 pt-0">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30"
                      >
                        <a href={group.url} target="_blank" rel="noopener noreferrer">
                          {t("join_group")}
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 bg-[#2a1a8a]/80 backdrop-blur-md pt-2">
          <div className="flex gap-2 bg-[#1a1040] p-3 rounded-lg">
            <Input
              placeholder={t("ask_placeholder")}
              className="bg-[#0d0a20] border-none text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={robotState !== "idle"}
            />
            <Button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={robotState !== "idle" || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <SidebarProvider>
          <MobileNav isConnected={isAuthenticated} />
      </SidebarProvider>
      
    </div>
  )
}
