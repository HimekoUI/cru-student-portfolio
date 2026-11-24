"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  User as UserIcon,
  Lock,
  ArrowRight,
  Users,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import {
  Button,
  BackButton,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  SegmentedControl,
  Divider,
  useToast,
} from "@/components/ui";
import { useAuth, TEST_ACCOUNTS } from "@/stores/auth-context";
import { UserRole } from "@/types";

const PORTAL_INFO: Record<
  UserRole,
  { label: string; desc: string; testUsername: string; testPassword: string; redirect: string }
> = {
  student: {
    label: "นักศึกษา",
    desc: "เข้าสู่ระบบเพื่อสมัครกิจกรรม ส่งหลักฐาน และดู Portfolio",
    testUsername: "student_test",
    testPassword: "password123",
    redirect: "/dashboard",
  },
  lecturer: {
    label: "อาจารย์",
    desc: "เข้าสู่ระบบเพื่อสร้างกิจกรรม ตรวจหลักฐาน และรับรองผล",
    testUsername: "lecturer_test",
    testPassword: "password123",
    redirect: "/lecturer",
  },
  admin: {
    label: "ผู้ดูแลระบบ",
    desc: "เข้าสู่ระบบเพื่อกำกับดูแลภาพรวมและข้อมูลทั้งหมด",
    testUsername: "admin_test",
    testPassword: "password123",
    redirect: "/admin",
  },
};

export default function LoginPage() {
  const [portalRole, setPortalRole] = React.useState<UserRole>("student");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { loginWithCredentials } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const currentPortal = PORTAL_INFO[portalRole];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      addToast("error", "กรุณากรอก Username และ Password");
      return;
    }
    setLoading(true);
    const res = await loginWithCredentials(username, password, portalRole);
    setLoading(false);

    if (!res.ok) {
      addToast("error", res.error || "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }

    addToast("success", `เข้าสู่ระบบในฐานะ${currentPortal.label}สำเร็จ`);
    router.push(currentPortal.redirect);
  };

  const handleFillTestAccount = (role: UserRole) => {
    const acc = TEST_ACCOUNTS.find((a) => a.role === role);
    if (!acc) return;
    setPortalRole(role);
    setUsername(acc.username);
    setPassword(acc.password);
    addToast("info", `กรอกบัญชีทดสอบ "${acc.username}" แล้ว กดเข้าสู่ระบบได้เลย`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4 sm:p-6">
      {/* Top Back Button */}
      <div className="max-w-md w-full mx-auto pt-2 pb-4">
        <BackButton fallbackHref="/" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Brand */}
          <div className="text-center text-white space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-400 text-primary-900 shadow-lg">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CRU Student Portfolio</h1>
            <p className="text-sm text-primary-200">
              มหาวิทยาลัยราชภัฏจันทรเกษม (สีเทา–เหลือง)
            </p>
          </div>

          <Card className="shadow-2xl border-primary-700/30">
            <CardHeader className="space-y-3">
              {/* 3-Way Portal Selector */}
              <div className="flex justify-center">
                <SegmentedControl
                  value={portalRole}
                  onChange={(v) => setPortalRole(v as UserRole)}
                  options={[
                    { value: "student", label: "นักศึกษา", icon: <GraduationCap className="h-3.5 w-3.5" /> },
                    { value: "lecturer", label: "อาจารย์", icon: <Users className="h-3.5 w-3.5" /> },
                    { value: "admin", label: "ผู้ดูแล", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                  ]}
                />
              </div>
              <div>
                <CardTitle>เข้าสู่ระบบ ({currentPortal.label})</CardTitle>
                <CardDescription>{currentPortal.desc}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Username"
                  type="text"
                  placeholder={currentPortal.testUsername}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserIcon className="h-4 w-4" />}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                />
                <Button type="submit" variant="accent" className="w-full" size="lg" loading={loading}>
                  เข้าสู่ระบบทางเข้า{currentPortal.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <Divider label="บัญชีทดสอบระบบ (3 Users)" />

              <div className="rounded-xl border border-border bg-primary-50 p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-800">
                  <KeyRound className="h-3.5 w-3.5 text-accent-600" />
                  <span>คลิกเพื่อกรอก Username / Password ทดสอบ (รหัสผ่าน: password123)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TEST_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => handleFillTestAccount(acc.role)}
                      className={`rounded-lg border p-2 text-left transition-all cursor-pointer ${
                        portalRole === acc.role
                          ? "border-accent-500 bg-accent-50 text-primary-900"
                          : "border-border bg-card hover:bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-[11px] font-bold">
                        {acc.role === "student" ? "นักศึกษา" : acc.role === "lecturer" ? "อาจารย์" : "ผู้ดูแล"}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate">
                        {acc.username}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-1">
                ยังไม่มีบัญชีในระบบ?{" "}
                <Link href="/register" className="text-primary-800 font-semibold hover:underline">
                  สมัครสมาชิกใหม่
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
