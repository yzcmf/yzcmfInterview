"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const features = [
  {
    category: "Matching & Discovery",
    items: [
      { name: "Daily matches", free: "5", premium: "Unlimited", platinum: "Unlimited" },
      { name: "Super likes", free: "0", premium: "5/day", platinum: "Unlimited" },
      { name: "Rewind last swipe", free: false, premium: true, platinum: true },
      { name: "See who liked you", free: false, premium: true, platinum: true },
      { name: "Priority in discovery", free: false, premium: false, platinum: true },
    ],
  },
  {
    category: "Messaging & Communication",
    items: [
      { name: "Send messages", free: "Limited", premium: "Unlimited", platinum: "Unlimited" },
      { name: "Read receipts", free: false, premium: true, platinum: true },
      { name: "Message before matching", free: false, premium: false, platinum: true },
      { name: "Voice messages", free: false, premium: true, platinum: true },
      { name: "Video calls", free: false, premium: false, platinum: true },
    ],
  },
  {
    category: "Profile & Customization",
    items: [
      { name: "Profile photos", free: "6", premium: "9", platinum: "12" },
      { name: "Enhanced profile", free: false, premium: true, platinum: true },
      { name: "Profile verification", free: false, premium: true, platinum: true },
      { name: "Advanced filters", free: false, premium: true, platinum: true },
      { name: "Incognito mode", free: false, premium: false, platinum: true },
    ],
  },
  {
    category: "Support & Experience",
    items: [
      { name: "Customer support", free: "Email", premium: "Priority", platinum: "VIP" },
      { name: "Ad-free experience", free: false, premium: true, platinum: true },
      { name: "Personal dating coach", free: false, premium: false, platinum: true },
      { name: "Exclusive events", free: false, premium: false, platinum: true },
      { name: "Advanced analytics", free: false, premium: false, platinum: true },
    ],
  },
]

export function PricingFeatures() {
  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-400 mx-auto" />
      )
    }
    return <span className="text-sm text-center">{value}</span>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Compare All Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {features.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">{category.category}</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium">Feature</th>
                      <th className="text-center py-3 px-4">
                        <Badge variant="outline">Free</Badge>
                      </th>
                      <th className="text-center py-3 px-4">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Premium</Badge>
                      </th>
                      <th className="text-center py-3 px-4">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">Platinum</Badge>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, index) => (
                      <tr key={item.name} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                        <td className="py-3 px-4 text-sm font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-center">{renderFeatureValue(item.free)}</td>
                        <td className="py-3 px-4 text-center">{renderFeatureValue(item.premium)}</td>
                        <td className="py-3 px-4 text-center">{renderFeatureValue(item.platinum)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
