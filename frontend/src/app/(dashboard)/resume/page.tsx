"use client";

import React from "react";
import { Printer, CheckCircle2, GraduationCap, Award, Briefcase } from "lucide-react";
import { Breadcrumb, BackButton, Card, CardHeader, CardTitle, CardContent, Button, Divider, useToast } from "@/components/ui";
import { useAuth } from "@/stores/auth-context";
import { useAppStore } from "@/stores/app-store";

export default function ResumePage() {
  const { user } = useAuth();
  const { portfolioItems, radarData, assessments } = useAppStore();
  const { addToast } = useToast();

  const myItems = portfolioItems.filter((p) => !user || p.studentId === user.id);

  const [includeEducation, setIncludeEducation] = React.useState(true);
  const [includeSkills, setIncludeSkills] = React.useState(true);
  const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSelectedItemIds(myItems.map((p) => p.id));
  }, [portfolioItems.length]);

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePrintPDF = () => {
    addToast("info", "กำลังเปิดหน้าต่างสร้าง Resume PDF...");
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BackButton fallbackHref="/portfolio" />
            <Breadcrumb items={[{ label: "Portfolio", href: "/portfolio" }, { label: "สร้าง Resume PDF" }]} />
          </div>
          <h1 className="text-2xl font-bold">สร้าง Resume จาก Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            เลือกข้อมูลการศึกษา ทักษะที่มีหลักฐาน และกิจกรรมที่ต้องการแสดง
          </p>
        </div>
        <Button variant="accent" size="lg" onClick={handlePrintPDF}>
          <Printer className="h-4 w-4" /> สร้าง Resume PDF
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configuration Controls */}
        <Card className="lg:col-span-4 print:hidden">
          <CardHeader>
            <CardTitle className="text-base">เลือกข้อมูลสำหรับ Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/40">
              <input
                type="checkbox"
                checked={includeEducation}
                onChange={(e) => setIncludeEducation(e.target.checked)}
                className="h-4 w-4 accent-accent-600"
              />
              <div>
                <p className="text-sm font-medium">ข้อมูลการศึกษา</p>
                <p className="text-xs text-muted-foreground">คณะ สาขา และรหัสนักศึกษา</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/40">
              <input
                type="checkbox"
                checked={includeSkills}
                onChange={(e) => setIncludeSkills(e.target.checked)}
                className="h-4 w-4 accent-accent-600"
              />
              <div>
                <p className="text-sm font-medium">ทักษะที่มีหลักฐานรับรอง</p>
                <p className="text-xs text-muted-foreground">ทักษะที่อาจารย์ประเมินแล้ว</p>
              </div>
            </label>

            <Divider label="กิจกรรมและผลงานที่ต้องการใช้" />

            {myItems.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                ยังไม่มีกิจกรรมที่ได้รับการรับรองในระบบ
              </p>
            ) : (
              <div className="space-y-2">
                {myItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="h-4 w-4 mt-0.5 accent-accent-600"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">{item.activity?.title}</p>
                      <p className="text-muted-foreground mt-0.5">{item.evidence?.title}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: A4 Live Preview */}
        <div className="lg:col-span-8">
          <div className="bg-white text-slate-900 rounded-xl border border-border shadow-lg p-8 sm:p-12 space-y-6 print:shadow-none print:border-0 print:p-0">
            <div className="h-2 w-full bg-gradient-to-r from-primary-800 to-accent-500 rounded-full" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-primary-700">RESUME / VERIFIED PORTFOLIO</p>
                <h2 className="text-2xl font-bold mt-1">{user?.fullName || "ชื่อ-นามสกุลผู้ใช้งาน"}</h2>
                <p className="text-sm text-slate-600">{user?.email || "—"}</p>
              </div>
              <div className="flex items-center gap-2 text-primary-900 bg-accent-50 px-3 py-2 rounded-lg border border-accent-300 self-start">
                <GraduationCap className="h-5 w-5 text-accent-700" />
                <div className="text-xs">
                  <p className="font-bold">มรภ.จันทรเกษม</p>
                  <p>Chandrakasem Rajabhat University</p>
                </div>
              </div>
            </div>

            {includeEducation && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-800 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-accent-600" /> การศึกษา (Education)
                </h3>
                <div className="pl-6">
                  <p className="font-semibold text-sm">มหาวิทยาลัยราชภัฏจันทรเกษม</p>
                  <p className="text-xs text-slate-600">
                    {user?.faculty || "—"} {user?.department ? `• สาขาวิชา${user.department}` : ""}
                  </p>
                </div>
              </section>
            )}

            {includeSkills && (
              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-800 flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent-600" /> ทักษะที่มีหลักฐานรับรอง (Verified Skills)
                </h3>
                <div className="flex flex-wrap gap-2 pl-6">
                  {assessments.length === 0 ? (
                    <span className="text-xs text-slate-400">ยังไม่มีทักษะที่ได้รับการประเมิน</span>
                  ) : (
                    radarData
                      .filter((s) => s.level > 0)
                      .map((s) => (
                        <span
                          key={s.skill}
                          className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 border border-slate-200"
                        >
                          {s.skill} <strong className="text-accent-700">{s.level}/5</strong>
                        </span>
                      ))
                  )}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary-800 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent-600" /> กิจกรรมและผลงานที่ได้รับการรับรอง (Verified Activities)
              </h3>
              <div className="space-y-4 pl-6">
                {myItems.filter((p) => selectedItemIds.includes(p.id)).length === 0 ? (
                  <p className="text-xs text-slate-400">ยังไม่มีรายการผลงานที่เลือก</p>
                ) : (
                  myItems
                    .filter((p) => selectedItemIds.includes(p.id))
                    .map((item) => (
                      <div key={item.id} className="border-l-2 border-accent-400 pl-4 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-sm">{item.activity?.title}</h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> อาจารย์รับรอง
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">ผลงาน: {item.evidence?.title}</p>
                        <p className="text-xs text-slate-500">{item.evidence?.description}</p>
                      </div>
                    ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
