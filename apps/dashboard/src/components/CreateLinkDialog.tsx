import React from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { jorh } from "../lib/api";
import { ApiError } from "@repo/api-client";

interface CreateLinkDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateLinkDialog({ open, onClose }: CreateLinkDialogProps) {
  const qc = useQueryClient();
  const { toast } = useToast();

  const [originalUrl, setOriginalUrl] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  function resetForm() {
    setOriginalUrl("");
    setSlug("");
    setTitle("");
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await jorh.links.create({
        originalUrl,
        slug: slug.trim() || undefined,
        title: title.trim() || undefined,
      });
      await qc.invalidateQueries({ queryKey: ["links"] });
      toast("Link created successfully!", "success");
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new link</DialogTitle>
          <DialogDescription>
            Shorten a URL and optionally set a custom slug.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="originalUrl">Destination URL *</Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Custom slug (optional)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">jorh.io/</span>
              <Input
                id="slug"
                placeholder="my-link"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="My awesome link"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !originalUrl}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Creating..." : "Create link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
