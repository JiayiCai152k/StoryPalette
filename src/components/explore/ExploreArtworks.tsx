"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

type Artwork = {
  id: string
  title: string
  imageUrl: string
  caption?: string
  createdAt: string
  user: {
    id: string
    name: string
    image?: string | null
  }
}

export function ExploreArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("recent")
  const router = useRouter()

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(`/api/explore/artworks?sort=${sortBy}`)
        if (!response.ok) throw new Error('Failed to fetch artworks')
        const data = await response.json()
        setArtworks(data)
      } catch (error) {
        console.error('Error fetching artworks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtworks()
  }, [sortBy])

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] w-full" />
      ))}
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card 
            key={artwork.id} 
            className="group overflow-hidden bg-card hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <Link href={`/profile/creations/${artwork.id}`} className="block">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
              
              <CardContent className="flex flex-col flex-1 pb-0 pt-4">
                <div className="flex-1 space-y-2">
                  <Link href={`/profile/creations/${artwork.id}`}>
                    <h3 className="font-semibold line-clamp-1 text-lg">
                      {artwork.title}
                    </h3>
                    {artwork.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {artwork.caption}
                      </p>
                    )}
                  </Link>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={artwork.user.image || ""} />
                    <AvatarFallback>{artwork.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/profile/${artwork.user.id}`);
                      }}
                      className="text-sm font-medium hover:underline truncate text-left leading-none"
                    >
                      {artwork.user.name}
                    </button>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {artworks.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No artworks found
        </p>
      )}
    </div>
  )
} 