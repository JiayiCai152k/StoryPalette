import { db } from "@/db"
import { likes } from "@/db/schema/content"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { eq, and, count } from "drizzle-orm"
import { headers } from "next/headers"

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { postId } = await params
  const userId = session.user.id

  try {
    // Check if already liked
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1)

    let liked = false;
    
    if (existingLike.length === 0) {
      // Add like
      await db.insert(likes).values({
        userId,
        postId,
      })
      liked = true;
    } else {
      // Unlike
      await db.delete(likes).where(
        and(eq(likes.postId, postId), eq(likes.userId, userId))
      )
      liked = false;
    }
    
    // Get the updated like count
    const [likesCountResult] = await db
      .select({ value: count() })
      .from(likes)
      .where(eq(likes.postId, postId))
    
    return NextResponse.json({ liked, likeCount: likesCountResult.value })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

// GET to check like status
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))
  
  const { postId } = await params
  
  try {
    // Get the total like count
    const [likesCountResult] = await db
      .select({ value: count() })
      .from(likes)
      .where(eq(likes.postId, postId))
    
    const likeCount = likesCountResult.value
    
    // Check if the current user has liked the post
    let liked = false
    if (session) {
      const userId = session.user.id
      const existingLike = await db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
        .limit(1)
      
      liked = existingLike.length > 0
    }

    return NextResponse.json({ liked, likeCount })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ liked: false, likeCount: 0 })
  }
} 