import { Link, useRouterState } from "@tanstack/react-router";
import { Link2, BarChart2, Settings, LogOut } from "lucide-react";
import { Avatar } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { getStoredUser, clearAuth } from "../lib/auth";
import { router } from "../router";

const navItems = [
  { to: "/links", label: "Links", icon: BarChart2 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar() {
  const user = getStoredUser();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  function handleLogout() {
    clearAuth();
    router.update({ context: { isAuthed: false } });
    void router.invalidate().then(() => router.navigate({ to: "/login" }));
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <Link2 className="h-5 w-5 text-indigo-600" />
        <span className="text-lg font-bold text-indigo-600">Jorh</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/links"
              ? currentPath === "/links" || currentPath.startsWith("/links/")
              : currentPath.startsWith(to);

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          {user && <Avatar name={user.name} size="sm" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user?.email ?? ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="h-7 w-7 text-slate-400 hover:text-rose-500"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
