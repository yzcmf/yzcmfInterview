"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, X } from "lucide-react"
import Image from "next/image"

interface User {
  id: string
  name: string
  age: number
  bio: string
  photos: string[]
  interests: string[]
  location: string
  compatibility: number
}

interface UserCardProps {
  user: User
  isActive: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
  isAnimating: boolean
}

export function UserCard({ user, isActive, onSwipeLeft, onSwipeRight, isAnimating }: UserCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return
    setDragStart({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !isActive) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging || !isActive) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    }

    setDragStart(null)
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
  }

  const rotation = isDragging ? dragOffset.x * 0.1 : 0
  const opacity = isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200) : 1

  return (
    <Card
      className={`relative w-full h-[600px] overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isActive ? "shadow-2xl" : "shadow-lg"
      }`}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Photo */}
      <div className="relative h-2/3">
        <Image src={user.photos[0] || "/placeholder.svg"} alt={user.name} fill className="object-cover" />

        {/* Compatibility Score */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-semibold text-green-600">{user.compatibility}% match</span>
        </div>

        {/* Swipe Indicators */}
        {isDragging && (
          <>
            {dragOffset.x > 50 && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 text-white p-4 rounded-full">
                  <Heart className="h-8 w-8" />
                </div>
              </div>
            )}
            {dragOffset.x < -50 && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <div className="bg-red-500 text-white p-4 rounded-full">
                  <X className="h-8 w-8" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-6 h-1/3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold">
              {user.name}, {user.age}
            </h3>
          </div>

          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{user.location}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {user.interests.slice(0, 4).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
          {user.interests.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{user.interests.length - 4} more
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
