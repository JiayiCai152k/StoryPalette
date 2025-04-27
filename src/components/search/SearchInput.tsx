"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Tag = {
  id: string
  name: string
  postCount: number
}

export function SearchInput({
  onSearch,
  onTagSelect
}: {
  onSearch: (value: string) => void
  onTagSelect: (tag: Tag) => void
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const debouncedValue = useDebounce(value, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!debouncedValue) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `/api/tags/suggestions?q=${encodeURIComponent(debouncedValue)}`
        )
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setOpen(true)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    fetchSuggestions()
  }, [debouncedValue])

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Input
              ref={inputRef}
              placeholder="Search or type # to find tags..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (e.target.value.startsWith('#')) {
                  setOpen(true)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !open) {
                  onSearch(value)
                }
              }}
              className="w-full"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandGroup heading="Tag Suggestions">
              {suggestions.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    onTagSelect(tag)
                    setValue("")
                    setOpen(false)
                    inputRef.current?.focus()
                  }}
                >
                  <Badge variant="outline" className="mr-2">
                    #{tag.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tag.postCount} posts
                  </span>
                </CommandItem>
              ))}
              {suggestions.length === 0 && (
                <CommandItem disabled>No tags found</CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 