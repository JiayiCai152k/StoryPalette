import { Suspense } from "react"
import { SearchResults } from "@/components/search/SearchResults"
import { SearchBar } from "@/components/search/SearchBar"

interface SearchPageProps {
  searchParams: Promise<{ 
    q?: string
    type?: string 
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type } = await searchParams

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Search</h1>
        <SearchBar defaultQuery={q} defaultType={type} />
        <Suspense fallback={<SearchLoadingSkeleton />}>
          <SearchResults query={q} type={type} />
        </Suspense>
      </div>
    </main>
  )
}

function SearchLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg animate-pulse">
          <div className="w-16 h-16 bg-muted rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
} 