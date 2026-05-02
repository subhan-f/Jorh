import { Header } from "@/components/layout/Header";
import { BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header title="Analytics" description="Click data across all your links" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <BarChart2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Analytics coming soon</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Per-link analytics are available from each link card. A unified analytics dashboard is on the roadmap.
        </p>
      </div>
    </div>
  );
}
