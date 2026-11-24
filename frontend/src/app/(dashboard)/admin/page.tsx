"use client";

import React from "react";
import { Calendar, CheckCircle2, Clock, Users, RotateCcw } from "lucide-react";
import {
  Breadcrumb, BackButton, StatCard, Card, CardHeader, CardTitle, CardContent,
  Progress, DataTable, Badge, Button, EmptyState, useToast
} from "@/components/ui";
import { useAppStore } from "@/stores/app-store";
import { useAuth } from "@/stores/auth-context";
import { BADGE_VARIANTS } from "@/types";

export default function AdminPage() {
  const { activities, enrollments, portfolioItems, resetAllData } = useAppStore();
  const { registeredUsers } = useAuth();
  const { addToast } = useToast();

  const openCount = activities.filter((a) => a.status === "open").length;
  const inProgressCount = activities.filter((a) => a.status === "in_progress").length;
  const completedCount = portfolioItems.length;

  const handleReset = () => {
    resetAllData();
    addToast("info", "ล้างข้อมูลทั้งหมดในระบบกลับสู่ค่าเริ่มต้น (ว่าง) แล้ว");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/dashboard" />
            <Breadcrumb items={[{ label: "ภาพรวมผู้ดูแลระบบ" }]} />
          </div>
          <h1 className="text-2xl font-bold">ภาพรวมการจัดกิจกรรมและหลักฐาน (Admin)</h1>
          <p className="text-sm text-muted-foreground">
            ติดตามสถานะกิจกรรม การรับรองผล และผู้ใช้งานในระบบ
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" /> รีเซ็ตข้อมูลระบบ (ค่าว่าง)
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="กิจกรรมทั้งหมด" value={activities.length} icon={<Calendar className="h-5 w-5" />} />
        <StatCard title="ผู้ใช้งานในระบบ" value={registeredUsers.length} icon={<Users className="h-5 w-5" />} />
        <StatCard title="รายการลงทะเบียน" value={enrollments.length} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="ผลงานที่รับรองแล้ว" value={completedCount} icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">สถานะรายการกิจกรรม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>เปิดรับสมัคร</span>
              <span className="font-bold">{openCount} กิจกรรม</span>
            </div>
            <Progress value={openCount} max={Math.max(1, activities.length)} variant="accent" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>กำลังดำเนินการ</span>
              <span className="font-bold">{inProgressCount} กิจกรรม</span>
            </div>
            <Progress value={inProgressCount} max={Math.max(1, activities.length)} variant="warning" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>รับรองผลเข้า Portfolio แล้ว</span>
              <span className="font-bold">{completedCount} รายการ</span>
            </div>
            <Progress value={completedCount} max={Math.max(1, enrollments.length)} variant="success" />
          </div>
        </CardContent>
      </Card>

      {/* Activity Governance Table */}
      {activities.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Calendar className="h-8 w-8" />}
            title="ยังไม่มีข้อมูลกิจกรรมในระบบ"
            description="ขณะนี้ระบบอยู่ในสถานะข้อมูลว่าง (0 รายการ)"
          />
        </Card>
      ) : (
        <DataTable
          data={activities}
          columns={[
            { key: "title", header: "กิจกรรม", sortable: true, render: (a) => <span className="font-medium">{a.title}</span> },
            { key: "location", header: "สถานที่", render: (a) => <span className="text-xs text-muted-foreground">{a.location}</span> },
            {
              key: "status",
              header: "สถานะ",
              render: (a) => (
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_VARIANTS[a.status].className}`}>
                  {BADGE_VARIANTS[a.status].label}
                </span>
              ),
            },
            { key: "currentParticipants", header: "ผู้เข้าร่วม", render: (a) => <Badge variant="outline">{a.currentParticipants} / {a.maxParticipants}</Badge> },
          ]}
        />
      )}
    </div>
  );
}
