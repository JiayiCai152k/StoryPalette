import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { eq, desc } from "drizzle-orm"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sortBy = searchParams.get('sort') || 'recent'

  try {
    const artworks = await db
      .select({
        id: posts.id,
        title: posts.title,
        imageUrl: posts.imageUrl,
        caption: posts.caption,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.type, 'ARTWORK'))
      .orderBy(
        sortBy === 'popular' 
          ? desc(posts.views) 
          : desc(posts.createdAt)
      )
      .limit(50)

    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
} 