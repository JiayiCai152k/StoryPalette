"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LockIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArtworkGrid } from "@/components/artwork/ArtworkGrid"
import { useRouter } from "next/navigation"

type Collection = {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  createdAt: string
}

type CollectionPost = {
  id: string
  title: string
  type: "ARTWORK" | "FICTION"
  imageUrl?: string
  summary?: string
  wordCount?: number
  createdAt: string
}

export default function CollectionClient({ id }: { id: string }) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [posts, setPosts] = useState<CollectionPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/collections/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch collection')
        }
        const data = await response.json()
        setCollection(data.collection)
        setPosts(data.posts)
      } catch (error) {
        console.error('Error fetching collection:', error)
        toast({
          title: "Error",
          description: "Failed to load collection",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [id, toast])

  const handleArtworkClick = (postId: string) => {
    router.push(`/profile/creations/${postId}`)
  }

  const handleFictionClick = (postId: string) => {
    router.push(`/profile/fictions/${postId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!collection) {
    return <div>Collection not found</div>
  }

  const artworks = posts.filter(post => post.type === "ARTWORK" && post.imageUrl)
  const fictions = posts.filter(post => post.type === "FICTION")

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                {collection.name}
                {collection.isPrivate && (
                  <LockIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                )}
              </CardTitle>
              {collection.description && (
                <p className="text-muted-foreground mt-2">{collection.description}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={artworks.length > 0 ? "artwork" : "fiction"} className="w-full">
            <TabsList>
              <TabsTrigger value="artwork">Artwork ({artworks.length})</TabsTrigger>
              <TabsTrigger value="fiction">Fiction ({fictions.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="artwork" className="mt-6">
              {artworks.length > 0 ? (
                <ArtworkGrid 
                  artworks={artworks.map(art => ({
                    id: art.id,
                    title: art.title,
                    imageUrl: art.imageUrl!,
                    createdAt: new Date(art.createdAt)
                  }))}
                  onArtworkClick={handleArtworkClick}
                />
              ) : (
                <p className="text-muted-foreground">No artwork in this collection</p>
              )}
            </TabsContent>
            
            <TabsContent value="fiction" className="mt-6">
              {fictions.length > 0 ? (
                <div className="grid gap-4">
                  {fictions.map(fiction => (
                    <div
                      key={fiction.id}
                      className="p-4 border rounded-md cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleFictionClick(fiction.id)}
                    >
                      <h3 className="font-medium">{fiction.title}</h3>
                      {fiction.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {fiction.summary}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{fiction.wordCount?.toLocaleString() || 0} words</span>
                        <span>{new Date(fiction.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No fiction in this collection</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
} 