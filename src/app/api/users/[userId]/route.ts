import { db } from "@/db"
import { users, userFollows } from "@/db/schema/auth"
import { posts } from "@/db/schema/content"
import { eq, sql, or } from "drizzle-orm"
import { NextResponse, NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        bio: users.bio,
        website: users.website,
        twitter: users.twitter,
        instagram: users.instagram,
        _count: {
          posts: sql<number>`count(distinct ${posts.id})`,
          followers: sql<number>`count(distinct case when ${userFollows.followingId} = ${userId} then ${userFollows.followerId} end)`,
          following: sql<number>`count(distinct case when ${userFollows.followerId} = ${userId} then ${userFollows.followingId} end)`
        }
      })
      .from(users)
      .leftJoin(posts, eq(posts.userId, users.id))
      .leftJoin(
        userFollows,
        or(
          eq(userFollows.followerId, users.id),
          eq(userFollows.followingId, users.id)
        )
      )
      .where(eq(users.id, userId))
      .groupBy(users.id)
      .then(rows => rows[0])

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  
  try {
    const session = await auth.api.getSession(({
      headers: await headers()
    }))

    if (!session?.user || session.user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const updatedUser = await db
      .update(users)
      .set({
        name: data.name,
        bio: data.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
} 