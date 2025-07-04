"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Compass, Heart, MessageCircle, User, Menu, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Matches", href: "/matches", icon: Heart },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          SocialConnect
        </h1>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col h-full">
              {/* User Profile */}
              <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-800">
                <Avatar>
                  <AvatarImage src={user?.image || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Settings */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
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
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                  isActive ? "text-purple-600" : "text-gray-500 dark:text-gray-400",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
