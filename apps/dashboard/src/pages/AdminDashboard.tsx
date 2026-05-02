import { useQuery } from "@tanstack/react-query";
import { Shield, Users, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@jorh/types";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<User[]>("/auth/admin/users").then((res) => res.data ?? []),
  });

  const totalUsers = users?.length ?? 0;
  const admins = users?.filter((u) => u.role === "admin").length ?? 0;
  const proUsers =
    users?.filter((u) => u.plan === "pro" || u.plan === "business" || u.plan === "enterprise")
      .length ?? 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Admin Dashboard" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Welcome, {user?.displayName ?? "Admin"}</h2>
            <p className="text-muted-foreground text-sm">
              Organization-level controls and account metrics are available here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Admin Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{admins}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  Paid Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{proUsers}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
