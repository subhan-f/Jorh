import type { MetaFunction } from "@remix-run/node";
import { EndpointSection } from "~/components/EndpointSection";
import { redirectEndpoints } from "~/lib/api-spec";

export const meta: MetaFunction = () => [
  { title: "Redirect — Jorh API" },
  { name: "description", content: "Resolve short link slugs to their original destination URLs." },
];

export default function RedirectPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Redirect</h1>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl">
          The redirect service resolves slugs at the root path. Requests to{" "}
          <code className="text-slate-700 font-mono text-[13px] bg-slate-100 px-1.5 py-0.5 rounded">
            /:slug
          </code>{" "}
          perform an in-memory lookup (kept in sync via RabbitMQ), then issue a{" "}
          <code className="text-slate-700 font-mono text-[13px] bg-slate-100 px-1.5 py-0.5 rounded">
            302
          </code>{" "}
          redirect. Click events are published asynchronously to the analytics service.
        </p>
      </div>

      {redirectEndpoints.map((ep) => (
        <EndpointSection key={ep.id} endpoint={ep} />
      ))}
    </div>
  );
}
