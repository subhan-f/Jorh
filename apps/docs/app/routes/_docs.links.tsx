import type { MetaFunction } from "@remix-run/node";
import { EndpointSection } from "~/components/EndpointSection";
import { linksEndpoints } from "~/lib/api-spec";

export const meta: MetaFunction = () => [
  { title: "Links — Jorh API" },
  { name: "description", content: "Create and manage short links via the Jorh links API." },
];

export default function LinksPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Links</h1>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl">
          Manage your shortened URLs through the links service at{" "}
          <code className="text-slate-700 font-mono text-[13px] bg-slate-100 px-1.5 py-0.5 rounded">
            /api/links
          </code>
          . All endpoints require authentication. Custom slugs are optional — a random one is generated when omitted.
        </p>
      </div>

      {linksEndpoints.map((ep) => (
        <EndpointSection key={ep.id} endpoint={ep} />
      ))}
    </div>
  );
}
