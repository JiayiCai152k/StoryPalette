import { db } from "@/db"
import { users } from "@/db/schema/auth"
import { posts } from "@/db/schema/content"
import { sql, eq, ilike } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const searchTerm = searchParams.get("q")

  try {
    const baseQuery = db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        bio: users.bio,
        _count: {
          posts: sql<number>`count(distinct ${posts.id})`,
        }
      })
      .from(users)
      .leftJoin(posts, eq(posts.userId, users.id))
      .groupBy(users.id)

    const creators = await (searchTerm 
      ? baseQuery.where(ilike(users.name, `%${searchTerm}%`))
      : baseQuery)

    return NextResponse.json(creators)
  } catch (error) {
    console.error("Error fetching creators:", error)
    return NextResponse.json(
      { error: "Failed to fetch creators" },
      { status: 500 }
    )
  }
} 