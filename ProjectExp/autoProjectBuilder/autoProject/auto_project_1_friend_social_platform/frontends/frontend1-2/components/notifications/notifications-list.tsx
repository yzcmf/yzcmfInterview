"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Star, Gift, Calendar, Check, Trash2 } from "lucide-react"

interface Notification {
  id: string
  type: "match" | "message" | "like" | "super_like" | "event" | "gift"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  user?: {
    name: string
    avatar: string
  }
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "match",
    title: "New Match! 💕",
    message: "You and Sarah have liked each other",
    timestamp: "2 minutes ago",
    isRead: false,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    actionUrl: "/chat?match=1",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "Hey! Thanks for the match 😊",
    timestamp: "5 minutes ago",
    isRead: false,
    user: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    actionUrl: "/chat?conversation=2",
  },
  {
    id: "3",
    type: "super_like",
    title: "Super Like! ⭐",
    message: "Jessica super liked your profile",
    timestamp: "1 hour ago",
    isRead: true,
    user: {
      name: "Jessica Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    actionUrl: "/discover",
  },
  {
    id: "4",
    type: "like",
    title: "Someone Liked You",
    message: "You have 3 new likes",
    timestamp: "2 hours ago",
    isRead: true,
    actionUrl: "/matches",
  },
  {
    id: "5",
    type: "event",
    title: "Speed Dating Event",
    message: "Join our virtual speed dating event tonight at 8 PM",
    timestamp: "3 hours ago",
    isRead: true,
    actionUrl: "/events",
  },
  {
    id: "6",
    type: "gift",
    title: "Gift Received! 🎁",
    message: "Amanda sent you a virtual gift",
    timestamp: "1 day ago",
    isRead: true,
    user: {
      name: "Amanda Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    actionUrl: "/chat?conversation=6",
  },
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "match":
      return <Heart className="w-5 h-5 text-pink-500" />
    case "message":
      return <MessageCircle className="w-5 h-5 text-blue-500" />
    case "like":
      return <Heart className="w-5 h-5 text-red-500" />
    case "super_like":
      return <Star className="w-5 h-5 text-yellow-500" />
    case "event":
      return <Calendar className="w-5 h-5 text-purple-500" />
    case "gift":
      return <Gift className="w-5 h-5 text-green-500" />
    default:
      return <Heart className="w-5 h-5 text-gray-500" />
  }
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you when something exciting happens!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                  !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                {/* Icon or Avatar */}
                <div className="flex-shrink-0">
                  {notification.user ? (
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {notification.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium ${!notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.timestamp}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
