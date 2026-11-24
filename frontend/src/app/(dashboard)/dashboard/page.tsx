"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Award, CheckCircle2, FileText, ArrowRight, Sparkles } from "lucide-react";
import {
  Breadcrumb, BackButton, StatCard, Card, CardHeader, CardTitle, CardContent,
  Button, Alert, Skeleton, EmptyState, useToast
} from "@/components/ui";
import { SkillRadarChart } from "@/components/portfolio/skill-radar-chart";
import { ActivityCard } from "@/components/activities/activity-card";
import { useAuth } from "@/stores/auth-context";
import { useAppStore } from "@/stores/app-store";

export default function DashboardPage() {
  const { user } = useAuth();
  const { activities, enrollments, portfolioItems, assessments, radarData, enrollActivity } = useAppStore();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const myEnrollments = enrollments.filter((e) => !user || e.studentId === user.id);
  const myPortfolio = portfolioItems.filter((p) => !user || p.studentId === user.id);
  const avgScore =
    assessments.length > 0
      ? (assessments.reduce((s, a) => s + a.level, 0) / assessments.length).toFixed(1)
      : "0.0";

  const openActivities = activities.filter((a) => a.status === "open");

  const handleEnroll = (actId: string, title: string) => {
    if (!user) {
      addToast("warning", "กรุณาเข้าสู่ระบบก่อนสมัครกิจกรรม");
      router.push("/login");
      return;
    }
    enrollActivity(actId, user.id);
    addToast("success", `สมัครเข้าร่วม "${title}" สำเร็จ`);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with BackButton + Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/" />
            <Breadcrumb items={[{ label: "ภาพรวม" }]} />
          </div>
          <h1 className="text-2xl font-bold">
            สวัสดี, {user?.fullName || "ผู้เยี่ยมชม"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.faculty || "มหาวิทยาลัยราชภัฏจันทรเกษม"} {user?.department ? `• ${user.department}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/activities">
            <Button variant="outline" size="sm">ค้นหากิจกรรม</Button>
          </Link>
          <Link href="/resume">
            <Button variant="accent" size="sm">
              <FileText className="h-4 w-4" /> สร้าง Resume PDF
            </Button>
          </Link>
        </div>
      </div>

      {!user && (
        <Alert variant="warning" title="ยังไม่ได้เข้าสู่ระบบ">
          กรุณา{" "}
          <Link href="/login" className="underline font-semibold">เข้าสู่ระบบ</Link>{" "}
          ด้วยบัญชีทดสอบ (student_test / lecturer_test / admin_test) เพื่อใช้งานฟังก์ชันทั้งหมด
        </Alert>
      )}

      {user?.role === "lecturer" && (
        <Alert variant="info" title="โหมดอาจารย์ / ผู้จัดกิจกรรม">
          คุณสามารถสร้างกิจกรรมใหม่ และตรวจรับรองหลักฐานได้ที่หน้า{" "}
          <Link href="/lecturer" className="underline font-semibold">จัดการกิจกรรม / รับรองผล</Link>
        </Alert>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="กิจกรรมที่เข้าร่วม" value={myEnrollments.length} icon={<Calendar className="h-5 w-5" />} />
          <StatCard title="ผลงานที่รับรองแล้ว" value={myPortfolio.length} icon={<CheckCircle2 className="h-5 w-5" />} />
          <StatCard title="คะแนนทักษะเฉลี่ย" value={`${avgScore} / 5`} icon={<Award className="h-5 w-5" />} />
          <StatCard
            title="สถานะ Portfolio"
            value={myPortfolio.some((p) => p.isPublic) ? "เปิดเผย" : "ยังไม่มีผลงาน"}
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Radar Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">กราฟทักษะของคุณ (0–5)</CardTitle>
            <Link href="/portfolio">
              <Button variant="ghost" size="sm">ดูหลักฐาน</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <EmptyState
                icon={<Award className="h-7 w-7" />}
                title="ยังไม่มีข้อมูลทักษะ"
                description="เข้าร่วมกิจกรรมและส่งหลักฐานให้อาจารย์รับรองเพื่อสร้างกราฟทักษะ"
                className="py-8"
              />
            ) : (
              <SkillRadarChart data={radarData} height={260} />
            )}
          </CardContent>
        </Card>

        {/* Open Activities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">กิจกรรมที่เปิดรับสมัคร</h2>
            <Link href="/activities" className="text-sm text-primary-700 font-medium hover:underline inline-flex items-center gap-1">
              ดูทั้งหมด <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {openActivities.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Calendar className="h-8 w-8" />}
                title="ยังไม่มีกิจกรรมในระบบ"
                description="ยังไม่มีกิจกรรมที่เปิดรับสมัครในขณะนี้ อาจารย์สามารถสร้างกิจกรรมใหม่ได้ที่หน้าจัดการกิจกรรม"
                action={
                  user?.role === "lecturer" || user?.role === "admin"
                    ? { label: "ไปหน้าสร้างกิจกรรม", onClick: () => router.push("/lecturer") }
                    : undefined
                }
              />
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {openActivities.slice(0, 2).map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  isEnrolled={myEnrollments.some((e) => e.activityId === act.id)}
                  onSelect={() => router.push("/activities")}
                  onEnroll={(a) => handleEnroll(a.id, a.title)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
