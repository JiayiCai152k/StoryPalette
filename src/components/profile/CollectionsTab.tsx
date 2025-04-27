"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GridIcon, ListIcon, Heart } from "lucide-react"
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
}

export function CollectionsTab() {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "details">("grid")
  const router = useRouter()

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const response = await fetch('/api/user/likes')
        if (!response.ok) {
          throw new Error('Failed to fetch liked items')
        }
        const data = await response.json()
        
        setLikedItems(data.map((post: Post) => ({
          id: post.id,
          title: post.title,
          type: post.type,
          summary: post.summary || undefined,
          imageUrl: post.imageUrl || undefined,
          wordCount: post.wordCount,
          createdAt: new Date(post.createdAt),
          tags: post.tags
        })))
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
        <div className="flex items-center justify-between gap-4 border-b pb-2">
          <TabsList>
            <TabsTrigger value="all">All Likes</TabsTrigger>
            <TabsTrigger value="fictions">Fictions</TabsTrigger>
            <TabsTrigger value="artworks">Artworks</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">View:</span>
            <TabsList className="h-8 bg-transparent p-0">
              <TabsTrigger 
                value="grid" 
                className="h-8 px-3 data-[state=active]:bg-accent"
                onClick={() => setViewMode("grid")}
                data-state={viewMode === "grid" ? "active" : "inactive"}
              >
                <GridIcon className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="h-8 px-3 data-[state=active]:bg-accent"
                onClick={() => setViewMode("details")}
                data-state={viewMode === "details" ? "active" : "inactive"}
              >
                <ListIcon className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="w-full">
          <TabsContent value="all">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                    onClick={() => handleItemClick(item)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 flex items-center">
                        {item.title}
                        <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {item.type === 'ARTWORK' ? 'Artwork' : 'Fiction'}
                        </span>
                      </CardTitle>
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
            ) : (
              <div className="space-y-4">
                {likedItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.type === 'ARTWORK' && item.imageUrl && (
                      <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium flex items-center">
                        {item.title}
                        <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {item.type === 'ARTWORK' ? 'Artwork' : 'Fiction'}
                        </span>
                      </h3>
                      {item.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                      <div className="flex text-sm text-muted-foreground mt-2">
                        {item.type === 'FICTION' && (
                          <span className="mr-4">{item.wordCount?.toLocaleString() || '0'} words</span>
                        )}
                        <span>{item.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fictions">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fictionItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                    onClick={() => handleItemClick(item)}
                  >
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
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
            ) : (
              <div className="space-y-4">
                {fictionItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex flex-col p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-4">
                      <span>{item.wordCount?.toLocaleString() || '0'} words</span>
                      <span>{item.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="artworks">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artworkItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                    onClick={() => handleItemClick(item)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
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
            ) : (
              <div className="space-y-4">
                {artworkItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    {item.imageUrl && (
                      <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="text-sm text-muted-foreground mt-2">
                        <span>{item.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
} 