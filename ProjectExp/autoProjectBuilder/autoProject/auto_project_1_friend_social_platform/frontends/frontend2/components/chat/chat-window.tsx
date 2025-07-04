"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MessageList from "./message-list"
import MessageInput from "./message-input"
import { useState, useEffect } from "react"

interface ChatWindowProps {
  matchId: string
  matchName: string
  matchAvatar: string
  currentUserId: string
}

// Placeholder for Message type (should be imported from types/chat later)
type Message = {
  id: string
  senderId: string
  content: string
  timestamp: string
}

export default function ChatWindow({ matchId, matchName, matchAvatar, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Simulate fetching message history
    const fetchMessages = async () => {
      // In a real app, this would be an API call: GET /api/chat/messages/:conversationId
      const dummyMessages: Message[] = [
        { id: "1", senderId: "match123", content: "Hey there! How are you?", timestamp: new Date().toISOString() },
        {
          id: "2",
          senderId: currentUserId,
          content: "I'm great, thanks! How about you?",
          timestamp: new Date().toISOString(),
        },
        {
          id: "3",
          senderId: "match123",
          content: "Doing well! Just enjoying the day.",
          timestamp: new Date().toISOString(),
        },
      ]
      setMessages(dummyMessages)
    }
    fetchMessages()
  }, [matchId, currentUserId])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(), // Unique ID for now
      senderId: currentUserId,
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    // In a real app, you'd send this via WebSocket: socket.emit('send_message', newMessage)
    console.log("Sending message:", newMessage)
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-100px)] max-h-[800px] w-full max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Avatar className="h-10 w-10">
          <AvatarImage src={matchAvatar || "/placeholder.svg"} alt={`${matchName}'s avatar`} />
          <AvatarFallback>{matchName.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{matchName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </CardContent>
      <MessageInput onSendMessage={handleSendMessage} />
    </Card>
  )
}
