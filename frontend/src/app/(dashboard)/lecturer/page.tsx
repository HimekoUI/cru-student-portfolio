"use client";

import React from "react";
import { Plus, ClipboardCheck, CheckCircle2, Users, Trash2, Calendar } from "lucide-react";
import {
  Breadcrumb, BackButton, Button, DataTable, Badge, Modal, Input, Textarea,
  Select, Rating, Card, FAB, EmptyState, useToast
} from "@/components/ui";
import { useAuth } from "@/stores/auth-context";
import { useAppStore, CRU_SKILLS } from "@/stores/app-store";
import { BADGE_VARIANTS, SKILL_LEVELS } from "@/types";
import { formatDateShort } from "@/lib/utils";

export default function LecturerPage() {
  const { user } = useAuth();
  const {
    activities,
    enrollments,
    evidences,
    createActivity,
    deleteActivity,
    verifyAndAssess,
  } = useAppStore();
  const { addToast } = useToast();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [verifyOpen, setVerifyOpen] = React.useState(false);

  // Create form state
  const [newTitle, setNewTitle] = React.useState("");
  const [newCat, setNewCat] = React.useState("training");
  const [newLocation, setNewLocation] = React.useState("");
  const [newMax, setNewMax] = React.useState("40");
  const [newDesc, setNewDesc] = React.useState("");
  const [selectedSkillId, setSelectedSkillId] = React.useState(CRU_SKILLS[0].id);

  // Verify modal state
  const [selectedEnrollmentId, setSelectedEnrollmentId] = React.useState("");
  const [assessSkillId, setAssessSkillId] = React.useState(CRU_SKILLS[0].id);
  const [skillLevel, setSkillLevel] = React.useState(4);
  const [feedback, setFeedback] = React.useState("");

  const pendingEnrollments = enrollments.filter((e) => e.status !== "attended");

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast("error", "กรุณาระบุชื่อกิจกรรม");
      return;
    }
    createActivity({
      title: newTitle.trim(),
      description: newDesc.trim() || "กิจกรรมเสริมสร้างทักษะนักศึกษา มรภ.จันทรเกษม",
      category: newCat as any,
      location: newLocation.trim() || "อาคาร 15 มรภ.จันทรเกษม",
      maxParticipants: Number(newMax) || 40,
      startDate: new Date().toISOString(),
      skillIds: [selectedSkillId],
      organizerId: user?.id || "lec-test-01",
    });
    addToast("success", `เปิดรับสมัครกิจกรรม "${newTitle}" เรียบร้อยแล้ว`);
    setCreateOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewLocation("");
  };

  const handleOpenVerify = () => {
    if (pendingEnrollments.length > 0 && !selectedEnrollmentId) {
      setSelectedEnrollmentId(pendingEnrollments[0].id);
    }
    setVerifyOpen(true);
  };

  const handleApproveEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = selectedEnrollmentId || pendingEnrollments[0]?.id;
    if (!targetId) {
      addToast("warning", "ยังไม่มีรายการรอรับรอง");
      return;
    }
    verifyAndAssess({
      enrollmentId: targetId,
      skillId: assessSkillId,
      level: skillLevel as 1 | 2 | 3 | 4 | 5,
      assessedBy: user?.id || "lec-test-01",
      feedback,
    });
    addToast("success", `รับรองผลงานและบันทึกทักษะระดับ ${skillLevel}/5 สำเร็จ`);
    setVerifyOpen(false);
    setFeedback("");
    setSelectedEnrollmentId("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/dashboard" />
            <Breadcrumb items={[{ label: "จัดการกิจกรรม / รับรองผล" }]} />
          </div>
          <h1 className="text-2xl font-bold">พื้นที่ทำงานอาจารย์ / ผู้จัดกิจกรรม</h1>
          <p className="text-sm text-muted-foreground">
            สร้างกิจกรรม กำหนดทักษะที่คาดหวัง และตรวจรับรองหลักฐานนักศึกษา
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenVerify}>
            <ClipboardCheck className="h-4 w-4" /> ตรวจรับรองหลักฐาน ({pendingEnrollments.length})
          </Button>
          <Button variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> สร้างกิจกรรมใหม่
          </Button>
        </div>
      </div>

      {/* Data Table / Empty State */}
      {activities.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Calendar className="h-8 w-8" />}
            title="ยังไม่มีกิจกรรมที่สร้าง"
            description="เริ่มต้นสร้างกิจกรรมแรกของคุณ เพื่อให้นักศึกษาสามารถสมัครเข้าร่วมและส่งหลักฐานได้"
            action={{ label: "สร้างกิจกรรมใหม่", onClick: () => setCreateOpen(true) }}
          />
        </Card>
      ) : (
        <DataTable
          data={activities}
          columns={[
            {
              key: "title",
              header: "ชื่อกิจกรรม",
              sortable: true,
              render: (a) => (
                <div>
                  <p className="font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.location}</p>
                </div>
              ),
            },
            {
              key: "startDate",
              header: "วันที่จัด",
              sortable: true,
              render: (a) => <span className="text-xs">{formatDateShort(a.startDate)}</span>,
            },
            {
              key: "currentParticipants",
              header: "ผู้สมัคร",
              render: (a) => (
                <span className="inline-flex items-center gap-1 text-xs font-medium">
                  <Users className="h-3.5 w-3.5 text-primary-700" />
                  {a.currentParticipants} / {a.maxParticipants}
                </span>
              ),
            },
            {
              key: "status",
              header: "สถานะ",
              render: (a) => {
                const s = BADGE_VARIANTS[a.status];
                return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>{s.label}</span>;
              },
            },
            {
              key: "actions",
              header: "จัดการ",
              render: (a) => (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={handleOpenVerify}>
                    ตรวจรับรองผล
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { deleteActivity(a.id); addToast("info", "ลบกิจกรรมแล้ว"); }}
                  >
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              ),
            },
          ]}
          mobileCardRender={(a) => (
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{formatDateShort(a.startDate)}</Badge>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_VARIANTS[a.status].className}`}>
                  {BADGE_VARIANTS[a.status].label}
                </span>
              </div>
              <h3 className="font-semibold text-sm">{a.title}</h3>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  ผู้สมัคร {a.currentParticipants}/{a.maxParticipants} คน
                </span>
                <div className="flex gap-1.5">
                  <Button variant="secondary" size="sm" onClick={handleOpenVerify}>ตรวจรับรองผล</Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteActivity(a.id)}>
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        />
      )}

      {/* Mobile FAB */}
      <FAB icon={<Plus className="h-5 w-5" />} label="สร้างกิจกรรม" onClick={() => setCreateOpen(true)} />

      {/* Create Activity Modal / Sheet */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="สร้างกิจกรรมใหม่"
        description="กำหนดรายละเอียด เงื่อนไข และทักษะที่คาดหวัง"
      >
        <form onSubmit={handleCreateActivity} className="space-y-4">
          <Input label="ชื่อกิจกรรม" placeholder="เช่น อบรมการนำเสนอผลงาน" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="ประเภทกิจกรรม"
              value={newCat}
              onChange={setNewCat}
              options={[
                { value: "training", label: "อบรม" },
                { value: "workshop", label: "เวิร์กช็อป" },
                { value: "club", label: "ชมรม" },
                { value: "project", label: "โครงงาน" },
                { value: "volunteer", label: "จิตอาสา" },
              ]}
            />
            <Input label="จำนวนรับ (คน)" type="number" value={newMax} onChange={(e) => setNewMax(e.target.value)} />
          </div>
          <Select
            label="ทักษะหลักที่คาดหวัง"
            value={selectedSkillId}
            onChange={setSelectedSkillId}
            options={CRU_SKILLS.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Input label="สถานที่จัดกิจกรรม" placeholder="อาคาร 15 มรภ.จันทรเกษม" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
          <Textarea label="รายละเอียดกิจกรรม" placeholder="วัตถุประสงค์และหลักฐานที่นักศึกษาต้องส่ง..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>ยกเลิก</Button>
            <Button type="submit" variant="accent">บันทึก / เปิดรับสมัคร</Button>
          </div>
        </form>
      </Modal>

      {/* Verify & Assess Evidence Modal / Sheet */}
      <Modal
        isOpen={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="ตรวจรับรองหลักฐานและประเมินทักษะ"
        description="เลือกผู้สมัครและประเมินระดับทักษะ 1–5"
      >
        {pendingEnrollments.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="h-8 w-8" />}
            title="ไม่มีรายการรอรับรองผล"
            description="ยังไม่มีนักศึกษาที่สมัครกิจกรรมหรือส่งหลักฐานเข้ามาในขณะนี้"
            className="py-8"
          />
        ) : (
          <form onSubmit={handleApproveEvidence} className="space-y-4">
            <Select
              label="เลือกรายการผู้สมัคร"
              value={selectedEnrollmentId || pendingEnrollments[0].id}
              onChange={setSelectedEnrollmentId}
              options={pendingEnrollments.map((enr) => {
                const act = activities.find((a) => a.id === enr.activityId);
                const ev = evidences.find((e) => e.enrollmentId === enr.id);
                return {
                  value: enr.id,
                  label: `${act?.title || "กิจกรรม"} — ${ev ? `ส่งหลักฐาน: ${ev.title}` : "รอส่งหลักฐาน"}`,
                };
              })}
            />

            <Select
              label="ทักษะที่ประเมิน"
              value={assessSkillId}
              onChange={setAssessSkillId}
              options={CRU_SKILLS.map((s) => ({ value: s.id, label: s.name }))}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">ประเมินระดับทักษะ (1–5)</label>
              <div className="flex items-center gap-4">
                <Rating value={skillLevel} onChange={setSkillLevel} size="lg" />
                <Badge variant="accent">
                  ระดับ {skillLevel}: {SKILL_LEVELS[skillLevel - 1]?.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {SKILL_LEVELS[skillLevel - 1]?.description}
              </p>
            </div>

            <Textarea
              label="ข้อเสนอแนะจากอาจารย์"
              placeholder="ความเห็นเพิ่มเติมสำหรับนักศึกษา..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setVerifyOpen(false)}>ปิด</Button>
              <Button type="submit" variant="accent">
                <CheckCircle2 className="h-4 w-4" /> ยืนยันรับรองผล
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
