"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type posts } from "@/db/schema/content"
import { type InferSelectModel } from "drizzle-orm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Post = InferSelectModel<typeof posts>

type FictionItem = {
  id: string
  title: string
  summary?: string
  wordCount: number | null
  createdAt: Date
}

export function UserFictions({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/fictions`)
        if (!response.ok) {
          throw new Error('Failed to fetch fictions')
        }
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching fictions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [userId])

  const handleFictionClick = (id: string) => {
    router.push(`/profile/fictions/${id}`)
  }

  const fictionItems: FictionItem[] = posts
    .filter((post): post is Post & { createdAt: Date } => 
      post.type === 'FICTION'
    )
    .map(post => ({
      id: post.id,
      title: post.title,
      summary: post.summary ?? undefined,
      wordCount: post.wordCount,
      createdAt: new Date(post.createdAt)
    }))

  if (isLoading) return <div>Loading...</div>
  if (fictionItems.length === 0) return <p className="text-center text-muted-foreground">No fictions yet</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fictionItems.map((fiction) => (
        <Card 
          key={fiction.id}
          className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
          onClick={() => handleFictionClick(fiction.id)}
        >
          <CardHeader>
            <CardTitle className="line-clamp-2">{fiction.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            {fiction.summary && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {fiction.summary}
              </p>
            )}
            <div className="flex justify-between text-sm text-muted-foreground mt-auto pt-4">
              <span>{fiction.wordCount?.toLocaleString() ?? '0'} words</span>
              <span>{fiction.createdAt.toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 