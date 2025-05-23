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
import { ProjectItem } from "./ProjectItem"

const dummyProjectsData = [
  { title: "Project One", date: "2024-06-01", description: "Description for project one." },
  { title: "Project Two", date: "2024-06-15", description: "Description for project two." },
  { title: "Project Three", date: "2024-07-01", description: "Description for project three." },
]

export function ProjectsDialog({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => (isOpen ? onOpen() : onClose())}>
      <SheetContent
        side="right"
        className="w-2/3 max-w-none sm:w-full sm:max-w-full"
      >
        <SheetHeader>
          <SheetTitle>Projects</SheetTitle>
          <SheetDescription>List of projects</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {dummyProjectsData.map((project, index) => (
            <ProjectItem
              key={index}
              title={project.title}
              date={project.date}
              description={project.description}
            />
          ))}
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
