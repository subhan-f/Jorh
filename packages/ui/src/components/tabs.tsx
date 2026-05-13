import { cn } from "../lib/utils";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  className,
  // consumed by the controlled-tab pattern; not forwarded to DOM
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: TabsProps) {
  return <div className={cn(className)} {...props} />;
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-1", className)} {...props} />;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  activeValue?: string;
}

export function TabsTrigger({ className, value, activeValue, ...props }: TabsTriggerProps) {
  const active = value === activeValue;
  return (
    <button
      type="button"
      data-state={active ? "active" : "inactive"}
      className={cn(
        "rounded px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200",
        active && "bg-slate-700 text-slate-100",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}
