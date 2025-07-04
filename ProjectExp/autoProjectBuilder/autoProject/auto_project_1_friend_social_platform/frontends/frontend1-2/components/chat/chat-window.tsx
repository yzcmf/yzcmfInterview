"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react"
import { useSocket } from "@/lib/socket-context"
import { useAuth } from "@/lib/auth-context"

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
}

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

interface ChatWindowProps {
  conversation: Conversation
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const { user } = useAuth()
  const {
    messages,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    typingUsers,
    onlineUsers,
    isConnected,
  } = useSocket()

  // Filter messages for current conversation
  const conversationMessages = messages.filter((msg) => msg.conversationId === conversation.id)

  // Check if user is online
  const isUserOnline = onlineUsers.some((u) => u.userId === conversation.userId)

  // Check if someone is typing in this conversation
  const currentTypingUsers = typingUsers.filter((t) => t.conversationId === conversation.id && t.userId !== user?.id)

  useEffect(() => {
    // Join conversation when component mounts
    joinConversation(conversation.id)

    // Scroll to bottom when new messages arrive
    scrollToBottom()

    return () => {
      // Leave conversation when component unmounts
      leaveConversation(conversation.id)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [conversation.id, joinConversation, leaveConversation])

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    sendMessage(conversation.id, newMessage.trim(), conversation.userId)
    setNewMessage("")
    handleStopTyping()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    handleStartTyping()
  }

  const handleStartTyping = () => {
    if (!isTyping) {
      setIsTyping(true)
      startTyping(conversation.id)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping()
    }, 3000)
  }

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false)
      stopTyping(conversation.id)
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMessageStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      case "sent":
        return <Check className="h-3 w-3" />
      case "delivered":
      case "read":
        return <CheckCheck className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3 flex-1">
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
            {isUserOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{conversation.name}</h3>
            <div className="flex items-center space-x-2">
              {isUserOnline ? (
                <Badge variant="secondary" className="text-xs">
                  Online
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">Last seen {conversation.lastMessageTime}</span>
              )}
              {!isConnected && (
                <Badge variant="destructive" className="text-xs">
                  Offline
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start your conversation with {conversation.name}</p>
          </div>
        ) : (
          conversationMessages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`flex items-center justify-between mt-1 ${
                    message.senderId === user?.id ? "text-purple-100" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-xs">{formatTime(message.timestamp)}</span>
                  {message.senderId === user?.id && <div className="ml-2">{getMessageStatusIcon(message.status)}</div>}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {currentTypingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {currentTypingUsers[0].userName} is typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onBlur={handleStopTyping}
            className="flex-1"
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            disabled={!newMessage.trim() || !isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!isConnected && <p className="text-xs text-muted-foreground mt-2">Reconnecting to chat server...</p>}
      </div>
    </Card>
  )
}
