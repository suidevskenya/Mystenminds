"use client"

import * as React from "react"

export interface EventItemProps {
  title: string
  date: string
  description: string
  location?: string
  speakers?: string
  registerAt?: string
  posterImage?: string
}

export function EventItem({ title, date, description, location, speakers, registerAt, posterImage }: EventItemProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 rounded-lg border border-gray-300 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      {posterImage && (
        <img
          src={posterImage}
          alt={title}
          className="h-32 w-full md:w-48 flex-shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{date}</p>
          <p className="text-gray-700 mb-1">{description}</p>
          {location && <p className="text-gray-700 mb-1"><strong>Location:</strong> {location}</p>}
          {speakers && <p className="text-gray-700 mb-1"><strong>Speakers:</strong> {speakers}</p>}
          {registerAt && <p className="text-gray-700 mb-1"><strong>Register at:</strong> <a href={registerAt} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{registerAt}</a></p>}
        </div>
      </div>
    </div>
  )
}
