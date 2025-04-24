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
    let orderByClause;
    switch (sortBy) {
      case 'popular':
        orderByClause = desc(posts.views);
        break;
      case 'longest':
        orderByClause = desc(posts.wordCount);
        break;
      case 'recent':
      default:
        orderByClause = desc(posts.createdAt);
        break;
    }

    const fictions = await db
      .select({
        id: posts.id,
        title: posts.title,
        summary: posts.summary,
        wordCount: posts.wordCount,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.type, 'FICTION'))
      .orderBy(orderByClause)
      .limit(50)

    return NextResponse.json(fictions)
  } catch (error) {
    console.error('Error fetching fictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fictions' },
      { status: 500 }
    )
  }
} 