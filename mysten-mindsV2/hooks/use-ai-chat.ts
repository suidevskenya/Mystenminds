"use client"

import { useState, useCallback } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface TelegramGroup {
  id: string
  name: string
  url: string
  description: string
  memberCount?: number
  language: string
  category: string
}

interface AIChatResponse {
  text: string
  telegramGroups?: TelegramGroup[]
}

export function useAIChat() {
  const [isProcessing, setIsProcessing] = useState(false)

  const processMessage = useCallback(async (message: string): Promise<AIChatResponse> => {
    setIsProcessing(true)

    try {
      // Check if the message is related to community or groups
      const communityKeywords = ["community", "group", "telegram", "chat", "join", "connect", "people", "members"]
      const isCommunityRelated = communityKeywords.some((keyword) => message.toLowerCase().includes(keyword))

      let telegramGroups: TelegramGroup[] = []

      // If the message is community-related, fetch relevant groups
      if (isCommunityRelated) {
        const groupsCollection = collection(db, "telegramGroups")
        const snapshot = await getDocs(groupsCollection)

        snapshot.forEach((doc) => {
          telegramGroups.push({
            id: doc.id,
            ...(doc.data() as Omit<TelegramGroup, "id">),
          })
        })

        // Sort by relevance (this is a simple implementation)
        // In a real app, you might want to use more sophisticated matching
        telegramGroups = telegramGroups.sort((a, b) => {
          // Count keyword matches in description
          const aMatches = communityKeywords.filter((keyword) => a.description.toLowerCase().includes(keyword)).length

          const bMatches = communityKeywords.filter((keyword) => b.description.toLowerCase().includes(keyword)).length

          return bMatches - aMatches
        })

        // Limit to top 3 most relevant groups
        telegramGroups = telegramGroups.slice(0, 3)
      }

      // In a real implementation, you would call your AI service here
      // For now, we'll simulate a response
      let responseText = "I'm your AI guide to the SUI ecosystem. "

      if (isCommunityRelated && telegramGroups.length > 0) {
        responseText +=
          "I found some Sui community Telegram groups that might interest you. You can check them out in the suggestions below."
      } else {
        responseText +=
          "I can provide information about SUI blockchain, Move programming, and Mysten Labs. What specific aspect would you like to learn about?"
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        text: responseText,
        telegramGroups: telegramGroups.length > 0 ? telegramGroups : undefined,
      }
    } catch (error) {
      console.error("Error processing message:", error)
      return {
        text: "I'm sorry, I encountered an error while processing your message. Please try again later.",
      }
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    processMessage,
    isProcessing,
  }
}
