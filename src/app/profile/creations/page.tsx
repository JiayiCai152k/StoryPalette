"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArtworkGrid } from "@/components/artwork/ArtworkGrid"
import { useRouter } from "next/navigation"
import { type posts } from "@/db/schema/content"
import { type InferSelectModel } from "drizzle-orm"

// Use the inferred type from your schema
type Post = InferSelectModel<typeof posts>

// Define the type that ArtworkGrid expects
type ArtworkGridItem = {
  id: string
  title: string
  imageUrl: string
  caption?: string
}

export default function CreationsPage() {
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

  // Transform posts to match ArtworkGrid's expected type
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

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Artwork</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ArtworkGrid 
              artworks={artworkItems}
              onArtworkClick={handleArtworkClick}
            />
          )}
        </CardContent>
      </Card>
    </main>
  )
}
