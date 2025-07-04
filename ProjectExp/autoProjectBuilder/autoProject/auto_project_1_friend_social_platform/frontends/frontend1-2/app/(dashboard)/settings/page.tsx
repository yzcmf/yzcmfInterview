import { AccountSettings } from "@/components/settings/account-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { PreferencesSettings } from "@/components/settings/preferences-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AccountSettings />
          <SecuritySettings />
        </div>
        <div className="space-y-8">
          <PrivacySettings />
          <PreferencesSettings />
        </div>
      </div>
    </div>
  )
}
