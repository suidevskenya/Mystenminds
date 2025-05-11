"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"

interface SidebarContextType {
  isExpanded: boolean
  toggleSidebar: () => void
  setIsExpanded: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Check localStorage for user preference on first load
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded")
    if (savedState !== null) {
      setIsExpanded(savedState === "true")
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded.toString())
  }, [isExpanded])

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}