"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function PaymentForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    saveCard: false,
    agreeToTerms: false,
  })

  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("billingAddress.")) {
      const addressField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Payment Successful! 🎉",
        description: "Welcome to Premium! Your subscription is now active.",
      })

      router.push("/dashboard?upgraded=true")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Payment Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Billing Address</h3>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                value={formData.billingAddress.street}
                onChange={(e) => handleInputChange("billingAddress.street", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleInputChange("billingAddress.state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="ca">California</SelectItem>
                    <SelectItem value="tx">Texas</SelectItem>
                    <SelectItem value="fl">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={formData.billingAddress.zipCode}
                  onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={(value) => handleInputChange("billingAddress.country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveCard"
                checked={formData.saveCard}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, saveCard: checked as boolean }))}
              />
              <Label htmlFor="saveCard" className="text-sm">
                Save card for future purchases
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Complete Payment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
