import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded font-mono font-semibold tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-600 border border-slate-200",
        get: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        post: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        patch: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        delete: "bg-red-500/15 text-red-400 border border-red-500/30",
        put: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        error: "bg-rose-50 text-rose-600 border border-rose-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
