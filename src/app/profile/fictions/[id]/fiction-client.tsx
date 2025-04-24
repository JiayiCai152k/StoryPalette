"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, BookmarkPlus } from "lucide-react"

type FictionContent = {
  content: string;
  metadata: {
    wordCount: number;
    updatedAt: string;
  };
}

type FictionPost = {
  id: string;
  title: string;
  summary?: string;
  content: string; // This is now the actual content, not the URL
  wordCount: number | null;
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

export default function FictionClient({ id }: { id: string }) {
  const [fiction, setFiction] = useState<FictionPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFiction = async () => {
      try {
        const response = await fetch(`/api/fiction/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch fiction')
        }
        const data = await response.json()
        setFiction(data)
      } catch (error) {
        console.error('Error fetching fiction:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiction()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (!fiction) return <div>Fiction not found</div>

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <CardTitle className="text-2xl">{fiction.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  by {fiction.user?.name || 'Anonymous'} · {fiction.wordCount?.toLocaleString() || 0} words
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fiction.summary && (
            <p className="text-lg italic mb-6 text-muted-foreground">
              {fiction.summary}
            </p>
          )}
          <div className="prose prose-lg max-w-none">
            {fiction.content.split('\n').map((paragraph, index) => (
              paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
            ))}
          </div>
          {fiction.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {fiction.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-secondary rounded-full text-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
} 