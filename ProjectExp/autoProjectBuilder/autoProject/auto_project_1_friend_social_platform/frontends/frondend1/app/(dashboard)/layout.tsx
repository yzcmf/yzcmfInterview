import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <DashboardNav />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Main Content */}
        <main className="md:ml-64 min-h-screen">
          <div className="p-4 md:p-8 pb-20 md:pb-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
