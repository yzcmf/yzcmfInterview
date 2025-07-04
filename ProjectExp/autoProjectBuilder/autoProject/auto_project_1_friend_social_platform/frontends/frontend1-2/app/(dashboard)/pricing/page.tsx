import { PricingPlans } from "@/components/pricing/pricing-plans"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { PricingFeatures } from "@/components/pricing/pricing-features"

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400">Unlock premium features and find your perfect match faster</p>
      </div>

      <PricingPlans />
      <PricingFeatures />
      <PricingFAQ />
    </div>
  )
}
