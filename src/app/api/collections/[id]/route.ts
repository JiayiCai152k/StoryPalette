import { db } from "@/db"
import { collections, collectionPosts, posts } from "@/db/schema/content"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { eq, and, inArray } from "drizzle-orm"
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const userId = session.user.id

  try {
    // Fetch the collection
    const collection = await db.query.collections.findFirst({
      where: and(
        eq(collections.id, id),
        eq(collections.userId, userId)
      )
    })

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      )
    }

    // Fetch posts in the collection
    const collectionWithPosts = await db
      .select({
        postId: collectionPosts.postId
      })
      .from(collectionPosts)
      .where(eq(collectionPosts.collectionId, id))
    
    const postIds = collectionWithPosts.map(item => item.postId)
    
    // If there are no posts, return early
    if (postIds.length === 0) {
      return NextResponse.json({
        collection,
        posts: []
      })
    }
    
    // Get the full post data for each post in the collection
    const postsData = await db
      .select({
        id: posts.id,
        title: posts.title,
        type: posts.type,
        imageUrl: posts.imageUrl,
        summary: posts.summary,
        wordCount: posts.wordCount,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(inArray(posts.id, postIds))

    return NextResponse.json({
      collection,
      posts: postsData
    })
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    )
  }
} 