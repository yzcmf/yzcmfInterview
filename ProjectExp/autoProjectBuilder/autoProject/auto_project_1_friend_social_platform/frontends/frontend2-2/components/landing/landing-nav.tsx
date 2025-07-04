import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingNav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex items-center justify-between bg-transparent">
      <Link href="/" className="text-2xl font-bold text-white">
        SocialConnect
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/features" className="text-white hover:text-gray-200 transition-colors hidden md:block">
          Features
        </Link>
        <Link href="/pricing" className="text-white hover:text-gray-200 transition-colors hidden md:block">
          Pricing
        </Link>
        <Button asChild variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link href="/register">Sign Up</Link>
        </Button>
      </nav>
    </header>
  )
}
