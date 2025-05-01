import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { eq, desc, count } from "drizzle-orm"
import { likes } from "@/db/schema/content"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sortBy = searchParams.get('sort') || 'recent'
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    const artworks = await db
      .select({
        id: posts.id,
        title: posts.title,
        imageUrl: posts.imageUrl,
        caption: posts.caption,
        createdAt: posts.createdAt,
        likesCount: count(likes.id),
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .where(eq(posts.type, 'ARTWORK'))
      .groupBy(posts.id, users.id, users.name, users.image)
      .orderBy(
        sortBy === 'popular' 
          ? desc(count(likes.id))
          : desc(posts.createdAt)
      )
      .limit(limit)

    if (!artworks || artworks.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(artworks, { status: 200 })
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
} 