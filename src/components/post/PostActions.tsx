"use client"

import { LikeButton } from "@/components/post/LikeButton"
import { SaveToCollectionButton } from "@/components/post/SaveToCollectionButton"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface PostActionsProps {
  postId: string
  initialLikeCount?: number
  initialLiked?: boolean
}

export function PostActions({
  postId,
  initialLikeCount = 0,
  initialLiked = false,
}: PostActionsProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      })
    } catch (error) {
      console.error("Error sharing post:", error)
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <LikeButton
        postId={postId}
        initialLiked={initialLiked}
        likeCount={initialLikeCount}
      />
      <SaveToCollectionButton postId={postId} />
      <Button variant="ghost" size="icon" onClick={handleShare}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
} 