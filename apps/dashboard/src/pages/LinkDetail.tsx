import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@repo/ui/components/table";
import { jorh } from "../lib/api";
import CopyButton from "../components/CopyButton";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-2xl font-bold text-indigo-600">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function truncate(str: string | undefined, max: number) {
  if (!str) return "—";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function LinkDetail() {
  const { slug } = useParams({ from: "/_auth/links/$slug" });

  const { data: linkData, isLoading: linkLoading } = useQuery({
    queryKey: ["link", slug],
    queryFn: () => jorh.links.get(slug),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["analytics", slug],
    queryFn: () => jorh.analytics.getLinkStats(slug),
  });

  const { data: clickData, isLoading: clicksLoading } = useQuery({
    queryKey: ["clicks", slug],
    queryFn: () => jorh.analytics.getClickHistory(slug),
  });

  const link = linkData?.result;
  const stats = statsData?.result;
  const clicks = clickData?.result ?? [];
  const shortUrl = `${BASE_URL}/${slug}`;

  return (
    <div>
      {/* Back */}
      <Link
        to="/links"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to links
      </Link>

      {/* Header */}
      <div className="mb-6">
        {linkLoading ? (
          <Skeleton className="h-7 w-48 mb-2" />
        ) : (
          <h1 className="text-xl font-semibold text-slate-900">
            {link?.title ?? link?.slug ?? slug}
          </h1>
        )}
      </div>

      {/* Link info card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Link details</CardTitle>
        </CardHeader>
        <CardContent>
          {linkLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : link ? (
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <dt className="w-28 shrink-0 font-medium text-slate-500">
                  Short URL
                </dt>
                <dd className="flex items-center gap-2 text-indigo-600">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {shortUrl}
                  </a>
                  <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                  <CopyButton text={shortUrl} label="URL" />
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="w-28 shrink-0 font-medium text-slate-500">
                  Destination
                </dt>
                <dd className="text-slate-700 break-all">{link.originalUrl}</dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="w-28 shrink-0 font-medium text-slate-500">
                  Status
                </dt>
                <dd>
                  {link.isActive === false ? (
                    <Badge variant="warning" size="sm">
                      Inactive
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  )}
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="w-28 shrink-0 font-medium text-slate-500">
                  Created
                </dt>
                <dd className="text-slate-700">
                  {new Date(link.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
              {link.expiresAt && (
                <div className="flex items-start gap-3">
                  <dt className="w-28 shrink-0 font-medium text-slate-500">
                    Expires
                  </dt>
                  <dd className="text-slate-700">
                    {new Date(link.expiresAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                    })}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-slate-400">Link not found.</p>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <h2 className="text-base font-semibold text-slate-900 mb-3">Analytics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : stats ? (
          <>
            <StatCard label="Total Clicks" value={stats.totalClicks} />
            <StatCard label="Unique Clicks" value={stats.uniqueClicks} />
            <StatCard
              label="Last Click"
              value={
                stats.lastClickAt
                  ? new Date(stats.lastClickAt).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })
                  : "No clicks yet"
              }
            />
          </>
        ) : (
          <>
            <StatCard label="Total Clicks" value={0} />
            <StatCard label="Unique Clicks" value={0} />
            <StatCard label="Last Click" value="No clicks yet" />
          </>
        )}
      </div>

      {/* Click history */}
      <h2 className="text-base font-semibold text-slate-900 mb-3">
        Click history
      </h2>
      {clicksLoading ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : clicks.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          No click history yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>User Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clicks.map((click) => (
              <TableRow key={click._id}>
                <TableCell className="whitespace-nowrap text-slate-700">
                  {new Date(click.createdAt).toLocaleString("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-slate-500">
                  {truncate(click.referrer, 50)}
                </TableCell>
                <TableCell className="text-slate-400 text-xs">
                  {truncate(click.userAgent, 60)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
