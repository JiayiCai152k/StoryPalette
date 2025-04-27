"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type User = {
  id: string
  name: string
  image: string
}

type Comment = {
  id: string
  content: string
  createdAt: string
  user: User
}

interface CommentSectionProps {
  postId: string
  initialComments?: Comment[]
}

const MAX_COMMENT_LENGTH = 500

export function CommentSection({
  postId,
  initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      setIsFetching(true)
      try {
        const response = await fetch(`/api/posts/${postId}/comments`)
        if (response.ok) {
          const data = await response.json()
          // Sort comments - newest first
          setComments(data.sort((a: Comment, b: Comment) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ))
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    if (initialComments.length === 0) {
      fetchComments()
    }
  }, [postId, initialComments, toast])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    if (newComment.length > MAX_COMMENT_LENGTH) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments(prevComments => [comment, ...prevComments])
        setNewComment("")
        toast({
          title: "Success",
          description: "Comment posted successfully!",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to add comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const charCount = newComment.length
  const isOverLimit = charCount > MAX_COMMENT_LENGTH

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        Comments ({comments.length})
      </h3>
      
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] focus:ring-offset-2"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex-1"></div>
            <div className={isOverLimit ? "text-red-500 font-medium" : ""}>
              {charCount}/{MAX_COMMENT_LENGTH}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment} 
            disabled={isLoading || !newComment.trim() || isOverLimit}
            className="relative"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 border rounded-lg bg-muted/20">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.image} alt={comment.user.name} />
                <AvatarFallback>
                  {comment.user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{comment.user.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
} 