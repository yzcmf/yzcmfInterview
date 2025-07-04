"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, Users, MessageCircle } from "lucide-react"
import Link from "next/link"

export function LandingHero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-pulse delay-2000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge
              variant="secondary"
              className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Matching
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Match</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Connect with like-minded people through our AI-powered matching system. Discover meaningful relationships
              and build lasting friendships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8" asChild>
                <Link href="/register">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Matching
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Match Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image/Cards */}
          <div className="relative">
            <div className="relative max-w-md mx-auto">
              {/* Main Card */}
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform rotate-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">SJ</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sarah, 28</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">New York, NY</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                      95% Match
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Adventure seeker, coffee lover, and dog mom. Looking for someone to explore the city with!
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary">Travel</Badge>
                  <Badge variant="secondary">Coffee</Badge>
                  <Badge variant="secondary">Dogs</Badge>
                </div>
              </div>

              {/* Background Cards */}
              <div className="absolute top-4 left-4 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 transform -rotate-6" />
              <div className="absolute top-8 left-8 w-full h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl opacity-20 transform rotate-12" />
            </div>

            {/* Floating Icons */}
            <div className="absolute top-10 right-10 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-10 left-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce delay-1000">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-1/2 right-0 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-bounce delay-2000">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
