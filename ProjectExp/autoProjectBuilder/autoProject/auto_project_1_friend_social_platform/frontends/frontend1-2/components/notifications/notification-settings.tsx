"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Smartphone, Mail, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettings {
  pushNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  newMatches: boolean
  newMessages: boolean
  likes: boolean
  superLikes: boolean
  events: boolean
  marketing: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  frequency: "instant" | "hourly" | "daily"
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    newMatches: true,
    newMessages: true,
    likes: true,
    superLikes: true,
    events: true,
    marketing: false,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
    frequency: "instant",
  })

  const { toast } = useToast()

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateQuietHours = (key: keyof NotificationSettings["quietHours"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value,
      },
    }))
  }

  const saveSettings = () => {
    // Simulate API call
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h3 className="font-medium mb-4">Delivery Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-4 h-4 text-gray-500" />
                <Label htmlFor="push">Push Notifications</Label>
              </div>
              <Switch
                id="push"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <Label htmlFor="email">Email Notifications</Label>
              </div>
              <Switch
                id="email"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <Label htmlFor="sms">SMS Notifications</Label>
              </div>
              <Switch
                id="sms"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="font-medium mb-4">What to notify me about</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="matches">New Matches</Label>
              <Switch
                id="matches"
                checked={settings.newMatches}
                onCheckedChange={(checked) => updateSetting("newMatches", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="messages">New Messages</Label>
              <Switch
                id="messages"
                checked={settings.newMessages}
                onCheckedChange={(checked) => updateSetting("newMessages", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="likes">Likes</Label>
              <Switch
                id="likes"
                checked={settings.likes}
                onCheckedChange={(checked) => updateSetting("likes", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="superLikes">Super Likes</Label>
              <Switch
                id="superLikes"
                checked={settings.superLikes}
                onCheckedChange={(checked) => updateSetting("superLikes", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="events">Events & Promotions</Label>
              <Switch
                id="events"
                checked={settings.events}
                onCheckedChange={(checked) => updateSetting("events", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing Updates</Label>
              <Switch
                id="marketing"
                checked={settings.marketing}
                onCheckedChange={(checked) => updateSetting("marketing", checked)}
              />
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div>
          <h3 className="font-medium mb-4">Notification Frequency</h3>
          <Select value={settings.frequency} onValueChange={(value) => updateSetting("frequency", value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="hourly">Hourly Summary</SelectItem>
              <SelectItem value="daily">Daily Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quiet Hours */}
        <div>
          <h3 className="font-medium mb-4">Quiet Hours</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quietHours">Enable Quiet Hours</Label>
              <Switch
                id="quietHours"
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) => updateQuietHours("enabled", checked)}
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm">
                    Start Time
                  </Label>
                  <Select value={settings.quietHours.start} onValueChange={(value) => updateQuietHours("start", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endTime" className="text-sm">
                    End Time
                  </Label>
                  <Select value={settings.quietHours.end} onValueChange={(value) => updateQuietHours("end", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0")
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={saveSettings} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}
