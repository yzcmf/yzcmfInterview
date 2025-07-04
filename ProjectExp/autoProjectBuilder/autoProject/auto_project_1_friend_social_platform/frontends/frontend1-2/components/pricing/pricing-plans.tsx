"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Crown, Heart, Star } from "lucide-react"
import { useRouter } from "next/navigation"

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Heart,
    color: "from-gray-500 to-gray-600",
    features: ["5 matches per day", "Basic profile", "Limited messaging", "Standard support"],
    limitations: ["No super likes", "No read receipts", "Ads included"],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Most popular choice",
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    popular: true,
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
  },
  {
    id: "platinum",
    name: "Platinum",
    description: "Ultimate dating experience",
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
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
  },
]

export function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      router.push("/register")
    } else {
      router.push(`/payment?plan=${planId}&billing=${isYearly ? "yearly" : "monthly"}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isYearly ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"}`}>
          Monthly
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm ${isYearly ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"}`}>
          Yearly
        </span>
        {isYearly && (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">Save 17%</Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative hover:shadow-lg transition-all duration-300 ${
              plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}
              >
                <plan.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  {plan.monthlyPrice > 0 && (
                    <span className="text-lg text-gray-500">/{isYearly ? "year" : "month"}</span>
                  )}
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    ${(plan.yearlyPrice / 12).toFixed(2)}/month billed annually
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
                {plan.limitations?.map((limitation) => (
                  <div key={limitation} className="flex items-center space-x-3 opacity-60">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      <div className="w-3 h-3 border border-gray-400 rounded-full" />
                    </div>
                    <span className="text-sm text-gray-500 line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : plan.id === "free"
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500"
                }`}
              >
                {plan.id === "free" ? "Get Started Free" : `Choose ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
