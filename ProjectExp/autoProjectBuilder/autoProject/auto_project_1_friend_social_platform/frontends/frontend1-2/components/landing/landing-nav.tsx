"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Heart, Moon, Sun, Star, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function LandingNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Success Stories", href: "#success-stories" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "/pricing" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-purple-500/5"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                <Heart className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                SocialConnect
              </span>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-400 border-0"
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  4.9
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">Trusted by 10M+</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-10 h-10 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-purple-600" />
              )}
            </Button>

            <Button
              variant="ghost"
              asChild
              className="font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              <Link href="/login">Sign In</Link>
            </Button>

            <Button
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/register">
                <Heart className="w-4 h-4 mr-2" />
                Get Started Free
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 pb-6 border-b border-purple-200 dark:border-purple-800">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                        SocialConnect
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          4.9
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 font-medium text-lg rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-6 border-t border-purple-200 dark:border-purple-800 space-y-4">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start border-purple-200 hover:bg-purple-50 bg-transparent"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 shadow-lg"
                      asChild
                    >
                      <Link href="/register">
                        <Heart className="w-4 h-4 mr-2" />
                        Get Started Free
                      </Link>
                    </Button>

                    {/* Theme Toggle */}
                    <Button
                      variant="outline"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-full border-purple-200 hover:bg-purple-50"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-2 text-purple-600" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
