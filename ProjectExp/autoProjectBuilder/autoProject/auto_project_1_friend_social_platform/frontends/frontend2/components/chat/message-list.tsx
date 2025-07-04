import type { Message } from "@/types/chat" // Assuming this type will be defined later
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MessageListProps {
  messages: Message[]
  currentUserId: string // To differentiate between sender and receiver
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex items-end gap-2", message.senderId === currentUserId ? "justify-end" : "justify-start")}
        >
          {message.senderId !== currentUserId && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          )}
          <div
            className={cn(
              "max-w-[70%] rounded-lg p-3 text-sm",
              message.senderId === currentUserId
                ? "bg-purple-600 text-white rounded-br-none"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none",
            )}
          >
            <p>{message.content}</p>
            <span
              className={cn(
                "block text-xs mt-1",
                message.senderId === currentUserId ? "text-purple-100" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {message.senderId === currentUserId && (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="My Avatar" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  )
}
