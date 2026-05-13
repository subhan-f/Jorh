import type { MetaFunction } from "@remix-run/node";
import { EndpointSection } from "~/components/EndpointSection";
import { analyticsEndpoints } from "~/lib/api-spec";

export const meta: MetaFunction = () => [
  { title: "Analytics — Jorh API" },
  { name: "description", content: "Retrieve click stats and history for your short links." },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Analytics</h1>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl">
          The analytics service aggregates click data published by the redirect service via RabbitMQ.
          Endpoints are served at{" "}
          <code className="text-slate-700 font-mono text-[13px] bg-slate-100 px-1.5 py-0.5 rounded">
            /api/analytics
          </code>{" "}
          and require authentication.
        </p>
      </div>

      {analyticsEndpoints.map((ep) => (
        <EndpointSection key={ep.id} endpoint={ep} />
      ))}
    </div>
  );
}
