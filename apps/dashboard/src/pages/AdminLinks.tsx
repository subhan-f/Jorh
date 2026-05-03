import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ExternalLink, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, Badge, Spinner } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Link } from "@jorh/types";

const REDIRECT_BASE = import.meta.env.VITE_REDIRECT_BASE ?? "https://go.jorh.net";

function truncateUrl(url: string, max = 55): string {
  try {
    const u = new URL(url);
    const display = u.hostname + u.pathname;
    return display.length > max ? display.slice(0, max) + "…" : display;
  } catch {
    return url.length > max ? url.slice(0, max) + "…" : url;
  }
}

function AdminLinkRow({
  link,
  onToggle,
  onDelete,
}: {
  link: Link;
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border-border flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
      {/* Status dot */}
      <div
        className={`h-2 w-2 shrink-0 rounded-full ${link.isActive ? "bg-green-500" : "bg-muted-foreground"}`}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">/{link.shortCode}</span>
          {link.title && (
            <span className="text-muted-foreground hidden text-xs sm:inline">— {link.title}</span>
          )}
        </div>
        <p className="text-muted-foreground truncate text-xs">{truncateUrl(link.originalUrl)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-muted-foreground text-xs">{(link.clickCount ?? 0).toLocaleString()} clicks</span>
        <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
          {link.type ?? "short"}
        </Badge>

        {/* Actions */}
        <a
          href={`${REDIRECT_BASE}/${link.shortCode}`}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Open short link"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <button
          onClick={() => onToggle(link.id, !link.isActive)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={link.isActive ? "Deactivate" : "Activate"}
        >
          {link.isActive ? (
            <ToggleRight className="h-4 w-4 text-green-500" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={() => onDelete(link.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Delete link"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminLinksPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-links"],
    queryFn: () => api.get<Link[]>("/admin/links?limit=100").then((r) => r.data ?? []),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/links/${id}/status`, { isActive }),
    onSuccess: () => {
      toast.success("Link updated");
      qc.invalidateQueries({ queryKey: ["admin-links"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => toast.error("Failed to update link"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/links/${id}`),
    onSuccess: () => {
      toast.success("Link deleted");
      setConfirming(null);
      qc.invalidateQueries({ queryKey: ["admin-links"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => toast.error("Failed to delete link"),
  });

  const handleToggle = (id: string, isActive: boolean) => {
    toggleMutation.mutate({ id, isActive });
  };

  const handleDelete = (id: string) => {
    if (confirming === id) {
      deleteMutation.mutate(id);
    } else {
      setConfirming(id);
      setTimeout(() => setConfirming(null), 3000);
    }
  };

  const filtered = (data ?? []).filter((l) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      l.shortCode?.toLowerCase().includes(term) ||
      l.originalUrl?.toLowerCase().includes(term) ||
      l.title?.toLowerCase().includes(term)
    );
  });

  const activeCount = filtered.filter((l) => l.isActive).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Links Management" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Search bar */}
          <Card>
            <CardContent className="p-3">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                <input
                  className="border-border bg-background h-9 w-full rounded-lg border pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Search by short code, URL or title…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {filtered.length} link{filtered.length !== 1 ? "s" : ""} — {activeCount} active
            </p>
            {confirming && (
              <p className="text-destructive text-xs">Click delete again to confirm.</p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : !filtered.length ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              <p className="text-sm font-medium">No links found</p>
              <p className="text-muted-foreground mt-1 text-xs">Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((link) => (
                <AdminLinkRow
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
