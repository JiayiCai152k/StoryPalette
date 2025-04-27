"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, BookmarkPlus, MessageSquare, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Define the type for the artwork data
type ArtworkPost = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  caption?: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
  createdAt: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

// Make sure to return JSX from the component
export default function ArtworkClient({ id }: { id: string }) {
  const [artwork, setArtwork] = useState<ArtworkPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await fetch(`/api/artwork/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch artwork')
        }
        const data = await response.json()
        setArtwork(data)
      } catch (error) {
        console.error('Error fetching artwork:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtwork()
  }, [id])

  useEffect(() => {
    // Fetch like status
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/posts/${id}/like`)
        if (response.ok) {
          const { liked, likeCount } = await response.json()
          setLiked(liked)
          setLikeCount(likeCount)
        }
      } catch (error) {
        console.error('Error checking like status:', error)
      }
    }

    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${id}/comments`)
        if (response.ok) {
          const data = await response.json()
          setComments(data)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }


    if (id) {
      checkLikeStatus()
      fetchComments()
    }
  }, [id])

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: "POST"
      })

      if (response.ok) {
        const { liked: newLikedStatus, likeCount } = await response.json()
        setLiked(newLikedStatus)
        setLikeCount(likeCount)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }


  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsCommentLoading(true)
    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([comment, ...comments])
        setNewComment("")
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsCommentLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/profile/creations/${id}`
      
      // Check if navigator and clipboard API are available
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard", {
          description: url,
          duration: 3000,
          icon: <Check className="h-4 w-4" />,
        })
      } else {
        // Fallback for environments where clipboard API is not available
        toast.info("Share link", {
          description: url,
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to copy link")
    }
  }

  const testClick = () => {
    console.log('Test click detected!');
  };


  if (isLoading) return <div>Loading...</div>
  if (!artwork) return <div>Artwork not found</div>

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {artwork.user?.image && (
                <Image
                  src={artwork.user.image}
                  alt={artwork.user?.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <CardTitle>{artwork.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {artwork.user?.name || 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span className="text-sm">{likeCount > 0 ? likeCount : ""}</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share artwork</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {artwork.imageUrl && (
            <div className="relative aspect-square w-full max-w-3xl mx-auto mb-6">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
              />
            </div>
          )}
          {artwork.caption && (
            <p className="text-lg text-center mb-4">{artwork.caption}</p>
          )}
          {artwork.description && (
            <p className="text-muted-foreground mb-4">{artwork.description}</p>
          )}
          {artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-secondary rounded-full text-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
          
          <Tabs defaultValue="comments" className="mt-10">
            <TabsList>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Comments ({comments.length})</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-4">
              <div className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] mb-2"
                />
                <Button 
                  onClick={handleAddComment} 
                  disabled={isCommentLoading || !newComment.trim()}
                  className="ml-auto block"
                >
                  {isCommentLoading ? "Posting..." : "Post Comment"}
                </Button>
              </div>
              
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user.image || ""} alt={comment.user.name} />
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
                        <p className="mt-2 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
