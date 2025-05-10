"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface TelegramGroup {
  id: string
  name: string
  url: string
  description: string
  memberCount?: number
  language: string
  category: string
  lastUpdated: any
}

export function useTelegramGroups() {
  const [groups, setGroups] = useState<TelegramGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true)
        const groupsCollection = collection(db, "telegramGroups")
        const groupsQuery = query(groupsCollection, orderBy("category"), orderBy("name"))
        const snapshot = await getDocs(groupsQuery)

        const fetchedGroups: TelegramGroup[] = []
        snapshot.forEach((doc) => {
          fetchedGroups.push({
            id: doc.id,
            ...(doc.data() as Omit<TelegramGroup, "id">),
          })
        })

        setGroups(fetchedGroups)
        setError(null)
      } catch (err) {
        console.error("Error fetching Telegram groups:", err)
        setError("Failed to load Telegram groups")
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  return { groups, loading, error }
}
