import { useQuery } from "@tanstack/react-query";
import { jorh } from "~/lib/api-client";

function useHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: () => jorh.client.health(),
    refetchInterval: 30_000,
    retry: 1,
  });
}

export function ApiStatus() {
  const { data: online, isLoading } = useHealth();

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-hover">
      <span
        className={[
          "h-2 w-2 rounded-full flex-shrink-0",
          isLoading
            ? "bg-slate-500 animate-pulse"
            : online
              ? "bg-emerald-400"
              : "bg-red-400",
        ].join(" ")}
      />
      <span className="text-xs text-slate-400">
        {isLoading ? "Checking…" : online ? "API operational" : "API offline"}
      </span>
    </div>
  );
}
