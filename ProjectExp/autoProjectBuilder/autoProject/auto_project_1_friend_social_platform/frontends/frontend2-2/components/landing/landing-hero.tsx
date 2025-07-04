import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingHero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center" />
      <div className="relative z-10 max-w-4xl px-4 space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Connect, Discover, Chat. Your New Social Journey Starts Here.
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          Find meaningful connections, explore new friendships, and engage in real-time conversations with people who
          share your interests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
          >
            <Link href="/register">Get Started Free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold rounded-full shadow-lg bg-transparent"
          >
            <Link href="/features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
