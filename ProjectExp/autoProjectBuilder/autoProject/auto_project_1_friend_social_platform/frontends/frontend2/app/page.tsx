import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 text-center">
      <h1 className="text-5xl font-extrabold mb-6">Welcome to the Social Platform!</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Connect with new friends, discover exciting matches, and chat in real-time.
      </p>
      <div className="flex gap-4">
        <Button
          asChild
          className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button
          asChild
          className="bg-transparent border border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
        >
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </div>
  )
}
