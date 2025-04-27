"use client"

import { useState, useRef, useEffect } from "react"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type TagSuggestion = {
  id: string
  name: string
  postCount: number
}

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
  className?: string
  onInputChange?: (value: string) => void
  dynamicSuggestions?: TagSuggestion[]
  isLoading?: boolean
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags = 10,
  className,
  onInputChange,
  dynamicSuggestions = [],
  isLoading = false,
}: TagInputProps) {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions
    .filter(tag => !value.includes(tag))
    .filter(tag => tag.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setIsTyping(true)
    setShowSuggestions(true)
    if (onInputChange) {
      onInputChange(value)
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmedTag])
      setInput("")
      setIsTyping(false)
      setShowSuggestions(false)
      if (onInputChange) {
        onInputChange("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsTyping(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Hide suggestions if input is empty
  useEffect(() => {
    if (!input) {
      setShowSuggestions(false)
      setIsTyping(false)
    }
  }, [input])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[2.5rem]">
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1">
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <div className="flex-1 flex items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag(input)
              }
              if (e.key === "Backspace" && !input && value.length > 0) {
                removeTag(value[value.length - 1])
              }
            }}
            onFocus={() => {
              if (input) {
                setShowSuggestions(true)
                setIsTyping(true)
              }
            }}
            placeholder={value.length < maxTags ? placeholder : ""}
            className="flex-1 outline-none bg-transparent min-w-[120px]"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
        </div>
      </div>

      {showSuggestions && isTyping && (
        <Command className="absolute w-full z-10 top-[100%] mt-1">
          <CommandGroup>
            {filteredSuggestions.length > 0 && filteredSuggestions.map(tag => (
              <CommandItem
                key={tag}
                onSelect={() => {
                  addTag(tag)
                  inputRef.current?.focus()
                }}
              >
                #{tag}
              </CommandItem>
            ))}
            
            {dynamicSuggestions.length > 0 && dynamicSuggestions.map(tag => (
              <CommandItem
                key={tag.id}
                onSelect={() => {
                  addTag(tag.name)
                  inputRef.current?.focus()
                }}
              >
                <span className="flex items-center justify-between w-full">
                  <span>#{tag.name}</span>
                  <span className="text-xs text-muted-foreground">{tag.postCount} posts</span>
                </span>
              </CommandItem>
            ))}
            
            {!isLoading && filteredSuggestions.length === 0 && dynamicSuggestions.length === 0 && input && (
              <CommandItem
                onSelect={() => {
                  addTag(input)
                  inputRef.current?.focus()
                }}
              >
                Create &ldquo;#{input}&rdquo;
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      )}
    </div>
  )
}
