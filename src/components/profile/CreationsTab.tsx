"use client"

import { useState, useEffect } from "react"
import { ArtworkGrid } from "@/components/artwork/ArtworkGrid"
import { useRouter } from "next/navigation"
import { type posts } from "@/db/schema/content"
import { type InferSelectModel } from "drizzle-orm"

type Post = InferSelectModel<typeof posts>

type ArtworkGridItem = {
  id: string
  title: string
  imageUrl: string
  caption?: string
}

export function CreationsTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/user/artwork')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleArtworkClick = (id: string) => {
    router.push(`/profile/creations/${id}`)
  }

  const artworkItems: ArtworkGridItem[] = posts
    .filter((post): post is Post & { imageUrl: string } => 
      post.type === 'ARTWORK' && post.imageUrl !== null
    )
    .map(post => ({
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl,
      caption: post.caption ?? undefined
    }))

  if (isLoading) return <div>Loading...</div>
  
  return artworkItems.length > 0 ? (
    <ArtworkGrid 
      artworks={artworkItems}
      onArtworkClick={handleArtworkClick}
    />
  ) : (
    <p className="text-muted-foreground">No creations yet</p>
  )
} 