import { DiscoverInterface } from "@/components/discover/discover-interface"

export default function DiscoverPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Discover New Friends</h1>
        <p className="text-gray-600 dark:text-gray-400">Swipe right to like, left to pass. Find your perfect match!</p>
      </div>

      <DiscoverInterface />
    </div>
  )
}
