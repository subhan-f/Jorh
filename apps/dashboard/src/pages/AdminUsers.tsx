import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Shield, Crown, Ban, CheckCircle, ChevronDown } from "lucide-react";
import { Card, CardContent, Badge, Button, Spinner } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { User, Plan } from "@jorh/types";

type AdminUser = User & { isSuspended?: boolean };

const PLAN_OPTIONS: Plan[] = ["free", "pro", "business", "enterprise"];

const PLAN_BADGE: Record<Plan, "secondary" | "default"> = {
  free: "secondary",
  pro: "default",
  business: "default",
  enterprise: "default",
};

function UserRow({ user, onUpdate }: { user: AdminUser; onUpdate: (id: string, patch: Partial<AdminUser>) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-border rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
          {user.displayName?.charAt(0).toUpperCase() ?? "?"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{user.displayName}</span>
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                <Shield className="h-2.5 w-2.5" />
                Admin
              </span>
            )}
            {user.isSuspended && (
              <span className="inline-flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                <Ban className="h-2.5 w-2.5" />
                Suspended
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={PLAN_BADGE[user.plan]} className="capitalize">
            {user.plan}
          </Badge>
          <button
            onClick={() => setOpen((v) => !v)}
            className="hover:bg-muted rounded p-1 transition-colors"
            aria-label="Actions"
          >
            <ChevronDown
              className={`text-muted-foreground h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-border mt-3 flex flex-wrap gap-2 border-t pt-3">
          {/* Plan change */}
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">Plan:</span>
            <select
              defaultValue={user.plan}
              className="border-border bg-background rounded border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              onChange={(e) => onUpdate(user.id, { plan: e.target.value as Plan })}
            >
              {PLAN_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Role toggle */}
          <button
            onClick={() =>
              onUpdate(user.id, { role: user.role === "admin" ? "client" : "admin" })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Shield className="h-3.5 w-3.5" />
            {user.role === "admin" ? "Remove admin" : "Make admin"}
          </button>

          {/* Suspend toggle */}
          <button
            onClick={() => onUpdate(user.id, { isSuspended: !user.isSuspended })}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              user.isSuspended
                ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {user.isSuspended ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" /> Unsuspend
              </>
            ) : (
              <>
                <Ban className="h-3.5 w-3.5" /> Suspend
              </>
            )}
          </button>

          <div className="ml-auto text-right">
            <p className="text-muted-foreground text-[10px]">
              Joined{" "}
              {user.createdAt
                ? new Date(
                    typeof (user.createdAt as unknown as { toDate?: () => Date }).toDate ===
                    "function"
                      ? (user.createdAt as unknown as { toDate: () => Date }).toDate()
                      : user.createdAt
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<Plan | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", planFilter],
    queryFn: () => {
      const params = new URLSearchParams({ limit: "100" });
      if (planFilter !== "all") params.set("plan", planFilter);
      return api.get<AdminUser[]>(`/admin/users?${params}`).then((r) => r.data ?? []);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AdminUser> }) =>
      api.patch(`/admin/users/${id}`, patch),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => toast.error("Failed to update user"),
  });

  const handleUpdate = (id: string, patch: Partial<AdminUser>) => {
    updateMutation.mutate({ id, patch });
  };

  const filtered = (data ?? []).filter((u) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return u.email?.toLowerCase().includes(term) || u.displayName?.toLowerCase().includes(term);
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="User Management" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-48">
                  <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                  <input
                    className="border-border bg-background h-9 w-full rounded-lg border pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1">
                  {(["all", ...PLAN_OPTIONS] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlanFilter(p)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                        planFilter === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            </p>
            {updateMutation.isPending && (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Spinner className="h-3 w-3" /> Saving…
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : !filtered.length ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              <Crown className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
              <p className="text-sm font-medium">No users found</p>
              <p className="text-muted-foreground mt-1 text-xs">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((user) => (
                <UserRow key={user.id} user={user} onUpdate={handleUpdate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
