"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"

type Post = {
  id: string;
  userId: string;
  type: 'ARTWORK' | 'FICTION';
  title: string;
  description?: string;
  imageUrl?: string;
  caption?: string;
  content?: string;
  summary?: string;
  wordCount?: number;
  createdAt: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

type LikedItem = {
  id: string;
  title: string;
  type: 'ARTWORK' | 'FICTION';
  summary?: string;
  imageUrl?: string;
  wordCount?: number;
  createdAt: Date;
  tags: Array<{
    id: string;
    name: string;
  }>;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export function CollectionsTab() {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const response = await fetch('/api/user/likes')
        if (!response.ok) {
          throw new Error('Failed to fetch liked items')
        }
        const data = await response.json()
        
        // For debugging
        console.log('Received data:', data);
        
        setLikedItems(data.map((post: Post) => {
          console.log('Processing post:', post); // Debug individual post
          return {
            id: post.id,
            title: post.title,
            type: post.type,
            summary: post.summary || undefined,
            imageUrl: post.imageUrl || undefined,
            wordCount: post.wordCount,
            createdAt: new Date(post.createdAt),
            tags: post.tags || [],
            user: post.user
          };
        }))
      } catch (error) {
        console.error('Error fetching liked items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLikedItems()
  }, [])

  const handleItemClick = (item: LikedItem) => {
    if (item.type === 'ARTWORK') {
      router.push(`/profile/creations/${item.id}`)
    } else {
      router.push(`/profile/fictions/${item.id}`)
    }
  }

  const fictionItems = likedItems.filter(item => item.type === 'FICTION')
  const artworkItems = likedItems.filter(item => item.type === 'ARTWORK')

  if (isLoading) return <div>Loading...</div>
  if (likedItems.length === 0) return (
    <div className="text-center py-12">
      <Heart className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
      <p className="text-muted-foreground">You haven&apos;t liked any posts yet</p>
    </div>
  )

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="all">All Likes</TabsTrigger>
          <TabsTrigger value="fictions">Fictions</TabsTrigger>
          <TabsTrigger value="artworks">Artworks</TabsTrigger>
        </TabsList>

        <div className="w-full">
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedItems.map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="pb-2 space-y-2">
                    <div>
                      <CardTitle className="line-clamp-2 flex items-center gap-2">
                        {item.title}
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {item.type === 'ARTWORK' ? 'Artwork' : 'Fiction'}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {item.user?.name || 'Anonymous'}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    {item.type === 'ARTWORK' && item.imageUrl && (
                      <div className="relative h-40 mb-3">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    {item.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.summary}
                      </p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground mt-auto pt-4">
                      {item.type === 'FICTION' && (
                        <span>{item.wordCount?.toLocaleString() || '0'} words</span>
                      )}
                      <span className="ml-auto">{item.createdAt.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fictions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fictionItems.map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="space-y-2">
                    <div>
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {item.user?.name || 'Anonymous'}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    {item.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.summary}
                      </p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground mt-auto pt-4">
                      <span>{item.wordCount?.toLocaleString() || '0'} words</span>
                      <span>{item.createdAt.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artworks">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artworkItems.map((item) => (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="pb-2 space-y-2">
                    <div>
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {item.user?.name || 'Anonymous'}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    {item.imageUrl && (
                      <div className="relative h-40 mb-3">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground mt-auto">
                      <span>{item.createdAt.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
} 