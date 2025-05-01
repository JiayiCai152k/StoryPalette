// src/app/create/fiction/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "@/components/ui/tag-input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { uploadFiction } from "@/lib/utils/uploadFiction"
import { useDebounce } from "@/lib/hooks/useDebounce"

// Popular fiction tags for suggestions
const popularTags = [
  "fantasy", "scifi", "romance", "horror", "mystery",
  "adventure", "poetry", "shortstory", "drama", "thriller",
  "historical", "literary", "fanfiction", "comedy"
]

type Tag = {
  id: string
  name: string
  postCount: number
}

export default function CreateFictionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tagInput, setTagInput] = useState("")
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const debouncedTagInput = useDebounce(tagInput, 300)

  useEffect(() => {
    if (!debouncedTagInput) {
      setTagSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true)
      try {
        const response = await fetch(
          `/api/tags/suggestions?q=${encodeURIComponent(debouncedTagInput)}`
        )
        if (response.ok) {
          const data = await response.json()
          setTagSuggestions(data)
        }
      } catch (error) {
        console.error('Error fetching tag suggestions:', error)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedTagInput])

  const handleTagInputChange = (value: string) => {
    setTagInput(value)
  }

  const handleTagsChange = (newTags: string[]) => {
    // Clean up each tag: remove leading # and trim whitespace
    const cleanedTags = newTags.map(tag => tag.replace(/^#/, '').trim()).filter(Boolean)
    setTags(cleanedTags)
    setTagInput("")
    setIsLoadingSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const content = formData.get('content') as string
      
      if (!content) {
        throw new Error('Content is required')
      }

      // First upload the content to Firebase
      const { url: contentUrl, wordCount } = await uploadFiction(
        content,
        'temp-user-id', // This will be replaced with actual user ID in the API
        (progress) => setUploadProgress(progress)
      )

      // Add the content URL and word count to the form data
      formData.append('contentUrl', contentUrl)
      formData.append('wordCount', wordCount.toString())
      formData.append('tags', JSON.stringify(tags))
      
      // Send to your API
      const response = await fetch('/api/fiction', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish story')
      }

      // Navigate to the new fiction page
      router.push(`/profile/fictions/${data.fictionId}`)
      
      // Refresh the router cache
      router.refresh()

    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to publish story. Please try again.')
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
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

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading: {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tags
                <span className="text-muted-foreground ml-2 text-xs">
                  (up to 10 tags)
                </span>
              </label>
              <TagInput
                value={tags}
                onChange={handleTagsChange}
                suggestions={popularTags}
                placeholder="Add tags (e.g. fantasy, shortstory)"
                maxTags={10}
                onInputChange={handleTagInputChange}
                dynamicSuggestions={tagSuggestions}
                isLoading={isLoadingSuggestions}
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
              {isLoading ? 
                uploadProgress < 100 ? 
                  'Uploading...' : 
                  'Publishing...' 
                : 'Publish Story'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}