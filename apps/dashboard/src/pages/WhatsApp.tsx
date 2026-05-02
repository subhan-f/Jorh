import { useState } from "react";
import { Button, CopyButton } from "@jorh/ui";
import { Header } from "@/components/layout/Header";
import { buildWhatsAppLink } from "@jorh/utils";
import { toast } from "sonner";

export default function WhatsAppPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const generate = () => {
    if (!phone.trim()) { toast.error("Enter a phone number"); return; }
    setResult(buildWhatsAppLink(phone.trim(), message.trim() || undefined));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="WhatsApp Links" description="Create click-to-chat links with pre-filled messages" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-md space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Phone number (with country code)</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Pre-filled message (optional)</label>
            <textarea
              rows={3}
              placeholder="Hi! I'd like to inquire about..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90" onClick={generate}>
            Generate WhatsApp Link
          </Button>

          {result && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Your link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all text-sm">{result}</code>
                <CopyButton value={result} size="sm" />
              </div>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs text-[#25D366] hover:underline"
              >
                Test link →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
