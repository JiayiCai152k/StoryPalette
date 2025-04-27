"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  postId: string
  initialLiked?: boolean
  likeCount?: number
  size?: "sm" | "md" | "lg"
}

export function LikeButton({
  postId,
  initialLiked = false,
  likeCount: initialLikeCount = 0,
  size = "md",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/like`)
        if (response.ok) {
          const { liked } = await response.json()
          setLiked(liked)
        }
      } catch (error) {
        console.error("Error checking like status:", error)
      }
    }

    checkLikeStatus()
  }, [postId])

  const handleLike = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const { liked: newLikedStatus } = await response.json()
        setLiked(newLikedStatus)
        setLikeCount(prev => newLikedStatus ? prev + 1 : prev - 1)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to like post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sizes = {
    sm: "h-8 px-2",
    md: "h-10 px-3",
    lg: "h-12 px-4",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizes[size],
        "group transition-colors",
        liked && "text-red-500 hover:text-red-600"
      )}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "mr-1",
          liked ? "fill-current" : "fill-none",
          "transition-all"
        )}
      />
      <span>{likeCount > 0 ? likeCount : ""}</span>
    </Button>
  )
} 