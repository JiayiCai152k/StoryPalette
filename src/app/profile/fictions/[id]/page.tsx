import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import FictionClient from "./fiction-client"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq } from "drizzle-orm"

export default async function FictionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Fetch the fiction's user ID to check ownership
  const fiction = await db
    .select({ userId: posts.userId })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  const isOwner = session?.user?.id === fiction[0]?.userId

  return <FictionClient id={id} isOwner={isOwner} />
} 