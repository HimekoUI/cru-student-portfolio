"use client";

import React from "react";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({ src, alt, name, size = "md", className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium overflow-hidden",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img src={src} alt={alt || name || "Avatar"} className="h-full w-full object-cover" onError={() => setImageError(true)} />
      ) : (
        <span>{name ? getInitials(name) : "?"}</span>
      )}
    </div>
  );
}

export function AvatarGroup({ children, max = 4, className }: { children: React.ReactNode; max?: number; className?: string }) {
  const childArray = React.Children.toArray(children);
  const visible = childArray.slice(0, max);
  const remaining = childArray.length - max;
  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((child, i) => (
        <div key={i} className="ring-2 ring-card rounded-full">{child}</div>
      ))}
      {remaining > 0 && (
        <div className="ring-2 ring-card rounded-full h-10 w-10 flex items-center justify-center bg-muted text-xs font-medium text-muted-foreground">
          +{remaining}
        </div>
      )}
    </div>
  );
}
