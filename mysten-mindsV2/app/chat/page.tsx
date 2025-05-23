"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Sidebar } from "../components/Sidebar"
import { SidebarProvider } from '../context/SidebarContext'
import { MobileNav } from "../../components/mobile-nav"
import ReactMarkdown from "react-markdown"
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to MysteinMinds! How can I help you with SUI blockchain today?", timestamp: new Date() },
  ])
  const [input, setInput] = useState("")
  const [robotState, setRobotState] = useState("idle")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const account = useCurrentAccount()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage = { role: "user", content: input, timestamp: new Date() }
    setMessages([...messages, newMessage])
    setInput("")
    setRobotState("thinking")

    setTimeout(() => {
      setRobotState("speaking")
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "I'm your AI guide to the SUI ecosystem.\n\n*Ask me about:*\n- SUI blockchain\n- Move programming\n- Mysten Labs",
          timestamp: new Date(),
        },
      ])
      setTimeout(() => setRobotState("idle"), 1000)
    }, 1500)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#2a1a8a] text-white flex">
        <div className="w-64 fixed top-0 left-0 bottom-0 z-40">
          <Sidebar />
        </div>

        <div className="flex-1 ml-64 flex flex-col">
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
            <div className="flex items-center gap-4">
              {account && (
                <div className="text-sm bg-white/10 px-3 py-1 rounded-md">
                  Connected to {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </div>
              )}
                {/* Connect Button */}
            <ConnectButton className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition" />
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
                  width={40}
                  height={40}
                  className={`object-contain transition-all duration-300 ${robotState === "thinking" ? "animate-pulse" : ""} ${robotState === "speaking" ? "scale-110" : ""}`}
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

            {robotState === "thinking" && (
              <div className="text-sm text-blue-200 italic mb-2">MysteinMinds AI is typing...</div>
            )}

            <div className="flex-1 bg-white/10 rounded-lg p-4 mb-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-3 rounded-lg max-w-[80%] text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 ml-auto text-white shadow"
                      : "bg-white/10 border border-white/20 text-white flex items-start gap-2"
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
                  <div className="flex-1">
                    <div className="prose prose-invert max-w-full">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="mt-1 text-xs text-blue-200 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
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
                autoFocus
              />
              <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </main>
          <MobileNav isConnected={!!account} />
        </div>
      </div>
    </SidebarProvider>
  )
}