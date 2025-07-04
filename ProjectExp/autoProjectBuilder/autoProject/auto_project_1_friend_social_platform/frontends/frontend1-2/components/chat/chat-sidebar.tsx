"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSocket } from "@/lib/socket-context"

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  isOnline: boolean
  unreadCount: number
  userId: string
}

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversation: string | null
  onSelectConversation: (id: string) => void
}

export function ChatSidebar({ conversations, activeConversation, onSelectConversation }: ChatSidebarProps) {
  const { onlineUsers, messages, isConnected } = useSocket()

  // Get the latest message for each conversation
  const getLatestMessage = (conversationId: string) => {
    const conversationMessages = messages.filter((msg) => msg.conversationId === conversationId)
    return conversationMessages[conversationMessages.length - 1]
  }

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user) => user.userId === userId)
  }

  // Get unread count for conversation
  const getUnreadCount = (conversationId: string) => {
    return messages.filter((msg) => msg.conversationId === conversationId && msg.status !== "read").length
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              title={isConnected ? "Connected" : "Disconnected"}
            />
            <span className="text-xs text-muted-foreground">{onlineUsers.length} online</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {conversations.map((conversation) => {
            const latestMessage = getLatestMessage(conversation.id)
            const isOnline = isUserOnline(conversation.userId)
            const unreadCount = getUnreadCount(conversation.id)

            return (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  activeConversation === conversation.id &&
                    "bg-purple-50 dark:bg-purple-900/20 border-r-2 border-purple-600",
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{conversation.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {latestMessage
                          ? new Date(latestMessage.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : conversation.lastMessageTime}
                      </span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {latestMessage ? latestMessage.content : conversation.lastMessage}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
