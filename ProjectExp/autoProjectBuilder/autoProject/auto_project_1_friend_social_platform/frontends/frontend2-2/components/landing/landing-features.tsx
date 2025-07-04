import { Heart, MessageSquare, Users, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LandingFeatures() {
  const features = [
    {
      icon: Heart,
      title: "Smart Matching",
      description:
        "Our AI-powered algorithm connects you with compatible individuals based on your interests and preferences.",
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Engage in instant, seamless conversations with your matches through our integrated chat system.",
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Join a diverse and active community of users looking to make genuine connections.",
    },
    {
      icon: Sparkles,
      title: "Personalized Discovery",
      description: "Swipe through profiles tailored to your tastes and discover new friends effortlessly.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900 text-center">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Why Choose SocialConnect?</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        We're dedicated to helping you build meaningful relationships in a fun and secure environment.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
          >
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-4">
              <feature.icon className="h-8 w-8" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
