"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

type Creator = {
  id: string
  name: string
  image?: string | null
  bio?: string | null
  _count?: {
    posts: number
    followers: number
    following: number
  }
}

export function CreatorsList() {
  const [creators, setCreators] = useState<Creator[]>([])
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("q")

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.set("q", searchTerm)
        
        const response = await fetch(`/api/creators?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch creators")
        const data = await response.json()
        setCreators(data)
      } catch (error) {
        console.error("Error fetching creators:", error)
      }
    }

    fetchCreators()
  }, [searchTerm])

  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No creators found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {creators.map((creator) => (
        <Card key={creator.id}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={creator.image ?? ""} alt={creator.name} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link 
                  href={`/profile/${creator.id}`}
                  className="font-semibold hover:underline"
                >
                  {creator.name}
                </Link>
                {creator._count && (
                  <p className="text-sm text-muted-foreground">
                    {creator._count.posts} creations
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {creator.bio ? (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {creator.bio}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No bio provided
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 