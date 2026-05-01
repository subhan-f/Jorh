import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  QrCode,
  MessageCircle,
  BarChart2,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@jorh/ui";
import { useUiStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/links", icon: Link2, label: "Links" },
  { href: "/tools/qr", icon: QrCode, label: "QR Codes" },
  { href: "/tools/whatsapp", icon: MessageCircle, label: "WhatsApp" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { user } = useAuthStore();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-200",
        sidebarOpen ? "w-56" : "w-16"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {sidebarOpen && (
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent">
            Jorh
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto rounded-md p-1.5 hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn("h-4 w-4 text-muted-foreground transition-transform", !sidebarOpen && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  to={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {sidebarOpen && user && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.displayName?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{user.displayName}</p>
              <p className="truncate text-[10px] capitalize text-muted-foreground">{user.plan} plan</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
