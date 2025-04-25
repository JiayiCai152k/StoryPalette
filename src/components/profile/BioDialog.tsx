"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function formatPreviewText(bio: string, limit: number = 150): string {
  // Replace line breaks with spaces for preview
  const previewText = bio.replace(/\n/g, ' ').trim()
  return previewText.length > limit ? `${previewText.slice(0, limit)}...` : previewText
}

export function BioDialog({ bio, name }: { bio: string; name: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="text-sm text-muted-foreground max-w-md cursor-pointer hover:text-foreground">
          {formatPreviewText(bio)}
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About {name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-muted-foreground whitespace-pre-line">{bio}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 