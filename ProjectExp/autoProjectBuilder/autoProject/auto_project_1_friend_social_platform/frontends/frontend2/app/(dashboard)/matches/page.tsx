"use client"

import MatchQueue from "@/components/matching/match-queue"
import { useState } from "react"

export default function MatchesPage() {
  const [usersInQueue, setUsersInQueue] = useState([
    {
      id: "userA",
      name: "David",
      age: 29,
      bio: "Avid reader and aspiring chef. Love trying new recipes and discussing classic literature.",
      photos: ["/placeholder.svg?height=320&width=320"],
      interests: ["Reading", "Cooking", "Literature", "Foodie"],
      location: "Chicago",
    },
    {
      id: "userB",
      name: "Emily",
      age: 27,
      bio: "Yoga enthusiast and nature lover. Always looking for new trails to hike and peaceful spots to meditate.",
      photos: ["/placeholder.svg?height=320&width=320"],
      interests: ["Yoga", "Nature", "Hiking", "Meditation"],
      location: "Denver",
    },
    {
      id: "userC",
      name: "Frank",
      age: 31,
      bio: "Musician and gamer. Enjoy playing guitar, exploring virtual worlds, and attending indie concerts.",
      photos: ["/placeholder.svg?height=320&width=320"],
      interests: ["Music", "Gaming", "Concerts", "Indie"],
      location: "Austin",
    },
  ])

  const handleMatch = (userId: string) => {
    console.log(`Matched with: ${userId}`)
    // In a real app, send to backend, update state (e.g., remove from queue, add to matches list)
  }

  const handlePass = (userId: string) => {
    console.log(`Passed on: ${userId}`)
    // In a real app, send to backend, remove from queue
  }

  const handleSuperLike = (userId: string) => {
    console.log(`Super Liked: ${userId}`)
    // In a real app, send to backend, remove from queue
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Match Queue</h1>
      <MatchQueue users={usersInQueue} onMatch={handleMatch} onPass={handlePass} onSuperLike={handleSuperLike} />
    </div>
  )
}
