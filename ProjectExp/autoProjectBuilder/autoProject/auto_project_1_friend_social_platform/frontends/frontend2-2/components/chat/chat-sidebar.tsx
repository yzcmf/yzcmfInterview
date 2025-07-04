"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unreadCount: number
}

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
}

export default function ChatSidebar({ conversations, activeConversationId, onSelectConversation }: ChatSidebarProps) {
  return (
    <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No conversations yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                    activeConversationId === conv.id && "bg-purple-50 dark:bg-purple-900",
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conv.avatar || "/placeholder.svg"} alt={`${conv.name}'s avatar`} />
                    <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conv.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-purple-600 text-white rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
