// src/components/upload/ImageUpload.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadImage } from "@/lib/utils/uploadImage"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onUploadProgress?: (progress: number) => void
}

export function ImageUpload({ onImageSelect, onUploadProgress }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Clear any previous errors
      setError(null)
      
      // Pass the file back to parent component
      onImageSelect(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file')
      setPreview(null)
    }
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
            type="button"
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
        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  )
}