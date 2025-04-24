import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts, tags, postTags as postTagsTable } from "@/db/schema/content"
import { users } from "@/db/schema/auth"
import { eq } from "drizzle-orm"

type FictionContent = {
  content: string;
  metadata: {
    wordCount: number;
    updatedAt: string;
  };
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
    const [fiction] = await db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        content: posts.content, // This is the Firebase URL
        summary: posts.summary,
        wordCount: posts.wordCount,
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

    if (!fiction) {
      return NextResponse.json(
        { error: 'Fiction not found' },
        { status: 404 }
      )
    }

    // Fetch the content from Firebase URL
    let fictionContent = "";
    if (fiction.content) {
      try {
        const contentResponse = await fetch(fiction.content);
        if (!contentResponse.ok) {
          throw new Error('Failed to fetch content');
        }
        const jsonContent: FictionContent = await contentResponse.json();
        fictionContent = jsonContent.content;
      } catch (error) {
        console.error('Error fetching fiction content:', error);
      }
    }

    const fictionTags = await db
      .select({
        id: tags.id,
        name: tags.name
      })
      .from(tags)
      .innerJoin(postTagsTable, eq(postTagsTable.tagId, tags.id))
      .where(eq(postTagsTable.postId, fiction.id));

    const result = {
      ...fiction,
      content: fictionContent, // Send the actual content instead of URL
      tags: fictionTags
    };

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching fiction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fiction' },
      { status: 500 }
    )
  }
} 