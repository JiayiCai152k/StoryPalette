"use client"

import { useState } from "react"
import { UserIcon, UsersIcon } from "lucide-react"
import { FollowersDialog } from "./FollowersDialog"

interface FollowersClientProps {
  userId: string
  followerCount: number
  followingCount: number
}

export function FollowersClient({ 
  userId, 
  followerCount, 
  followingCount 
}: FollowersClientProps) {
  const [followerDialogOpen, setFollowerDialogOpen] = useState(false)
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setFollowerDialogOpen(true)}
        className="text-sm flex items-center gap-1 hover:underline"
      >
        <UserIcon className="h-3.5 w-3.5" />
        <span className="font-medium">{followerCount}</span>
        <span className="text-muted-foreground">
          {followerCount === 1 ? "follower" : "followers"}
        </span>
      </button>

      <button
        onClick={() => setFollowingDialogOpen(true)}
        className="text-sm flex items-center gap-1 hover:underline"
      >
        <UsersIcon className="h-3.5 w-3.5" />
        <span className="font-medium">{followingCount}</span>
        <span className="text-muted-foreground">following</span>
      </button>

      {/* Followers Dialog */}
      <FollowersDialog
        userId={userId}
        type="followers"
        count={followerCount}
        open={followerDialogOpen}
        onOpenChange={setFollowerDialogOpen}
      />

      {/* Following Dialog */}
      <FollowersDialog
        userId={userId}
        type="following"
        count={followingCount}
        open={followingDialogOpen}
        onOpenChange={setFollowingDialogOpen}
      />
    </>
  )
} 