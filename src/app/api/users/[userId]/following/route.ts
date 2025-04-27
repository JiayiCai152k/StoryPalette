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

    // Get all users that the target user follows
    const following = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
      })
      .from(users)
      .innerJoin(
        userFollows,
        and(
          eq(userFollows.followingId, users.id),
          eq(userFollows.followerId, userId)
        )
      )
      .orderBy(users.name)

    return NextResponse.json(following)
  } catch (error) {
    console.error("Error fetching following:", error)
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    )
  }
} 