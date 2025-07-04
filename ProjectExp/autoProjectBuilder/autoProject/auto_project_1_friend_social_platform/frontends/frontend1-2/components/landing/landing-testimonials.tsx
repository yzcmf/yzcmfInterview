"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "I found my perfect match within a week! The AI matching is incredibly accurate and the interface is so intuitive. Highly recommend!",
    rating: 5,
    location: "New York, NY",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The real-time chat feature is amazing. I love how I can see when someone is typing and the conversations flow naturally.",
    rating: 5,
    location: "San Francisco, CA",
  },
  {
    name: "Emily Rodriguez",
    role: "Designer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Finally, a dating app that prioritizes safety and privacy. I feel secure sharing my information and meeting new people.",
    rating: 5,
    location: "Austin, TX",
  },
  {
    name: "David Kim",
    role: "Teacher",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The mobile experience is flawless. I can stay connected with my matches whether I'm on my phone or computer.",
    rating: 5,
    location: "Seattle, WA",
  },
  {
    name: "Jessica Williams",
    role: "Photographer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "I've tried many dating apps, but this one stands out. The quality of matches and the user experience is unmatched.",
    rating: 5,
    location: "Los Angeles, CA",
  },
  {
    name: "Alex Thompson",
    role: "Entrepreneur",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The AI really understands what I'm looking for. Every match feels like it could be 'the one'. Great job on the algorithm!",
    rating: 5,
    location: "Miami, FL",
  },
]

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real users have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-purple-500 opacity-50" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.9/5 Average Rating</span>
            </div>
            <div>•</div>
            <div>10,000+ Happy Users</div>
            <div>•</div>
            <div>95% Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
