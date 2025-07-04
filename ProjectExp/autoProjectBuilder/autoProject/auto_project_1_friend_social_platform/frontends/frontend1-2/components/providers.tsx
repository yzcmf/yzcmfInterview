"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { SocketProvider } from "@/lib/socket-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
