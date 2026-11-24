"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Share2, CheckCircle2, FileText, Eye, EyeOff, ExternalLink, Award, FolderKanban } from "lucide-react";
import {
  Breadcrumb, BackButton, Card, CardHeader, CardTitle, CardContent, Badge,
  Button, Switch, Avatar, Rating, Tabs, Modal, EmptyState, useToast
} from "@/components/ui";
import { SkillRadarChart } from "@/components/portfolio/skill-radar-chart";
import { useAuth } from "@/stores/auth-context";
import { useAppStore } from "@/stores/app-store";
import { PortfolioItem } from "@/types";
import { formatDate } from "@/lib/utils";

export default function PortfolioPage() {
  const { user } = useAuth();
  const { portfolioItems, assessments, radarData, togglePortfolioPublic } = useAppStore();
  const { addToast } = useToast();
  const router = useRouter();

  const [selectedSkill, setSelectedSkill] = React.useState<string>("การสื่อสาร");
  const [activeTab, setActiveTab] = React.useState("works");
  const [previewItem, setPreviewItem] = React.useState<PortfolioItem | null>(null);

  const myItems = portfolioItems.filter((p) => !user || p.studentId === user.id);

  const handleTogglePublic = (id: string) => {
    togglePortfolioPublic(id);
    addToast("info", "อัปเดตการตั้งค่าการเผยแพร่ผลงานแล้ว");
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/portfolio?u=${user?.studentId || "cru"}`;
    navigator.clipboard?.writeText(shareUrl);
    addToast("success", "คัดลอกลิงก์แชร์ Portfolio เรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/dashboard" />
            <Breadcrumb items={[{ label: "Portfolio ของฉัน" }]} />
          </div>
          <h1 className="text-2xl font-bold">แฟ้มสะสมผลงาน (Portfolio)</h1>
        </div>
        <Button variant="accent" onClick={handleCopyShareLink}>
          <Share2 className="h-4 w-4" /> คัดลอกลิงก์แชร์
        </Button>
      </div>

      {/* Profile Header Card — CRU Gray-Yellow */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary-800 via-primary-700 to-accent-500" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <Avatar name={user?.fullName || "CRU"} size="xl" className="ring-4 ring-card h-20 w-20 text-xl" />
              <div className="pb-1">
                <h2 className="text-xl font-bold">{user?.fullName || "ผู้ใช้งาน"}</h2>
                <p className="text-sm text-muted-foreground">
                  {user?.faculty || "มหาวิทยาลัยราชภัฏจันทรเกษม"} {user?.department ? `• ${user.department}` : ""}
                </p>
              </div>
            </div>
            <Badge variant="success" className="self-start sm:self-end">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> ยืนยันตัวตนแล้ว
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Skill Radar + Evidence Inspector */}
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">กราฟทักษะที่เปิดดูหลักฐานได้</CardTitle>
            <p className="text-xs text-muted-foreground">คลิกที่ชื่อทักษะบนกราฟเพื่อดูหลักฐานประกอบ</p>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <EmptyState
                icon={<Award className="h-7 w-7" />}
                title="ยังไม่มีคะแนนทักษะ"
                description="เมื่ออาจารย์ประเมินหลักฐานของคุณ กราฟทักษะจะปรากฏที่นี่"
                className="py-10"
              />
            ) : (
              <SkillRadarChart data={radarData} onSelectSkill={setSelectedSkill} height={270} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">หลักฐานประกอบทักษะ: {selectedSkill}</CardTitle>
              <Badge variant="accent">
                ระดับ {radarData.find((d) => d.skill === selectedSkill)?.level ?? 0} / 5
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {myItems.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-7 w-7" />}
                title="ยังไม่มีหลักฐานที่รับรองแล้ว"
                description="สมัครกิจกรรมและส่งหลักฐาน เพื่อให้อาจารย์ตรวจสอบและรับรองเข้าสู่ Portfolio"
                action={{ label: "ดูกิจกรรมที่เปิดรับ", onClick: () => router.push("/activities") }}
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {myItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border p-4 space-y-2 bg-muted/20">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="success" className="mb-1">อาจารย์รับรองแล้ว</Badge>
                        <h4 className="font-semibold text-sm">{item.activity?.title}</h4>
                      </div>
                      <Rating value={item.assessments?.[0]?.level || 0} readonly size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">หลักฐาน:</strong> {item.evidence?.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Items with Visibility Switch */}
      <div className="space-y-4">
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "works", label: "ผลงานที่คัดเลือก" },
            { id: "timeline", label: "ไทม์ไลน์พัฒนาการ" },
          ]}
        />

        {myItems.length === 0 ? (
          <Card>
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title="ยังไม่มีผลงานใน Portfolio"
              description="เริ่มต้นด้วยการสมัครเข้าร่วมกิจกรรมระหว่างเรียนและส่งหลักฐานผลงาน"
              action={{ label: "ไปหน้ากิจกรรม", onClick: () => router.push("/activities") }}
            />
          </Card>
        ) : activeTab === "works" ? (
          <div className="grid md:grid-cols-2 gap-4">
            {myItems.map((item) => (
              <Card key={item.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.isPublic ? "success" : "secondary"}>
                        {item.isPublic ? <><Eye className="h-3 w-3 mr-1" /> เปิดเผย</> : <><EyeOff className="h-3 w-3 mr-1" /> ซ่อนไว้</>}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.evidence?.submittedAt && formatDate(item.evidence.submittedAt)}
                      </span>
                    </div>
                    <h3 className="font-bold text-base">{item.activity?.title}</h3>
                  </div>
                  <Switch checked={item.isPublic} onChange={() => handleTogglePublic(item.id)} />
                </div>

                <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <FileText className="h-4 w-4 text-primary-700" />
                    <span>{item.evidence?.title}</span>
                  </div>
                  <p className="text-muted-foreground">{item.evidence?.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex gap-1.5 flex-wrap">
                    {item.assessments?.map((as) => (
                      <Badge key={as.id} variant="outline" className="text-[11px]">
                        {as.skill?.name}: {as.level}/5
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewItem(item)}>
                    <ExternalLink className="h-3.5 w-3.5" /> เปิดดูหลักฐาน
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <div className="space-y-6 border-l-2 border-accent-400 pl-6 ml-2">
              {myItems.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-accent-500 ring-4 ring-accent-100" />
                  <p className="text-xs text-muted-foreground">
                    {item.evidence?.submittedAt && formatDate(item.evidence.submittedAt)}
                  </p>
                  <h4 className="font-semibold text-sm mt-0.5">{item.activity?.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.evidence?.title}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Evidence Detail Modal / Sheet */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.activity?.title}
        description="รายละเอียดหลักฐานและผลการรับรอง"
      >
        {previewItem && (
          <div className="space-y-4 text-sm">
            <div className="rounded-xl bg-muted/50 p-4 space-y-2">
              <p className="font-semibold">{previewItem.evidence?.title}</p>
              <p className="text-xs text-muted-foreground">{previewItem.evidence?.description}</p>
              {previewItem.evidence?.reflection && (
                <p className="text-xs italic text-foreground border-l-2 border-accent-400 pl-3 mt-2">
                  “{previewItem.evidence.reflection}”
                </p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">ผลการประเมินทักษะ</p>
              <div className="flex flex-wrap gap-2">
                {previewItem.assessments?.map((as) => (
                  <Badge key={as.id} variant="accent">
                    {as.skill?.name}: {as.level}/5
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
