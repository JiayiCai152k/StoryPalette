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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-4 border-b pb-2">
          <h3 className="text-sm font-medium">View:</h3>
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger 
              value="grid" 
              className="h-8 px-3 data-[state=active]:bg-accent"
            >
              <GridIcon className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="h-8 px-3 data-[state=active]:bg-accent"
            >
              <ListIcon className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full">
          <TabsContent value="grid">
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
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              {fictionItems.map((fiction) => (
                <div 
                  key={fiction.id}
                  className="flex flex-col p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleFictionClick(fiction.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{fiction.title}</h3>
                    {fiction.summary && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {fiction.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-4">
                    <span>{fiction.wordCount?.toLocaleString() ?? '0'} words</span>
                    <span>{fiction.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}