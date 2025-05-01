import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts, tags, postTags as postTagsTable } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { eq } from "drizzle-orm"

// Define the type for the query result using your schema types
type ArtworkWithRelations = typeof posts.$inferSelect & {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  postTags: Array<{
    tag: {
      id: string;
      name: string;
    }
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
    }
  }>;
  likes: Array<{
    id: string;
    userId: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  try {
    // First get the post with user data
    const [artwork] = await db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        imageUrl: posts.imageUrl,
        caption: posts.caption,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id));

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Then get the tags in a separate query
    const artworkTags = await db
      .select({
        id: tags.id,
        name: tags.name
      })
      .from(tags)
      .innerJoin(postTagsTable, eq(postTagsTable.tagId, tags.id))
      .where(eq(postTagsTable.postId, artwork.id));

    // Combine the results
    const result = {
      ...artwork,
      tags: artworkTags
    };

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching artwork:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // First check if the user owns the artwork
    const [artwork] = await db
      .select({ userId: posts.userId })
      .from(posts)
      .where(eq(posts.id, id))

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 })
    }

    if (artwork.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the artwork
    await db.delete(posts).where(eq(posts.id, id))

    return NextResponse.json({ message: "Artwork deleted successfully" })
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return NextResponse.json(
      { error: 'Failed to delete artwork' },
      { status: 500 }
    )
  }
}