import PricingPlans from "@/components/pricing/pricing-plans"

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-full p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Pricing Plans</h1>
      <PricingPlans />
    </div>
  )
}
