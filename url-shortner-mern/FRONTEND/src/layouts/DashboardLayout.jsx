import { useState } from "react"
import { Outlet } from "@tanstack/react-router"
import Sidebar from "@/components/dashboard/Sidebar"
import TopNav from "@/components/dashboard/TopNav"

export default function DashboardLayout({ user }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav user={user} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
