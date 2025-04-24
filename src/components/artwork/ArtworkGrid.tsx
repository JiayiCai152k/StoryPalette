import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ArtworkGridProps {
  artworks: Array<{
    id: string
    title: string
    imageUrl: string
    caption?: string
    createdAt: Date
  }>
  onArtworkClick: (id: string) => void
}

export function ArtworkGrid({ artworks, onArtworkClick }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artworks.map((artwork) => (
        <Card 
          key={artwork.id}
          className="cursor-pointer hover:shadow-lg transition-shadow h-full"
          onClick={() => onArtworkClick(artwork.id)}
        >
          <CardContent className="p-4 flex flex-col h-full pb-0">
            <div className="relative aspect-square w-full mb-2">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium truncate">{artwork.title}</h3>
              {artwork.caption && (
                <p className="text-sm text-muted-foreground truncate">
                  {artwork.caption}
                </p>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-auto pt-2">
              {artwork.createdAt.toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 