"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Creation = {
  id: string
  title: string
  type: 'ARTWORK' | 'FICTION'
  imageUrl?: string
  summary?: string
  wordCount?: number
  createdAt: string
}

export function UserCreations({ userId }: { userId: string }) {
  const [creations, setCreations] = useState<Creation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCreations = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/creations`)
        if (!response.ok) throw new Error('Failed to fetch creations')
        const data = await response.json()
        setCreations(data)
      } catch (error) {
        console.error('Error fetching creations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreations()
  }, [userId])

  if (isLoading) return <div>Loading creations...</div>
  if (creations.length === 0) return <div>No creations yet</div>

  const artworks = creations.filter(c => c.type === 'ARTWORK')
  const fictions = creations.filter(c => c.type === 'FICTION')

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="artwork">Artwork</TabsTrigger>
        <TabsTrigger value="fiction">Fiction</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creations.map(creation => (
            <CreationCard key={creation.id} creation={creation} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="artwork" className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map(artwork => (
            <CreationCard key={artwork.id} creation={artwork} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="fiction" className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fictions.map(fiction => (
            <CreationCard key={fiction.id} creation={fiction} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function CreationCard({ creation }: { creation: Creation }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/profile/creations/${creation.id}`}>
        {creation.type === 'ARTWORK' && creation.imageUrl && (
          <div className="relative w-full h-32">
            <Image
              src={creation.imageUrl}
              alt={creation.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-2">{creation.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {creation.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {creation.summary}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <time>{new Date(creation.createdAt).toLocaleDateString()}</time>
            {creation.type === 'FICTION' ? (
              <div className="flex items-center gap-2">
                <span>{creation.wordCount?.toLocaleString() ?? '0'} words</span>
                <BookOpen className="h-4 w-4" />
              </div>
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
} 