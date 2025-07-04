"use client"

import ChatWindow from "@/components/chat/chat-window"
import ChatSidebar from "@/components/chat/chat-sidebar"
import { useState } from "react"

export default function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>("conv_alice")

  // Dummy data for conversations
  const conversations = [
    {
      id: "conv_alice",
      name: "Alice",
      lastMessage: "Hey, how are you?",
      timestamp: "2024-07-04T10:00:00Z",
      avatar: "/placeholder.svg?height=40&width=40",
      unreadCount: 1,
    },
    {
      id: "conv_bob",
      name: "Bob",
      lastMessage: "Sounds good! See you then.",
      timestamp: "2024-07-04T09:30:00Z",
      avatar: "/placeholder.svg?height=40&width=40",
      unreadCount: 0,
    },
    {
      id: "conv_charlie",
      name: "Charlie",
      lastMessage: "Let's plan something soon!",
      timestamp: "2024-07-03T18:00:00Z",
      avatar: "/placeholder.svg?height=40&width=40",
      unreadCount: 0,
    },
  ]

  const currentUserId = "my_user_id_123" // This would come from your auth context

  const activeConversation = conversations.find((conv) => conv.id === activeConversationId)

  return (
    <div className="flex h-[calc(100vh-100px)] max-h-[800px] w-full max-w-5xl mx-auto shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />
      {activeConversation ? (
        <ChatWindow
          matchId={activeConversation.id}
          matchName={activeConversation.name}
          matchAvatar={activeConversation.avatar}
          currentUserId={currentUserId}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Select a conversation to start chatting.
        </div>
      )}
    </div>
  )
}
