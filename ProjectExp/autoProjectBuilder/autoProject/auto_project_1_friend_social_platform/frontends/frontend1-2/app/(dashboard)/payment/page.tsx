import { PaymentForm } from "@/components/payment/payment-form"
import { PaymentSummary } from "@/components/payment/payment-summary"

export default function PaymentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Purchase</h1>
        <p className="text-gray-600 dark:text-gray-400">Secure payment powered by Stripe</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PaymentForm />
        <PaymentSummary />
      </div>
    </div>
  )
}
