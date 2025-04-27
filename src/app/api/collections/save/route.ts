import { db } from "@/db"
import { collections, collectionPosts } from "@/db/schema/content"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession(({
        headers: await headers() // you need to pass the headers object.
    }))

  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { postId, collectionId } = await request.json()

  if (!postId || !collectionId) {
    return NextResponse.json(
      { error: "Post ID and Collection ID are required" },
      { status: 400 }
    )
  }

  try {
    // Verify collection belongs to user
    const collection = await db
      .select()
      .from(collections)
      .where(and(eq(collections.id, collectionId), eq(collections.userId, userId)))
      .limit(1)

    if (collection.length === 0) {
      return NextResponse.json(
        { error: "Collection not found or unauthorized" },
        { status: 404 }
      )
    }

    // Check if already in collection
    const existing = await db
      .select()
      .from(collectionPosts)
      .where(
        and(
          eq(collectionPosts.collectionId, collectionId),
          eq(collectionPosts.postId, postId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Remove from collection
      await db
        .delete(collectionPosts)
        .where(
          and(
            eq(collectionPosts.collectionId, collectionId),
            eq(collectionPosts.postId, postId)
          )
        )
      return NextResponse.json({ saved: false })
    } else {
      // Add to collection
      await db.insert(collectionPosts).values({
        collectionId,
        postId,
      })
      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error("Error saving to collection:", error)
    return NextResponse.json(
      { error: "Failed to save to collection" },
      { status: 500 }
    )
  }
} 