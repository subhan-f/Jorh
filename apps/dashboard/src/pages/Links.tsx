import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button, Spinner } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { LinkCard } from "@/components/links/LinkCard";
import { api } from "@/lib/api";
import type { Link } from "@jorh/types";
import { toast } from "sonner";

export default function LinksPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["links"],
    queryFn: () => api.get<Link[]>("/links").then((r) => r.data ?? []),
  });

  const createMutation = useMutation({
    mutationFn: (input: { originalUrl: string; customSlug?: string }) =>
      api.post<Link>("/links", input),
    onSuccess: (res) => {
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      toast.success("Link created!");
      setUrl("");
      setSlug("");
      setShowCreate(false);
      qc.invalidateQueries({ queryKey: ["links"] });
    },
    onError: () => toast.error("Failed to create link"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/links/${id}`),
    onSuccess: () => {
      toast.success("Link deleted");
      qc.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const handleCreate = () => {
    if (!url.trim()) return;
    createMutation.mutate({ originalUrl: url.trim(), customSlug: slug.trim() || undefined });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Links" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Create bar */}
          {!showCreate ? (
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New link
            </Button>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex gap-2">
                <input
                  className="flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="https://example.com/long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  autoFocus
                />
                <input
                  className="flex h-9 w-36 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="custom-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <Button onClick={handleCreate} loading={createMutation.isPending}>
                  Create
                </Button>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Links list */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : !data?.length ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No links yet. Create your first one above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((link) => (
                <LinkCard key={link.id} link={link} onDelete={(id) => deleteMutation.mutate(id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
