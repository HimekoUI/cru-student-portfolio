"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, Upload, CheckCircle2, Users, XCircle } from "lucide-react";
import {
  Breadcrumb, BackButton, Input, SegmentedControl, Button, Badge, Modal,
  Textarea, FileUpload, EmptyState, useToast
} from "@/components/ui";
import { ActivityCard } from "@/components/activities/activity-card";
import { useAuth } from "@/stores/auth-context";
import { useAppStore } from "@/stores/app-store";
import { Activity, ACTIVITY_CATEGORIES } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ActivitiesPage() {
  const { user } = useAuth();
  const { activities, enrollments, enrollActivity, cancelEnrollment, submitEvidence } = useAppStore();
  const { addToast } = useToast();
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = React.useState(false);
  const [evidenceFile, setEvidenceFile] = React.useState<File | null>(null);
  const [evidenceTitle, setEvidenceTitle] = React.useState("");
  const [reflection, setReflection] = React.useState("");

  const filtered = activities.filter((act) => {
    const matchSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || act.category === category;
    return matchSearch && matchCat;
  });

  const isEnrolledIn = (actId: string) =>
    !!user && enrollments.some((e) => e.activityId === actId && e.studentId === user.id);

  const handleEnroll = (act: Activity) => {
    if (!user) {
      addToast("warning", "กรุณาเข้าสู่ระบบก่อนสมัครกิจกรรม");
      router.push("/login");
      return;
    }
    enrollActivity(act.id, user.id);
    addToast("success", `สมัครเข้าร่วม "${act.title}" สำเร็จ`);
    setSelectedActivity(null);
  };

  const handleCancelEnroll = (act: Activity) => {
    if (!user) return;
    cancelEnrollment(act.id, user.id);
    addToast("info", `ยกเลิกการสมัคร "${act.title}" แล้ว`);
    setSelectedActivity(null);
  };

  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedActivity) return;
    if (!reflection.trim() && !evidenceFile) {
      addToast("error", "กรุณาแนบไฟล์ผลงาน หรือเขียนบันทึกสะท้อนการเรียนรู้");
      return;
    }
    submitEvidence({
      activityId: selectedActivity.id,
      studentId: user.id,
      title: evidenceTitle.trim() || (evidenceFile ? evidenceFile.name : "บันทึกสะท้อนการเรียนรู้"),
      description: `ส่งจากกิจกรรม ${selectedActivity.title}`,
      reflection,
      fileName: evidenceFile?.name,
    });
    addToast("success", "ส่งหลักฐานเรียบร้อย รออาจารย์ตรวจรับรองผล");
    setEvidenceModalOpen(false);
    setEvidenceFile(null);
    setEvidenceTitle("");
    setReflection("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BackButton fallbackHref="/dashboard" />
          <Breadcrumb items={[{ label: "กิจกรรมระหว่างเรียน" }]} />
        </div>
        <h1 className="text-2xl font-bold">ค้นหาและสมัครกิจกรรม</h1>
        <p className="text-sm text-muted-foreground">
          เลือกเข้าร่วมชุมนุม การอบรม และโครงงาน เพื่อสะสมทักษะพร้อมหลักฐานรับรอง
        </p>
      </div>

      {/* Search & Segmented Filter */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="w-full md:w-80">
          <Input
            placeholder="ค้นหาชื่อกิจกรรม, ทักษะ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="overflow-x-auto pb-1">
          <SegmentedControl
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: "ทั้งหมด" },
              { value: "training", label: "อบรม" },
              { value: "workshop", label: "เวิร์กช็อป" },
              { value: "project", label: "โครงงาน" },
              { value: "club", label: "ชมรม" },
              { value: "volunteer", label: "จิตอาสา" },
            ]}
          />
        </div>
      </div>

      {/* Activity Grid / Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8" />}
          title={activities.length === 0 ? "ยังไม่มีกิจกรรมในระบบ" : "ไม่พบกิจกรรมที่ตรงกับการค้นหา"}
          description={
            activities.length === 0
              ? "ระบบยังไม่มีรายการกิจกรรม อาจารย์สามารถสร้างกิจกรรมใหม่ได้ที่หน้าจัดการกิจกรรม"
              : "ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่ทั้งหมด"
          }
          action={
            activities.length === 0
              ? user?.role === "lecturer" || user?.role === "admin"
                ? { label: "ไปสร้างกิจกรรมใหม่", onClick: () => router.push("/lecturer") }
                : undefined
              : { label: "แสดงทั้งหมด", onClick: () => { setSearch(""); setCategory("all"); } }
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              isEnrolled={isEnrolledIn(act.id)}
              onSelect={setSelectedActivity}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      )}

      {/* Activity Detail Modal / Sheet */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity?.title}
        description={selectedActivity ? ACTIVITY_CATEGORIES[selectedActivity.category].label : undefined}
        size="lg"
      >
        {selectedActivity && (
          <div className="space-y-5">
            <p className="text-sm text-foreground leading-relaxed">{selectedActivity.description}</p>

            <div className="grid sm:grid-cols-2 gap-3 rounded-xl bg-muted/50 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-700" />
                <span>{formatDate(selectedActivity.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-700" />
                <span>{selectedActivity.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-700" />
                <span>รับ {selectedActivity.currentParticipants} / {selectedActivity.maxParticipants} คน</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">ทักษะที่คาดหวังว่าจะได้รับ</p>
              <div className="flex flex-wrap gap-2">
                {selectedActivity.skills.map((s) => (
                  <Badge key={s.id} variant="accent">{s.name}</Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
              {isEnrolledIn(selectedActivity.id) ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 text-error hover:text-error"
                    onClick={() => handleCancelEnroll(selectedActivity)}
                  >
                    <XCircle className="h-4 w-4" /> ยกเลิกการสมัคร
                  </Button>
                  <Button
                    variant="accent"
                    className="flex-1"
                    onClick={() => setEvidenceModalOpen(true)}
                  >
                    <Upload className="h-4 w-4" /> ส่งหลักฐานผลงาน
                  </Button>
                </>
              ) : (
                <Button
                  variant="accent"
                  className="w-full"
                  disabled={selectedActivity.status !== "open"}
                  onClick={() => handleEnroll(selectedActivity)}
                >
                  <CheckCircle2 className="h-4 w-4" /> ยืนยันสมัครเข้าร่วมกิจกรรม
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Submit Evidence Modal / Sheet */}
      <Modal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title="ส่งหลักฐานและบันทึกสะท้อนการเรียนรู้"
        description={selectedActivity?.title}
      >
        <form onSubmit={handleSubmitEvidence} className="space-y-4">
          <Input
            label="ชื่อผลงาน / หลักฐาน"
            placeholder="เช่น สไลด์นำเสนอผลงาน, สรุปการเรียนรู้"
            value={evidenceTitle}
            onChange={(e) => setEvidenceTitle(e.target.value)}
          />
          <FileUpload
            label="อัปโหลดไฟล์ชิ้นงาน / สไลด์ / เกียรติบัตร"
            selectedFile={evidenceFile}
            onFileSelect={setEvidenceFile}
          />
          <Textarea
            label="บันทึกสะท้อนการเรียนรู้ (Reflection)"
            placeholder="สิ่งที่ได้เรียนรู้ บทบาทหน้าที่ และการนำไปประยุกต์ใช้..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEvidenceModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="accent">
              ส่งหลักฐานเพื่อรับรอง
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
