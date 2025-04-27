"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

type Tag = {
  id: string
  name: string
  postCount: number
}

export function TagSuggestions({
  query,
  onTagClick,
  selectedTags = []
}: {
  query?: string
  onTagClick: (tag: Tag) => void
  selectedTags?: string[]
}) {
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const url = query
          ? `/api/tags/suggestions?q=${encodeURIComponent(query)}`
          : '/api/tags/suggestions'
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
        }
      } catch (error) {
        console.error('Error fetching tag suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [query])

  if (isLoading) return <div>Loading suggestions...</div>
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map(tag => (
        <Badge
          key={tag.id}
          variant={selectedTags.includes(tag.id) ? "secondary" : "outline"}
          className="cursor-pointer hover:bg-secondary"
          onClick={() => onTagClick(tag)}
        >
          {tag.name}
          <span className="ml-1 text-xs text-muted-foreground">
            ({tag.postCount})
          </span>
        </Badge>
      ))}
    </div>
  )
} 