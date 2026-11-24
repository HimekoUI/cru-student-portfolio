"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer",
            activeTab === tab.id ? "text-primary-600" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.icon}
          {tab.label}
          {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />}
        </button>
      ))}
    </div>
  );
}
