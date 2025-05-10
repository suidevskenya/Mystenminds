"use client"

import { useState, useCallback, useEffect } from "react"

interface ChatMessage {
  id: string
  role: "user" | "system"
  content: string
  timestamp: number
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  lastUpdated: number
}

interface WalletState {
  isConnected: boolean
  walletAddress: string
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  connectWallet: () => Promise<void>
  isAuthenticated: boolean
  chatSessions: ChatSession[]
  currentChatId: string | null
  addMessage: (message: Omit<ChatMessage, "id">) => void
  createNewChat: () => string
  getChatById: (id: string) => ChatSession | undefined
  setCurrentChatId: (id: string | null) => void
}

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

export function useWallet(): WalletState {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  // Load chat sessions from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessions = localStorage.getItem("chatSessions")
      if (savedSessions) {
        setChatSessions(JSON.parse(savedSessions))
      }

      const savedCurrentChat = localStorage.getItem("currentChatId")
      if (savedCurrentChat) {
        setCurrentChatId(savedCurrentChat)
      }
    }
  }, [])

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions))
    }
  }, [chatSessions, isAuthenticated])

  // Save current chat ID to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && currentChatId) {
      localStorage.setItem("currentChatId", currentChatId)
    }
  }, [currentChatId])

  const connect = useCallback(async () => {
    try {
      // In a real implementation, this would connect to the Sui wallet
      // For now, simulate a connection
      setWalletAddress("0x7a9f...3e4d")
      setBalance(2350)
      setIsConnected(true)
      setIsAuthenticated(true)

      // Create a default chat session if none exists
      setChatSessions((prev) => {
        if (prev.length === 0) {
          const newChatId = generateId()
          setCurrentChatId(newChatId)
          return [
            {
              id: newChatId,
              title: "New Chat",
              messages: [
                {
                  id: generateId(),
                  role: "system",
                  content: "Welcome to MysteinMinds! How can I help you with SUI blockchain today?",
                  timestamp: Date.now(),
                },
              ],
              lastUpdated: Date.now(),
            },
          ]
        }
        return prev
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }, [])

  const disconnect = useCallback(() => {
    setWalletAddress("")
    setBalance(0)
    setIsConnected(false)
    setIsAuthenticated(false)
    setCurrentChatId(null)
  }, [])

  const connectWallet = useCallback(async () => {
    // Simulate a delay for the connection process
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await connect()
  }, [connect])

  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id">) => {
      if (!currentChatId || !isAuthenticated) return

      setChatSessions((prev) => {
        const newMessage: ChatMessage = {
          ...message,
          id: generateId(),
        }

        return prev.map((session) => {
          if (session.id === currentChatId) {
            // Update the chat title based on the first user message if it's still "New Chat"
            let title = session.title
            if (title === "New Chat" && message.role === "user") {
              title = message.content.length > 30 ? `${message.content.substring(0, 30)}...` : message.content
            }

            return {
              ...session,
              title,
              messages: [...session.messages, newMessage],
              lastUpdated: Date.now(),
            }
          }
          return session
        })
      })
    },
    [currentChatId, isAuthenticated],
  )

  const createNewChat = useCallback(() => {
    if (!isAuthenticated) return ""

    const newChatId = generateId()

    setChatSessions((prev) => [
      ...prev,
      {
        id: newChatId,
        title: "New Chat",
        messages: [
          {
            id: generateId(),
            role: "system",
            content: "Welcome to MysteinMinds! How can I help you with SUI blockchain today?",
            timestamp: Date.now(),
          },
        ],
        lastUpdated: Date.now(),
      },
    ])

    setCurrentChatId(newChatId)
    return newChatId
  }, [isAuthenticated])

  const getChatById = useCallback(
    (id: string) => {
      return chatSessions.find((session) => session.id === id)
    },
    [chatSessions],
  )

  return {
    isConnected,
    walletAddress,
    balance,
    connect,
    disconnect,
    connectWallet,
    isAuthenticated,
    chatSessions,
    currentChatId,
    addMessage,
    createNewChat,
    getChatById,
    setCurrentChatId,
  }
}
