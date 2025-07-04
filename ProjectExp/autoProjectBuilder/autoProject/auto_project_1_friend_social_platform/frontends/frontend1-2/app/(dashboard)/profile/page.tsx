import { ProfileForm } from "@/components/profile/profile-form"
import { ProfilePreview } from "@/components/profile/profile-preview"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your profile information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm />
        <ProfilePreview />
      </div>
    </div>
  )
}
