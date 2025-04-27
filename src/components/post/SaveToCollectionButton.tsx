"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bookmark, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type Collection = {
  id: string
  name: string
  saved?: boolean
}

interface SaveToCollectionProps {
  postId: string
  size?: "sm" | "md" | "lg"
}

export function SaveToCollectionButton({
  postId,
  size = "md",
}: SaveToCollectionProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Fetch user's collections and check which ones contain this post
        const response = await fetch(`/api/collections?postId=${postId}`)
        if (response.ok) {
          const data = await response.json()
          setCollections(data)
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      }
    }

    fetchCollections()
  }, [postId])

  const handleSaveToCollection = async (collectionId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/collections/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, collectionId }),
      })

      if (response.ok) {
        const { saved } = await response.json()
        setCollections(collections.map(collection => 
          collection.id === collectionId 
            ? { ...collection, saved } 
            : collection
        ))
        
        toast({
          title: saved ? "Saved" : "Removed",
          description: saved 
            ? "Post saved to collection" 
            : "Post removed from collection",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving to collection:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCollection = () => {
    router.push("/profile/collections/new?postId=" + postId)
  }

  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(sizes[size], "transition-colors")}
          disabled={isLoading}
        >
          <Bookmark className={iconSizes[size]} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <DropdownMenuItem
              key={collection.id}
              onClick={() => handleSaveToCollection(collection.id)}
              className="flex items-center justify-between"
            >
              {collection.name}
              {collection.saved && <span className="text-green-500">✓</span>}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No collections found</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateCollection}>
          <Plus className="mr-2 h-4 w-4" />
          Create new collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 