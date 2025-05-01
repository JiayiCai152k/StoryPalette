import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import ArtworkClient from "./artwork-client"
import { db } from "@/db"
import { posts } from "@/db/schema/content"
import { eq } from "drizzle-orm"

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Fetch the artwork's user ID to check ownership
  const artwork = await db
    .select({ userId: posts.userId })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  const isOwner = session?.user?.id === artwork[0]?.userId

  return <ArtworkClient id={id} isOwner={isOwner} />
}
