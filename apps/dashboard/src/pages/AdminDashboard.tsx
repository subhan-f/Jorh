import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Link2,
  MousePointerClick,
  TrendingUp,
  UserPlus,
  Crown,
  Activity,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  paidUsers: number;
  totalLinks: number;
  activeLinks: number;
  linksCreatedToday: number;
  linksCreatedThisWeek: number;
  totalClicks: number;
  planBreakdown: { free: number; pro: number; business: number; enterprise: number };
  topLinks: Array<{
    rank: number;
    id: string;
    shortCode: string;
    originalUrl: string;
    title?: string;
    clickCount: number;
    ownerId: string;
  }>;
}

const PLAN_COLORS: Record<string, string> = {
  free: "secondary",
  pro: "default",
  business: "default",
  enterprise: "default",
};

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get<AdminStats>("/admin/stats").then((r) => r.data),
    refetchInterval: 60_000,
  });

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      sub: `+${stats?.newUsersToday ?? 0} today`,
    },
    {
      icon: Crown,
      label: "Paid Plans",
      value: stats?.paidUsers ?? 0,
      sub: `${stats ? Math.round((stats.paidUsers / Math.max(stats.totalUsers, 1)) * 100) : 0}% conversion`,
    },
    {
      icon: Link2,
      label: "Total Links",
      value: stats?.totalLinks ?? 0,
      sub: `+${stats?.linksCreatedToday ?? 0} today`,
    },
    {
      icon: MousePointerClick,
      label: "Total Clicks",
      value: (stats?.totalClicks ?? 0).toLocaleString(),
      sub: `${stats?.activeLinks ?? 0} active links`,
    },
    {
      icon: TrendingUp,
      label: "This Week",
      value: stats?.linksCreatedThisWeek ?? 0,
      sub: "links created",
    },
    {
      icon: Activity,
      label: "Active Links",
      value: stats?.activeLinks ?? 0,
      sub: `of ${stats?.totalLinks ?? 0} total`,
    },
  ];

  const planEntries = stats
    ? (["free", "pro", "business", "enterprise"] as const).map((p) => ({
        plan: p,
        count: stats.planBreakdown[p],
        pct: Math.round((stats.planBreakdown[p] / Math.max(stats.totalUsers, 1)) * 100),
      }))
    : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Admin Dashboard" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Welcome, {user?.displayName?.split(" ")[0] ?? "Admin"}
              </h2>
              <p className="text-muted-foreground text-sm">Platform overview — refreshes every minute.</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/admin/users"
                className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Manage Users
              </Link>
              <Link
                to="/admin/links"
                className="border-border bg-card inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                <Link2 className="h-3.5 w-3.5" />
                Manage Links
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {statCards.map(({ icon: Icon, label, value, sub }) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4" />
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{isLoading ? "—" : value}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Plan breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Plan Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {planEntries.map(({ plan, count, pct }) => (
                  <div key={plan} className="flex items-center gap-3">
                    <Badge variant={PLAN_COLORS[plan] as "default" | "secondary"} className="w-20 justify-center capitalize">
                      {plan}
                    </Badge>
                    <div className="flex-1">
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-muted-foreground w-16 text-right text-xs">
                      {count} ({pct}%)
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top 10 links */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Top Links by Clicks</CardTitle>
                  <Link
                    to="/admin/links"
                    className="text-primary text-xs underline-offset-4 hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground text-xs">Loading…</p>
                ) : !stats?.topLinks.length ? (
                  <p className="text-muted-foreground text-xs">No links yet.</p>
                ) : (
                  <ol className="space-y-2">
                    {stats.topLinks.slice(0, 7).map((link) => (
                      <li key={link.id} className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-4 shrink-0 text-right font-mono">
                          {link.rank}
                        </span>
                        <span className="text-muted-foreground min-w-0 flex-1 truncate font-mono">
                          /{link.shortCode}
                        </span>
                        <span className="shrink-0 font-semibold">
                          {(link.clickCount ?? 0).toLocaleString()}
                        </span>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
