// src/app/create/fiction/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/ui/tag-input"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Popular fiction tags for suggestions
const popularTags = [
  "fantasy", "scifi", "romance", "horror", "mystery",
  "adventure", "poetry", "shortstory", "drama", "thriller",
  "historical", "literary", "fanfiction", "comedy"
]

export default function CreateFictionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('tags', JSON.stringify(tags))
      
      // Send to your API
      const response = await fetch('/api/fiction', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to publish story')
      }
      
      const data = await response.json()
      router.push(`/fiction/${data.id}`)
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Write Fiction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input 
                id="title"
                name="title"
                placeholder="Give your story a title" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Summary
              </label>
              <Input 
                id="summary"
                name="summary"
                placeholder="Brief summary of your story (optional)" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Story Content
              </label>
              <Textarea 
                id="content"
                name="content"
                placeholder="Start writing your story..." 
                rows={12}
                className="font-serif text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tags
                <span className="text-muted-foreground ml-2 text-xs">
                  (up to 10 tags)
                </span>
              </label>
              <TagInput
                value={tags}
                onChange={setTags}
                suggestions={popularTags}
                placeholder="Add tags (e.g. fantasy, shortstory)"
                maxTags={10}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Press enter to add a tag, or click a suggestion
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish Story'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}