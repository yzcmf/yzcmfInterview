import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPlans() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "Limited daily swipes",
        "Basic chat features",
        "Standard profile visibility",
        "Ad-supported experience",
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline",
      buttonLink: "#",
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      features: [
        "Unlimited daily swipes",
        "Advanced chat features",
        "Enhanced profile visibility",
        "Ad-free experience",
        "See who liked you",
        "5 Super Likes per day",
      ],
      buttonText: "Choose Premium",
      buttonVariant: "default",
      buttonLink: "/payment?plan=premium",
      highlight: true,
    },
    {
      name: "VIP",
      price: "$19.99",
      period: "/month",
      features: [
        "All Premium features",
        "Priority profile boost",
        "Exclusive VIP badge",
        "Dedicated support",
        "Read receipts in chat",
        "Undo last swipe",
      ],
      buttonText: "Choose VIP",
      buttonVariant: "outline",
      buttonLink: "/payment?plan=vip",
    },
  ]

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Choose the plan that's right for you and unlock the full potential of SocialConnect.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`flex flex-col shadow-lg ${
              plan.highlight ? "border-2 border-purple-600 dark:border-purple-400" : ""
            } bg-white dark:bg-gray-800`}
          >
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                <span className="text-5xl font-extrabold text-purple-600 dark:text-purple-400">{plan.price}</span>
                <span className="text-lg font-medium">{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-6 py-4">
              <ul className="space-y-3 text-left text-gray-700 dark:text-gray-200">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button asChild className="w-full" variant={plan.buttonVariant}>
                <Link href={plan.buttonLink}>{plan.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
