"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Fiction = {
  id: string
  title: string
}

export default function EditFictionForm({ fiction }: { fiction: Fiction }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this fiction? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/fiction/${fiction.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete fiction')
      }

      toast.success('Fiction deleted successfully')
      router.push('/profile')
      router.refresh()
    } catch (error) {
      console.error('Error deleting fiction:', error)
      toast.error('Failed to delete fiction')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Delete Fiction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Are you sure you want to delete &ldquo;{fiction.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Fiction'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/profile/fictions/${fiction.id}`)}
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