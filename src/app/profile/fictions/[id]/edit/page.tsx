import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq, and } from "drizzle-orm"
import { redirect } from "next/navigation"
import EditFictionForm from "@/app/profile/fictions/[id]/edit/edit-form"

export default async function EditFictionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/login')
  }

  // Fetch the fiction and check ownership
  const fiction = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      description: posts.description,
      userId: posts.userId,
    })
    .from(posts)
    .where(
      and(
        eq(posts.id, id),
        eq(posts.type, 'FICTION')
      )
    )
    .limit(1)

  if (!fiction[0]) {
    redirect('/profile/fictions')
  }

  // Check if the current user is the owner
  if (session.user.id !== fiction[0].userId) {
    redirect('/profile/fictions')
  }

  return <EditFictionForm fiction={fiction[0]} />
} 