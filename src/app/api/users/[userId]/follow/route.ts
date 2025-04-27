import { NextResponse } from "next/server"
import { db } from "@/db"
import { auth } from "@/lib/auth"
import { userFollows } from "@/db/schema/auth"
import { and, eq } from "drizzle-orm"
import { headers } from "next/headers"

// POST handler for following a user
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await auth.api.getSession({
      headers: await headers()
    })

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const currentUserId = session.user.id

    // Can't follow yourself
    if (currentUserId === userId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      )
    }

    // Check if already following
    const existingFollow = await db.query.userFollows.findFirst({
      where: and(
        eq(userFollows.followerId, currentUserId),
        eq(userFollows.followingId, userId)
      ),
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      )
    }

    // Create follow relationship
    await db.insert(userFollows).values({
      followerId: currentUserId,
      followingId: userId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    )
  }
}

// DELETE handler for unfollowing a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await auth.api.getSession({
      headers: await headers()
    })

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const currentUserId = session.user.id

    // Delete follow relationship
    await db.delete(userFollows).where(
      and(
        eq(userFollows.followerId, currentUserId),
        eq(userFollows.followingId, userId)
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    )
  }
}

// GET handler to check if current user follows the target user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await auth.api.getSession({
      headers: await headers()
    })

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { isFollowing: false }
      )
    }

    const currentUserId = session.user.id

    // Check if following
    const existingFollow = await db.query.userFollows.findFirst({
      where: and(
        eq(userFollows.followerId, currentUserId),
        eq(userFollows.followingId, userId)
      ),
    })

    return NextResponse.json({
      isFollowing: !!existingFollow
    })
  } catch (error) {
    console.error("Error checking follow status:", error)
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    )
  }
} 