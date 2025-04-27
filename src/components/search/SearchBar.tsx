"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Tag, Type, Loader2, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { Badge } from "@/components/ui/badge"

type SearchType = 'all' | 'tag' | 'title'

type Tag = {
  id: string
  name: string
  postCount: number
}

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
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSelectingTag, setIsSelectingTag] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type)
    setShowSuggestions(false)
    setSuggestions([])
    setIsTyping(false)
  }

  useEffect(() => {
    if (!debouncedQuery || searchType === 'title' || !isTyping) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        console.log('Fetching suggestions for:', debouncedQuery)
        const response = await fetch(
          `/api/tags/suggestions?q=${encodeURIComponent(debouncedQuery)}`
        )
        if (response.ok) {
          const data = await response.json()
          console.log('Received suggestions:', data)
          setSuggestions(data)
          if (data.length > 0 && isTyping) {
            setShowSuggestions(true)
          }
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery, searchType, isTyping])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const searchParams = new URLSearchParams({
      q: query,
      ...(searchType !== 'all' && { type: searchType })
    })
    router.push(`/search?${searchParams.toString()}`)
    setShowSuggestions(false)
  }

  const handleTagSelect = (tag: Tag) => {
    setIsSelectingTag(true)
    setQuery(tag.name)
    setSearchType('tag')
    setShowSuggestions(false)
    setIsTyping(false)
    
    const searchParams = new URLSearchParams({
      q: tag.name,
      type: 'tag'
    })
    router.push(`/search?${searchParams.toString()}`)
    
    setTimeout(() => {
      setIsSelectingTag(false)
    }, 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsTyping(true)
    if (!value || searchType === 'title') {
      setShowSuggestions(false)
      setIsTyping(false)
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (isSelectingTag) return
    setTimeout(() => {
      setShowSuggestions(false)
      setIsTyping(false)
    }, 200)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              placeholder={`Search by ${searchType === 'tag' ? 'tags' : searchType === 'title' ? 'title' : 'title or tags'}...`}
              value={query}
              onChange={handleInputChange}
              className="w-full"
              onBlur={handleBlur}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={searchType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSearchTypeChange('all')}
            className="flex gap-2"
          >
            <Search className="h-4 w-4" />
            All
          </Button>
          <Button
            type="button"
            variant={searchType === 'tag' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSearchTypeChange('tag')}
            className="flex gap-2"
          >
            <Tag className="h-4 w-4" />
            Tags
          </Button>
          <Button
            type="button"
            variant={searchType === 'title' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSearchTypeChange('title')}
            className="flex gap-2"
          >
            <Type className="h-4 w-4" />
            Title
          </Button>
        </div>
      </form>

      {(isLoading || (showSuggestions && suggestions.length > 0)) && (
        <div className="absolute z-50 w-full mt-1 py-1 bg-background border rounded-md shadow-lg">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-medium text-muted-foreground">
              {isLoading ? 'Searching...' : 'Tag Suggestions'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 hover:bg-accent"
              onClick={() => setShowSuggestions(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close suggestions</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Searching for tags...
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((tag) => (
                <button
                  key={tag.id}
                  className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between"
                  onClick={() => handleTagSelect(tag)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setIsSelectingTag(true)
                  }}
                  onMouseUp={() => setIsSelectingTag(false)}
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-muted-foreground">#</span>
                    {tag.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tag.postCount} posts
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 