import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with actual authentication logic
        // This is a mock implementation for demo purposes
        if (credentials.email === "demo@example.com" && credentials.password === "password") {
          return {
            id: "1",
            email: credentials.email,
            name: "Demo User",
            image: "/placeholder.svg?height=40&width=40",
          }
        }

        // For demo purposes, accept any email/password combination
        return {
          id: Date.now().toString(),
          email: credentials.email,
          name: credentials.email.split("@")[0],
          image: "/placeholder.svg?height=40&width=40",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
