"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with your premium experience, contact us within 30 days for a full refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard SSL encryption and never store your payment details. All transactions are processed through our secure payment partner, Stripe.",
  },
  {
    question: "What happens to my matches if I downgrade?",
    answer:
      "Your existing matches and conversations will remain intact. However, you'll be limited to the features available in your new plan.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! We offer a 50% discount for verified students. Contact our support team with your student ID for more information.",
  },
  {
    question: "Can I pause my subscription?",
    answer:
      "Currently, we don't offer subscription pausing. However, you can cancel and resubscribe at any time without losing your profile data.",
  },
]

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (question: string) => {
    setOpenItems((prev) => (prev.includes(question) ? prev.filter((item) => item !== question) : [...prev, question]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5" />
          <span>Frequently Asked Questions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Collapsible
              key={faq.question}
              open={openItems.includes(faq.question)}
              onOpenChange={() => toggleItem(faq.question)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openItems.includes(faq.question) ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
