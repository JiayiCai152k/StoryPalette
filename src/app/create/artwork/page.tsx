// src/app/create/artwork/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from "lucide-react";
export default function CreateArtworkPage() {
  return (
    <main className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Share Your Artwork</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full place-items-center border-2 border-dashed rounded-lg p-12">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <Button>Upload Image</Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Input placeholder="Title" />
          </div>
          
          <div className="space-y-2">
            <Input placeholder="Caption (optional)" />
          </div>
          
          <div className="space-y-2">
            <Textarea placeholder="Description" rows={4} />
          </div>
          
          <Button className="w-full">Publish Artwork</Button>
        </CardContent>
      </Card>
    </main>
  )
}