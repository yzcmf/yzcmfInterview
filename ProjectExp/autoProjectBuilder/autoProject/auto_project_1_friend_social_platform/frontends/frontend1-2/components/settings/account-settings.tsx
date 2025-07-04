"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Camera, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export function AccountSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: user?.email || "john@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Adventure seeker, coffee lover, and dog mom. Looking for someone to explore the city with!",
    location: "New York, NY",
    birthDate: "1995-06-15",
    occupation: "Software Engineer",
    education: "Bachelor's in Computer Science",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Simulate API call
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Account Information</span>
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.image || "/placeholder.svg?height=80&width=80"} />
              <AvatarFallback className="text-2xl">
                {formData.firstName[0]}
                {formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{formData.occupation}</p>
            <Button variant="ghost" size="sm" className="mt-1 p-0 h-auto">
              Change Photo
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!isEditing}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={!isEditing}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="birthDate">Birth Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              disabled={!isEditing}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => handleInputChange("occupation", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="education">Education</Label>
          <Input
            id="education"
            value={formData.education}
            onChange={(e) => handleInputChange("education", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            rows={3}
            placeholder="Tell others about yourself..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
