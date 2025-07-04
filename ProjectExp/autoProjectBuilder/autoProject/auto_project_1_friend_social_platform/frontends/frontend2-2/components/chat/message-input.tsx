"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (message: string) => void
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <Input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-purple-500"
      />
      <Button type="submit" size="icon" className="rounded-full bg-purple-600 hover:bg-purple-700">
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
