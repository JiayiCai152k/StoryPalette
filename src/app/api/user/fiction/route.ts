import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq, and, desc } from "drizzle-orm"

export async function GET() {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Please log in to view your fictions' }, 
      { status: 401 }
    )
  }

  try {
    const fictions = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.userId, session.user.id),
          eq(posts.type, 'FICTION')
        )
      )
      .orderBy(desc(posts.createdAt));

    return NextResponse.json(fictions)
  } catch (error) {
    console.error('Error fetching fictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fictions' },
      { status: 500 }
    )
  }
} 