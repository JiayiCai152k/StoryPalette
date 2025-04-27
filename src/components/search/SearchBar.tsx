"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Tag, Type } from "lucide-react"
import { useState } from "react"

type SearchType = 'all' | 'tag' | 'title'

export function SearchBar({ 
  defaultQuery = '', 
  defaultType = 'all' 
}: { 
  defaultQuery?: string
  defaultType?: string 
}) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultQuery)
  const [searchType, setSearchType] = useState<SearchType>(defaultType as SearchType || 'all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const searchParams = new URLSearchParams({
      q: query,
      ...(searchType !== 'all' && { type: searchType })
    })
    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
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
  )
} 