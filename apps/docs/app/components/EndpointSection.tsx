import { Shield, ShieldOff } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { CodeBlock } from "~/components/CodeBlock";
import { MethodBadge } from "~/components/MethodBadge";
import { ParamTable } from "~/components/ParamTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import type { ApiEndpoint } from "~/lib/api-spec";

interface Props {
  endpoint: ApiEndpoint;
}

export function EndpointSection({ endpoint }: Props) {
  const successJson = JSON.stringify(endpoint.responses.success.body, null, 2);

  return (
    <section id={endpoint.id} className="scroll-mt-24 pt-10 first:pt-0">
      {/* Title row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <MethodBadge method={endpoint.method} />
        <code className="text-[15px] font-mono font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
          {endpoint.path}
        </code>
        {endpoint.auth ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Shield size={11} />
            Requires auth
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            <ShieldOff size={11} />
            Public
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">{endpoint.title}</h3>
      <p className="text-slate-500 text-[15px] leading-relaxed mb-6">{endpoint.description}</p>

      {/* Parameters */}
      {endpoint.pathParams && (
        <ParamTable title="Path Parameters" params={endpoint.pathParams} />
      )}
      {endpoint.queryParams && (
        <ParamTable title="Query Parameters" params={endpoint.queryParams} />
      )}
      {endpoint.bodyParams && (
        <ParamTable title="Request Body" params={endpoint.bodyParams} />
      )}

      {/* Code examples */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Request</h4>
        <CodeBlock tabs={endpoint.examples} />
      </div>

      {/* Success response */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-semibold text-slate-700">Response</h4>
          <Badge variant="success" size="sm" className="font-sans tracking-normal">
            {endpoint.responses.success.status}
          </Badge>
          <span className="text-xs text-slate-400">{endpoint.responses.success.description}</span>
        </div>
        <CodeBlock code={successJson} lang="json" />
      </div>

      {/* Error table */}
      {endpoint.responses.errors.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Possible Errors</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endpoint.responses.errors.map((e) => (
                <TableRow key={e.status}>
                  <TableCell className="font-mono text-rose-600 font-medium">
                    {e.status}
                  </TableCell>
                  <TableCell className="text-slate-600">{e.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-10 border-b border-slate-100" />
    </section>
  );
}
