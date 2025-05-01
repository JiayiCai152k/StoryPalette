"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

type Artwork = {
  id: string
  title: string
  imageUrl: string | null
}

export default function EditArtworkForm({ artwork }: { artwork: Artwork }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/artwork/${artwork.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete artwork')
      }

      toast.success('Artwork deleted successfully')
      router.push('/profile')
      router.refresh()
    } catch (error) {
      console.error('Error deleting artwork:', error)
      toast.error('Failed to delete artwork')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Delete Artwork</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative aspect-square w-full max-w-xl mx-auto mb-6">
              <Image
                src={artwork.imageUrl || ""}
                alt={artwork.title}
                fill
                className="object-contain"
              />
            </div>
            
            <p className="text-muted-foreground">
              Are you sure you want to delete &ldquo;{artwork.title}&rdquo;? This action cannot be undone.
            </p>

            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Artwork"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/profile/creations/${artwork.id}`)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 