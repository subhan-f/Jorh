import TabSwitcher from "@/components/dashboard/TabSwitcher"
import QuickCreateCard from "@/components/dashboard/QuickCreateCard"
import AiUpgradeCard from "@/components/dashboard/AiUpgradeCard"
import IntegrationsCard from "@/components/dashboard/IntegrationsCard"
import ChecklistCard from "@/components/dashboard/ChecklistCard"

export default function DashboardPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <TabSwitcher />

      {/* Quick create + AI upgrade */}
      <div className="flex gap-4">
        <QuickCreateCard />
        <AiUpgradeCard />
      </div>

      {/* Integrations + Checklist */}
      <div className="flex gap-4">
        <IntegrationsCard />
        <ChecklistCard userName="Subhan" />
      </div>
    </div>
  )
}
