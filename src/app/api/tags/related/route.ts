import { db } from "@/db"
import { tags, postTags } from "@/db/schema/content"
import { sql, eq, and } from "drizzle-orm"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams
  const tagId = searchParams.get('tagId')

  if (!tagId) {
    return NextResponse.json(
      { error: 'Tag ID is required' },
      { status: 400 }
    )
  }

  try {
    // Find related tags that appear in the same posts
    const relatedTags = await db
      .select({
        id: tags.id,
        name: tags.name,
        postCount: tags.postCount,
      })
      .from(tags)
      .innerJoin(postTags, eq(tags.id, postTags.tagId))
      .where(
        and(
          sql`${tags.id} IN (
            SELECT pt2.tag_id 
            FROM ${postTags} pt1 
            JOIN ${postTags} pt2 ON pt1.post_id = pt2.post_id 
            WHERE pt1.tag_id = ${tagId}
          )`,
          sql`${tags.id} != ${tagId}`
        )
      )
      .groupBy(tags.id)
      .orderBy(sql`count(*) DESC`)
      .limit(10)

    return NextResponse.json(relatedTags)
  } catch (error) {
    console.error('Error fetching related tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related tags' },
      { status: 500 }
    )
  }
} 