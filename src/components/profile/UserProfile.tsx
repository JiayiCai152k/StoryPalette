"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Globe, Twitter, Instagram, Loader2 } from "lucide-react"
import Link from "next/link"
import { BioDialog } from "./BioDialog"
import { useCurrentUser } from "@/lib/hooks/useCurrentUser"

type UserProfileData = {
  id: string
  name: string
  image?: string | null
  bio?: string | null
  _count: {
    posts: number
    followers: number
    following: number
  }
}

function truncateBio(bio: string, wordLimit: number = 30): string {
  const words = bio.split(/\s+/)
  if (words.length <= wordLimit) return bio
  return words.slice(0, wordLimit).join(' ') + '...'
}

export function UserProfile({ 
  userId, 
  showOnlyBio = false 
}: { 
  userId: string
  showOnlyBio?: boolean 
}) {
  const { user: currentUser } = useCurrentUser()
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(true)
  
  // Get user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  // Check if current user is following the profile user
  useEffect(() => {
    if (!currentUser) {
      setIsLoadingFollow(false)
      return
    }
    
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/follow`)
        if (response.ok) {
          const data = await response.json()
          setIsFollowing(data.isFollowing)
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      } finally {
        setIsLoadingFollow(false)
      }
    }

    checkFollowStatus()
  }, [userId, currentUser])

  const handleFollow = async () => {
    if (!currentUser) return
    
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })
      
      if (response.ok) {
        setIsFollowing(!isFollowing)
        
        // Update follower count
        if (profile) {
          const countChange = isFollowing ? -1 : 1;
          // Make sure we're working with numbers
          const currentFollowers = Number(profile._count.followers);
          const newFollowers = Math.max(0, currentFollowers + countChange);
          
          setProfile({
            ...profile,
            _count: {
              ...profile._count,
              followers: newFollowers
            }
          });
        }
      } else {
        const data = await response.json()
        console.error('Error updating follow status:', data.error)
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const isOwnProfile = currentUser?.id === userId

  if (isLoading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  if (showOnlyBio) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {profile.bio ? (
          <div className="text-muted-foreground">
            {profile.bio.split('\n').map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No bio available</p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.image ?? ""} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="mt-2">
                {profile.bio ? (
                  <BioDialog bio={profile.bio} name={profile.name} />
                ) : (
                  <p className="text-sm text-muted-foreground italic">No bio available</p>
                )}
              </div>
            </div>
            
            {!isOwnProfile && (
              <Button 
                onClick={handleFollow} 
                variant={isFollowing ? "secondary" : "default"}
                disabled={isLoadingFollow || isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : isLoadingFollow ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  isFollowing ? "Following" : "Follow"
                )}
              </Button>
            )}
            
            {isOwnProfile && (
              <Button asChild>
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            )}
          </div>
          
          <div className="flex justify-center sm:justify-start gap-6 mt-4">
            <div className="text-sm">
              <span className="font-medium">{Number(profile._count.posts)}</span>
              {" "}
              <span className="text-muted-foreground">
                {profile._count.posts === 1 ? "creation" : "creations"}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{Number(profile._count.followers)}</span>
              {" "}
              <span className="text-muted-foreground">
                {profile._count.followers === 1 ? "follower" : "followers"}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{Number(profile._count.following)}</span>
              {" "}
              <span className="text-muted-foreground">following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 