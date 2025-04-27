"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GridIcon, ListIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Collection = {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  createdAt: Date
}

export function CollectionsTab() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections')
        if (!response.ok) {
          throw new Error('Failed to fetch collections')
        }
        const data = await response.json()
        setCollections(data.map((collection: any) => ({
          ...collection,
          createdAt: new Date(collection.createdAt)
        })))
      } catch (error) {
        console.error('Error fetching collections:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const handleCollectionClick = (id: string) => {
    router.push(`/profile/collections/${id}`)
  }

  if (isLoading) return <div>Loading...</div>
  if (collections.length === 0) return <p className="text-muted-foreground">No collections yet</p>

  return (
    <Tabs defaultValue="grid" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-4 border-b pb-2">
          <h3 className="text-sm font-medium">View:</h3>
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger 
              value="grid" 
              className="h-8 px-3 data-[state=active]:bg-accent"
            >
              <GridIcon className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="h-8 px-3 data-[state=active]:bg-accent"
            >
              <ListIcon className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full">
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection) => (
                <Card 
                  key={collection.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-2 flex items-center">
                      {collection.name}
                      {collection.isPrivate && (
                        <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">Private</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    {collection.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {collection.description}
                      </p>
                    )}
                    <div className="text-sm text-muted-foreground mt-auto pt-4">
                      <span>Created {collection.createdAt.toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              {collections.map((collection) => (
                <div 
                  key={collection.id}
                  className="flex flex-col p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center">
                      {collection.name}
                      {collection.isPrivate && (
                        <span className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">Private</span>
                      )}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    <span>Created {collection.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
} 