// src/app/create/artwork/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/upload/ImageUpload"
import { TagInput } from "@/components/ui/tag-input"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Popular art tags for suggestions
const popularTags = [
  "digital", "traditional", "painting", "sketch", "illustration",
  "fantasy", "portrait", "landscape", "abstract", "anime",
  "fanart", "conceptart", "characterdesign", "photography"
]

export default function CreateArtworkPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>([])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageFile) {
      alert('Please select an image')
      return
    }
    
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('tags', JSON.stringify(tags))
      
      // Send to your API
      const response = await fetch('/api/artwork', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload artwork')
      }
      
      const data = await response.json()
      router.push(`/artwork/${data.id}`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload artwork. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
                onChange={setTags}
                suggestions={popularTags}
                placeholder="Add tags (e.g. digital, fantasy)"
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
              {isLoading ? 'Publishing...' : 'Publish Artwork'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}