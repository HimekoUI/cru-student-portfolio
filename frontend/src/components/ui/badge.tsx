"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-600 text-white",
        secondary: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-success-light text-green-700",
        warning: "border-transparent bg-warning-light text-amber-700",
        error: "border-transparent bg-error-light text-red-700",
        info: "border-transparent bg-info-light text-blue-700",
        outline: "border-border text-foreground",
        accent: "border-transparent bg-accent-100 text-accent-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
