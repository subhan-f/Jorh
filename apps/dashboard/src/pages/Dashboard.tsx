import { useQuery } from "@tanstack/react-query";
import { Link2, MousePointerClick, QrCode, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { LinkCard } from "@/components/links/LinkCard";
import { api } from "@/lib/api";
import { withRolePath } from "@/lib/routing";
import { useAuthStore } from "@/store/auth.store";
import type { Link as LinkType } from "@jorh/types";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "client";
  const { data: links } = useQuery({
    queryKey: ["links"],
    queryFn: () => api.get<LinkType[]>("/links").then((r) => r.data ?? []),
  });

  const totalClicks = links?.reduce((sum, l) => sum + l.clickCount, 0) ?? 0;

  const stats = [
    { icon: Link2, label: "Total Links", value: links?.length ?? 0 },
    { icon: MousePointerClick, label: "Total Clicks", value: totalClicks.toLocaleString() },
    { icon: QrCode, label: "QR Codes", value: links?.filter((l) => l.type === "qr").length ?? 0 },
    {
      icon: TrendingUp,
      label: "Active Links",
      value: links?.filter((l) => l.isActive).length ?? 0,
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Welcome back, {user?.displayName?.split(" ")[0] ?? "there"} 👋
            </h2>
            <p className="text-muted-foreground text-sm">
              Here's what's happening with your links today.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4" />
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {links && links.length > 0 ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                  Recent Links
                </h3>
                <Link
                  to={withRolePath(role, "/links")}
                  className="text-primary text-xs underline-offset-4 hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-2">
                {links.slice(0, 5).map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          ) : (
            <div className="border-border bg-muted/30 rounded-2xl border border-dashed px-6 py-14 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
                <Link2 className="text-primary h-7 w-7" />
              </div>
              <h3 className="font-semibold">Create your first link</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Shorten a URL, add a custom slug, and start tracking clicks.
              </p>
              <Link
                to={withRolePath(role, "/links")}
                className="bg-primary text-primary-foreground mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              >
                Create a link
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
