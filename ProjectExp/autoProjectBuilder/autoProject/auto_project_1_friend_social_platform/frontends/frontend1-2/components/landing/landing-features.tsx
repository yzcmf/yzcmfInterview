"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, MessageCircle, Shield, Heart, Lock, Video, Gift, Calendar, Users } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our advanced AI analyzes 200+ compatibility factors to find your perfect matches with 98% accuracy.",
    badge: "Smart",
    color: "from-purple-500 to-pink-500",
    stats: "98% accuracy",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description: "Connect instantly with secure messaging, voice notes, video calls, and fun interactive features.",
    badge: "Instant",
    color: "from-blue-500 to-purple-500",
    stats: "1M+ messages daily",
  },
  {
    icon: Video,
    title: "Video Dating",
    description:
      "Safe virtual dates with HD video calls, screen sharing, and interactive games before meeting in person.",
    badge: "New",
    color: "from-green-500 to-blue-500",
    stats: "50K+ video dates",
  },
  {
    icon: Shield,
    title: "Privacy & Safety",
    description: "Military-grade encryption, photo verification, and 24/7 safety monitoring keep you protected.",
    badge: "Secure",
    color: "from-red-500 to-pink-500",
    stats: "100% verified",
  },
  {
    icon: Gift,
    title: "Virtual Gifts",
    description: "Express yourself with premium virtual gifts, custom stickers, and personalized messages.",
    badge: "Fun",
    color: "from-yellow-500 to-orange-500",
    stats: "500+ gifts",
  },
  {
    icon: Calendar,
    title: "Events & Meetups",
    description: "Join exclusive dating events, speed dating sessions, and local meetups in your area.",
    badge: "Social",
    color: "from-indigo-500 to-purple-500",
    stats: "1K+ events monthly",
  },
]

const howItWorks = [
  {
    step: "1",
    title: "Create Your Profile",
    description: "Upload photos, answer fun questions, and let our AI learn your preferences.",
    icon: Users,
  },
  {
    step: "2",
    title: "Get Smart Matches",
    description: "Our AI finds compatible people based on personality, interests, and lifestyle.",
    icon: Brain,
  },
  {
    step: "3",
    title: "Start Connecting",
    description: "Chat, video call, or meet up safely with your perfect matches.",
    icon: Heart,
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Heart className="w-3 h-3 mr-1" />
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Find Love
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover powerful features designed to help you find meaningful connections and build lasting relationships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 border-0 shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{feature.stats}</span>
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                    Learn More →
                  </Button>
                </div>
              </CardContent>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </Card>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Finding love has never been easier. Get started in just 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {howItWorks.map((step, index) => (
            <div key={step.step} className="text-center relative">
              {/* Connection Line */}
              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform translate-x-1/2 z-0" />
              )}

              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-500">
                  <span className="text-sm font-bold text-purple-600">{step.step}</span>
                </div>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-lg px-8 py-4 h-auto">
            <Heart className="mr-2 h-5 w-5" />
            Start Your Journey Today
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            <Lock className="w-4 h-4 inline mr-1" />
            Free to join • No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
