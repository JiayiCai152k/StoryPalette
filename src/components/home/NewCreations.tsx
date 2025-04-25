// src/components/home/NewCreations.tsx
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
  user: {
    id: string
    name: string
  }
  createdAt: string
}

type Fiction = {
  id: string
  title: string
  summary?: string
  wordCount: number
  user: {
    id: string
    name: string
  }
  createdAt: string
}

export default function NewCreations() {
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [fiction, setFiction] = useState<Fiction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const [artworkRes, fictionRes] = await Promise.all([
          fetch('/api/explore/artworks?sort=recent&limit=1'),
          fetch('/api/explore/fictions?sort=recent&limit=1')
        ])
        
        if (artworkRes.ok) setArtwork((await artworkRes.json())[0])
        if (fictionRes.ok) setFiction((await fictionRes.json())[0])
      } catch (error) {
        console.error('Error fetching latest items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatest()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Creations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Latest Creations</h2>
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto auto-rows-auto">
        {artwork && (
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-fit">
            <div className="relative w-full h-32">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardHeader className="pb-1 px-4 pt-2">
              <CardTitle className="line-clamp-4 text-base">
                <Link href={`/profile/creations/${artwork.id}`} className="hover:underline">
                  {artwork.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col px-4 pt-0">
              {artwork.caption && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {artwork.caption}
                </p>
              )}
              {artwork.user && (
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${artwork.user.id}`} className="hover:underline">
                      {artwork.user.name}
                    </Link>
                    <span>•</span>
                    <time>{new Date(artwork.createdAt).toLocaleDateString()}</time>
                  </div>
                  <ImageIcon className="h-4 w-4" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {fiction && (
          <Card className="hover:shadow-lg transition-shadow h-fit">
            <CardHeader className="pb-1 px-4 pt-2">
              <CardTitle className="line-clamp-4 text-base">
                <Link href={`/profile/fictions/${fiction.id}`} className="hover:underline">
                  {fiction.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col px-4 pt-0">
              {fiction.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {fiction.summary}
                </p>
              )}
              {fiction.user && (
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${fiction.user.id}`} className="hover:underline">
                      {fiction.user.name}
                    </Link>
                    <span>•</span>
                    <time>{new Date(fiction.createdAt).toLocaleDateString()}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{fiction.wordCount?.toLocaleString() ?? '0'} words</span>
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-lg transition-shadow h-fit flex flex-col justify-center items-center">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Want to see more?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Discover more latest creations in our explore page
            </p>
            <Link 
              href="/explore" 
              className="text-sm text-primary hover:underline flex items-center gap-2"
            >
              Check out more
              <span aria-hidden="true">→</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}