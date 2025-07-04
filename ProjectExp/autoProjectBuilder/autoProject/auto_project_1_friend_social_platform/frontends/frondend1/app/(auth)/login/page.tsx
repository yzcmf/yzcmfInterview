import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  return (
    <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>Sign in to continue your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
