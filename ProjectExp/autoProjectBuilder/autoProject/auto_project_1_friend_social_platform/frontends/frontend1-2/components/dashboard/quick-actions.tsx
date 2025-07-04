"use client"

import { Button } from "@/components/ui/button"
import { Compass, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
        <Link href="/discover">
          <Compass className="mr-2 h-4 w-4" />
          Discover
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm">
        <Link href="/matches">
          <Heart className="mr-2 h-4 w-4" />
          Matches
        </Link>
      </Button>

      <Button asChild variant="outline" size="sm">
        <Link href="/chat">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat
        </Link>
      </Button>
    </div>
  )
}
