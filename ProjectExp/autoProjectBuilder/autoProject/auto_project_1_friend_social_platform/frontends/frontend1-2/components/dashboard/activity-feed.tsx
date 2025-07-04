"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Eye } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "match",
    user: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "You have a new match!",
    time: "2 hours ago",
    icon: Heart,
    iconColor: "text-pink-600",
  },
  {
    id: "2",
    type: "message",
    user: "Emily Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Sent you a message",
    time: "4 hours ago",
    icon: MessageCircle,
    iconColor: "text-blue-600",
  },
  {
    id: "3",
    type: "view",
    user: "Jessica Williams",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Viewed your profile",
    time: "6 hours ago",
    icon: Eye,
    iconColor: "text-green-600",
  },
  {
    id: "4",
    type: "like",
    user: "Amanda Davis",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Liked your profile",
    time: "1 day ago",
    icon: Heart,
    iconColor: "text-pink-600",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-900 rounded-full">
                <activity.icon className={`h-3 w-3 ${activity.iconColor}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.message}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
