"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, User as UserIcon, Lock, Hash, ArrowRight } from "lucide-react";
import {
  Button,
  BackButton,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  SegmentedControl,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/stores/auth-context";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const [role, setRole] = React.useState<UserRole>("student");
  const [fullName, setFullName] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [faculty, setFaculty] = React.useState("คณะวิทยาศาสตร์");
  const [loading, setLoading] = React.useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password) {
      addToast("error", "กรุณากรอกชื่อ-นามสกุล, Username และ Password ให้ครบถ้วน");
      return;
    }
    setLoading(true);
    await register({
      fullName,
      username,
      password,
      studentId: role === "student" ? studentId : undefined,
      faculty,
      role,
    });
    setLoading(false);
    addToast("success", "ลงทะเบียนสำเร็จ ยินดีต้อนรับสู่ CRU Portfolio");
    router.push(role === "lecturer" ? "/lecturer" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto pt-2 pb-4">
        <BackButton fallbackHref="/login" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center text-white space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-400 text-primary-900 shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold">สมัครใช้งาน CRU Student Portfolio</h1>
          </div>

          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>ลงทะเบียนบัญชีใหม่</CardTitle>
              <CardDescription>เลือกบทบาทและกำหนด Username / Password ของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center">
                  <SegmentedControl
                    value={role}
                    onChange={(v) => setRole(v as UserRole)}
                    options={[
                      { value: "student", label: "นักศึกษา" },
                      { value: "lecturer", label: "อาจารย์ / ผู้จัด" },
                    ]}
                  />
                </div>

                <Input
                  label="ชื่อ-นามสกุล"
                  placeholder="ระบุชื่อ-นามสกุลจริง"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<UserIcon className="h-4 w-4" />}
                />

                {role === "student" && (
                  <Input
                    label="รหัสนักศึกษา"
                    placeholder="เช่น 6611012345"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    icon={<Hash className="h-4 w-4" />}
                  />
                )}

                <Input
                  label="Username"
                  type="text"
                  placeholder="ตั้งชื่อผู้ใช้งาน"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserIcon className="h-4 w-4" />}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="ตั้งรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                />

                <Select
                  label="คณะ"
                  value={faculty}
                  onChange={setFaculty}
                  options={[
                    { value: "คณะวิทยาศาสตร์", label: "คณะวิทยาศาสตร์" },
                    { value: "คณะวิทยาการจัดการ", label: "คณะวิทยาการจัดการ" },
                    { value: "คณะมนุษยศาสตร์และสังคมศาสตร์", label: "คณะมนุษยศาสตร์และสังคมศาสตร์" },
                    { value: "คณะศึกษาศาสตร์", label: "คณะศึกษาศาสตร์" },
                    { value: "คณะเกษตรและชีวภาพ", label: "คณะเกษตรและชีวภาพ" },
                  ]}
                />

                <Button type="submit" variant="accent" className="w-full" size="lg" loading={loading}>
                  สร้างบัญชีและเข้าใช้งาน
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link href="/login" className="text-primary-800 font-semibold hover:underline">
                    เข้าสู่ระบบ
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
