"use client"

import * as React from "react"
import { mockTelegramGroups } from "../data/mockTelegramGroups"

export function TelegramGroups() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Telegram Groups</h2>
      <ul className="space-y-4">
        {mockTelegramGroups.map((group, index) => (
          <li key={index} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold">{group.name}</h3>
            <p className="text-gray-700 mb-2">{group.description}</p>
            <a
              href={group.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Join Group
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
