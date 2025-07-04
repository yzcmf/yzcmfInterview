"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, MapPin, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface Match {
  id: string
  name: string
  age: number
  location: string
  avatar: string
  compatibility: number
  matchedAt: string
  lastMessage?: string
  lastMessageTime?: string
  isOnline: boolean
  interests: string[]
}

const mockMatches: Match[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    location: "New York, NY",
    avatar: "/placeholder.svg?height=60&width=60",
    compatibility: 95,
    matchedAt: "2024-01-15",
    lastMessage: "Hey! Thanks for the match 😊",
    lastMessageTime: "2 hours ago",
    isOnline: true,
    interests: ["Travel", "Photography", "Coffee"],
  },
  {
    id: "2",
    name: "Emily Chen",
    age: 26,
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=60&width=60",
    compatibility: 88,
    matchedAt: "2024-01-14",
    lastMessage: "Would love to grab coffee sometime!",
    lastMessageTime: "1 day ago",
    isOnline: false,
    interests: ["Technology", "Art", "Food"],
  },
  {
    id: "3",
    name: "Jessica Williams",
    age: 30,
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg?height=60&width=60",
    compatibility: 92,
    matchedAt: "2024-01-13",
    isOnline: true,
    interests: ["Yoga", "Wellness", "Nature"],
  },
  {
    id: "4",
    name: "Amanda Davis",
    age: 27,
    location: "Chicago, IL",
    avatar: "/placeholder.svg?height=60&width=60",
    compatibility: 85,
    matchedAt: "2024-01-12",
    lastMessage: "Your profile is amazing!",
    lastMessageTime: "3 days ago",
    isOnline: false,
    interests: ["Reading", "Wine", "Travel"],
  },
]

export function MatchesList() {
  const [matches] = useState<Match[]>(mockMatches)
  const router = useRouter()

  const handleStartChat = (matchId: string) => {
    router.push(`/chat?match=${matchId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <Card key={match.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={match.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {match.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {match.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg">
                  {match.name}, {match.age}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {match.location}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {match.compatibility}% match
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Last Message */}
            {match.lastMessage && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-muted-foreground mb-1">Latest message:</p>
                <p className="text-sm font-medium">{match.lastMessage}</p>
                <p className="text-xs text-muted-foreground mt-1">{match.lastMessageTime}</p>
              </div>
            )}

            {/* Match Date */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Matched on {new Date(match.matchedAt).toLocaleDateString()}
            </div>

            {/* Interests */}
            <div className="flex flex-wrap gap-1">
              {match.interests.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button
                onClick={() => handleStartChat(match.id)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button variant="outline" size="sm" className="px-3 bg-transparent">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
