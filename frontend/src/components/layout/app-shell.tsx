"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, FolderKanban, FileText,
  ClipboardCheck, ShieldCheck, GraduationCap
} from "lucide-react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { BottomNavigation } from "./bottom-navigation";
import { Drawer, CommandPalette } from "@/components/ui";
import { useAuth } from "@/stores/auth-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, switchRole } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "ภาพรวม (Dashboard)", icon: LayoutDashboard },
    { href: "/activities", label: "กิจกรรมระหว่างเรียน", icon: Calendar },
    { href: "/portfolio", label: "Portfolio ของฉัน", icon: FolderKanban },
    { href: "/resume", label: "สร้าง Resume PDF", icon: FileText },
    { href: "/lecturer", label: "จัดการกิจกรรม / รับรองผล", icon: ClipboardCheck },
    { href: "/admin", label: "ภาพรวมผู้ดูแลระบบ", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((c) => !c)} />

      {/* Mobile Drawer (opened via Hamburger menu) */}
      <Drawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        side="left"
        title="CRU Student Portfolio"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{user?.fullName || "ผู้เยี่ยมชม"}</p>
              <p className="text-xs text-muted-foreground">{user?.faculty || "มรภ.จันทรเกษม"}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "bg-primary-50 text-primary-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-1">สลับบทบาททดสอบระบบ</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(["student", "lecturer", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => { switchRole(r); setMobileDrawerOpen(false); }}
                  className={cn(
                    "rounded-lg py-1.5 text-xs font-medium border transition-colors cursor-pointer",
                    user?.role === r
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  )}
                >
                  {r === "student" ? "นักศึกษา" : r === "lecturer" ? "อาจารย์" : "แอดมิน"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <footer className="hidden lg:flex items-center justify-between px-8 py-4 border-t border-border text-xs text-muted-foreground bg-card">
          <span>CRU Student Portfolio — มหาวิทยาลัยราชภัฏจันทรเกษม</span>
          <span>ระบบกิจกรรมและแฟ้มสะสมผลงานระหว่างเรียน</span>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Global Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette />
    </div>
  );
}
