import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { likes, posts } from "@/db/schema/content";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

// Proper types for our query result
type PostTag = {
  tag: { id: string; name: string };
}

type LikedPost = {
  post: {
    id: string;
    userId: string;
    type: 'ARTWORK' | 'FICTION';
    title: string;
    description?: string | null;
    createdAt: string;
    imageUrl?: string | null;
    caption?: string | null;
    content?: string | null;
    summary?: string | null;
    wordCount?: number | null;
    user: {
      id: string;
      name: string;
      image?: string | null;
    };
    postTags: PostTag[];
  };
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get all posts liked by the current user with their details
    const likedPosts = await db.query.likes.findMany({
      where: eq(likes.userId, session.user.id),
      with: {
        post: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
            postTags: {
              with: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: [desc(likes.createdAt)],
    }) as unknown as LikedPost[];

    // Map the query result to our desired output format
    const result = likedPosts.map(like => ({
      id: like.post.id,
      userId: like.post.userId,
      type: like.post.type,
      title: like.post.title,
      description: like.post.description,
      createdAt: like.post.createdAt,
      imageUrl: like.post.imageUrl,
      caption: like.post.caption,
      content: like.post.content,
      summary: like.post.summary,
      wordCount: like.post.wordCount,
      user: like.post.user,
      tags: like.post.postTags.map(pt => pt.tag)
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json(
      { error: "Error fetching liked posts" },
      { status: 500 }
    );
  }
} 