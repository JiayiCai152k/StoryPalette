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
import { BookOpen } from "lucide-react"

type Fiction = {
  id: string
  title: string
  summary?: string
  wordCount: number | null
  createdAt: string
  user: {
    id: string
    name: string
    image?: string | null
  }
}

export function ExploreFictions() {
  const [fictions, setFictions] = useState<Fiction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const fetchFictions = async () => {
      try {
        const response = await fetch(`/api/explore/fictions?sort=${sortBy}`)
        if (!response.ok) throw new Error('Failed to fetch fictions')
        const data = await response.json()
        setFictions(data)
      } catch (error) {
        console.error('Error fetching fictions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFictions()
  }, [sortBy])

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full" />
      ))}
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="longest">Longest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fictions.map((fiction) => (
          <Card key={fiction.id} className="hover:shadow-lg transition-shadow">
            <Link href={`/profile/fictions/${fiction.id}`} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{fiction.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link 
                    href={`/profile/${fiction.user.id}`} 
                    className="hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {fiction.user.name}
                  </Link>
                  <span>•</span>
                  <span>{new Date(fiction.createdAt).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                {fiction.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {fiction.summary}
                  </p>
                )}
                <div className="flex items-center text-sm text-muted-foreground mt-auto">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{fiction.wordCount?.toLocaleString() ?? 0} words</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {fictions.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No fictions found
        </p>
      )}
    </div>
  )
}