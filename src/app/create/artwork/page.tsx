// src/app/create/artwork/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/upload/ImageUpload"
import { TagInput } from "@/components/ui/tag-input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/utils/uploadImage"
import { useDebounce } from "@/lib/hooks/useDebounce"

// Popular art tags for suggestions
const popularTags = [
  "digital", "traditional", "painting", "sketch", "illustration",
  "fantasy", "portrait", "landscape", "abstract", "anime",
  "fanart", "conceptart", "characterdesign", "photography"
]

type Tag = {
  id: string
  name: string
  postCount: number
}

export default function CreateArtworkPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const debouncedTagInput = useDebounce(tagInput, 300)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!imageFile) {
      alert('Please select an image')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Create form data with the file
      const formData = new FormData(e.currentTarget)
      formData.append('image', imageFile) // Add the image file
      formData.append('tags', JSON.stringify(tags))
      
      // Send to your API
      const response = await fetch('/api/artwork', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create artwork')
      }

      // Revalidate the profile page and artwork pages
      await fetch('/api/revalidate?path=/profile')
      
      // Navigate to the new artwork
      router.push(`/profile/creations/${data.artworkId}`)
      
      // Refresh the router cache
      router.refresh()

    } catch (error) {
      console.error('Error:', error)
      alert('Failed to upload artwork. Please try again.')
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
      setIsSubmitting(false)
    }
  }

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

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Your existing navbar content */}
      </nav>

      <main className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Share Your Artwork</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUpload 
                onImageSelect={(file) => setImageFile(file)} 
              />
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Uploading: {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="Give your artwork a title" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="caption" className="text-sm font-medium">
                  Caption
                </label>
                <Input 
                  id="caption"
                  name="caption"
                  placeholder="Add a short caption (optional)" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Tell us about your artwork..." 
                  rows={4} 
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
                  onChange={handleTagsChange}
                  suggestions={popularTags}
                  placeholder="Add tags (e.g. digital, fantasy)"
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
                disabled={isLoading || !imageFile}
              >
                {isLoading ? 
                  uploadProgress < 100 ? 
                    'Uploading...' : 
                    'Publishing...' 
                  : 'Publish Artwork'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}