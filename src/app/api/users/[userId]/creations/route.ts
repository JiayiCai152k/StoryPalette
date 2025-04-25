import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq } from "drizzle-orm"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  
  try {
    const creations = await db
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
      .where(eq(posts.userId, userId))
      .orderBy(posts.createdAt)

    return NextResponse.json(creations)
  } catch (error) {
    console.error("Error fetching creations:", error)
    return NextResponse.json(
      { error: "Failed to fetch creations" },
      { status: 500 }
    )
  }
} 