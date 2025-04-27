"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Image from "next/image"

type SearchResult = {
  id: string
  title: string
  type: 'ARTWORK' | 'FICTION'
  imageUrl: string | null
  summary: string | null
  createdAt: string
  user: {
    id: string
    name: string
    image: string | null
  }
  tags: string[]
}

export function SearchResults({ query, type }: { query?: string; type?: string }) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return
      
      setIsLoading(true)
      try {
        const searchParams = new URLSearchParams({
          q: query,
          ...(type && type !== 'all' && { type })
        })
        const response = await fetch(`/api/search?${searchParams}`)
        if (!response.ok) throw new Error('Search failed')
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, type])

  const handleResultClick = (result: SearchResult) => {
    const route = result.type === 'ARTWORK' 
      ? `/profile/creations/${result.id}`
      : `/profile/fictions/${result.id}`
    router.push(route)
  }

  if (!query) {
    return (
      <p className="text-center text-muted-foreground">
        Enter a search term to find content
      </p>
    )
  }

  if (isLoading) {
    return <p className="text-center">Searching...</p>
  }

  if (results.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No results found for &ldquo;{query}&rdquo;
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <button
          key={result.id}
          className="w-full flex items-start gap-4 p-4 hover:bg-accent rounded-lg text-left border"
          onClick={() => handleResultClick(result)}
        >
          {result.type === 'ARTWORK' && result.imageUrl && (
            <div className="relative w-16 h-16">
              <Image
                src={result.imageUrl}
                alt={result.title}
                fill
                className="object-cover rounded"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{result.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={result.user.image || ""} />
                <AvatarFallback>{result.user.name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">{result.user.name}</p>
            </div>
            {result.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary px-1.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
} 