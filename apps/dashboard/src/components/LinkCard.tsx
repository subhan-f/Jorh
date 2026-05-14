import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, Trash2, Calendar, Pencil, Power } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import { useToast } from "@repo/ui/components/toast";
import type { Link } from "@repo/api-client";
import { ApiError } from "@repo/api-client";
import { jorh } from "../lib/api";
import CopyButton from "./CopyButton";
import EditLinkDialog from "./EditLinkDialog";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface LinkCardProps {
  link: Link;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function LinkCard({ link }: LinkCardProps) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleting, setDeleting] = React.useState(false);
  const [toggling, setToggling] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const shortUrl = `${BASE_URL}/${link.slug}`;
  const displayTitle = link.title ?? link.slug;
  const createdAt = new Date(link.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete link "${displayTitle}"?`)) return;
    setDeleting(true);
    try {
      await jorh.links.delete(link.slug);
      await qc.invalidateQueries({ queryKey: ["links"] });
      toast("Link deleted.", "success");
    } catch (err) {
      if (err instanceof ApiError) {
        toast(err.message, "error");
      } else {
        toast("Failed to delete link.", "error");
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setToggling(true);
    try {
      await jorh.links.update(link.slug, { isActive: !link.isActive });
      await qc.invalidateQueries({ queryKey: ["links"] });
    } catch (err) {
      if (err instanceof ApiError) {
        toast(err.message, "error");
      } else {
        toast("Failed to update link.", "error");
      }
    } finally {
      setToggling(false);
    }
  }

  function handleCardClick() {
    void navigate({ to: "/links/$slug", params: { slug: link.slug } });
  }

  return (
    <>
      <Card
        className="cursor-pointer border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-150"
        onClick={handleCardClick}
      >
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-900 text-sm">
                  {displayTitle}
                </span>
                {link.isActive === false && (
                  <Badge variant="warning" size="sm">
                    Inactive
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {shortUrl}
                </a>
                <ExternalLink className="h-3 w-3 text-indigo-400" />
              </div>

              <p className="text-xs text-slate-400 truncate">
                {truncate(link.originalUrl, 80)}
              </p>

              {link.tags && link.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {link.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div
              className="flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <CopyButton text={shortUrl} label="URL" />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                }}
                title="Edit link"
                className="text-slate-400 hover:text-indigo-500"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                disabled={toggling}
                title={link.isActive === false ? "Activate link" : "Deactivate link"}
                className={
                  link.isActive === false
                    ? "text-slate-300 hover:text-emerald-500"
                    : "text-slate-400 hover:text-amber-500"
                }
              >
                <Power className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete link"
                className="text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{createdAt}</span>
          </div>
        </CardContent>
      </Card>

      <EditLinkDialog
        link={link}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
