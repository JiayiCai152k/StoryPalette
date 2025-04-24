import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts, type posts as PostTable } from "@/db/schema/content"
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
    const artwork = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        user: true,
        postTags: {
          with: {
            tag: true
          }
        },
        comments: {
          with: {
            user: true
          }
        },
        likes: true
      }
    }) as ArtworkWithRelations | null;

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Transform the response to include tags in a more friendly format
    const transformedArtwork = {
      ...artwork,
      tags: artwork.postTags.map(pt => pt.tag),
      postTags: undefined // Remove the junction table data from the response
    }

    return NextResponse.json(transformedArtwork)
  } catch (error) {
    console.error('Error fetching artwork:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    )
  }
}