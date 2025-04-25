"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Globe, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

type UserProfileData = {
  id: string
  name: string
  image?: string | null
  bio?: string | null
  website?: string | null
  twitter?: string | null
  instagram?: string | null
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
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

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

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      })
      if (!response.ok) throw new Error('Failed to update follow status')
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Error updating follow status:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!profile) return <div>Profile not found</div>

  if (showOnlyBio) {
    return (
      <div className="space-y-4">
        {profile.bio ? (
          <p className="text-muted-foreground">{profile.bio}</p>
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
              <div className="mt-2 text-muted-foreground">
                {profile.bio ? (
                  <p>{truncateBio(profile.bio)}</p>
                ) : (
                  <p className="italic">No bio available</p>
                )}
              </div>
            </div>
            <Button onClick={handleFollow} variant={isFollowing ? "secondary" : "default"}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
          
          <div className="flex justify-center sm:justify-start gap-6 mt-4">
            <div className="text-sm">
              <span className="font-medium">{profile._count.posts}</span>
              {" "}
              <span className="text-muted-foreground">creations</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{profile._count.followers}</span>
              {" "}
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{profile._count.following}</span>
              {" "}
              <span className="text-muted-foreground">following</span>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start gap-4 mt-4">
            {profile.website && (
              <Link 
                href={profile.website}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                target="_blank"
              >
                <Globe className="h-4 w-4" />
                Website
              </Link>
            )}
            {profile.twitter && (
              <Link 
                href={`https://twitter.com/${profile.twitter}`}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                target="_blank"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Link>
            )}
            {profile.instagram && (
              <Link 
                href={`https://instagram.com/${profile.instagram}`}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                target="_blank"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 