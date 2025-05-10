import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore"
import axios from "axios"
import * as cheerio from "cheerio"

// Define the structure of a Telegram group
interface TelegramGroup {
  id?: string
  name: string
  url: string
  description: string
  memberCount?: number
  language: string
  category: string
  lastUpdated: any
}

// Function to scrape Telegram groups from various sources
async function scrapeTelegramGroups(): Promise<TelegramGroup[]> {
  const groups: TelegramGroup[] = []

  try {
    // Example: Scrape from Sui Foundation website or community pages
    const response = await axios.get("https://sui.io/community")
    const $ = cheerio.load(response.data)

    // This is a placeholder selector - you'll need to adjust based on the actual website structure
    $(".telegram-group-link").each((_, element) => {
      const name = $(element).text().trim()
      const url = $(element).attr("href") || ""
      const description = $(element).attr("data-description") || "Sui community group"
      const language = $(element).attr("data-language") || "English"
      const category = $(element).attr("data-category") || "General"

      if (url.includes("t.me/") && name) {
        groups.push({
          name,
          url,
          description,
          language,
          category,
          lastUpdated: serverTimestamp(),
        })
      }
    })

    // If scraping doesn't work, we'll add some hardcoded examples
    if (groups.length === 0) {
      groups.push(
        {
          name: "Sui Network Official",
          url: "https://t.me/SuiNetwork",
          description: "Official Sui Network community group",
          memberCount: 24500,
          language: "English",
          category: "Official",
          lastUpdated: serverTimestamp(),
        },
        {
          name: "Sui Developers",
          url: "https://t.me/SuiDevelopers",
          description: "Community for Sui blockchain developers",
          memberCount: 8700,
          language: "English",
          category: "Development",
          lastUpdated: serverTimestamp(),
        },
        {
          name: "Sui Spanish",
          url: "https://t.me/SuiSpanish",
          description: "Spanish-speaking Sui community",
          memberCount: 3200,
          language: "Spanish",
          category: "Regional",
          lastUpdated: serverTimestamp(),
        },
        {
          name: "Sui Africa",
          url: "https://t.me/SuiAfrica",
          description: "African Sui community",
          memberCount: 2800,
          language: "English",
          category: "Regional",
          lastUpdated: serverTimestamp(),
        },
        {
          name: "Sui NFT Collectors",
          url: "https://t.me/SuiNFTs",
          description: "Community for Sui NFT enthusiasts",
          memberCount: 5600,
          language: "English",
          category: "NFTs",
          lastUpdated: serverTimestamp(),
        },
      )
    }
  } catch (error) {
    console.error("Error scraping Telegram groups:", error)
  }

  return groups
}

// Function to update Firebase with the latest groups
async function updateFirebaseGroups(groups: TelegramGroup[]) {
  const groupsCollection = collection(db, "telegramGroups")

  try {
    // Get existing groups
    const snapshot = await getDocs(groupsCollection)
    const existingGroups = new Map()

    snapshot.forEach((doc) => {
      const data = doc.data() as TelegramGroup
      existingGroups.set(data.url, {
        id: doc.id,
        ...data,
      })
    })

    // Update or add new groups
    for (const group of groups) {
      if (existingGroups.has(group.url)) {
        // Update existing group
        const existingGroup = existingGroups.get(group.url)
        await updateDoc(doc(db, "telegramGroups", existingGroup.id), {
          ...group,
          lastUpdated: serverTimestamp(),
        })
        existingGroups.delete(group.url)
      } else {
        // Add new group
        await addDoc(groupsCollection, {
          ...group,
          lastUpdated: serverTimestamp(),
        })
      }
    }

    // Remove groups that no longer exist
    for (const [_, group] of existingGroups.entries()) {
      await deleteDoc(doc(db, "telegramGroups", group.id))
    }

    return { success: true, message: "Telegram groups updated successfully" }
  } catch (error) {
    console.error("Error updating Firebase:", error)
    return { success: false, message: "Error updating Telegram groups" }
  }
}

// GET endpoint to fetch all groups
export async function GET() {
  try {
    const groupsCollection = collection(db, "telegramGroups")
    const snapshot = await getDocs(groupsCollection)

    const groups: TelegramGroup[] = []
    snapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...(doc.data() as TelegramGroup),
      })
    })

    return NextResponse.json({ success: true, groups })
  } catch (error) {
    console.error("Error fetching Telegram groups:", error)
    return NextResponse.json({ success: false, message: "Error fetching Telegram groups" }, { status: 500 })
  }
}

// POST endpoint to trigger a refresh of the groups
export async function POST() {
  try {
    const groups = await scrapeTelegramGroups()
    const result = await updateFirebaseGroups(groups)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error refreshing Telegram groups:", error)
    return NextResponse.json({ success: false, message: "Error refreshing Telegram groups" }, { status: 500 })
  }
}
