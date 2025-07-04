"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

export function LandingCTA() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
      <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000" />
      <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
          <Sparkles className="w-3 h-3 mr-1" />
          Limited Time Offer
        </Badge>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Find Your
          <br />
          <span className="text-yellow-300">Perfect Match?</span>
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of happy users who have found meaningful connections. Start your journey today and discover
          what makes us different.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto" asChild>
            <Link href="/register">
              <Heart className="mr-2 h-5 w-5" />
              Start Matching Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4 h-auto bg-transparent"
            asChild
          >
            <Link href="/login">Already have an account?</Link>
          </Button>
        </div>

        {/* Features List */}
        <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Free to join</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>AI-powered matching</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Secure & private</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
