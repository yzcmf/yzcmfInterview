import Link from "next/link"

export default function LandingFooter() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 px-4 text-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">SocialConnect</h3>
          <p className="text-sm text-gray-400">Connecting hearts, one swipe at a time.</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <nav className="flex flex-col items-center space-y-1">
            <Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/help" className="text-sm text-gray-400 hover:text-white transition-colors">
              Help Center
            </Link>
          </nav>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <nav className="flex flex-col items-center space-y-1">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-6 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} SocialConnect. All rights reserved.
      </div>
    </footer>
  )
}
