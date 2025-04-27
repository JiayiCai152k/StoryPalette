import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ user: null })
  }
} 