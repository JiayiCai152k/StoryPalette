// src/app/create/fiction/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateFictionPage() {
  return (
    <main className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Write Fiction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input placeholder="Title" />
          </div>
          
          <div className="space-y-2">
            <Input placeholder="Summary (optional)" />
          </div>
          
          <div className="space-y-2">
            <Textarea 
              placeholder="Start writing your story..." 
              rows={12}
              className="font-serif text-lg"
            />
          </div>
          
          <Button className="w-full">Publish Story</Button>
        </CardContent>
      </Card>
    </main>
  )
}