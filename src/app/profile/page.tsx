// src/app/profile/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenSquare, ImageIcon, BookmarkIcon } from "lucide-react"
import { headers } from "next/headers"
import { CreationsTab } from "@/components/profile/CreationsTab"
import { FictionsTab } from "@/components/profile/FictionsTab"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session) {
    return <p className="text-center mt-10 text-gray-500">Please log in to view your profile.</p>
  }

  return (
    <main className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4 items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{session.user.name}</CardTitle>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Edit Profile</Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="creations" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="fictions" className="flex items-center gap-2">
                <PenSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Fictions</span>
                <span className="sr-only sm:hidden">Fictions</span>
              </TabsTrigger>
              <TabsTrigger value="creations" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Creations</span>
                <span className="sr-only sm:hidden">Creations</span>
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <BookmarkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Collections</span>
                <span className="sr-only sm:hidden">Collections</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="creations" className="mt-6">
              <CreationsTab />
            </TabsContent>
            
            <TabsContent value="fictions" className="mt-6">
              <FictionsTab />
            </TabsContent>
            
            <TabsContent value="collections" className="mt-6">
              <div className="grid gap-4">
                <p className="text-muted-foreground">No collections yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}