import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, PenSquare } from "lucide-react"
import { ExploreArtworks } from "@/components/explore/ExploreArtworks"
import { ExploreFictions } from "@/components/explore/ExploreFictions"

export default function ExplorePage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      
      <Tabs defaultValue="artworks" className="w-full">
        <TabsList className="w-full sm:w-auto justify-start mb-6">
          <TabsTrigger value="artworks" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Artworks</span>
            <span className="sr-only sm:hidden">Artworks</span>
          </TabsTrigger>
          <TabsTrigger value="fictions" className="flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Fictions</span>
            <span className="sr-only sm:hidden">Fictions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artworks">
          <ExploreArtworks />
        </TabsContent>

        <TabsContent value="fictions">
          <ExploreFictions />
        </TabsContent>
      </Tabs>
    </main>
  )
} 