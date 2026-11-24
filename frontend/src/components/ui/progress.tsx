"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "warning" | "error" | "accent";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary-600", success: "bg-success", warning: "bg-warning", error: "bg-error", accent: "bg-accent-500",
};
const sizeClasses: Record<string, string> = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function Progress({ value, max = 100, variant = "primary", size = "md", showLabel = false, className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{value}/{max}</span><span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-muted overflow-hidden", sizeClasses[size])}>
        <div className={cn("h-full rounded-full transition-all duration-500 ease-out", variantClasses[variant])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
