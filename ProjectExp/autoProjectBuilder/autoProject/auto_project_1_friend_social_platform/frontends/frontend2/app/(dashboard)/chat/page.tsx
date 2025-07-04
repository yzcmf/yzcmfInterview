"use client"

import ChatWindow from "@/components/chat/chat-window"

export default function ChatPage() {
  // These would typically come from a selected conversation or route params
  const dummyMatchId = "conversation_123"
  const dummyMatchName = "Sophia"
  const dummyMatchAvatar = "/placeholder.svg?height=40&width=40"
  const dummyCurrentUserId = "my_user_id_123" // This would come from your auth context

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Real-time Chat</h1>
      <ChatWindow
        matchId={dummyMatchId}
        matchName={dummyMatchName}
        matchAvatar={dummyMatchAvatar}
        currentUserId={dummyCurrentUserId}
      />
    </div>
  )
}
