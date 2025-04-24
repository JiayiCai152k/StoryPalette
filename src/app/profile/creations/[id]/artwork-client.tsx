"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, BookmarkPlus } from "lucide-react"

// Define the type for the artwork data
type ArtworkPost = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  caption?: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
  createdAt: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

// Make sure to return JSX from the component
export default function ArtworkClient({ id }: { id: string }) {
  const [artwork, setArtwork] = useState<ArtworkPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/artwork/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch artwork')
        }
        const data = await response.json()
        setArtwork(data)
      } catch (error) {
        console.error('Error fetching artwork:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtwork()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (!artwork) return <div>Artwork not found</div>

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {artwork.user.image && (
                <Image
                  src={artwork.user.image}
                  alt={artwork.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <CardTitle>{artwork.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {artwork.user.name}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square w-full max-w-3xl mx-auto mb-6">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-contain"
            />
          </div>
          {artwork.caption && (
            <p className="text-lg text-center mb-4">{artwork.caption}</p>
          )}
          {artwork.description && (
            <p className="text-muted-foreground mb-4">{artwork.description}</p>
          )}
          {artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-secondary rounded-full text-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
