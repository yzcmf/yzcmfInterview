"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Home, Compass, Heart, MessageCircle, User, LogOut, Moon, Sun, Wifi, WifiOff } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useSocket } from "@/lib/socket-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Matches", href: "/matches", icon: Heart },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { isConnected, onlineUsers, messages } = useSocket()

  // Count unread messages
  const unreadCount = messages.filter((msg) => msg.senderId !== user?.id && msg.status !== "read").length

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            SocialConnect
          </h1>
        </div>

        {/* Connection Status */}
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">Offline</span>
                </>
              )}
            </div>
            <span className="text-muted-foreground">{onlineUsers.length} users online</span>
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
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors relative",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {showBadge && (
                  <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <Avatar>
                <AvatarImage src={user?.image || "/placeholder.svg?height=40&width=40"} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex-1"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={logout} className="flex-1">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
