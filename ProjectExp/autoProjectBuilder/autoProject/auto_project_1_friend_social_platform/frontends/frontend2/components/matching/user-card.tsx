"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, Star } from "lucide-react"
import Image from "next/image"

interface UserCardProps {
  user: {
    id: string
    name: string
    age: number
    bio: string
    photos: string[]
    interests: string[]
    location: string
  }
  onLike: (userId: string) => void
  onPass: (userId: string) => void
  onSuperLike: (userId: string) => void
}

export default function UserCard({ user, onLike, onPass, onSuperLike }: UserCardProps) {
  return (
    <Card className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg relative bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      <div className="relative h-80 w-full">
        {user.photos && user.photos.length > 0 ? (
          <Image
            src={user.photos[0] || "/placeholder.svg"} // Display the first photo
            alt={`Photo of ${user.name}`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500 rounded-t-xl">
            <span className="text-lg">No Image</span>
          </div>
        )}
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-3xl font-bold">
            {user.name}, {user.age}
          </h3>
          <span className="text-sm opacity-80">{user.location}</span>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">{user.bio}</p>
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span key={index} className="bg-white/20 text-xs px-3 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-around p-4 border-t border-white/20">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 transition-transform duration-200 hover:scale-110"
          onClick={() => onPass(user.id)}
        >
          <X className="h-8 w-8" />
          <span className="sr-only">Pass</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 transition-transform duration-200 hover:scale-110"
          onClick={() => onLike(user.id)}
        >
          <Heart className="h-8 w-8 fill-current" />
          <span className="sr-only">Like</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 transition-transform duration-200 hover:scale-110"
          onClick={() => onSuperLike(user.id)}
        >
          <Star className="h-8 w-8 fill-current" />
          <span className="sr-only">Super Like</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
