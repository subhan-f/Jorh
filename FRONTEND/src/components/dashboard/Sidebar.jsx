import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Home,
  Link2,
  QrCode,
  User,
  Globe,
  BarChart2,
  Megaphone,
  Settings,
} from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { icon: Home,      label: "Home",           to: "/dashboard" },
  { icon: Link2,     label: "Links",          to: "/dashboard/links" },
  { icon: QrCode,    label: "QR Codes",       to: "/dashboard/qr-codes" },
  { icon: User,      label: "Link in Bio",    to: "/dashboard/bio" },
  { icon: Globe,     label: "Custom Domains", to: "/dashboard/domains", badge: "Try It" },
  { icon: BarChart2, label: "Analytics",      to: "/dashboard/analytics" },
  { icon: Megaphone, label: "Campaigns",      to: "/dashboard/campaigns" },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { location } = useRouterState()

  const isActive = (to) =>
    to === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(to)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Create New */}
      <div className="p-3">
        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 shrink-0" />
          {!collapsed && <span>Create new</span>}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-1">
        {navItems.map(({ icon: Icon, label, to, badge }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(to)
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-gray-100 px-2 py-2">
        <Link
          to="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive("/dashboard/settings")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-14 z-10 flex size-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
      >
        {collapsed ? (
          <ChevronRight className="size-3 text-gray-500" />
        ) : (
          <ChevronLeft className="size-3 text-gray-500" />
        )}
      </button>
    </aside>
  )
}
