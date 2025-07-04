import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Chat with your matches</p>
      </div>

      <ChatInterface />
    </div>
  )
}
