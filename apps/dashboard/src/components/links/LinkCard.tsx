import { ExternalLink, BarChart2, Trash2 } from "lucide-react";
import { Badge, CopyButton } from "@jorh/ui";
import type { Link } from "@jorh/types";
import { truncateUrl, getDomain } from "@jorh/utils";

interface LinkCardProps {
  link: Link;
  onDelete?: (id: string) => void;
}

const SHORT_BASE = import.meta.env.VITE_REDIRECT_BASE ?? "https://jorh.net";

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const shortUrl = `${SHORT_BASE}/${link.customSlug ?? link.shortCode}`;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 hover:shadow-sm transition-shadow">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm">
        {getDomain(link.originalUrl)?.[0]?.toUpperCase() ?? "?"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {link.title ?? truncateUrl(link.originalUrl, 40)}
          </span>
          {!link.isActive && <Badge variant="secondary">Inactive</Badge>}
          {link.password && <Badge variant="outline">🔒</Badge>}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            {shortUrl.replace("https://", "")}
          </a>
          <CopyButton value={shortUrl} size="sm" />
          <span className="text-muted-foreground">·</span>
          <span className="truncate text-xs text-muted-foreground">
            {truncateUrl(link.originalUrl, 40)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <BarChart2 className="h-3.5 w-3.5" />
        <span>{link.clickCount.toLocaleString()}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href={link.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        {onDelete && (
          <button
            onClick={() => onDelete(link.id)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
