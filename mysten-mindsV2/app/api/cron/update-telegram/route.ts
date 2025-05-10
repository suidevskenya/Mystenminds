import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Call our API endpoint to update Telegram groups
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/telegram-groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ success: false, message: "Error updating Telegram groups" }, { status: 500 })
  }
}
