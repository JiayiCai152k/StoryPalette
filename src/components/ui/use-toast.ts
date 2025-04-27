import { useState, useCallback } from 'react'

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

type ToastOptions = Omit<Toast, 'id'>

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { id, ...options }
      
      setToasts((prev) => [...prev, newToast])
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 3000)
      
      return id
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
} 