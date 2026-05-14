import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Link2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import Header from "../components/Header";
import LinkCard from "../components/LinkCard";
import CreateLinkDialog from "../components/CreateLinkDialog";
import { jorh } from "../lib/api";

export default function Dashboard() {
  const [showCreate, setShowCreate] = React.useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["links"],
    queryFn: () => jorh.links.list(),
  });

  const links = data?.result ?? [];

  return (
    <div>
      <Header
        title="My Links"
        action={
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Link
          </Button>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error instanceof Error ? error.message : "Failed to load links."}
        </div>
      )}

      {!isLoading && !isError && links.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <Link2 className="mb-4 h-10 w-10 text-slate-300" />
          <h3 className="mb-1 text-base font-medium text-slate-700">
            No links yet
          </h3>
          <p className="mb-6 text-sm text-slate-400">
            Create your first short link to get started.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Create your first link
          </Button>
        </div>
      )}

      {!isLoading && !isError && links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <LinkCard key={link._id} link={link} />
          ))}
        </div>
      )}

      <CreateLinkDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
