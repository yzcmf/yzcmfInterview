import ProfileForm from "@/components/profile/profile-form"

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Your Profile</h1>
      <ProfileForm />
    </div>
  )
}
