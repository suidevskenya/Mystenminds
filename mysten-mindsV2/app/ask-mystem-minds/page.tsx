"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Lock } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectButton } from "@mysten/dapp-kit"

export default function AskMyStemMinds() {
  const [question, setQuestion] = useState("")
  const [robotState, setRobotState] = useState("idle") // idle, thinking, speaking, scanning
  const [typingText, setTypingText] = useState("")
  const { t } = useTranslation()
  const typingRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const {
    isAuthenticated,
    connectWallet,
    addMessage,
    createNewChat,
  } = useWallet()

  useEffect(() => {
    if (question.length > 0) {
      setRobotState("thinking")
    } else {
      setRobotState("idle")
    }
  }, [question])

  useEffect(() => {
    if (robotState === "speaking") {
      const text = t("robot_speaking_message")
      let index = 0

      if (typingRef.current) {
        clearInterval(typingRef.current)
      }

      setTypingText("")

      typingRef.current = setInterval(() => {
        if (index < text.length) {
          setTypingText((prev) => prev + text.charAt(index))
          index++
        } else {
          if (typingRef.current) clearInterval(typingRef.current)

          setTimeout(() => {
            setRobotState("idle")
          }, 2000)
        }
      }, 50)
    }

    return () => {
      if (typingRef.current) clearInterval(typingRef.current)
    }
  }, [robotState, t])

  const handleAskClick = () => {
    if (!question.trim()) return

    if (!isAuthenticated) {
      return
    }

    const chatId = createNewChat()

    addMessage({
      role: "user",
      content: question,
      timestamp: Date.now(),
    })

    router.push(`/chat/${chatId}`)
  }

  return (
    <div className="min-h-screen bg-[#2a1a8a] text-white flex flex-col">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold robot-logo">
            M
          </div>
          <h1 className="text-2xl font-bold hidden sm:block">MysteinMinds</h1>
        </div>
        <div className="hidden sm:block">
          <ConnectButton />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto w-full">
    <div className="robot-interface w-full h-screen max-w-6xl p-6 flex flex-col justify-center items-center">
            <div className="robot-interface-header">
              <div className="robot-interface-lights">
                <div className="robot-light"></div>
                <div className="robot-light"></div>
                <div className="robot-light"></div>
              </div>
              <div className="robot-interface-title hidden sm:block">{t("robot_interface_title")}</div>
              <div className="robot-interface-status">
                <div className={`robot-status ${robotState}`}>
                  {robotState === "idle" && t("status_idle")}
                  {robotState === "thinking" && t("status_thinking")}
                  {robotState === "speaking" && t("status_speaking")}
                  {robotState === "scanning" && t("status_scanning")}
                </div>
              </div>
            </div>
            {/* <div className="robot-interface-screen">
              <div className="robot-avatar">
                <div className={`robot-head-small ${robotState}`}>
                  <div className="robot-eyes-small">
                    <div className={`robot-eye-small ${robotState !== "idle" ? "robot-eye-active" : ""}`}>
                      <div className="robot-scan-line"></div>
                    </div>
                    <div className={`robot-eye-small ${robotState !== "idle" ? "robot-eye-active" : ""}`}>
                      <div className="robot-scan-line"></div>
                    </div>
                  </div>
                  <div className="robot-mouth-small">
                    {robotState === "speaking" && (
                      <div className="robot-mouth-animation">
                        <div className="robot-mouth-bar"></div>
                        <div className="robot-mouth-bar"></div>
                        <div className="robot-mouth-bar"></div>
                        <div className="robot-mouth-bar"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="robot-body-small">
                  <div className="robot-body-light"></div>
                </div>
              </div>
              <div className="robot-message">
                {!isAuthenticated && (
                  <div className="flex items-center justify-center gap-2 text-yellow-300">
                    <Lock size={16} />
                    <span>{t("connect_wallet_to_chat")}</span>
                  </div>
                )}
                {isAuthenticated && robotState === "idle" && t("robot_idle_message")}
                {isAuthenticated && robotState === "thinking" && (
                  <div className="thinking-animation">
                    <span>{t("robot_thinking_message")}</span>
                    <span className="thinking-dots">
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                      <span className="dot">.</span>
                    </span>
                  </div>
                )}
                {isAuthenticated && robotState === "speaking" && typingText}
                {isAuthenticated && robotState === "scanning" && (
                  <div className="scanning-animation">
                    <div className="scanning-text">{t("robot_scanning_message")}</div>
                    <div className="scanning-progress">
                      <div className="scanning-bar"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="robot-input-container">
                <Input
                  placeholder={isAuthenticated ? t("ask_placeholder") : t("connect_wallet_placeholder")}
                  className="robot-input"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskClick()}
                />
                <Button className="robot-send-button" onClick={handleAskClick}>
                  {isAuthenticated ? <Send className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span className="robot-send-ripple"></span>
                </Button>
              </div>
            </div>
            <div className="robot-interface-suggestions">
              <div className="robot-suggestion-title">{t("suggested_questions")}</div>
              <div className="robot-suggestions grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="robot-suggestion"
                  onClick={() => setQuestion(t("question_what_is_sui"))}
                >
                  {t("question_what_is_sui")}
                </Button>
                <Button
                  variant="outline"
                  className="robot-suggestion"
                  onClick={() => setQuestion(t("question_create_wallet"))}
                >
                  {t("question_create_wallet")}
                </Button>
                <Button
                  variant="outline"
                  className="robot-suggestion"
                  onClick={() => setQuestion(t("question_move_programming"))}
                >
                  {t("question_move_programming")}
                </Button>
                <Button
                  variant="outline"
                  className="robot-suggestion"
                  onClick={() => setQuestion(t("question_sui_nfts"))}
                >
                  {t("question_sui_nfts")}
                </Button>
              </div>
              <div className="swipe-indicator mt-4 sm:hidden">
                <p className="text-xs text-blue-300">{t("swipe_down_hint")}</p>
                <div className="swipe-arrow swipe-down"></div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  )
}
