import { db } from "@/db"
import { comments } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params

  try {
    // For GET, we'll use a simple query since we don't need relations
    const postComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt)
      
    // Join with users table to get user info
    const commentsWithUsers = await Promise.all(
      postComments.map(async (comment) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, comment.userId),
          columns: {
            id: true,
            name: true,
            image: true,
          },
        })
        
        return {
          ...comment,
          user: user || { 
            id: comment.userId,
            name: "Unknown User",
            image: null 
          }
        }
      })
    )

    return NextResponse.json(commentsWithUsers)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

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
  const { content } = await request.json()

  if (!content || typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "Comment content is required" },
      { status: 400 }
    )
  }

  try {
    // Insert the comment
    const [newComment] = await db.insert(comments).values({
      userId,
      postId,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    // Get user info
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        image: true,
      },
    })

    // Return comment with user
    return NextResponse.json({
      ...newComment,
      user: user || { 
        id: userId,
        name: "Unknown User",
        image: null 
      }
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    )
  }
} 