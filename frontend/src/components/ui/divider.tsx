"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Divider({ label, className }: { label?: string; className?: string }) {
  if (label) {
    return (
      <div className={cn("relative flex items-center py-2", className)}>
        <div className="flex-grow border-t border-border" />
        <span className="mx-3 shrink-0 text-xs text-muted-foreground">{label}</span>
        <div className="flex-grow border-t border-border" />
      </div>
    );
  }
  return <hr className={cn("border-t border-border my-2", className)} />;
}

export function FAB({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label || "Action"}
      className={cn(
        "fixed bottom-20 right-4 z-40 sm:hidden inline-flex items-center gap-2 rounded-full bg-primary-600 text-white px-4 py-3.5 shadow-lg hover:bg-primary-700 active:scale-95 transition-all cursor-pointer",
        className
      )}
    >
      {icon}
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
