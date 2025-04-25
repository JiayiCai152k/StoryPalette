// src/components/home/TrendingCreations.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, ImageIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Artwork = {
  id: string
  title: string
  imageUrl: string
  caption?: string
}

type Fiction = {
  id: string
  title: string
  summary?: string
  wordCount: number
}

export default function TrendingCreations() {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [fiction, setFiction] = useState<Fiction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const [artworkRes, fictionRes] = await Promise.all([
          fetch('/api/explore/artworks?sort=popular&limit=1'),
          fetch('/api/explore/fictions?sort=popular&limit=1')
        ])
        
        if (artworkRes.ok) setArtwork((await artworkRes.json())[0])
        if (fictionRes.ok) setFiction((await fictionRes.json())[0])
      } catch (error) {
        console.error('Error fetching trending items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Trending Now</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Trending Now</h2>
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {artwork && (
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[4/3]">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={`/profile/creations/${artwork.id}`} className="hover:underline">
                  {artwork.title}
                </Link>
              </CardTitle>
            </CardHeader>
            {artwork.caption && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {artwork.caption}
                </p>
              </CardContent>
            )}
          </Card>
        )}

        {fiction && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={`/profile/fictions/${fiction.id}`} className="hover:underline">
                  {fiction.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fiction.summary && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {fiction.summary}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{fiction.wordCount?.toLocaleString() ?? '0'} words</span>
                <BookOpen className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
