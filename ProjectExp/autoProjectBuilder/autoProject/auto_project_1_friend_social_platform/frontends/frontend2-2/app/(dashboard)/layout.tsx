import type React from "react"
import Link from "next/link"
import { Home, Users, MessageSquare, User, Heart, DollarSign, Bell, Settings } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8">SocialApp</div>
        <nav className="space-y-4">
          <NavLink href="/dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" />
          <NavLink href="/discover" icon={<Users className="h-5 w-5" />} label="Discover" />
          <NavLink href="/matches" icon={<Heart className="h-5 w-5" />} label="Matches" />
          <NavLink href="/chat" icon={<MessageSquare className="h-5 w-5" />} label="Chat" />
          <NavLink href="/profile" icon={<User className="h-5 w-5" />} label="Profile" />
          <NavLink href="/pricing" icon={<DollarSign className="h-5 w-5" />} label="Pricing" />
          <NavLink href="/notifications" icon={<Bell className="h-5 w-5" />} label="Notifications" />
          <NavLink href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
