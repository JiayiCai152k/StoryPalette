import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq, and } from "drizzle-orm"
import { redirect } from "next/navigation"
import EditArtworkForm from "./edit-form"

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/login')
  }

  // Fetch the artwork and check ownership
  const artwork = await db
    .select({
      id: posts.id,
      title: posts.title,
      caption: posts.caption,
      description: posts.description,
      userId: posts.userId,
      imageUrl: posts.imageUrl,
    })
    .from(posts)
    .where(
      and(
        eq(posts.id, id),
        eq(posts.type, 'ARTWORK')
      )
    )
    .limit(1)

  if (!artwork[0]) {
    redirect('/profile/creations')
  }

  // Check if the current user is the owner
  if (session.user.id !== artwork[0].userId) {
    redirect('/profile/creations')
  }

  return <EditArtworkForm artwork={artwork[0]} />
}