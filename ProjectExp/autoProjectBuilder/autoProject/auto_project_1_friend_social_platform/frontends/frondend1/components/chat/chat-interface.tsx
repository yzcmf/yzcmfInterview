"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
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

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey! Thanks for the match 😊",
    lastMessageTime: "2 hours ago",
    isOnline: true,
    unreadCount: 2,
    userId: "user-1",
  },
  {
    id: "2",
    name: "Emily Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Would love to grab coffee sometime!",
    lastMessageTime: "1 day ago",
    isOnline: false,
    unreadCount: 0,
    userId: "user-2",
  },
  {
    id: "3",
    name: "Jessica Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "That sounds amazing!",
    lastMessageTime: "2 days ago",
    isOnline: true,
    unreadCount: 1,
    userId: "user-3",
  },
]

export function ChatInterface() {
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(conversations[0]?.id || null)
  const { isConnected } = useSocket()

  const selectedConversation = conversations.find((conv) => conv.id === activeConversation)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Chat Sidebar */}
      <div className="lg:col-span-1">
        <ChatSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={setActiveConversation}
        />
      </div>

      {/* Chat Window */}
      <div className="lg:col-span-2">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="mb-4">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <p className="text-sm">{isConnected ? "Connected to chat server" : "Connecting to chat server..."}</p>
              </div>
              <p>Select a conversation to start chatting</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
