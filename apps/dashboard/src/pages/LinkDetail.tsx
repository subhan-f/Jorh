import React from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@repo/ui/components/table";
import type { Click } from "@repo/api-client";
import { jorh } from "../lib/api";
import CopyButton from "../components/CopyButton";
import EditLinkDialog from "../components/EditLinkDialog";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const CLICKS_LIMIT = 20;

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
  const qc = useQueryClient();

  const [toggling, setToggling] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const [editingExpiry, setEditingExpiry] = React.useState(false);
  const [newExpiresAt, setNewExpiresAt] = React.useState("");
  const [savingExpiry, setSavingExpiry] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [allClicks, setAllClicks] = React.useState<Click[]>([]);
  const [total, setTotal] = React.useState(0);

  const { data: linkData, isLoading: linkLoading } = useQuery({
    queryKey: ["link", slug],
    queryFn: () => jorh.links.get(slug),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["analytics", slug],
    queryFn: () => jorh.analytics.getLinkStats(slug),
  });

  const { data: clickData, isLoading: clicksLoading, isFetching: clicksFetching } = useQuery({
    queryKey: ["clicks", slug, page],
    queryFn: () => jorh.analytics.getClickHistory(slug, { page, limit: CLICKS_LIMIT }),
  });

  React.useEffect(() => {
    if (!clickData) return;
    if (page === 1) {
      setAllClicks(clickData.result ?? []);
    } else {
      setAllClicks((prev) => [...prev, ...(clickData.result ?? [])]);
    }
    setTotal(clickData.total ?? 0);
  }, [clickData, page]);

  const link = linkData?.result;
  const stats = statsData?.result;
  const shortUrl = `${BASE_URL}/${slug}`;

  async function handleToggle() {
    if (!link) return;
    setToggling(true);
    try {
      await jorh.links.update(slug, { isActive: !link.isActive });
      await qc.invalidateQueries({ queryKey: ["link", slug] });
      await qc.invalidateQueries({ queryKey: ["links"] });
    } catch {
      // toggle failure is non-critical
    } finally {
      setToggling(false);
    }
  }

  async function handleSaveExpiry() {
    setSavingExpiry(true);
    try {
      await jorh.links.update(slug, {
        expiresAt: newExpiresAt ? new Date(newExpiresAt).toISOString() : null,
      });
      await qc.invalidateQueries({ queryKey: ["link", slug] });
      await qc.invalidateQueries({ queryKey: ["links"] });
      setEditingExpiry(false);
    } catch {
      // expiry save failure is non-critical
    } finally {
      setSavingExpiry(false);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  const dailyClicks = stats?.dailyClicks ?? [];
  const last14 = dailyClicks.slice(-14);
  const maxClickCount = Math.max(...last14.map((d) => d.count), 1);

  const devices = stats?.devices ?? { mobile: 0, desktop: 0, tablet: 0 };
  const totalDevices = devices.mobile + devices.desktop + devices.tablet || 1;
  const pct = (n: number) => Math.round((n / totalDevices) * 100);

  const browsers = Object.entries(stats?.browsers ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div>
      {/* Back + Edit */}
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/links"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to links
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
          disabled={linkLoading || !link}
          className="flex items-center gap-1.5 text-slate-600"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit link
        </Button>
      </div>

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
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-28 sm:shrink-0 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-slate-500">Short URL</dt>
                <dd className="flex flex-wrap items-center gap-2 text-indigo-600 min-w-0">
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

              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-28 sm:shrink-0 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-slate-500">Destination</dt>
                <dd className="text-slate-700 break-all">{link.originalUrl}</dd>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-28 sm:shrink-0 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-slate-500">Status</dt>
                <dd className="flex items-center gap-2">
                  {link.isActive === false ? (
                    <Badge variant="warning" size="sm">Inactive</Badge>
                  ) : (
                    <Badge variant="success" size="sm">Active</Badge>
                  )}
                  <button
                    type="button"
                    onClick={handleToggle}
                    disabled={toggling}
                    className="text-xs text-slate-400 hover:text-slate-700 underline disabled:opacity-50"
                  >
                    {link.isActive === false ? "Activate" : "Deactivate"}
                  </button>
                </dd>
              </div>

              {link.tags && link.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <dt className="w-28 shrink-0 font-medium text-slate-500">Tags</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {link.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-28 sm:shrink-0 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-slate-500">Created</dt>
                <dd className="text-slate-700">
                  {new Date(link.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </dd>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-28 sm:shrink-0 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-slate-500">Expires</dt>
                {editingExpiry ? (
                  <dd className="flex items-center gap-2 flex-wrap">
                    <Input
                      type="date"
                      value={newExpiresAt}
                      min={minDate}
                      onChange={(e) => setNewExpiresAt(e.target.value)}
                      className="h-7 w-36 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveExpiry}
                      disabled={savingExpiry}
                      className="h-7 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3"
                    >
                      {savingExpiry ? "Saving…" : "Save"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditingExpiry(false)}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </dd>
                ) : (
                  <dd className="flex items-center gap-2 text-slate-700">
                    <span>
                      {link.expiresAt
                        ? new Date(link.expiresAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                          })
                        : "No expiry"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewExpiresAt(link.expiresAt?.slice(0, 10) ?? "");
                        setEditingExpiry(true);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-700 underline"
                    >
                      Edit
                    </button>
                  </dd>
                )}
              </div>
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

      {/* Daily clicks bar chart */}
      {!statsLoading && last14.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily clicks (last {last14.length} days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-28 pt-6">
              {last14.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 hidden group-hover:block text-[10px] bg-slate-800 text-white rounded px-1 py-0.5 whitespace-nowrap z-10">
                    {d.date}: {d.count}
                  </span>
                  <div
                    className="w-full bg-indigo-300 hover:bg-indigo-500 rounded-sm transition-colors"
                    style={{
                      height: `${Math.max(4, (d.count / maxClickCount) * 80)}px`,
                    }}
                  />
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referrers + Countries */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Top referrers</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topReferrers.length === 0 ? (
                <p className="text-sm text-slate-400">No referrer data yet.</p>
              ) : (
                <ul className="space-y-2">
                  {stats.topReferrers.slice(0, 5).map((r) => (
                    <li
                      key={r.referrer}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-700 truncate max-w-[200px]">
                        {r.referrer || "Direct"}
                      </span>
                      <span className="text-slate-400 font-medium ml-2 shrink-0">
                        {r.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top countries</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topCountries.length === 0 ? (
                <p className="text-sm text-slate-400">No country data yet.</p>
              ) : (
                <ul className="space-y-2">
                  {stats.topCountries.slice(0, 5).map((c) => (
                    <li
                      key={c.country}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-700">{c.country || "Unknown"}</span>
                      <span className="text-slate-400 font-medium ml-2 shrink-0">
                        {c.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Devices + Browsers */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                  Desktop{" "}
                  <span className="text-blue-400 font-normal">
                    {devices.desktop} ({pct(devices.desktop)}%)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700">
                  Mobile{" "}
                  <span className="text-purple-400 font-normal">
                    {devices.mobile} ({pct(devices.mobile)}%)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-sm font-medium text-pink-700">
                  Tablet{" "}
                  <span className="text-pink-400 font-normal">
                    {devices.tablet} ({pct(devices.tablet)}%)
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              {browsers.length === 0 ? (
                <p className="text-sm text-slate-400">No browser data yet.</p>
              ) : (
                <ul className="space-y-2">
                  {browsers.map(([browser, count]) => (
                    <li
                      key={browser}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-700">{browser}</span>
                      <span className="text-slate-400 font-medium ml-2 shrink-0">
                        {count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Click history */}
      <h2 className="text-base font-semibold text-slate-900 mb-3">
        Click history
        {total > 0 && (
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({total} total)
          </span>
        )}
      </h2>
      {clicksLoading && page === 1 ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : allClicks.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          No click history yet.
        </p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClicks.map((click) => (
                <TableRow key={click._id}>
                  <TableCell className="whitespace-nowrap text-slate-700">
                    {new Date(click.timestamp).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {click.country ?? "—"}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {truncate(click.referrer, 40)}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {truncate(click.userAgent, 50)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {allClicks.length < total && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={clicksFetching}
              >
                {clicksFetching
                  ? "Loading…"
                  : `Load more (${total - allClicks.length} remaining)`}
              </Button>
            </div>
          )}
        </>
      )}

      {link && (
        <EditLinkDialog
          link={link}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
