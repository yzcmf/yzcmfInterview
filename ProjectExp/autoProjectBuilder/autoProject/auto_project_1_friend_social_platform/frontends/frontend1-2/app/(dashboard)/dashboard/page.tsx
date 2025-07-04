import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentMatches } from "@/components/dashboard/recent-matches"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{"Here's what's happening in your social world"}</p>
        </div>
        <QuickActions />
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMatches />
        <ActivityFeed />
      </div>
    </div>
  )
}
