"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Settings } from "lucide-react"

interface VoiceCallProps {
  isActive: boolean
  onEndCall: () => void
  participant: {
    id: string
    name: string
    avatar: string
  }
}

export function VoiceCall({ isActive, onEndCall, participant }: VoiceCallProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting")

  useEffect(() => {
    if (isActive) {
      // Simulate connection
      const connectTimer = setTimeout(() => {
        setCallStatus("connected")
      }, 2000)

      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      return () => {
        clearTimeout(connectTimer)
        clearInterval(interval)
      }
    }
  }, [isActive])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Avatar */}
          <div className="mb-6">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src={participant.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-4xl">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Pulse Animation for Active Call */}
            {callStatus === "connected" && (
              <div className="relative">
                <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 w-40 h-40 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
                <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 w-36 h-36 border-4 border-green-500 rounded-full animate-ping opacity-40 delay-75"></div>
              </div>
            )}
          </div>

          {/* Call Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{participant.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {callStatus === "connecting" && "Connecting..."}
              {callStatus === "connected" && formatDuration(callDuration)}
              {callStatus === "ended" && "Call ended"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-6">
            {/* Mute Toggle */}
            <Button
              variant="ghost"
              size="lg"
              className={`rounded-full w-16 h-16 ${
                !isMuted
                  ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              onClick={toggleMute}
            >
              {!isMuted ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </Button>

            {/* Audio Toggle */}
            <Button
              variant="ghost"
              size="lg"
              className={`rounded-full w-16 h-16 ${
                isAudioEnabled
                  ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
              onClick={toggleAudio}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            {/* End Call */}
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full w-16 h-16 bg-red-500 text-white hover:bg-red-600"
              onClick={onEndCall}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full w-16 h-16 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {/* Call Quality Indicator */}
          {callStatus === "connected" && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                <div className="w-1 h-2 bg-green-500 rounded-full"></div>
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
              </div>
              <span>Excellent quality</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
