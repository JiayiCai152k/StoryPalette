"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ImageIcon } from "lucide-react"

type Creation = {
  id: string
  title: string
  type: 'ARTWORK' | 'FICTION'
  imageUrl?: string
  summary?: string
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
        // Filter to only include artwork
        const artworkOnly = data.filter((c: Creation) => c.type === 'ARTWORK')
        setCreations(artworkOnly)
      } catch (error) {
        console.error('Error fetching creations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreations()
  }, [userId])

  if (isLoading) return <div>Loading creations...</div>
  if (creations.length === 0) return <div>No artwork yet</div>

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {creations.map(creation => (
        <CreationCard key={creation.id} creation={creation} />
      ))}
    </div>
  )
}

function CreationCard({ creation }: { creation: Creation }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/profile/creations/${creation.id}`}>
        {creation.imageUrl && (
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
            <ImageIcon className="h-4 w-4" />
          </div>
        </CardContent>
      </Link>
    </Card>
  )
} 