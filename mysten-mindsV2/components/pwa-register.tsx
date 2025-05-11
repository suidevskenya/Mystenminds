"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err)
          },
        )
      })
    }

    // Handle PWA install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setInstallPrompt(e)
      // Check if already installed
      if (!isInstalled) {
        setShowInstallBanner(true)
      }
    })

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for app install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
    })
  }, [isInstalled])

  const handleInstallClick = () => {
    if (!installPrompt) return

    // Show the install prompt
    installPrompt.prompt()

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      setInstallPrompt(null)
    })
  }

  if (!showInstallBanner) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-blue-600 rounded-lg p-4 shadow-lg z-40 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-white">{t("add_to_home_screen")}</h3>
        <p className="text-sm text-blue-100">Install for the best experience</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-blue-700"
          onClick={handleInstallClick}
        >
          {t("install_app")}
        </Button>
        <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={() => setShowInstallBanner(false)}>
          Later
        </Button>
      </div>
    </div>
  )
}
