import { Suspense } from "react"
import { UserProfile } from "@/components/profile/UserProfile"
import { UserCreations } from "@/components/profile/UserCreations"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function LoadingProfile() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-start gap-6">
        <div className="h-24 w-24 rounded-full bg-muted" />
        <div className="flex-1 space-y-4">
          <div className="h-7 w-48 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="flex gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 w-20 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({
  params
}: PageProps) {
  const { userId } = await params

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Suspense fallback={<LoadingProfile />}>
        <UserProfile userId={userId} />
      </Suspense>
      
      <div className="mt-8">
        <Tabs defaultValue="creations" className="w-full">
          <TabsList className="flex justify-center w-full">
            <TabsTrigger value="creations">Creations</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="creations" className="mt-6">
            <Suspense fallback={<div>Loading creations...</div>}>
              <UserCreations userId={userId} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-center">Links</h3>
              {/* Social links will be rendered in UserProfile */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 