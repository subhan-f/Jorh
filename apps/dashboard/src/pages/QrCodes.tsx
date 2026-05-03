import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Trash2, MousePointerClick, ExternalLink, QrCode } from "lucide-react";
import { Button, Card, CardContent, Spinner } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Link } from "@jorh/types";

interface QrCreateResult {
  link: Link;
  qrDataUrl: string;
}

const REDIRECT_BASE = import.meta.env.VITE_REDIRECT_BASE ?? "https://go.jorh.net";

function QrCard({
  link,
  onDelete,
}: {
  link: Link;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const qrUrl = `${REDIRECT_BASE}/${link.shortCode}`;

  // Re-generate a preview QR from the API for display in the list
  const { data: qrData } = useQuery({
    queryKey: ["qr-preview", link.shortCode],
    queryFn: () =>
      api
        .post<{ format: string; data: string }>("/qr/generate", {
          url: qrUrl,
          format: "dataurl",
          width: 200,
        })
        .then((r) => r.data?.data ?? null),
    staleTime: Infinity,
  });

  const handleDelete = () => {
    if (confirming) {
      onDelete(link.id);
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* QR thumbnail */}
          <div className="bg-muted flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-border overflow-hidden">
            {qrData ? (
              <img src={qrData} alt="QR" className="h-full w-full object-contain" />
            ) : (
              <QrCode className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {link.title ?? link.shortCode}
                </p>
                <p className="text-muted-foreground mt-0.5 truncate text-xs">{link.originalUrl}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <MousePointerClick className="h-3 w-3" />
                    {link.clickCount.toLocaleString()} scans
                  </span>
                  <span
                    className={`inline-flex h-1.5 w-1.5 rounded-full ${link.isActive ? "bg-green-500" : "bg-muted-foreground"}`}
                  />
                  <span className="text-muted-foreground text-xs">
                    {link.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <a
                  href={qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                  title="Test link"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {qrData && (
                  <a
                    href={qrData}
                    download={`jorh-qr-${link.shortCode}.png`}
                    className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                    title="Download PNG"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={handleDelete}
                  className={`rounded-md p-1.5 transition-colors ${
                    confirming
                      ? "text-destructive"
                      : "text-muted-foreground hover:text-destructive"
                  }`}
                  title={confirming ? "Click again to confirm" : "Delete"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateForm({ onCreated }: { onCreated: (result: QrCreateResult) => void }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#FFFFFF");

  const createMutation = useMutation({
    mutationFn: (body: object) =>
      api.post<QrCreateResult>("/qr/create", body).then((r) => {
        if (r.error) throw new Error(r.error.message);
        return r.data!;
      }),
    onSuccess: (result) => {
      toast.success("QR code created and saved!");
      onCreated(result);
      setUrl("");
      setTitle("");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create QR code"),
  });

  const handleCreate = () => {
    if (!url.trim()) return;
    try {
      new URL(url);
    } catch {
      toast.error("Enter a valid URL");
      return;
    }
    createMutation.mutate({ url: url.trim(), title: title.trim() || undefined, darkColor, lightColor });
  };

  return (
    <div className="space-y-4">
      <input
        className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
      />
      <input
        className="flex h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Dark color</label>
          <input
            type="color"
            value={darkColor}
            onChange={(e) => setDarkColor(e.target.value)}
            className="h-9 w-full cursor-pointer rounded-md border border-border"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Light color</label>
          <input
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            className="h-9 w-full cursor-pointer rounded-md border border-border"
          />
        </div>
      </div>
      <Button className="w-full" onClick={handleCreate} loading={createMutation.isPending}>
        Generate &amp; Save
      </Button>
    </div>
  );
}

export default function QrCodesPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [preview, setPreview] = useState<QrCreateResult | null>(null);

  const { data: qrLinks, isLoading } = useQuery({
    queryKey: ["links", "qr"],
    queryFn: () =>
      api.get<Link[]>("/links?type=qr").then((r) => r.data ?? []),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/links/${id}`),
    onSuccess: () => {
      toast.success("QR code deleted");
      qc.invalidateQueries({ queryKey: ["links", "qr"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleCreated = (result: QrCreateResult) => {
    setPreview(result);
    setShowCreate(false);
    qc.invalidateQueries({ queryKey: ["links", "qr"] });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="QR Codes" description="Generate trackable QR codes for any URL" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {/* Latest QR preview (after creation) */}
          {preview && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <img
                    src={preview.qrDataUrl}
                    alt="QR Code"
                    className="h-40 w-40 rounded-xl border border-border object-contain"
                  />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="font-semibold">
                      {preview.link.title ?? preview.link.shortCode}
                    </p>
                    <p className="text-muted-foreground text-xs">{preview.link.originalUrl}</p>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      <a
                        href={preview.qrDataUrl}
                        download={`jorh-qr-${preview.link.shortCode}.png`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download PNG
                      </a>
                      <button
                        onClick={() => setPreview(null)}
                        className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create toggle */}
          {!showCreate ? (
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New QR Code
            </Button>
          ) : (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Create QR Code</p>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                <CreateForm onCreated={handleCreated} />
              </CardContent>
            </Card>
          )}

          {/* Saved QR list */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : !qrLinks?.length ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
                <QrCode className="text-primary h-7 w-7" />
              </div>
              <h3 className="font-semibold">No QR codes yet</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Generate your first trackable QR code above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs">
                {qrLinks.length} QR code{qrLinks.length !== 1 ? "s" : ""} —{" "}
                {qrLinks.reduce((s, l) => s + l.clickCount, 0).toLocaleString()} total scans
              </p>
              {qrLinks.map((link) => (
                <QrCard
                  key={link.id}
                  link={link}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
