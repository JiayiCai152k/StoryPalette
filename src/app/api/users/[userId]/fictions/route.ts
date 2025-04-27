import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq, and } from "drizzle-orm"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  
  try {
    const fictions = await db
      .select({
        id: posts.id,
        title: posts.title,
        type: posts.type,
        summary: posts.summary,
        wordCount: posts.wordCount,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(
        and(
          eq(posts.userId, userId),
          eq(posts.type, 'FICTION')
        )
      )
      .orderBy(posts.createdAt)

    return NextResponse.json(fictions)
  } catch (error) {
    console.error('Error fetching user fictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fictions' }, 
      { status: 500 }
    )
  }
} 