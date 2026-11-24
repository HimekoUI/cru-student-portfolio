"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, FolderKanban, FileText, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/stores/auth-context";

/**
 * Bottom navigation: Mobile-only 4-5 action buttons replacing Sidebar
 */
export function BottomNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items = [
    { href: "/dashboard", label: "หน้าหลัก", icon: LayoutDashboard },
    { href: "/activities", label: "กิจกรรม", icon: Calendar },
    { href: "/portfolio", label: "Portfolio", icon: FolderKanban },
    { href: "/resume", label: "Resume", icon: FileText },
    ...(user?.role === "lecturer" || user?.role === "admin"
      ? [{ href: "/lecturer", label: "รับรองผล", icon: ClipboardCheck }]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-border bg-card/95 backdrop-blur-md">
      <div className="flex items-center justify-around h-16 px-1">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary-600" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary-600")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
