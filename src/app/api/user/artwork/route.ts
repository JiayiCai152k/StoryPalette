import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Please log in to view your artworks' }, 
      { status: 401 }
    )
  }

  try {
    const artworks = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, session.user.id))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json(artworks)
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}
