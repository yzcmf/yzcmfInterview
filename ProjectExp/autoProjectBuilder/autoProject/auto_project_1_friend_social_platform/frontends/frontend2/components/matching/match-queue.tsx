"use client"

import { useState } from "react"
import UserCard from "./user-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MatchQueueProps {
  users: Array<{
    id: string
    name: string
    age: number
    bio: string
    photos: string[]
    interests: string[]
    location: string
  }>
  onMatch: (userId: string) => void
  onPass: (userId: string) => void
  onSuperLike: (userId: string) => void
}

export default function MatchQueue({ users, onMatch, onPass, onSuperLike }: MatchQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + users.length) % users.length)
  }

  const currentUser = users[currentIndex]

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-600 dark:text-gray-400">
        <p className="text-lg">No users in your match queue right now.</p>
        <p className="text-sm">Check back later for new suggestions!</p>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 z-10 bg-white/50 dark:bg-gray-800/50 rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-colors"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-8 w-8 text-gray-800 dark:text-gray-200" />
        <span className="sr-only">Previous user</span>
      </Button>

      <div className="flex justify-center items-center w-full h-full">
        <UserCard
          user={currentUser}
          onLike={() => {
            onMatch(currentUser.id)
            handleNext()
          }}
          onPass={() => {
            onPass(currentUser.id)
            handleNext()
          }}
          onSuperLike={() => {
            onSuperLike(currentUser.id)
            handleNext()
          }}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 z-10 bg-white/50 dark:bg-gray-800/50 rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-colors"
        onClick={handleNext}
      >
        <ChevronRight className="h-8 w-8 text-gray-800 dark:text-gray-200" />
        <span className="sr-only">Next user</span>
      </Button>
    </div>
  )
}
