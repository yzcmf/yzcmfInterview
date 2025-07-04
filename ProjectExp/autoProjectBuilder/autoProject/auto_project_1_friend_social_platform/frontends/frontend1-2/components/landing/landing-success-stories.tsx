"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Quote, MapPin, Calendar, Play } from "lucide-react"
import { useState } from "react"

const successStories = [
  {
    id: 1,
    couple: {
      person1: { name: "Emma", age: 29, avatar: "/placeholder.svg?height=60&width=60" },
      person2: { name: "Jake", age: 31, avatar: "/placeholder.svg?height=60&width=60" },
    },
    story:
      "We matched on SocialConnect and had our first video date during lockdown. Two years later, we're engaged and planning our dream wedding!",
    location: "New York, NY",
    matchDate: "March 2022",
    relationship: "Engaged",
    videoUrl: "#",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    couple: {
      person1: { name: "Sarah", age: 26, avatar: "/placeholder.svg?height=60&width=60" },
      person2: { name: "Michael", age: 28, avatar: "/placeholder.svg?height=60&width=60" },
    },
    story:
      "The AI matching was incredible - we had 98% compatibility! Our first date felt like we'd known each other forever. Now we're married with a beautiful baby girl.",
    location: "San Francisco, CA",
    matchDate: "January 2021",
    relationship: "Married",
    videoUrl: "#",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    couple: {
      person1: { name: "Alex", age: 24, avatar: "/placeholder.svg?height=60&width=60" },
      person2: { name: "Jordan", age: 25, avatar: "/placeholder.svg?height=60&width=60" },
    },
    story:
      "We both love hiking and the app matched us perfectly! Our first date was a mountain hike, and we've been exploring the world together ever since.",
    location: "Denver, CO",
    matchDate: "June 2023",
    relationship: "Dating",
    videoUrl: "#",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export function LandingSuccessStories() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Heart className="w-3 h-3 mr-1" />
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real Love Stories from{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Real People
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of couples who found their perfect match through our platform. Your love story could be next!
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedStory(story.id)}
            >
              {/* Story Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full w-16 h-16"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                {/* Couple Avatars */}
                <div className="absolute bottom-4 left-4 flex -space-x-3">
                  <Avatar className="w-12 h-12 border-4 border-white">
                    <AvatarImage src={story.couple.person1.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{story.couple.person1.name[0]}</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-12 h-12 border-4 border-white">
                    <AvatarImage src={story.couple.person2.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{story.couple.person2.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Relationship Status */}
                <div className="absolute top-4 right-4">
                  <Badge
                    className={`${
                      story.relationship === "Married"
                        ? "bg-green-500"
                        : story.relationship === "Engaged"
                          ? "bg-purple-500"
                          : "bg-pink-500"
                    } text-white`}
                  >
                    {story.relationship}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Couple Names */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {story.couple.person1.name} & {story.couple.person2.name}
                  </h3>
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>

                {/* Story Quote */}
                <div className="mb-4">
                  <Quote className="w-6 h-6 text-purple-500 mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm italic line-clamp-3">"{story.story}"</p>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {story.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Matched {story.matchDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-400">Success Stories</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">15K+</div>
            <div className="text-gray-600 dark:text-gray-400">Marriages</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">2.3M</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Couples</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8 py-4 h-auto">
            <Heart className="mr-2 h-5 w-5" />
            Write Your Love Story
          </Button>
        </div>
      </div>
    </section>
  )
}
