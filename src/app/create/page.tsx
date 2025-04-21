// src/app/create/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PenSquare } from "lucide-react"
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ImageIcon } from "lucide-react";

export default async function CreatePage() {
    //add session check
    const session = await auth.api.getSession(({
        headers: await headers() // you need to pass the headers object.
    }))

    if (!session) {
        return <p className="text-center mt-10 text-gray-500">Please log in to create.</p>
    }
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create New</h1>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="hover:border-primary transition-colors">
          <Link href="/create/fiction">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenSquare className="h-5 w-5" />
                Write Fiction
              </CardTitle>
              <CardDescription>
                Create a story, poem, or other written content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rich text editor with formatting options, chapters, and more
              </p>
              <Button className="mt-4">Start Writing</Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <Link href="/create/artwork">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Share Artwork
              </CardTitle>
              <CardDescription>
                Upload artwork with caption and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support for images, illustrations, and digital art
              </p>
              <Button className="mt-4">Upload Artwork</Button>
            </CardContent>
          </Link>
        </Card>
      </div>
    </main>
  )
}



