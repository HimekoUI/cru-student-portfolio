"use client";

import React from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  GraduationCap,
  ArrowRight,
  FileText,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Users,
} from "lucide-react";
import { Button, Card, CardContent, Badge, Stepper } from "@/components/ui";

const WORKFLOW_STEPS = [
  { id: 1, title: "สร้างกิจกรรม", description: "อาจารย์กำหนดเงื่อนไข" },
  { id: 2, title: "สมัครเข้าร่วม", description: "นักศึกษาเลือกกิจกรรม" },
  { id: 3, title: "บันทึกผล", description: "ส่งหลักฐานผลงาน" },
  { id: 4, title: "ตรวจรับรอง", description: "ประเมินทักษะ 1–5" },
  { id: 5, title: "อัปเดตผลงาน", description: "Portfolio & Resume" },
];

export default function HomePage() {
  const heroRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-animate", {
        y: 28,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-800 text-accent-400 shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base text-foreground">CRU Student Portfolio</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2">มรภ.จันทรเกษม</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/register">
              <Button variant="ghost" size="sm">สมัครสมาชิก</Button>
            </Link>
            <Link href="/login">
              <Button variant="accent" size="sm">
                เข้าสู่ระบบ
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — CRU Gray & Yellow-Gold Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="hero-animate inline-flex items-center gap-2 rounded-full bg-white/10 border border-accent-400/40 px-3.5 py-1.5 text-xs font-medium text-accent-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>มหาวิทยาลัยราชภัฏจันทรเกษม • สีเทา–เหลือง</span>
            </div>

            <h1 className="hero-animate text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
              ประสบการณ์ระหว่างเรียน
              <span className="block text-accent-400 mt-1">มีหลักฐานที่นำไปใช้ต่อได้จริง</span>
            </h1>

            <p className="hero-animate text-base sm:text-lg text-primary-200 max-w-xl leading-relaxed">
              ระบบกิจกรรมและแฟ้มสะสมผลงานระหว่างเรียน สำหรับนักศึกษา อาจารย์ และผู้ดูแลระบบ
              รวบรวมผลงาน ผลประเมิน และส่งออก <strong className="text-white">Resume PDF</strong> อย่างเป็นทางการ
            </p>

            <div className="hero-animate flex flex-wrap gap-3 pt-2">
              <Link href="/login">
                <Button variant="accent" size="lg">
                  เข้าสู่ระบบ (3 ช่องทาง)
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/activities">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white">
                  ดูกิจกรรมที่เปิดรับ
                </Button>
              </Link>
            </div>
          </div>

          {/* 3 Login Portals Card */}
          <div className="hero-animate">
            <Card className="bg-card border-primary-700/40 shadow-2xl text-foreground">
              <CardContent className="p-6 space-y-4">
                <div className="border-b border-border pb-3">
                  <Badge variant="accent" className="mb-1">ทางเข้าสู่ระบบ 3 บทบาท</Badge>
                  <h3 className="font-bold text-lg">เลือกช่องทางเข้าใช้งานระบบ</h3>
                  <p className="text-xs text-muted-foreground">รองรับบัญชีทดสอบสำหรับทั้ง 3 กลุ่มผู้ใช้งาน</p>
                </div>

                <div className="space-y-2.5">
                  <Link href="/login" className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-accent-500 hover:bg-accent-50/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-800 text-accent-400 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">ทางเข้านักศึกษา</p>
                        <p className="text-xs text-muted-foreground font-mono">student_test / password123</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link href="/login" className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-accent-500 hover:bg-accent-50/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent-400 text-primary-900 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">ทางเข้าอาจารย์ / ผู้จัดกิจกรรม</p>
                        <p className="text-xs text-muted-foreground font-mono">lecturer_test / password123</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>

                  <Link href="/login" className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-accent-500 hover:bg-accent-50/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">ทางเข้าผู้ดูแลระบบ (Admin)</p>
                        <p className="text-xs text-muted-foreground font-mono">admin_test / password123</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="accent">5 ขั้นตอนหลัก</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold">กิจกรรมหนึ่งรายการ เชื่อมถึง Portfolio ได้อย่างไร</h2>
          <p className="text-sm text-muted-foreground">
            แยกการเข้าร่วมออกจากผลประเมินความสามารถอย่างชัดเจน พร้อมผู้รับรองทุกขั้นตอน
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <Stepper steps={WORKFLOW_STEPS} currentStep={0} />
        </Card>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Card hover className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">กราฟทักษะพร้อมหลักฐาน</h3>
            <p className="text-sm text-muted-foreground">
              แสดงระดับทักษะ 0–5 จากกิจกรรมจริงที่อาจารย์ประเมิน สามารถคลิกเปิดดูชิ้นงานและผู้รับรองได้ทันที
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-accent-100 text-accent-800 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">อาจารย์ตรวจและรับรองผล</h3>
            <p className="text-sm text-muted-foreground">
              สร้างกิจกรรม กำหนดทักษะที่คาดหวัง เช็กชื่อผู้เข้าร่วม และประเมินระดับทักษะจากหลักฐานที่นักศึกษาส่ง
            </p>
          </Card>

          <Card hover className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-success-light text-green-700 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">สร้าง Resume PDF ในคลิกเดียว</h3>
            <p className="text-sm text-muted-foreground">
              คัดเลือกกิจกรรม ทักษะ และข้อมูลการศึกษาที่ต้องการ เพื่อจัดทำ Resume พร้อมใช้งานสมัครงานและฝึกงาน
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 CRU Student Portfolio — มหาวิทยาลัยราชภัฏจันทรเกษม</p>
      </footer>
    </div>
  );
}
