"use client"

import { useToast } from "./use-toast"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end gap-2 p-4 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-2 p-4 rounded-md shadow-md border bg-background transition-all duration-300",
            toast.variant === "destructive" ? "border-red-500" : "border-border"
          )}
        >
          <div className="flex-1 mr-2">
            {toast.title && (
              <div className="font-semibold">
                {toast.title}
              </div>
            )}
            {toast.description && (
              <div className="text-sm text-muted-foreground">
                {toast.description}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => dismiss(toast.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      ))}
    </div>,
    document.body
  )
} 