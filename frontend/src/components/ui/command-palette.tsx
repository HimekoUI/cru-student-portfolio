"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, FolderKanban, FileText, ShieldCheck, LayoutDashboard, X } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const COMMANDS: CommandItem[] = [
  { id: "dashboard", label: "ภาพรวม (Dashboard)", description: "ดูสถิติและสรุปผลของคุณ", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "activities", label: "กิจกรรมทั้งหมด", description: "ค้นหาและสมัครกิจกรรมระหว่างเรียน", href: "/activities", icon: <Calendar className="h-4 w-4" /> },
  { id: "portfolio", label: "Portfolio ของฉัน", description: "จัดการผลงานและกราฟทักษะ", href: "/portfolio", icon: <FolderKanban className="h-4 w-4" /> },
  { id: "resume", label: "สร้าง Resume PDF", description: "เลือกผลงานและส่งออก Resume", href: "/resume", icon: <FileText className="h-4 w-4" /> },
  { id: "lecturer", label: "จัดการกิจกรรม (อาจารย์)", description: "สร้างกิจกรรมและตรวจรับรองผล", href: "/lecturer", icon: <ShieldCheck className="h-4 w-4" /> },
];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = COMMANDS.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="พิมพ์คำสั่งหรือหน้าที่ต้องการไป..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">ไม่พบคำสั่งที่ตรงกัน</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => { router.push(item.href); setOpen(false); setQuery(""); }}
                className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-pointer"
              >
                <div className="rounded-md bg-muted p-2 text-primary-600">{item.icon}</div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/40 text-[11px] text-muted-foreground">
          <span>กด ESC เพื่อปิด</span>
          <span>⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
