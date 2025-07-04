"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart } from "lucide-react"

const recentMatches = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    location: "New York, NY",
    avatar: "/placeholder.svg?height=40&width=40",
    compatibility: 95,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Emily Chen",
    age: 26,
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=40&width=40",
    compatibility: 88,
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Jessica Williams",
    age: 30,
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg?height=40&width=40",
    compatibility: 92,
    lastActive: "3 hours ago",
  },
]

export function RecentMatches() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-pink-600" />
          Recent Matches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentMatches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={match.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {match.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {match.name}, {match.age}
                </p>
                <p className="text-sm text-muted-foreground">{match.location}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    {match.compatibility}% match
                  </div>
                  <span className="text-xs text-muted-foreground">{match.lastActive}</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
