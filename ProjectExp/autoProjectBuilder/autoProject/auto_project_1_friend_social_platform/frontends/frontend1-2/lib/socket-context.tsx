"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
}

interface TypingUser {
  userId: string
  userName: string
  conversationId: string
}

interface OnlineUser {
  userId: string
  userName: string
  lastSeen: string
}

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: OnlineUser[]
  sendMessage: (conversationId: string, content: string, receiverId: string) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  startTyping: (conversationId: string) => void
  stopTyping: (conversationId: string) => void
  typingUsers: TypingUser[]
  messages: Message[]
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8002", {
      auth: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      },
      transports: ["websocket", "polling"],
    })

    setSocket(socketInstance)

    // Connection event handlers
    socketInstance.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to chat server")
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
      console.log("Disconnected from chat server")
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error)
      toast({
        title: "Connection Error",
        description: "Unable to connect to chat server. Using offline mode.",
        variant: "destructive",
      })
    })

    // Message event handlers
    socketInstance.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message])

      // Show notification for new messages
      if (message.senderId !== user.id) {
        toast({
          title: "New Message",
          description: `New message from ${getConversationName(message.conversationId)}`,
        })
      }
    })

    socketInstance.on("message_status_update", (data: { messageId: string; status: string }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === data.messageId ? { ...msg, status: data.status as Message["status"] } : msg)),
      )
    })

    // Online users event handlers
    socketInstance.on("users_online", (users: OnlineUser[]) => {
      setOnlineUsers(users)
    })

    socketInstance.on("user_online", (user: OnlineUser) => {
      setOnlineUsers((prev) => [...prev.filter((u) => u.userId !== user.userId), user])
    })

    socketInstance.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== userId))
    })

    // Typing event handlers
    socketInstance.on("user_typing", (data: TypingUser) => {
      if (data.userId !== user.id) {
        setTypingUsers((prev) => [...prev.filter((u) => u.userId !== data.userId), data])
      }
    })

    socketInstance.on("user_stopped_typing", (data: { userId: string; conversationId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId))
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [user, toast])

  const sendMessage = (conversationId: string, content: string, receiverId: string) => {
    if (!socket || !user) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: user.id,
      content,
      timestamp: new Date().toISOString(),
      status: "sending",
    }

    // Add message to local state immediately
    setMessages((prev) => [...prev, message])

    // Send message via socket
    socket.emit("send_message", {
      ...message,
      receiverId,
      senderName: user.name,
    })
  }

  const joinConversation = (conversationId: string) => {
    if (!socket) return
    socket.emit("join_conversation", conversationId)
  }

  const leaveConversation = (conversationId: string) => {
    if (!socket) return
    socket.emit("leave_conversation", conversationId)
  }

  const startTyping = (conversationId: string) => {
    if (!socket || !user) return
    socket.emit("typing_start", {
      conversationId,
      userId: user.id,
      userName: user.name,
    })
  }

  const stopTyping = (conversationId: string) => {
    if (!socket || !user) return
    socket.emit("typing_stop", {
      conversationId,
      userId: user.id,
    })
  }

  const getConversationName = (conversationId: string) => {
    // This would normally fetch from your conversations data
    return "User"
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        sendMessage,
        joinConversation,
        leaveConversation,
        startTyping,
        stopTyping,
        typingUsers,
        messages,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
