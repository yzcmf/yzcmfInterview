"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageCircle, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Matches",
    value: "24",
    change: "+3 this week",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/20",
  },
  {
    title: "Active Conversations",
    value: "8",
    change: "+2 new chats",
    icon: MessageCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    title: "Profile Likes",
    value: "156",
    change: "+23 today",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Match Rate",
    value: "68%",
    change: "+5% improvement",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
]

export function MatchesStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
