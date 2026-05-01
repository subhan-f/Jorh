import { useQuery } from "@tanstack/react-query";
import { Link2, MousePointerClick, QrCode, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { LinkCard } from "@/components/links/LinkCard";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { Link } from "@jorh/types";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: links } = useQuery({
    queryKey: ["links"],
    queryFn: () => api.get<Link[]>("/links").then((r) => r.data ?? []),
  });

  const totalClicks = links?.reduce((sum, l) => sum + l.clickCount, 0) ?? 0;

  const stats = [
    { icon: Link2, label: "Total Links", value: links?.length ?? 0 },
    { icon: MousePointerClick, label: "Total Clicks", value: totalClicks.toLocaleString() },
    { icon: QrCode, label: "QR Codes", value: links?.filter((l) => l.type === "qr").length ?? 0 },
    { icon: TrendingUp, label: "Active Links", value: links?.filter((l) => l.isActive).length ?? 0 },
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
            <p className="text-sm text-muted-foreground">
              Here's what's happening with your links today.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
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

          {links && links.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Recent Links
              </h3>
              <div className="space-y-2">
                {links.slice(0, 5).map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
