"use client"

import UserCard from "@/components/matching/user-card"
import { useState } from "react"

export default function DiscoverPage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0)

  const users = [
    {
      id: "1",
      name: "Alice",
      age: 28,
      bio: "Passionate about hiking, photography, and exploring new cafes. Looking for someone to share adventures with!",
      photos: ["/placeholder.svg?height=320&width=320"],
      interests: ["Hiking", "Photography", "Coffee", "Travel"],
      location: "San Francisco",
    },
    {
      id: "2",
      name: "Bob",
      age: 30,
      bio: "Software engineer who loves coding, gaming, and sci-fi movies. Always up for a good challenge.",
      photos: ["/placeholder.svg?height=320&width=320"],
      interests: ["Coding", "Gaming", "Sci-Fi", "Tech"],
      location: "New York",
    },
    {
      id: "3",
      name: "Charlie",
      age: 25,
      bio: "Artist and musician. Enjoys painting, playing guitar, and attending live concerts. Seeking creative souls.",
      photos: ["/placeholder.svg?height=320&width=320"],
      interests: ["Art", "Music", "Concerts", "Creativity"],
      location: "Los Angeles",
    },
  ]

  const handleAction = (actionType: string, userId: string) => {
    console.log(`${actionType} user: ${userId}`)
    // In a real app, you'd send this to your backend API (e.g., /api/matches/like)
    // For now, just move to the next user
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length)
  }

  const currentUser = users[currentUserIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">Discover New Friends</h1>
      {currentUser ? (
        <UserCard
          user={currentUser}
          onLike={() => handleAction("Liked", currentUser.id)}
          onPass={() => handleAction("Passed", currentUser.id)}
          onSuperLike={() => handleAction("Super Liked", currentUser.id)}
        />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No more users to discover for now!</p>
      )}
    </div>
  )
}
