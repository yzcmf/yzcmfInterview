import { MatchesList } from "@/components/matches/matches-list"
import { MatchesStats } from "@/components/matches/matches-stats"

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Your Matches</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with people who liked you back</p>
        </div>
      </div>

      <MatchesStats />
      <MatchesList />
    </div>
  )
}
