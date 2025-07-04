"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, MessageCircle, Globe } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Users",
    description: "Growing community of verified members",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Heart,
    value: "50,000+",
    label: "Successful Matches",
    description: "Meaningful connections made daily",
    color: "from-pink-500 to-red-500",
  },
  {
    icon: MessageCircle,
    value: "1M+",
    label: "Messages Sent",
    description: "Real conversations happening now",
    color: "from-green-500 to-blue-500",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries",
    description: "Global community worldwide",
    color: "from-purple-500 to-pink-500",
  },
]

export function LandingStats() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join Thousands of{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Happy Users
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform has helped thousands of people find meaningful connections and build lasting relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="text-center hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <CardContent className="pt-8 pb-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{stat.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
