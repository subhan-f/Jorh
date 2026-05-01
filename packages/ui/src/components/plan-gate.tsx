"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import type { Plan } from "@jorh/types";
import { cn } from "../lib/utils.js";

const PLAN_ORDER: Plan[] = ["free", "pro", "business", "enterprise"];

function planMeetsRequirement(userPlan: Plan, requiredPlan: Plan): boolean {
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(requiredPlan);
}

interface PlanGateProps {
  requiredPlan: Plan;
  userPlan: Plan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function PlanGate({ requiredPlan, userPlan, children, fallback, className }: PlanGateProps) {
  if (planMeetsRequirement(userPlan, requiredPlan)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-dashed border-muted-foreground/30 p-6",
        className
      )}
    >
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
        <Lock className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-medium">
          Requires <span className="capitalize text-primary">{requiredPlan}</span> plan
        </p>
        <a
          href="/settings/billing"
          className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
        >
          Upgrade now →
        </a>
      </div>
    </div>
  );
}
