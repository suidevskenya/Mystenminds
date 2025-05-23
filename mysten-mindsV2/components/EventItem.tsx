"use client"

import * as React from "react"

interface EventItemProps {
  title: string
  date: string
  description: string
}

export function EventItem({ title, date, description }: EventItemProps) {
  return (
    <div className="border-b border-gray-200 py-3 last:border-b-0">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <time className="block text-sm text-gray-500 mb-1">{date}</time>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  )
}
