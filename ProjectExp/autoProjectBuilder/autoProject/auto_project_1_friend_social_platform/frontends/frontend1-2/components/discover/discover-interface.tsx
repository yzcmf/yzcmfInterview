"use client"

import { useState, useEffect } from "react"
import { UserCard } from "@/components/discover/user-card"
import { Button } from "@/components/ui/button"
import { Heart, X, Zap, RotateCcw, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"

interface User {
  id: string
  name: string
  age: number
  bio: string
  photos: string[]
  interests: string[]
  location: string
  compatibility: number
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    bio: "Adventure seeker, coffee lover, and dog mom. Looking for someone to explore the city with!",
    photos: ["/placeholder.svg?height=400&width=300"],
    interests: ["Travel", "Photography", "Hiking", "Coffee"],
    location: "New York, NY",
    compatibility: 95,
  },
  {
    id: "2",
    name: "Emily Chen",
    age: 26,
    bio: "Tech enthusiast by day, artist by night. Love trying new restaurants and weekend getaways.",
    photos: ["/placeholder.svg?height=400&width=300"],
    interests: ["Technology", "Art", "Food", "Music"],
    location: "San Francisco, CA",
    compatibility: 88,
  },
  {
    id: "3",
    name: "Jessica Williams",
    age: 30,
    bio: "Yoga instructor and wellness coach. Passionate about mindful living and outdoor adventures.",
    photos: ["/placeholder.svg?height=400&width=300"],
    interests: ["Yoga", "Wellness", "Nature", "Meditation"],
    location: "Los Angeles, CA",
    compatibility: 92,
  },
  {
    id: "4",
    name: "Amanda Davis",
    age: 27,
    bio: "Marketing professional who loves books, wine, and spontaneous road trips.",
    photos: ["/placeholder.svg?height=400&width=300"],
    interests: ["Reading", "Wine", "Travel", "Marketing"],
    location: "Chicago, IL",
    compatibility: 85,
  },
]

export function DiscoverInterface() {
  const [users, setUsers] = useState<User[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // First try to get AI-powered matches
      try {
        const aiResponse = await apiService.findMatches("current-user", {
          ageRange: { min: 25, max: 35 },
          distance: 50,
          interests: ["travel", "music", "sports"]
        })
        
        if (aiResponse.matches && aiResponse.matches.length > 0) {
          const aiUsers = aiResponse.matches.map((match: any) => ({
            id: match.user_id,
            name: match.name,
            age: match.age,
            bio: `Compatibility: ${Math.round(match.compatibility_score * 100)}%`,
            photos: ["/placeholder.svg?height=400&width=300"],
            interests: ["AI Matched"],
            location: match.location,
            compatibility: Math.round(match.compatibility_score * 100),
          }))
          setUsers(aiUsers)
          return
        }
      } catch (error) {
        console.log('AI service not available, falling back to regular discovery')
      }

      // Fallback to regular user discovery
      const response = await apiService.discoverUsers(1, 20)
      if (response.success && response.data.users) {
        const discoveredUsers = response.data.users.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          age: user.age || 25,
          bio: user.bio || "No bio available",
          photos: [user.avatar || "/placeholder.svg?height=400&width=300"],
          interests: Array.isArray(user.interests) ? user.interests : [],
          location: user.location || "Unknown",
          compatibility: Math.round((user.compatibilityScore || 0.5) * 100),
        }))
        setUsers(discoveredUsers)
      } else {
        // Fallback to mock data if API fails
        setUsers(mockUsers)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Error",
        description: "Failed to load users. Using demo data.",
        variant: "destructive",
      })
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  const currentUser = users[currentIndex]

  const handleSwipe = async (direction: "left" | "right") => {
    if (isAnimating || !currentUser) return

    setIsAnimating(true)

    if (direction === "right") {
      try {
        // Send like to backend
        await apiService.likeUser(currentUser.id)
        toast({
          title: "It's a match! 💕",
          description: `You liked ${currentUser.name}`,
        })
      } catch (error) {
        console.error('Error liking user:', error)
        toast({
          title: "Liked! 💕",
          description: `You liked ${currentUser.name}`,
        })
      }
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  const handleSuperLike = () => {
    if (isAnimating || !currentUser) return

    setIsAnimating(true)
    toast({
      title: "Super Like! ⭐",
      description: `You super liked ${currentUser.name}`,
    })

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
      setIsAnimating(false)
    }, 300)
  }

  const resetStack = () => {
    setCurrentIndex(0)
    loadUsers()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <h3 className="text-xl font-semibold mb-2">Loading matches...</h3>
          <p className="text-muted-foreground">Finding the perfect matches for you</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">No more profiles!</h3>
          <p className="text-muted-foreground mb-4">{"You've seen all available matches in your area."}</p>
          <Button onClick={resetStack} className="bg-gradient-to-r from-purple-600 to-pink-600">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Stack
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Card Stack */}
      <div className="relative w-full max-w-sm">
        {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
          <div
            key={user.id}
            className={`absolute inset-0 transition-all duration-300 ${
              index === 0 ? "z-30" : index === 1 ? "z-20 scale-95 opacity-50" : "z-10 scale-90 opacity-25"
            }`}
            style={{
              transform: `translateY(${index * 8}px) scale(${1 - index * 0.05})`,
            }}
          >
            <UserCard
              user={user}
              isActive={index === 0}
              onSwipeLeft={() => handleSwipe("left")}
              onSwipeRight={() => handleSwipe("right")}
              isAnimating={isAnimating}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 border-red-200 hover:border-red-300 hover:bg-red-50 bg-transparent"
          onClick={() => handleSwipe("left")}
          disabled={isAnimating}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 border-blue-200 hover:border-blue-300 hover:bg-blue-50 bg-transparent"
          onClick={handleSuperLike}
          disabled={isAnimating}
        >
          <Zap className="h-7 w-7 text-blue-500" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 border-green-200 hover:border-green-300 hover:bg-green-50 bg-transparent"
          onClick={() => handleSwipe("right")}
          disabled={isAnimating}
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex space-x-2">
        {users.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index < currentIndex ? "bg-purple-600" : index === currentIndex ? "bg-purple-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
