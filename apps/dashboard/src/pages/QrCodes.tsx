import { useState } from "react";
import { Button } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export default function QrCodesPage() {
  const [url, setUrl] = useState("");
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#FFFFFF");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!url.trim()) return;
    try { new URL(url); } catch { toast.error("Enter a valid URL"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/qr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: "dataurl", darkColor, lightColor, width: 400 }),
      });
      const json = await res.json() as { data?: { data: string } };
      if (!json.data?.data) throw new Error();
      setDataUrl(json.data.data);
    } catch {
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="QR Codes" description="Generate QR codes for any URL" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-md space-y-4">
          <input
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Dark color</label>
              <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-border" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Light color</label>
              <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-border" />
            </div>
          </div>

          <Button className="w-full" onClick={generate} loading={loading}>
            Generate QR Code
          </Button>

          {dataUrl && (
            <div className="mt-4 flex flex-col items-center gap-4">
              <img src={dataUrl} alt="QR Code" className="rounded-xl border border-border" />
              <a
                href={dataUrl}
                download="jorh-qr.png"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Download PNG
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
