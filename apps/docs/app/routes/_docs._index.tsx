import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Zap, Lock, BarChart2, Link2, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

export const meta: MetaFunction = () => [
  { title: "Jorh API — Introduction" },
  { name: "description", content: "Jorh URL shortener API documentation" },
];

export const loader = () =>
  json({ baseUrl: process.env.API_BASE_URL ?? "http://localhost:3000" });

const features = [
  { icon: Lock, title: "Auth Service", description: "JWT-based authentication with register, login, logout, and profile management.", href: "/authentication" },
  { icon: Link2, title: "Links Service", description: "Create, read, update, and delete short links with custom slugs.", href: "/links" },
  { icon: BarChart2, title: "Analytics Service", description: "Track click-through rates, referrers, and geographic distribution.", href: "/analytics" },
  { icon: Globe, title: "Redirect Service", description: "High-performance slug resolution with in-memory caching.", href: "/redirect" },
];

const errorCodes = [
  { status: "400", name: "Bad Request", description: "The request payload is malformed or missing required fields." },
  { status: "401", name: "Unauthorized", description: "Missing or invalid Bearer token." },
  { status: "403", name: "Forbidden", description: "Authenticated but not permitted to access the resource." },
  { status: "404", name: "Not Found", description: "The requested resource does not exist." },
  { status: "409", name: "Conflict", description: "Resource already exists (e.g. duplicate email or slug)." },
  { status: "422", name: "Validation Error", description: "Input failed schema validation." },
  { status: "429", name: "Too Many Requests", description: "Rate limit exceeded. Retry after the indicated window." },
  { status: "500", name: "Internal Server Error", description: "An unexpected error occurred. Safe to retry." },
];

export default function IndexPage() {
  const { baseUrl } = useLoaderData<typeof loader>();
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-brand tracking-widest uppercase">API Reference</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Jorh API Documentation
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
          A microservices-based URL shortener platform built for scale.
          Every service exposes a clean REST API through a unified API gateway.
        </p>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {features.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={href}
            to={href}
            className="group flex gap-4 rounded-xl border border-slate-200 p-5 hover:border-brand/40 hover:bg-slate-50 transition-all"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
              <Icon size={18} />
            </div>
            <div>
              <div className="font-semibold text-slate-800 mb-0.5">{title}</div>
              <div className="text-[13px] text-slate-500 leading-relaxed">{description}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Base URL & Auth */}
      <section id="authentication" className="scroll-mt-24 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Base URL &amp; Authentication</h2>
        <p className="text-slate-500 mb-5 text-[15px]">
          All requests are routed through the API gateway. Authenticated endpoints require a Bearer
          token obtained from the{" "}
          <Link to="/authentication#login" className="text-brand hover:underline">
            Login
          </Link>{" "}
          endpoint.
        </p>

        <div className="rounded-xl border border-slate-200 overflow-hidden mb-4">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Base URL
          </div>
          <div className="px-4 py-3 font-mono text-sm text-slate-800 bg-white">{baseUrl}</div>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden mb-5">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Authorization Header
          </div>
          <div className="px-4 py-3 font-mono text-sm text-slate-800 bg-white">
            Authorization: Bearer &lt;access_token&gt;
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex gap-3">
            <Lock size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-amber-800 leading-relaxed">
              Tokens are short-lived JWTs. Refresh by logging in again. Logged-out tokens are
              blacklisted server-side and will be rejected even before expiry.
            </p>
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section id="errors" className="scroll-mt-24 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Codes</h2>
        <p className="text-slate-500 mb-5 text-[15px]">All errors follow a consistent JSON shape:</p>

        <div className="rounded-xl bg-[#0d1117] border border-[#30363d] px-5 py-4 font-mono text-sm text-slate-300 mb-6">
          <span className="text-[#7ee787]">{"{"}</span>
          {"\n  "}
          <span className="text-[#79c0ff]">"success"</span>
          <span className="text-slate-400">: </span>
          <span className="text-[#f97316]">false</span>
          {",\n  "}
          <span className="text-[#79c0ff]">"message"</span>
          <span className="text-slate-400">: </span>
          <span className="text-[#a5d6ff]">"Human-readable error message"</span>
          {"\n"}
          <span className="text-[#7ee787]">{"}"}</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-44">Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errorCodes.map((e) => (
              <TableRow key={e.status}>
                <TableCell className="font-mono text-rose-600 font-medium">{e.status}</TableCell>
                <TableCell className="text-slate-700 font-medium">{e.name}</TableCell>
                <TableCell className="text-slate-500">{e.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Rate Limiting */}
      <section id="rate-limiting" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Rate Limiting</h2>
        <p className="text-slate-500 mb-5 text-[15px]">
          The API gateway applies per-IP rate limiting. Exceeding the limit returns{" "}
          <code className="text-rose-600 font-mono text-[13px] bg-rose-50 px-1.5 py-0.5 rounded">
            429 Too Many Requests
          </code>
          .
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scope</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-slate-700 font-medium">Global</TableCell>
              <TableCell className="font-mono text-slate-600">200 requests</TableCell>
              <TableCell className="text-slate-500">15 minutes</TableCell>
              <TableCell className="text-slate-500">All routes, per IP</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-slate-700 font-medium">Auth endpoints</TableCell>
              <TableCell className="font-mono text-slate-600">20 requests</TableCell>
              <TableCell className="text-slate-500">15 minutes</TableCell>
              <TableCell className="text-slate-500">Brute-force protection on login/register</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
