import { NextResponse } from "next/server"
import { db } from "@/db"
import { users, userFollows } from "@/db/schema/auth"
import { eq, and } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    // Get all users who follow the target user
    const followers = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
      })
      .from(users)
      .innerJoin(
        userFollows,
        and(
          eq(userFollows.followerId, users.id),
          eq(userFollows.followingId, userId)
        )
      )
      .orderBy(users.name)

    return NextResponse.json(followers)
  } catch (error) {
    console.error("Error fetching followers:", error)
    return NextResponse.json(
      { error: "Failed to fetch followers" },
      { status: 500 }
    )
  }
} 