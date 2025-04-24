import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts, postTags, tags } from "@/db/schema/content"
import { sql } from "drizzle-orm"
import { uploadFiction } from "@/lib/utils/uploadFiction"

export async function POST(request: Request) {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Please log in to create fiction' }, 
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    
    // Get the content from form data
    const content = formData.get('content') as string
    const title = formData.get('title') as string
    const summary = formData.get('summary') as string
    const contentUrl = formData.get('contentUrl') as string
    const wordCount = parseInt(formData.get('wordCount') as string, 10)
    const tagsList = JSON.parse(formData.get('tags') as string) as string[]

    if (!content || !title || !contentUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the post
    const [post] = await db.insert(posts).values({
      userId: session.user.id,
      type: "FICTION",
      title,
      summary,
      content: contentUrl, // Store the URL to the content
      wordCount,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Handle tags
    if (tagsList.length > 0) {
      for (const tagName of tagsList) {
        const [existingTag] = await db
          .insert(tags)
          .values({
            name: tagName.toLowerCase(),
            postCount: 1,
          })
          .onConflictDoUpdate({
            target: tags.name,
            set: {
              postCount: sql`${tags.postCount} + 1`,
            },
          })
          .returning()

        await db.insert(postTags).values({
          postId: post.id,
          tagId: existingTag.id,
        })
      }
    }

    return NextResponse.json({ 
      success: true,
      fictionId: post.id,
      message: 'Fiction created successfully' 
    })

  } catch (error) {
    console.error('Create fiction error:', error)
    return NextResponse.json(
      { error: 'Failed to create fiction' }, 
      { status: 500 }
    )
  }
} 