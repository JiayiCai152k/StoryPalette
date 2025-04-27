"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useCurrentUser } from "@/lib/hooks/useCurrentUser"

type User = {
  id: string
  name: string
  image: string | null
}

interface FollowersDialogProps {
  userId: string
  type: "followers" | "following"
  count: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FollowersDialog({
  userId,
  type,
  count,
  open,
  onOpenChange,
}: FollowersDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser } = useCurrentUser()
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({})
  const [loadingFollowIds, setLoadingFollowIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) return

    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/${userId}/${type}`)
        if (!response.ok) throw new Error(`Failed to fetch ${type}`)
        const data = await response.json()
        setUsers(data)
        
        // Initialize follow status for each user
        if (currentUser) {
          const statuses: Record<string, boolean> = {}
          await Promise.all(
            data.map(async (user: User) => {
              if (user.id === currentUser.id) {
                statuses[user.id] = false // Can't follow yourself
                return
              }
              try {
                const statusResponse = await fetch(`/api/users/${user.id}/follow`)
                if (statusResponse.ok) {
                  const statusData = await statusResponse.json()
                  statuses[user.id] = statusData.isFollowing
                }
              } catch (error) {
                console.error(`Error checking follow status for ${user.id}:`, error)
                statuses[user.id] = false
              }
            })
          )
          setFollowStatus(statuses)
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [open, userId, type, currentUser])

  const handleFollow = async (targetId: string) => {
    if (!currentUser || targetId === currentUser.id) return
    
    setLoadingFollowIds(prev => [...prev, targetId])
    
    try {
      const isFollowing = followStatus[targetId]
      const response = await fetch(`/api/users/${targetId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })
      
      if (response.ok) {
        setFollowStatus(prev => ({
          ...prev,
          [targetId]: !isFollowing
        }))
      } else {
        const data = await response.json()
        console.error('Error updating follow status:', data.error)
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
    } finally {
      setLoadingFollowIds(prev => prev.filter(id => id !== targetId))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"} ({count})
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {type === "followers" 
              ? "No followers yet" 
              : "Not following anyone yet"}
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <Link 
                  href={`/profile/${user.id}`} 
                  className="flex items-center gap-3 hover:opacity-80"
                  onClick={() => onOpenChange(false)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </Link>
                
                {currentUser && currentUser.id !== user.id && (
                  <Button
                    size="sm"
                    variant={followStatus[user.id] ? "secondary" : "default"}
                    onClick={() => handleFollow(user.id)}
                    disabled={loadingFollowIds.includes(user.id)}
                  >
                    {loadingFollowIds.includes(user.id) ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Loading
                      </>
                    ) : followStatus[user.id] ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 