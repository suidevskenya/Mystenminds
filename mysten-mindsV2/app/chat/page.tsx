"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to MysteinMinds! How can I help you with SUI blockchain today?" },
  ])
  const [input, setInput] = useState("")
  const [robotState, setRobotState] = useState("idle") // idle, thinking, speaking
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])
    setInput("")

    // Show robot thinking
    setRobotState("thinking")

    // Simulate AI response
    setTimeout(() => {
      setRobotState("speaking")
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "I'm your AI guide to the SUI ecosystem. I can provide information about SUI blockchain, Move programming, and Mysten Labs. What specific aspect would you like to learn about?",
        },
      ])

      setTimeout(() => {
        setRobotState("idle")
      }, 1000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#2a1a8a] text-white flex flex-col">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold">
                M
              </div>
              <h1 className="text-2xl font-bold">MysteinMinds</h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">Connect Button</Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <div className="sticky top-0 z-10 flex items-center gap-4 mb-6 bg-[#2a1a8a]/80 backdrop-blur-sm py-2">
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-08%20at%2023.36.06_6a4f54c7.jpg-Hr2rzfTILfPTPym2oftFKyvqoR9iCO.jpeg"
              alt="AI Assistant Robot"
              width={64}
              height={64}
              className={`object-contain transition-all duration-300 ${
                robotState === "thinking" ? "animate-pulse" : ""
              } ${robotState === "speaking" ? "scale-110" : ""}`}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">MysteinMinds AI</h2>
            <p className="text-sm text-blue-300">
              {robotState === "idle" && "Ready to help"}
              {robotState === "thinking" && "Thinking..."}
              {robotState === "speaking" && "Responding..."}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white/10 rounded-lg p-4 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                message.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700 flex items-start gap-2"
              }`}
            >
              {message.role === "system" && (
                <div className="w-8 h-8 relative flex-shrink-0 mt-1">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-08%20at%2023.36.06_6a4f54c7.jpg-Hr2rzfTILfPTPym2oftFKyvqoR9iCO.jpeg"
                    alt="AI Assistant Robot"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              )}
              <div>{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 bg-white/10 p-3 rounded-lg">
          <Input
            placeholder="Ask anything about SUI blockchain..."
            className="bg-white/20 border-none text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
