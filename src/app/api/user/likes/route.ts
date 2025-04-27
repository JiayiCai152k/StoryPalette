import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { likes, posts, postTags, tags } from "@/db/schema/content";
import { users } from "@/db/schema/auth";
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

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get all posts liked by the current user with their details
    const likedPosts = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        type: posts.type,
        title: posts.title,
        description: posts.description,
        createdAt: posts.createdAt,
        imageUrl: posts.imageUrl,
        caption: posts.caption,
        content: posts.content,
        summary: posts.summary,
        wordCount: posts.wordCount,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        }
      })
      .from(likes)
      .innerJoin(posts, eq(likes.postId, posts.id))
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(likes.userId, session.user.id))
      .orderBy(desc(likes.createdAt));

    // For debugging
    console.log('Fetched liked posts:', JSON.stringify(likedPosts, null, 2));

    return NextResponse.json(likedPosts);
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json(
      { error: "Error fetching liked posts" },
      { status: 500 }
    );
  }
} 