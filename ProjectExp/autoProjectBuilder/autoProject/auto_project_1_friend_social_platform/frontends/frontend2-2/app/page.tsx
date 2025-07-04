import LandingNav from "@/components/landing/landing-nav"
import LandingHero from "@/components/landing/landing-hero"
import LandingFeatures from "@/components/landing/landing-features"
import LandingFooter from "@/components/landing/landing-footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        {/* Add other landing page sections here as needed: Testimonials, SocialProof, etc. */}
      </main>
      <LandingFooter />
    </div>
  )
}
