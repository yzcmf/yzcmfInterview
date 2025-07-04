import { NotificationsList } from "@/components/notifications/notifications-list"
import { NotificationSettings } from "@/components/notifications/notification-settings"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with your matches and messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NotificationsList />
        </div>
        <div>
          <NotificationSettings />
        </div>
      </div>
    </div>
  )
}
