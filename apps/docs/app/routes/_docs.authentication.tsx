import type { MetaFunction } from "@remix-run/node";
import { EndpointSection } from "~/components/EndpointSection";
import { authEndpoints } from "~/lib/api-spec";

export const meta: MetaFunction = () => [
  { title: "Authentication — Jorh API" },
  { name: "description", content: "Register, login, logout, and manage user profiles via the Jorh auth API." },
];

export default function AuthenticationPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Authentication</h1>
        <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl">
          All auth endpoints are served through the API gateway at{" "}
          <code className="text-slate-700 font-mono text-[13px] bg-slate-100 px-1.5 py-0.5 rounded">
            /api/auth
          </code>
          . On successful login, you receive a short-lived JWT. Include it as a{" "}
          <code className="text-slate-700 font-mono text-[13px] bg-slate-100 px-1.5 py-0.5 rounded">
            Bearer
          </code>{" "}
          token in subsequent requests.
        </p>
      </div>

      {authEndpoints.map((ep) => (
        <EndpointSection key={ep.id} endpoint={ep} />
      ))}
    </div>
  );
}
