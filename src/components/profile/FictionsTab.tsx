"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type posts } from "@/db/schema/content"
import { type InferSelectModel } from "drizzle-orm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GridIcon, ListIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Post = InferSelectModel<typeof posts>

type FictionItem = {
  id: string
  title: string
  summary?: string
  wordCount: number | null
  createdAt: Date
}

export function FictionsTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/user/fiction')
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
  }, [])

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
  if (fictionItems.length === 0) return <p className="text-muted-foreground">No fictions yet</p>

  return (
    <Tabs defaultValue="grid" className="w-full">
      <TabsList className="w-full justify-start mb-4">
        <TabsTrigger value="grid" className="flex gap-2">
          <GridIcon className="h-4 w-4" />
          Grid View
        </TabsTrigger>
        <TabsTrigger value="details" className="flex gap-2">
          <ListIcon className="h-4 w-4" />
          Details View
        </TabsTrigger>
      </TabsList>

      <TabsContent value="grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fictionItems.map((fiction) => (
            <Card 
              key={fiction.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleFictionClick(fiction.id)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{fiction.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {fiction.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                    {fiction.summary}
                  </p>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{fiction.wordCount?.toLocaleString() ?? '0'} words</span>
                  <span>{fiction.createdAt.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="details">
        <div className="space-y-4">
          {fictionItems.map((fiction) => (
            <div 
              key={fiction.id}
              className="flex flex-col p-4 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => handleFictionClick(fiction.id)}
            >
              <h3 className="font-medium">{fiction.title}</h3>
              {fiction.summary && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {fiction.summary}
                </p>
              )}
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{fiction.wordCount?.toLocaleString() ?? '0'} words</span>
                <span>{fiction.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}