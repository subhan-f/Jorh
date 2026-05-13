import { Badge } from "@repo/ui/components/badge";
import { methodVariant, type HttpMethod } from "~/lib/utils";

interface Props {
  method: HttpMethod;
  size?: "sm" | "md";
}

export function MethodBadge({ method, size = "md" }: Props) {
  return (
    <Badge variant={methodVariant(method)} size={size}>
      {method}
    </Badge>
  );
}
