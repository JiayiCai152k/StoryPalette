"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

type CurrentUser = {
  id: string
  name?: string
  email?: string
} | null

export function useCurrentUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/auth/session')
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      if (!data || !data.user) {
        return null
      }
      return data.user as CurrentUser
    }
  })

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user
  }
} 