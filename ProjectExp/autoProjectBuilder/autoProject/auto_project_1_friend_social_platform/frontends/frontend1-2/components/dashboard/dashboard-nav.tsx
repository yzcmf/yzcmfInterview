"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Compass,
  Heart,
  MessageCircle,
  User,
  LogOut,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Sparkles,
  Crown,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useSocket } from "@/lib/socket-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, color: "from-blue-500 to-purple-500" },
  { name: "Discover", href: "/discover", icon: Compass, color: "from-purple-500 to-pink-500" },
  { name: "Matches", href: "/matches", icon: Heart, color: "from-pink-500 to-red-500" },
  { name: "Chat", href: "/chat", icon: MessageCircle, color: "from-green-500 to-blue-500" },
  { name: "Profile", href: "/profile", icon: User, color: "from-orange-500 to-red-500" },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { isConnected, onlineUsers, messages } = useSocket()

  // Count unread messages
  const unreadCount = messages.filter((msg) => msg.senderId !== user?.id && msg.status !== "read").length

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10 border-r border-purple-200/50 dark:border-purple-800/50 shadow-xl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-600/5 to-pink-600/5">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                <Heart className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              SocialConnect
            </span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="px-4 py-3 border-b border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <div className="relative">
                    <Wifi className="h-3 w-3 text-green-500" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-green-600 font-medium">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span className="text-red-600 font-medium">Offline</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground font-medium">{onlineUsers.length} users online</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const showBadge = item.name === "Chat" && unreadCount > 0

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative group",
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-purple-500/25 scale-105`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:scale-105",
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg mr-3 transition-all duration-300",
                    isActive
                      ? "bg-white/20"
                      : "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 group-hover:scale-110",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="flex-1">{item.name}</span>
                {showBadge && (
                  <Badge variant="destructive" className="ml-auto text-xs px-2 py-1 min-w-[20px] h-6 animate-bounce">
                    {unreadCount}
                  </Badge>
                )}
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Settings */}
        <div className="p-4 border-t border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
            <div className="relative">
              <Avatar className="ring-2 ring-purple-200 dark:ring-purple-800">
                <AvatarImage src={user?.image || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              )}
              <div className="absolute -top-1 -right-1">
                <Crown className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@example.com"}</p>
              <Badge
                variant="secondary"
                className="mt-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/50 dark:to-pink-900/50 dark:text-purple-300"
              >
                Premium
              </Badge>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-purple-600" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
