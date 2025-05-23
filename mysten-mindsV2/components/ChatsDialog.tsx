"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./ui/sheet"
import { Button } from "./ui/button"
import { ChatItem } from "./ChatItem"
import { db } from "../lib/firebase"
import { collection, getDocs } from "firebase/firestore"

type TelegramGroup = {
  description: string
  focusArea: string
  primaryLanguage: string
  link: string
}

export function ChatsDialog({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const [query, setQuery] = React.useState("")
  const [telegramGroups, setTelegramGroups] = React.useState<TelegramGroup[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return

    const fetchTelegramGroups = async () => {
      setLoading(true)
      setError(null)
      try {
        const groupsCollection = collection(db, "telegramGroups")
        const querySnapshot = await getDocs(groupsCollection)
        const groups: TelegramGroup[] = []
        querySnapshot.forEach((doc) => {
          groups.push(doc.data() as TelegramGroup)
        })
        setTelegramGroups(groups)
      } catch (err) {
        setError("Failed to load telegram groups.")
        console.error("Error fetching telegram groups:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTelegramGroups()
  }, [open])

  const filteredGroups = telegramGroups.filter(group =>
    group.description.toLowerCase().includes(query.toLowerCase()) ||
    group.focusArea.toLowerCase().includes(query.toLowerCase()) ||
    group.primaryLanguage.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Sheet open={open} onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}>
      <SheetContent
        side="right"
        className="w-2/3 max-w-none sm:w-full sm:max-w-full"
      >
        <SheetHeader>
          <SheetTitle>Telegram Groups</SheetTitle>
          <SheetDescription>List of telegram community groups</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search telegram groups..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search telegram groups"
          />
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loading && <p>Loading telegram groups...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && filteredGroups.length === 0 && (
              <p className="text-gray-500">No telegram groups found.</p>
            )}
            {!loading && !error && filteredGroups.map((group, index) => (
              <ChatItem
                key={index}
                title={group.description}
                date={group.focusArea}
                description={`Language: ${group.primaryLanguage} | Link: ${group.link}`}
              />
            ))}
          </div>
        </div>
        <SheetClose asChild>
          <Button variant="outline" className="mt-6 w-full">
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
