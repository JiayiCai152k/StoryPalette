import { db } from "@/db"
import { collections, collectionPosts } from "@/db/schema/content"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get('postId')

  try {
    // Get user collections
    const userCollections = await db
      .select({
        id: collections.id,
        name: collections.name,
        description: collections.description,
        isPrivate: collections.isPrivate,
        createdAt: collections.createdAt,
      })
      .from(collections)
      .where(eq(collections.userId, userId))
      .orderBy(collections.createdAt)

    // If postId is provided, check which collections have this post
    if (postId) {
      const savedPosts = await db
        .select({
          collectionId: collectionPosts.collectionId,
        })
        .from(collectionPosts)
        .where(eq(collectionPosts.postId, postId))

      const savedCollectionIds = new Set(savedPosts.map(p => p.collectionId))

      // Mark collections that have the post saved
      const collectionsWithSavedStatus = userCollections.map(collection => ({
        ...collection,
        saved: savedCollectionIds.has(collection.id)
      }))

      return NextResponse.json(collectionsWithSavedStatus)
    }

    return NextResponse.json(userCollections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { name, description, isPrivate } = await request.json()

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json(
      { error: "Collection name is required" },
      { status: 400 }
    )
  }

  try {
    const [newCollection] = await db.insert(collections).values({
      userId,
      name: name.trim(),
      description: description?.trim() || null,
      isPrivate: isPrivate || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return NextResponse.json(newCollection)
  } catch (error) {
    console.error("Error creating collection:", error)
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    )
  }
} 