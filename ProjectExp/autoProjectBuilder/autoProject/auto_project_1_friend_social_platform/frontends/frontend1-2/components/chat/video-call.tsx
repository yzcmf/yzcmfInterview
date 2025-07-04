"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, PhoneOff, Settings, Maximize, Minimize, Volume2, VolumeX } from "lucide-react"

interface VideoCallProps {
  isActive: boolean
  onEndCall: () => void
  participant: {
    id: string
    name: string
    avatar: string
  }
}

export function VideoCall({ isActive, onEndCall, participant }: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!isActive) return null

  return (
    <div className={`fixed inset-0 z-50 bg-black ${isFullscreen ? "" : "p-4"}`}>
      <Card className={`h-full ${isFullscreen ? "rounded-none" : ""}`}>
        <CardContent className="p-0 h-full relative">
          {/* Remote Video */}
          <div className="relative h-full bg-gray-900">
            {isVideoEnabled ? (
              <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-4xl">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-semibold text-white">{participant.name}</h3>
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}

            {/* Call Info */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-white">
                <div className="font-medium">{participant.name}</div>
                <div className="text-sm text-gray-300">{formatDuration(callDuration)}</div>
              </div>
            </div>

            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
              {isVideoEnabled ? (
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                {/* Audio Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full w-12 h-12 ${
                    isAudioEnabled ? "text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                {/* Video Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full w-12 h-12 ${
                    isVideoEnabled ? "text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                {/* End Call */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-12 h-12 bg-red-500 text-white hover:bg-red-600"
                  onClick={onEndCall}
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>

                {/* Speaker Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full w-12 h-12 ${
                    !isMuted ? "text-white hover:bg-white/20" : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                  onClick={toggleMute}
                >
                  {!isMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="sm" className="rounded-full w-12 h-12 text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
