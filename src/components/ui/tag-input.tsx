"use client"

import { useState, useRef, useEffect } from "react"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
  className?: string
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags = 10,
  className,
}: TagInputProps) {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions
    .filter(tag => !value.includes(tag))
    .filter(tag => tag.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 5)

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmedTag])
      setInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className={cn("relative", className)}>
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
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              addTag(input)
            }
            if (e.key === "Backspace" && !input && value.length > 0) {
              removeTag(value[value.length - 1])
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={value.length < maxTags ? placeholder : ""}
          className="flex-1 outline-none bg-transparent min-w-[120px]"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <Command className="absolute w-full z-10 top-[100%] mt-1">
          <CommandGroup>
            {filteredSuggestions.map(tag => (
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
          </CommandGroup>
        </Command>
      )}
    </div>
  )
}
