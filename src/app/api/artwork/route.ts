import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { posts, postTags, tags } from "@/db/schema/content"
import { sql } from "drizzle-orm"

export async function POST(request: Request) {
  // Check authentication with auth.js
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Please log in to create artwork' }, 
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    
    // Extract data from formData
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const caption = formData.get('caption') as string
    const imageUrl = formData.get('imageUrl') as string
    const imageKey = formData.get('imageKey') as string
    const tagsList = JSON.parse(formData.get('tags') as string) as string[]

    // Create the post with the authenticated user's ID
    const [post] = await db.insert(posts).values({
      userId: session.user.id,
      type: "ARTWORK",
      title,
      description,
      caption,
      imageUrl,
      imageKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

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
      id: post.id,
      message: 'Artwork created successfully' 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload artwork' }, 
      { status: 500 }
    )
  }
}
