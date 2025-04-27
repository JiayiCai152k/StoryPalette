import { db } from "@/db"
import { posts, tags, postTags } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { eq, like, or, and, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const type = searchParams.get('type') // 'tag', 'title', or undefined (all)

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const baseQuery = db
      .select({
        id: posts.id,
        title: posts.title,
        type: posts.type,
        imageUrl: posts.imageUrl,
        summary: posts.summary,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
        tags: sql<string[]>`array_agg(${tags.name})`,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(postTags, eq(posts.id, postTags.postId))
      .leftJoin(tags, eq(postTags.tagId, tags.id))

    // Add where clause based on search type
    let whereClause;
    switch (type) {
      case 'tag':
        whereClause = like(tags.name || '', `%${query}%`)
        break
      case 'title':
        whereClause = or(
          like(posts.title, `%${query}%`),
          like(posts.summary || '', `%${query}%`)
        )
        break
      default:
        whereClause = or(
          like(posts.title, `%${query}%`),
          like(posts.summary || '', `%${query}%`),
          like(tags.name || '', `%${query}%`)
        )
    }

    const results = await baseQuery
      .where(whereClause)
      .groupBy(
        posts.id,
        posts.title,
        posts.type,
        posts.imageUrl,
        posts.summary,
        posts.createdAt,
        users.id,
        users.name,
        users.image
      )
      .orderBy(posts.createdAt)
      .limit(20)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
} 