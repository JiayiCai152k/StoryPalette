import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse, NextRequest } from "next/server"
import { db } from "@/db"
import { posts, tags, postTags } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { eq, and } from "drizzle-orm"

type FictionContent = {
  content: string;
  metadata: {
    wordCount: number;
    updatedAt: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const fiction = await db
      .select({
        id: posts.id,
        title: posts.title,
        type: posts.type,
        summary: posts.summary,
        content: posts.content,
        wordCount: posts.wordCount,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
        tags: {
          id: tags.id,
          name: tags.name,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(postTags, eq(posts.id, postTags.postId))
      .leftJoin(tags, eq(postTags.tagId, tags.id))
      .where(
        and(
          eq(posts.id, id),
          eq(posts.type, 'FICTION')
        )
      )

    if (!fiction[0]) {
      return NextResponse.json({ error: 'Fiction not found' }, { status: 404 })
    }

    // Fetch content from Firebase URL
    let fictionContent: FictionContent | null = null
    if (fiction[0].content) {
      try {
        const contentResponse = await fetch(fiction[0].content)
        if (contentResponse.ok) {
          fictionContent = await contentResponse.json()
        }
      } catch (error) {
        console.error('Error fetching fiction content:', error)
      }
    }

    // Transform the result to match the expected format
    const result = {
      ...fiction[0],
      content: fictionContent?.content || '',
      wordCount: fictionContent?.metadata.wordCount || fiction[0].wordCount,
      tags: fiction
        .filter(f => f.tags?.id !== null)
        .map(f => f.tags)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching fiction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fiction' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // First check if the user owns the fiction
    const [fiction] = await db
      .select({ userId: posts.userId })
      .from(posts)
      .where(eq(posts.id, id))

    if (!fiction) {
      return NextResponse.json({ error: "Fiction not found" }, { status: 404 })
    }

    if (fiction.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the fiction
    await db.delete(posts).where(eq(posts.id, id))

    return NextResponse.json({ message: "Fiction deleted successfully" })
  } catch (error) {
    console.error('Error deleting fiction:', error)
    return NextResponse.json(
      { error: 'Failed to delete fiction' },
      { status: 500 }
    )
  }
} 