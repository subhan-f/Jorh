import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Badge } from "@repo/ui/components/badge";
import { cn } from "~/lib/utils";
import type { Param } from "~/lib/api-spec";

export type { Param };

interface Props {
  title: string;
  params: Param[];
}

export function ParamTable({ title, params }: Props) {
  if (!params.length) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-36">Name</TableHead>
            <TableHead className="w-28">Type</TableHead>
            <TableHead className="w-24">Required</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.map((p) => (
            <TableRow key={p.name}>
              <TableCell className="font-mono font-medium text-slate-800">
                {p.name}
              </TableCell>
              <TableCell>
                <span className="font-mono text-[12px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                  {p.type}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={p.required ? "error" : "default"}
                  size="sm"
                  className={cn(
                    "font-sans tracking-normal",
                    !p.required && "text-slate-400",
                  )}
                >
                  {p.required ? "required" : "optional"}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">
                {p.description}
                {p.example && (
                  <span className="ml-2 font-mono text-[11px] text-slate-400">
                    e.g. <span className="text-slate-500">{p.example}</span>
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
