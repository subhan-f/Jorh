import React, { useState } from "react";
import { Link2, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createShortUrl } from "@/api/shortUrl.api";

function ShortUrlForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleShorten(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = await createShortUrl(url);

      if (!data.success) {
        setError(data.message || "Something went wrong");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Failed to reach the server");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-full">
          <Link2 className="text-primary size-5" />
        </div>
        <CardTitle className="text-2xl">URL Shortener</CardTitle>
        <CardDescription>Paste a long URL and get a short link instantly</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleShorten} className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Shorten"}
          </Button>
        </form>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {result && (
          <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Badge variant="secondary" className="shrink-0">
                Short URL
              </Badge>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary truncate text-sm hover:underline"
              >
                {result.shortUrl}
              </a>
            </div>
            <Button size="icon" variant="ghost" onClick={handleCopy} className="ml-2 shrink-0">
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShortUrlForm;
