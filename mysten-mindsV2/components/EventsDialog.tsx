"use client"

import * as React from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./ui/sheet"
import { Button } from "./ui/button"
import { EventItem } from "./EventItem"

const eventCategories = [
  "IRL Events",
  "Hackathons",
  "Bootcamps",
  "Campus Tours",
  "Gaming Events",
]

const dummyEventsData: Record<string, { title: string; date: string; description: string }[]> = {
  "IRL Events": [
    { title: "IRL Event One", date: "2024-06-05", description: "Description for IRL event one." },
    { title: "IRL Event Two", date: "2024-06-20", description: "Description for IRL event two." },
  ],
  "Hackathons": [
    { title: "Hackathon One", date: "2024-07-01", description: "Description for hackathon one." },
    { title: "Hackathon Two", date: "2024-07-15", description: "Description for hackathon two." },
  ],
  "Bootcamps": [
    { title: "Bootcamp One", date: "2024-08-01", description: "Description for bootcamp one." },
    { title: "Bootcamp Two", date: "2024-08-15", description: "Description for bootcamp two." },
  ],
  "Campus Tours": [
    { title: "Campus Tour One", date: "2024-09-01", description: "Description for campus tour one." },
    { title: "Campus Tour Two", date: "2024-09-15", description: "Description for campus tour two." },
  ],
  "Gaming Events": [
    { title: "Gaming Event One", date: "2024-10-01", description: "Description for gaming event one." },
    { title: "Gaming Event Two", date: "2024-10-15", description: "Description for gaming event two." },
  ],
}


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
            {dummyEventsData[selectedCategory].map((event, index) => (
              <EventItem
                key={index}
                title={event.title}
                date={event.date}
                description={event.description}
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
