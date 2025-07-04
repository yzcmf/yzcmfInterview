import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingStats } from "@/components/landing/landing-stats"
import { LandingTestimonials } from "@/components/landing/landing-testimonials"
import { LandingCTA } from "@/components/landing/landing-cta"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNav } from "@/components/landing/landing-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingStats />
      <LandingTestimonials />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}
