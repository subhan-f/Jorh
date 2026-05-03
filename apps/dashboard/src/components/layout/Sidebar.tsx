import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  QrCode,
  MessageCircle,
  BarChart2,
  Settings,
  ChevronLeft,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@jorh/ui";
import { useUiStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { signOut } from "@jorh/firebase/auth";
import { useNavigate } from "react-router-dom";
import { getRoleDashboardPath, withRolePath } from "@/lib/routing";

export function Sidebar() {
  const { pathname } = useLocation();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const role = user?.role ?? "client";

  const navItems = [
    {
      href: getRoleDashboardPath(role),
      icon: LayoutDashboard,
      label: role === "admin" ? "Overview" : "Dashboard",
    },
    ...(role === "admin"
      ? [
          { href: "/admin/users", icon: Users, label: "Users" },
          { href: "/admin/links", icon: Link2, label: "All Links" },
        ]
      : [{ href: withRolePath(role, "/links"), icon: Link2, label: "Links" }]),
    { href: withRolePath(role, "/tools/qr"), icon: QrCode, label: "QR Codes" },
    { href: withRolePath(role, "/tools/whatsapp"), icon: MessageCircle, label: "WhatsApp" },
    { href: withRolePath(role, "/analytics"), icon: BarChart2, label: "Analytics" },
    { href: withRolePath(role, "/settings"), icon: Settings, label: "Settings" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <aside
      className={cn(
        "border-border bg-card flex h-screen flex-col border-r transition-all duration-200",
        sidebarOpen ? "w-56" : "w-14"
      )}
    >
      {/* Logo + collapse */}
      <div className="border-border flex h-14 items-center justify-between border-b px-3">
        {sidebarOpen && (
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent">
            Jorh
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "hover:bg-muted rounded-md p-1.5 transition-colors",
            !sidebarOpen && "mx-auto"
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn(
              "text-muted-foreground h-4 w-4 transition-transform",
              !sidebarOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  to={href}
                  title={!sidebarOpen ? label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
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

      {/* User footer */}
      <div className="border-border border-t p-2">
        {sidebarOpen ? (
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium leading-tight">
                {user?.displayName ?? "User"}
              </p>
              <p className="text-muted-foreground truncate text-[10px] capitalize">
                {user?.plan ?? "free"} plan
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="bg-primary/10 text-primary hover:bg-primary/20 mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors"
            title="Sign out"
          >
            {initials}
          </button>
        )}
      </div>
    </aside>
  );
}
