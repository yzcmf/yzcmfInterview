"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Crown, Star, Check } from "lucide-react"

const planDetails = {
  premium: {
    name: "Premium",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      "Unlimited matches",
      "Enhanced profile",
      "Unlimited messaging",
      "Read receipts",
      "5 super likes per day",
      "Priority support",
      "Ad-free experience",
      "Advanced filters",
    ],
    monthly: 19.99,
    yearly: 199.99,
  },
  platinum: {
    name: "Platinum",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    features: [
      "Everything in Premium",
      "Unlimited super likes",
      "Message before matching",
      "Priority in discovery",
      "Exclusive events access",
      "Personal dating coach",
      "Advanced analytics",
      "VIP support",
    ],
    monthly: 39.99,
    yearly: 399.99,
  },
}

export function PaymentSummary() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") || "premium"
  const billing = searchParams.get("billing") || "monthly"

  const plan = planDetails[planId as keyof typeof planDetails]
  const isYearly = billing === "yearly"
  const price = isYearly ? plan.yearly : plan.monthly
  const savings = isYearly ? (plan.monthly * 12 - plan.yearly).toFixed(2) : 0

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
            <plan.icon className="w-4 h-4 text-white" />
          </div>
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg">{plan.name} Plan</span>
            <Badge className={`bg-gradient-to-r ${plan.color} text-white`}>{isYearly ? "Yearly" : "Monthly"}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{isYearly ? "Billed annually" : "Billed monthly"}</p>
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium mb-3">What's included:</h4>
          <div className="space-y-2">
            {plan.features.slice(0, 5).map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
            {plan.features.length > 5 && (
              <div className="text-sm text-gray-500">+{plan.features.length - 5} more features</div>
            )}
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{plan.name} Plan</span>
            <span>${price.toFixed(2)}</span>
          </div>

          {isYearly && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Annual Discount</span>
              <span>-${savings}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-500">
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${price.toFixed(2)}</span>
          </div>

          {isYearly && (
            <div className="text-sm text-gray-500 text-center">
              ${(price / 12).toFixed(2)}/month when billed annually
            </div>
          )}
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-blue-700 dark:text-blue-400">
            <div className="font-medium mb-1">30-Day Money Back Guarantee</div>
            <div>Not satisfied? Get a full refund within 30 days, no questions asked.</div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>256-bit Encryption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
