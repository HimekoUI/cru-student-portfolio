"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu, Search, Bell, LogOut, User as UserIcon,
  GraduationCap, ShieldCheck, Users
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/stores/auth-context";
import { useAppStore } from "@/stores/app-store";
import { UserRole } from "@/types";

interface NavbarProps {
  onOpenMobileDrawer: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; variant: "default" | "accent" | "info" }> = {
  student: { label: "นักศึกษา", variant: "default" },
  lecturer: { label: "อาจารย์", variant: "accent" },
  admin: { label: "ผู้ดูแลระบบ", variant: "info" },
};

export function Navbar({ onOpenMobileDrawer }: NavbarProps) {
  const { user, logout } = useAuth();
  const { activities, portfolioItems } = useAppStore();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = React.useState(false);

  const handleTriggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile Hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="เปิดเมนู"
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-800 text-accent-400 font-bold text-xs shadow-sm">
              CRU
            </div>
            <span className="font-bold text-sm text-foreground">Student Portfolio</span>
          </Link>

          {/* Desktop Command Palette Trigger */}
          <button
            type="button"
            onClick={handleTriggerCommandPalette}
            className="hidden md:flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-64 cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left text-xs">ค้นหากิจกรรม, หน้า...</span>
            <kbd className="rounded bg-card px-1.5 py-0.5 text-[10px] font-mono border border-border">⌘K</kbd>
          </button>
        </div>

        {/* Right: Role Badge + Notifications + User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-primary-50 px-3 py-1 text-xs">
              <span className="text-muted-foreground">สิทธิ์:</span>
              <Badge variant={ROLE_LABELS[user.role].variant} className="py-0">
                {ROLE_LABELS[user.role].label}
              </Badge>
            </div>
          )}

          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="การแจ้งเตือน"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* User Avatar Dropdown */}
          {user ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-muted transition-colors">
                  <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-foreground leading-tight">{user.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{user.studentId || user.email}</p>
                  </div>
                </div>
              }
              items={[
                { label: "Portfolio ของฉัน", icon: <UserIcon className="h-4 w-4" />, onClick: () => router.push("/portfolio") },
                { label: "สลับบัญชี / เข้าสู่ระบบใหม่", icon: <Users className="h-4 w-4" />, onClick: () => { logout(); router.push("/login"); } },
                { divider: true, label: "" },
                {
                  label: "ออกจากระบบ",
                  icon: <LogOut className="h-4 w-4" />,
                  danger: true,
                  onClick: () => {
                    logout();
                    router.push("/login");
                  },
                },
              ]}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-accent-400 px-3 py-1.5 text-xs font-semibold text-primary-900 hover:bg-accent-500"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>

      {/* Notification Modal / Sheet */}
      <Modal
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="การแจ้งเตือนระบบ"
        description="อัปเดตล่าสุดจากกิจกรรมและการรับรองผล"
      >
        {activities.length === 0 && portfolioItems.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm font-medium text-foreground">ยังไม่มีการแจ้งเตือนในขณะนี้</p>
            <p className="text-xs text-muted-foreground">เมื่อมีกิจกรรมใหม่หรือการรับรองผล ระบบจะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            {activities.map((a) => (
              <div key={a.id} className="rounded-lg border border-border p-3 bg-muted/30">
                <p className="font-medium">กิจกรรมเปิดใหม่: {a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.location}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </header>
  );
}
