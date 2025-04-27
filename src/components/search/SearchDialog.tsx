"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Tag, Type } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

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

type SearchType = 'all' | 'tag' | 'title'

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState<SearchType>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const searchParams = new URLSearchParams({
        q: query,
        ...(searchType !== 'all' && { type: searchType })
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

  const handleResultClick = (result: SearchResult) => {
    setOpen(false)
    const route = result.type === 'ARTWORK' 
      ? `/profile/creations/${result.id}`
      : `/profile/fictions/${result.id}`;
    router.push(route)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Search by ${searchType === 'tag' ? 'tags' : searchType === 'title' ? 'title' : 'title or tags'}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={searchType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('all')}
              className="flex gap-2"
            >
              <Search className="h-4 w-4" />
              All
            </Button>
            <Button
              type="button"
              variant={searchType === 'tag' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('tag')}
              className="flex gap-2"
            >
              <Tag className="h-4 w-4" />
              Tags
            </Button>
            <Button
              type="button"
              variant={searchType === 'title' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('title')}
              className="flex gap-2"
            >
              <Type className="h-4 w-4" />
              Title
            </Button>
          </div>
        </form>
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Searching...</p>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  className="w-full flex items-start gap-4 p-2 hover:bg-accent rounded-lg text-left"
                  onClick={() => handleResultClick(result)}
                >
                  {result.type === 'ARTWORK' && result.imageUrl && (
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-12 h-12 object-cover rounded"
                    />
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
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query && !isLoading ? (
            <p className="text-sm text-muted-foreground">No results found</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
} 