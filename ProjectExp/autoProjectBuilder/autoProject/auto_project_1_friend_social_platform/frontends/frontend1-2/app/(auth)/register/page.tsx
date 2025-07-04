import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Join SocialConnect
        </CardTitle>
        <CardDescription>Create your account and start connecting</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
