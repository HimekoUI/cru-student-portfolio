"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, FolderKanban, FileText,
  ClipboardCheck, ShieldCheck, ChevronLeft, ChevronRight, GraduationCap
} from "lucide-react";
import { useAuth } from "@/stores/auth-context";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "ภาพรวม (Dashboard)", icon: LayoutDashboard, roles: ["student", "lecturer", "admin"] },
    { href: "/activities", label: "กิจกรรมระหว่างเรียน", icon: Calendar, roles: ["student", "lecturer", "admin"] },
    { href: "/portfolio", label: "Portfolio ของฉัน", icon: FolderKanban, roles: ["student", "lecturer", "admin"] },
    { href: "/resume", label: "สร้าง Resume PDF", icon: FileText, roles: ["student", "lecturer", "admin"] },
    { href: "/lecturer", label: "จัดการกิจกรรม / รับรองผล", icon: ClipboardCheck, roles: ["lecturer", "admin"] },
    { href: "/admin", label: "ภาพรวมผู้ดูแลระบบ", icon: ShieldCheck, roles: ["admin"] },
  ];

  const visibleItems = navItems.filter((item) => !user || item.roles.includes(user.role));

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-250 shrink-0 sticky top-0 h-screen",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-800 text-accent-400 shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">CRU Portfolio</p>
              <p className="text-[10px] text-muted-foreground truncate">มรภ.จันทรเกษม</p>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="ยุบ/ขยาย Sidebar"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-accent-50 text-primary-900 border border-accent-300 shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-accent-600")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="rounded-xl bg-primary-800 text-white p-3">
            <p className="text-xs font-semibold text-accent-400">CRU Identity</p>
            <p className="text-[11px] text-primary-200 mt-0.5">
              สีประจำมหาวิทยาลัย: เทา – เหลือง
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
