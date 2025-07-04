"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageCircle, Shield, Smartphone, Zap, Heart, Globe, Lock } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Our advanced AI analyzes your preferences, interests, and behavior to find your perfect matches with 95% accuracy.",
    badge: "Smart",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    description:
      "Connect instantly with your matches through our secure, real-time messaging system with typing indicators and read receipts.",
    badge: "Instant",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "Your data is protected with end-to-end encryption, advanced privacy controls, and comprehensive safety features.",
    badge: "Secure",
    color: "from-green-500 to-blue-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Seamless experience across all devices with our responsive design and native mobile app features.",
    badge: "Responsive",
    color: "from-pink-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Smart Notifications",
    description: "Stay connected with intelligent notifications that keep you updated without being overwhelming.",
    badge: "Smart",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "Connect with people from around the world or find matches in your local area with location-based filtering.",
    badge: "Global",
    color: "from-indigo-500 to-purple-500",
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
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover powerful features designed to help you find meaningful connections and build lasting relationships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Lock className="w-4 h-4" />
            <span>Trusted by 10,000+ users worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}
