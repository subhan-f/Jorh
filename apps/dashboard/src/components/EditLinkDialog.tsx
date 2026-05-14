import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/components/toast";
import type { Link } from "@repo/api-client";
import { ApiError } from "@repo/api-client";
import { jorh } from "../lib/api";

interface EditLinkDialogProps {
  link: Link;
  open: boolean;
  onClose: () => void;
}

export default function EditLinkDialog({ link, open, onClose }: EditLinkDialogProps) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [originalUrl, setOriginalUrl] = React.useState(link.originalUrl);
  const [slug, setSlug] = React.useState(link.slug);
  const [title, setTitle] = React.useState(link.title ?? "");
  const [expiresAt, setExpiresAt] = React.useState(
    link.expiresAt ? link.expiresAt.slice(0, 10) : ""
  );
  const [tags, setTags] = React.useState<string[]>(link.tags ?? []);
  const [tagInput, setTagInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setOriginalUrl(link.originalUrl);
      setSlug(link.slug);
      setTitle(link.title ?? "");
      setExpiresAt(link.expiresAt ? link.expiresAt.slice(0, 10) : "");
      setTags(link.tags ?? []);
      setTagInput("");
      setError(null);
    }
  }, [open, link]);

  function addTag(val: string) {
    const trimmed = val.trim().replace(/,+$/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tagInput.trim()) addTag(tagInput);
    setError(null);

    const newSlug = slug.trim();
    const slugChanged = newSlug !== link.slug;
    if (
      slugChanged &&
      !confirm(
        `Changing the slug will make the old URL (/${link.slug}) stop working. Continue?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const updated = await jorh.links.update(link.slug, {
        originalUrl: originalUrl.trim(),
        slug: newSlug || undefined,
        title: title.trim() || undefined,
        tags,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });

      await qc.invalidateQueries({ queryKey: ["links"] });
      await qc.invalidateQueries({ queryKey: ["link", link.slug] });

      toast("Link updated!", "success");
      onClose();

      if (slugChanged && updated.result?.slug) {
        void navigate({ to: "/links/$slug", params: { slug: updated.result.slug } });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>
            Update the destination URL, slug, title, tags, or expiry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-originalUrl">Destination URL *</Label>
            <Input
              id="edit-originalUrl"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-slug">Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">jorh.io/</span>
              <Input
                id="edit-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Title (optional)</Label>
            <Input
              id="edit-title"
              placeholder="My awesome link"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tags (optional)</Label>
            <div className="flex flex-wrap gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-indigo-400 hover:text-indigo-700 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput.trim() && addTag(tagInput)}
                placeholder={tags.length === 0 ? "Add tags — Enter or comma" : ""}
                className="min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-expiresAt">Expiry date (optional)</Label>
            <Input
              id="edit-expiresAt"
              type="date"
              value={expiresAt}
              min={minDate}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            {expiresAt && (
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-rose-500 underline"
                onClick={() => setExpiresAt("")}
              >
                Remove expiry
              </button>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !originalUrl}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
