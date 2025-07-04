import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // TODO: Replace with actual user creation logic
    // This is a mock implementation
    console.log("Creating user:", { firstName, lastName, email })

    // Simulate user creation
    const user = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
