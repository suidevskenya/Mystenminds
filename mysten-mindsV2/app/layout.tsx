import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./global.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PWARegister } from "@/components/pwa-register"
import { SuiProviderWrapper } from "./components/SuiProvider"
import { SidebarProvider } from "./context/SidebarContext"

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "MysteinMinds - Your AI Guide to the SUI Ecosystem",
  description:
    "Get instant answers to all your questions about SUI blockchain, Move programming, and the entire Mysten Labs ecosystem.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#2a1a8a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MysteinMinds",
  },
  formatDetection: {
    telephone: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          
             <SuiProviderWrapper>
              {children}
            </SuiProviderWrapper>     
          <PWARegister />
         
           
        </ThemeProvider>
      </body>
    </html>
  )
}
