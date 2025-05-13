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

const dummyChatsData = [
  { title: "Chat One", date: "2024-06-01", description: "Description for chat one." },
  { title: "Chat Two", date: "2024-06-15", description: "Description for chat two." },
  { title: "Chat Three", date: "2024-07-01", description: "Description for chat three." },
]

export function ChatsDialog({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const [query, setQuery] = React.useState("")
  const filteredChats = dummyChatsData.filter(chat =>
    chat.title.toLowerCase().includes(query.toLowerCase()) ||
    chat.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Sheet open={open} onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}>
      <SheetContent
        side="right"
        className="w-2/3 max-w-none sm:w-full sm:max-w-full"
      >
        <SheetHeader>
          <SheetTitle>Chats</SheetTitle>
          <SheetDescription>List of chats</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search chats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search chats"
          />
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredChats.map((chat, index) => (
              <ChatItem
                key={index}
                title={chat.title}
                date={chat.date}
                description={chat.description}
              />
            ))}
            {filteredChats.length === 0 && (
              <p className="text-gray-500">No chats found.</p>
            )}
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
