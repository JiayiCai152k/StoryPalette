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
import { BioDialog } from "@/components/profile/BioDialog"
import Link from "next/link"
import { db } from "@/db"
import { users } from "@/db/schema/auth"
import { eq } from "drizzle-orm"
import { CollectionsTab } from "@/components/profile/CollectionsTab"
export default async function ProfilePage() {
  const session = await auth.api.getSession(({
    headers: await headers()
  }))

  if (!session) {
    return <p className="text-center mt-10 text-gray-500">Please log in to view your profile.</p>
  }

  // Fetch user data including bio
  const userData = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      bio: users.bio,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then(rows => rows[0])

  return (
    <main className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex gap-4 items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.image || ""} alt={userData.name || "User"} />
                <AvatarFallback>{userData.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <p className="text-muted-foreground">{userData.email}</p>
                {userData.bio ? (
                  <BioDialog bio={userData.bio} name={userData.name || "User"} />
                ) : (
                  <p className="text-sm text-muted-foreground italic">No bio available</p>
                )}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
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
                <span className="hidden sm:inline">Artworks</span>
                <span className="sr-only sm:hidden">Artworks</span>
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
              <CollectionsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}