"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Globe, Award, TrendingUp } from "lucide-react"

const mediaLogos = [
  { name: "TechCrunch", logo: "TC" },
  { name: "Forbes", logo: "F" },
  { name: "Wired", logo: "W" },
  { name: "The Verge", logo: "TV" },
  { name: "Mashable", logo: "M" },
]

const achievements = [
  {
    icon: Award,
    title: "App of the Year",
    subtitle: "Google Play Awards 2024",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Star,
    title: "4.9/5 Rating",
    subtitle: "Over 500K reviews",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "#1 Dating App",
    subtitle: "App Store Rankings",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "50+ Countries",
    subtitle: "Global community",
    color: "from-green-500 to-blue-500",
  },
]

const liveStats = [
  { label: "Active Users", value: "2.5M+", change: "+12%" },
  { label: "Daily Matches", value: "150K+", change: "+8%" },
  { label: "Messages Sent", value: "5M+", change: "+15%" },
  { label: "Success Rate", value: "95%", change: "+2%" },
]

export function LandingSocialProof() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            Trusted Worldwide
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by Millions,{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trusted by Experts
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join the world's most successful dating community, featured in top publications and loved by users globally.
          </p>
        </div>

        {/* Media Coverage */}
        <div className="mb-16">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {mediaLogos.map((media) => (
              <div
                key={media.name}
                className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center font-bold text-gray-600 dark:text-gray-300"
              >
                {media.logo}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement) => (
            <Card key={achievement.title} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center`}
                >
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Stats */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Live Platform Statistics</h3>
              <p className="text-purple-100">Real-time data from our global community</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {liveStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-purple-100 text-sm mb-1">{stat.label}</div>
                  <div className="text-xs bg-white/20 rounded-full px-2 py-1 inline-block">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {stat.change} this month
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Reviews Preview */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">4.9</span>
            <span className="text-gray-600 dark:text-gray-400">out of 5</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Based on 500,000+ reviews from verified users</p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              "Life-changing app!" - Sarah M.
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              "Found my soulmate here" - Mike R.
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              "Best dating experience ever" - Emma L.
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
