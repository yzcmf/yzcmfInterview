"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast" // Assuming use-toast is available

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate about hiking, photography, and exploring new cafes. Looking for someone to share adventures with!",
    location: "San Francisco",
    age: 28,
    gender: "male",
    interests: "Hiking, Photography, Coffee, Travel",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile updated:", formData)
    // In a real app, you'd send this to your backend API: PUT /api/users/profile
    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully saved.",
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Profile</CardTitle>
        <CardDescription>Update your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} disabled />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={formData.bio} onChange={handleChange} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" value={formData.age} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., hiking, reading, gaming"
            />
          </div>
          <div className="col-span-full flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
