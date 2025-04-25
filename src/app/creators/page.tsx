import { Suspense } from "react"
import { CreatorsList } from "@/components/creators/CreatorsList"
import { CreatorsSearch } from "@/components/creators/CreatorsSearch"

export default function CreatorsPage() {
  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Discover Creators</h1>
        <div className="space-y-6">
          <Suspense>
            <CreatorsSearch />
          </Suspense>
          <Suspense fallback={<CreatorsLoadingSkeleton />}>
            <CreatorsList />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function CreatorsLoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-[250px] bg-muted animate-pulse" />
            <div className="h-4 w-[200px] bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
} 