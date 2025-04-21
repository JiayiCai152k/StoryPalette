// src/app/create/artwork/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/upload/ImageUpload"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon } from "lucide-react"

export default function CreateArtworkPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageFile) {
      alert('Please select an image')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Create FormData
      const formData = new FormData(e.currentTarget)
      formData.append('image', imageFile)
      
      // Send to your API
      const response = await fetch('/api/artwork', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload artwork')
      }
      
      // Redirect to the new artwork page
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload 
              onImageSelect={(file) => setImageFile(file)} 
            />
            
            <div className="space-y-2">
              <Input 
                name="title"
                placeholder="Title" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                name="caption"
                placeholder="Caption (optional)" 
              />
            </div>
            
            <div className="space-y-2">
              <Textarea 
                name="description"
                placeholder="Description" 
                rows={4} 
              />
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