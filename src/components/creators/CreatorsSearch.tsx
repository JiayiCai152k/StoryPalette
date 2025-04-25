"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

export function CreatorsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    
    startTransition(() => {
      router.push(`/creators?${params.toString()}`, { scroll: false })
    })
  }, 300)

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search creators..."
        className="pl-10"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q") ?? ""}
        disabled={isPending}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
} 