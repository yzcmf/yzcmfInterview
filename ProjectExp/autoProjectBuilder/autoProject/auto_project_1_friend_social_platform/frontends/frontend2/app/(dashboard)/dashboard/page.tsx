import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Heart, Sparkles, User } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Welcome Back!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">New Discoveries</CardTitle>
            <Users className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">15</div>
            <p className="text-xs opacity-80">New profiles waiting for you</p>
            <Button asChild variant="outline" className="mt-4 bg-white text-purple-600 hover:bg-gray-100">
              <Link href="/discover">Start Swiping</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3</div>
            <p className="text-xs opacity-80">From your recent matches</p>
            <Button asChild variant="outline" className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/chat">Go to Chat</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">New Matches</CardTitle>
            <Heart className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">5</div>
            <p className="text-xs opacity-80">People who liked you back</p>
            <Button asChild variant="outline" className="mt-4 bg-white text-red-600 hover:bg-gray-100">
              <Link href="/matches">View Matches</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white">
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
          <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
            <Link href="/discover">
              <Sparkles className="mr-2 h-4 w-4" /> AI Match
            </Link>
          </Button>
          <Button asChild className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
            <Link href="/chat">
              <MessageSquare className="mr-2 h-4 w-4" /> Start New Chat
            </Link>
          </Button>
          <Button asChild className="w-full bg-gray-500 hover:bg-gray-600 text-white">
            <Link href="/settings">
              <Users className="mr-2 h-4 w-4" /> Find Friends
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
