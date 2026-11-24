"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-1 min-w-[180px] rounded-lg border border-border bg-card shadow-lg py-1",
          align === "right" ? "right-0" : "left-0"
        )}>
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 border-t border-border" />
            ) : (
              <button
                key={i}
                onClick={() => { item.onClick?.(); setIsOpen(false); }}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors cursor-pointer",
                  item.danger ? "text-error hover:bg-error-light" : "text-foreground hover:bg-muted"
                )}
              >
                {item.icon}{item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
