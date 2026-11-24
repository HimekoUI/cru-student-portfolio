"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export function Rating({ value, max = 5, onChange, readonly = false, size = "md", className }: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starVal = i + 1;
        const filled = starVal <= display;
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(starVal)}
            onMouseEnter={() => !readonly && setHovered(starVal)}
            onMouseLeave={() => !readonly && setHovered(null)}
            className={cn(
              "transition-transform",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizes[size],
                filled ? "fill-accent-400 text-accent-500" : "text-border"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
