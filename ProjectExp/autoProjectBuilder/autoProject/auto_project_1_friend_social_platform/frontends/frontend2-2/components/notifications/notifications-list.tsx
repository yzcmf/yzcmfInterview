import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "match" | "message" | "like" | "new_user"
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationsList() {
  const notifications: Notification[] = [
    {
      id: "1",
      type: "match",
      message: "You have a new match with Alice!",
      timestamp: "2024-07-04T10:00:00Z",
      read: false,
    },
    {
      id: "2",
      type: "message",
      message: "Bob sent you a new message: 'Hey, how are you?'",
      timestamp: "2024-07-04T09:30:00Z",
      read: false,
    },
    {
      id: "3",
      type: "like",
      message: "Charlie liked your profile!",
      timestamp: "2024-07-03T18:00:00Z",
      read: true,
    },
    {
      id: "4",
      type: "new_user",
      message: "Welcome David to SocialConnect! Find new friends.",
      timestamp: "2024-07-03T12:00:00Z",
      read: true,
    },
    {
      id: "5",
      type: "match",
      message: "You matched with Emily!",
      timestamp: "2024-07-02T15:45:00Z",
      read: true,
    },
  ]

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "match":
        return <Heart className="h-5 w-5 text-red-500" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "like":
        return <Bell className="h-5 w-5 text-yellow-500" />
      case "new_user":
        return <UserPlus className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Your Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">No new notifications.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification, index) => (
              <li
                key={notification.id}
                className={cn(
                  "flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  !notification.read && "bg-purple-50 dark:bg-purple-950",
                )}
              >
                <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
