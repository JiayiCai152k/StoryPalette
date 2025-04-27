import { db } from "@/db"
import { tags } from "@/db/schema/content"
import { sql } from "drizzle-orm"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = Number(searchParams.get('limit')) || 10

  if (!query) {
    return NextResponse.json([])
  }

  try {
    // Search for tags that start with or contain the query
    const suggestions = await db
      .select({
        id: tags.id,
        name: tags.name,
        postCount: tags.postCount,
      })
      .from(tags)
      .where(sql`${tags.name} ILIKE ${`${query}%`}`) // Prioritize tags that start with the query
      .orderBy(sql`${tags.postCount} DESC`) // Sort by popularity
      .limit(limit)

    // If we have space for more suggestions, include tags that contain the query
    if (suggestions.length < limit) {
      const remainingLimit = limit - suggestions.length
      const moreSuggestions = await db
        .select({
          id: tags.id,
          name: tags.name,
          postCount: tags.postCount,
        })
        .from(tags)
        .where(
          sql`${tags.name} ILIKE ${`%${query}%`} AND ${tags.name} NOT ILIKE ${`${query}%`}`
        )
        .orderBy(sql`${tags.postCount} DESC`)
        .limit(remainingLimit)

      suggestions.push(...moreSuggestions)
    }

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error fetching tag suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tag suggestions' },
      { status: 500 }
    )
  }
} 