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
import { EventItem } from "./EventItem"
import { eventCategories, mockEventsData } from "../data/mockEventsData"

export function EventsDialog({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = React.useState(eventCategories[0])

  return (
    <Sheet open={open} onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}>
      <SheetContent
        side="right"
        className="w-2/3 max-w-none sm:w-full sm:max-w-full"
      >
        <SheetHeader>
          <SheetTitle>Events</SheetTitle>
          <SheetDescription>List of upcoming events</SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex flex-col">
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((category) => (
              <button
                key={category}
                className={`rounded-md px-3 py-1 text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {mockEventsData[selectedCategory]?.map((event, index) => (
              <EventItem
                key={index}
                title={event.title}
                date={event.date}
                description={event.description}
                location={event.location}
                speakers={event.speakers}
                registerAt={event.registerAt}
                posterImage={event.posterImage}
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
