"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Globe, Wallet, LogOut, Copy, ExternalLink, Lock } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"
import { MobileNav } from "@/components/mobile-nav"
import { useSwipeable } from "react-swipeable"
import "../i18n"
import { useWallets, useCurrentAccount } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

export default function Home() {
  const [question, setQuestion] = useState("")
  const [queryHistory, setQueryHistory] = useState<string[]>([]); // State to store query history
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('');
  const [robotState, setRobotState] = useState("idle") // idle, thinking, speaking, scanning
  const [typingText, setTypingText] = useState("")
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const { t, i18n } = useTranslation()
  const typingRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const wallet = useWallets();
  const connectedWallet = wallet[0];
  const address = connectedWallet?.accounts[0]?.address;

  const shortenAddress = (address: string) => {
    if (!address || address.length <= 10) return address || '';
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

   // Fix for connectedWallet possibly undefined
  useEffect(() => {
    if (!connectedWallet) {
      console.warn('No connected wallet detected');
    }
  }, [connectedWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setQueryHistory((prev) => [...prev, query]); // Add query to history
    setIsLoading(true);
    setResponse('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query, is_first_interaction: false }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data.answer);
    } catch {
      setResponse('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connectedWallet) {
      console.log('Connected wallet:', address);
    }
  }, [connectedWallet,address]);
  
  const {
    connect,
    disconnect,
    isConnected,
    isAuthenticated,
    walletAddress,
    balance,
    connectWallet,
    addMessage,
    createNewChat,
  } = useWallet()

  // Simulate robot reaction to user interaction
  useEffect(() => {
    if (question.length > 0) {
      setRobotState("thinking")
    } else {
      setRobotState("idle")
    }
  }, [question])

  // Typing animation effect
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

          // Return to idle after typing is complete
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
      setShowAuthDialog(true)
      return
    }

    // Create a new chat and add the question
    const chatId = createNewChat()

    // Add the user's question to the chat
    addMessage({
      role: "user",
      content: question,
      timestamp: Date.now(),
    })

    // Navigate to the chat page
    router.push(`/chat/${chatId}`)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setShowLanguageMenu(false)
  }

  const handleConnectWallet = async () => {
    setShowWalletDialog(false)
    setShowAuthDialog(false)
    setRobotState("scanning")

    // Simulate scanning animation before connecting
    setTimeout(async () => {
      await connectWallet()
      setRobotState("idle")
    }, 2000)
  }

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  function ConnectedAccount() {
	const account = useCurrentAccount();

	if (!account) {
		return null;
	}

	return (
		<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
			<p className="text-sm font-semibold">Connected to:</p>
			<p className="text-lg font-bold">{account.address}</p>
		</div>
	);
  }

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    trackMouse: false,
  })

  const [showWalletDialog, setShowWalletDialog] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  return (
    <div className="min-h-screen bg-[#2a1a8a] text-white flex flex-col" {...swipeHandlers}>
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold robot-logo">
            M
          </div>
          <h1 className="text-2xl font-bold hidden sm:block">MysteinMinds</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <Globe size={20} />
            </Button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1a1040] rounded-lg shadow-lg overflow-hidden z-50 border border-gray-800">
                <div className="p-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => changeLanguage("en")}
                  >
                    <span className={i18n.language === "en" ? "text-blue-400" : "text-white"}>English</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => changeLanguage("fr")}
                  >
                    <span className={i18n.language === "fr" ? "text-blue-400" : "text-white"}>French</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => changeLanguage("sw")}
                  >
                    <span className={i18n.language === "sw" ? "text-blue-400" : "text-white"}>Swahili</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl mx-auto w-full">
          <ConnectedAccount />
          {/* Removed hero_title and hero_description as per user request */}
          
          <div className="flex flex-col items-center justify-center">
            <Button size="lg" className="ask-button" onClick={() => router.push('/ask-mystem-minds')}>
              {t("ask_question")}
              <span className="ask-button-glow"></span>
            </Button>
            <p className="text-sm text-blue-300 mt-4 hidden sm:block">{t("swipe_up_hint")}</p>
            <div className="swipe-indicator mt-4 sm:hidden">
              <div className="swipe-arrow"></div>
              <p className="text-xs text-blue-300">{t("swipe_up_hint")}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav isConnected={isConnected} />

      {/* Wallet Connection Dialog */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="wallet-dialog">
          <DialogHeader>
            <DialogTitle>{isConnected ? t("wallet_connected_title") : t("connect_wallet_title")}</DialogTitle>
            <DialogDescription>
              {isConnected ? t("wallet_connected_description") : t("connect_wallet_description")}
            </DialogDescription>
          </DialogHeader>

          {isConnected ? (
            <div className="wallet-details">
              <div className="wallet-detail-row">
                <div className="wallet-detail-label">{t("wallet_address")}</div>
                <div className="wallet-detail-value">
                  {truncateAddress(walletAddress)}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="wallet-copy-button"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="wallet-detail-row">
                <div className="wallet-detail-label">{t("wallet_balance")}</div>
                <div className="wallet-detail-value">{balance} SUI</div>
              </div>

              <div className="wallet-actions">
                <Button
                  variant="outline"
                  className="wallet-action-button"
                  onClick={() => window.open(`https://explorer.sui.io/address/${walletAddress}`, "_blank")}
                >
                  {t("view_on_explorer")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>

                <Button variant="destructive" className="wallet-disconnect-button" onClick={disconnect}>
                  {t("disconnect_wallet")}
                  <LogOut className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="wallet-options">
              <Button className="wallet-option" onClick={handleConnectWallet}>
                <div className="wallet-option-icon sui-wallet"></div>
                <div className="wallet-option-name">Sui Wallet</div>
              </Button>

              <Button className="wallet-option" onClick={handleConnectWallet}>
                <div className="wallet-option-icon ethos-wallet"></div>
                <div className="wallet-option-name">Ethos Wallet</div>
              </Button>

              <Button className="wallet-option" onClick={handleConnectWallet}>
                <div className="wallet-option-icon suiet-wallet"></div>
                <div className="wallet-option-name">Suiet Wallet</div>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Authentication Required Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="wallet-dialog">
          <DialogHeader>
            <DialogTitle>{t("auth_required_title")}</DialogTitle>
            <DialogDescription>{t("auth_required_description")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-6">
            <div className="mb-6 text-center">
              <Lock size={48} className="mx-auto mb-4 text-yellow-400" />
              <p className="text-gray-300">{t("auth_required_message")}</p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleConnectWallet}>
              <Wallet className="mr-2 h-4 w-4" />
              {t("connect_wallet")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
