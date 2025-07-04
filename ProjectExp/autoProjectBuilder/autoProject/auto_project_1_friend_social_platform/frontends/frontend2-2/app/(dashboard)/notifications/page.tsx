import NotificationsList from "@/components/notifications/notifications-list"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-full p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Notifications Center</h1>
      <NotificationsList />
    </div>
  )
}
