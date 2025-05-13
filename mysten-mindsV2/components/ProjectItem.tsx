import React from "react"

interface ProjectItemProps {
  title: string
  date: string
  description: string
}

export function ProjectItem({ title, date, description }: ProjectItemProps) {
  return (
    <div className="border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  )
}
