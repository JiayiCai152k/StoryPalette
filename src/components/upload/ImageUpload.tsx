// src/components/upload/ImageUpload.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    onImageSelect(file)
  }

  return (
    <div className="grid w-full place-items-center border-2 border-dashed rounded-lg p-12">
      <div className="text-center">
        {preview ? (
          <div className="relative w-full max-w-md aspect-square mb-4">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        )}
        <div className="mt-4">
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {preview ? 'Change Image' : 'Upload Image'}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  )
}