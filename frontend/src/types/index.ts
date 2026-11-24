// ==========================================
// CRU Student Portfolio — Type Definitions
// ==========================================

export type UserRole = "student" | "lecturer" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  studentId?: string;
  faculty?: string;
  department?: string;
  yearLevel?: number;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: ActivityStatus;
  skills: SkillTag[];
  organizerId: string;
  organizer?: User;
  imageUrl?: string;
  createdAt: string;
}

export type ActivityCategory =
  | "training" | "workshop" | "seminar" | "club"
  | "volunteer" | "competition" | "project";

export type ActivityStatus =
  | "draft" | "open" | "closed" | "in_progress" | "completed" | "cancelled";

export interface Enrollment {
  id: string;
  activityId: string;
  studentId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  attendedAt?: string;
  activity?: Activity;
  student?: User;
}

export type EnrollmentStatus =
  | "pending" | "approved" | "attended" | "absent" | "cancelled";

export interface Evidence {
  id: string;
  enrollmentId: string;
  type: EvidenceType;
  title: string;
  description: string;
  fileUrl?: string;
  reflection?: string;
  submittedAt: string;
  enrollment?: Enrollment;
}

export type EvidenceType = "file" | "link" | "reflection" | "certificate";

export interface SkillTag {
  id: string;
  name: string;
  category: SkillCategory;
  color?: string;
}

export type SkillCategory =
  | "hard_skill" | "soft_skill" | "leadership"
  | "creativity" | "communication" | "teamwork";

export interface SkillAssessment {
  id: string;
  enrollmentId: string;
  skillId: string;
  level: 1 | 2 | 3 | 4 | 5;
  assessedBy: string;
  assessedAt: string;
  verified: boolean;
  skill?: SkillTag;
}

export interface PortfolioItem {
  id: string;
  studentId: string;
  activityId: string;
  evidenceId?: string;
  isPublic: boolean;
  displayOrder: number;
  activity?: Activity;
  evidence?: Evidence;
  assessments?: SkillAssessment[];
}

export interface SkillRadarData {
  skill: string;
  level: number;
  maxLevel: number;
}

export const BADGE_VARIANTS = {
  open: { label: "เปิดรับสมัคร", className: "bg-success-light text-green-700" },
  closed: { label: "ปิดรับสมัคร", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "กำลังดำเนินการ", className: "bg-info-light text-blue-700" },
  completed: { label: "เสร็จสิ้น", className: "bg-primary-100 text-primary-700" },
  cancelled: { label: "ยกเลิก", className: "bg-error-light text-red-700" },
  draft: { label: "ร่าง", className: "bg-warning-light text-amber-700" },
  pending: { label: "รอดำเนินการ", className: "bg-warning-light text-amber-700" },
  approved: { label: "อนุมัติ", className: "bg-success-light text-green-700" },
  attended: { label: "เข้าร่วมแล้ว", className: "bg-primary-100 text-primary-700" },
  absent: { label: "ขาด", className: "bg-error-light text-red-700" },
} as const;

export const SKILL_LEVELS = [
  { level: 1, label: "เริ่มต้น", description: "กำลังเริ่มเรียนรู้" },
  { level: 2, label: "ปฏิบัติตามคำแนะนำ", description: "ทำได้เมื่อมีคำปรึกษา" },
  { level: 3, label: "ปฏิบัติได้ด้วยตนเอง", description: "ทำงานเสร็จสิ้นได้ตามลำพัง" },
  { level: 4, label: "ประยุกต์ใช้ได้", description: "ปรับใช้ในสถานการณ์ใหม่ได้" },
  { level: 5, label: "ถ่ายทอดและนำผู้อื่นได้", description: "เป็นพี่เลี้ยงหรือสอนผู้อื่นได้" },
] as const;

export const ACTIVITY_CATEGORIES: Record<ActivityCategory, { label: string; icon: string }> = {
  training: { label: "อบรม", icon: "GraduationCap" },
  workshop: { label: "เวิร์กช็อป", icon: "Wrench" },
  seminar: { label: "สัมมนา", icon: "Presentation" },
  club: { label: "ชมรม", icon: "Users" },
  volunteer: { label: "จิตอาสา", icon: "Heart" },
  competition: { label: "แข่งขัน", icon: "Trophy" },
  project: { label: "โครงงาน", icon: "FolderKanban" },
};
