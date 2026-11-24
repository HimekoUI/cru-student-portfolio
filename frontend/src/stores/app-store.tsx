"use client";

import React from "react";
import {
  Activity,
  ActivityCategory,
  ActivityStatus,
  Enrollment,
  Evidence,
  PortfolioItem,
  SkillAssessment,
  SkillRadarData,
  SkillTag,
} from "@/types";

export const CRU_SKILLS: SkillTag[] = [
  { id: "sk-1", name: "การสื่อสาร", category: "communication" },
  { id: "sk-2", name: "ทีมเวิร์ก", category: "teamwork" },
  { id: "sk-3", name: "วิเคราะห์", category: "hard_skill" },
  { id: "sk-4", name: "ดิจิทัล", category: "hard_skill" },
  { id: "sk-5", name: "ผู้นำ", category: "leadership" },
  { id: "sk-6", name: "รับผิดชอบ", category: "soft_skill" },
];

interface AppStoreContextType {
  activities: Activity[];
  enrollments: Enrollment[];
  evidences: Evidence[];
  assessments: SkillAssessment[];
  portfolioItems: PortfolioItem[];
  radarData: SkillRadarData[];

  createActivity: (input: {
    title: string;
    description: string;
    category: ActivityCategory;
    location: string;
    maxParticipants: number;
    startDate: string;
    skillIds: string[];
    organizerId: string;
  }) => Activity;

  updateActivityStatus: (activityId: string, status: ActivityStatus) => void;
  deleteActivity: (activityId: string) => void;

  enrollActivity: (activityId: string, studentId: string) => void;
  cancelEnrollment: (activityId: string, studentId: string) => void;

  submitEvidence: (input: {
    activityId: string;
    studentId: string;
    title: string;
    description: string;
    reflection: string;
    fileName?: string;
  }) => void;

  verifyAndAssess: (input: {
    enrollmentId: string;
    skillId: string;
    level: 1 | 2 | 3 | 4 | 5;
    assessedBy: string;
    feedback?: string;
  }) => void;

  addPortfolioItem: (input: {
    studentId: string;
    title: string;
    category: ActivityCategory;
    evidenceTitle: string;
    description: string;
    reflection: string;
    skillId: string;
    fileName?: string;
  }) => void;

  togglePortfolioPublic: (portfolioItemId: string) => void;
  resetAllData: () => void;
}

const AppStoreContext = React.createContext<AppStoreContextType | undefined>(undefined);

const STORE_KEY = "cru_portfolio_empty_store_v1";

interface PersistedState {
  activities: Activity[];
  enrollments: Enrollment[];
  evidences: Evidence[];
  assessments: SkillAssessment[];
  portfolioItems: PortfolioItem[];
}

const EMPTY_STATE: PersistedState = {
  activities: [],
  enrollments: [],
  evidences: [],
  assessments: [],
  portfolioItems: [],
};

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<PersistedState>(EMPTY_STATE);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        setState(JSON.parse(raw));
      }
    } catch {
      // keep empty state
    }
  }, []);

  const persist = (updater: (prev: PersistedState) => PersistedState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };

  const createActivity: AppStoreContextType["createActivity"] = (input) => {
    const selectedSkills = CRU_SKILLS.filter((s) => input.skillIds.includes(s.id));
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      title: input.title,
      description: input.description,
      category: input.category,
      startDate: input.startDate || new Date().toISOString(),
      endDate: input.startDate || new Date().toISOString(),
      location: input.location,
      maxParticipants: input.maxParticipants,
      currentParticipants: 0,
      status: "open",
      skills: selectedSkills.length > 0 ? selectedSkills : [CRU_SKILLS[0]],
      organizerId: input.organizerId,
      createdAt: new Date().toISOString(),
    };
    persist((prev) => ({
      ...prev,
      activities: [newAct, ...prev.activities],
    }));
    return newAct;
  };

  const updateActivityStatus = (activityId: string, status: ActivityStatus) => {
    persist((prev) => ({
      ...prev,
      activities: prev.activities.map((a) => (a.id === activityId ? { ...a, status } : a)),
    }));
  };

  const deleteActivity = (activityId: string) => {
    persist((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== activityId),
      enrollments: prev.enrollments.filter((e) => e.activityId !== activityId),
      portfolioItems: prev.portfolioItems.filter((p) => p.activityId !== activityId),
    }));
  };

  const enrollActivity = (activityId: string, studentId: string) => {
    persist((prev) => {
      const exists = prev.enrollments.some(
        (e) => e.activityId === activityId && e.studentId === studentId && e.status !== "cancelled"
      );
      if (exists) return prev;

      const newEnrollment: Enrollment = {
        id: `enr-${Date.now()}`,
        activityId,
        studentId,
        status: "approved",
        enrolledAt: new Date().toISOString(),
      };

      return {
        ...prev,
        enrollments: [newEnrollment, ...prev.enrollments],
        activities: prev.activities.map((a) =>
          a.id === activityId
            ? { ...a, currentParticipants: a.currentParticipants + 1 }
            : a
        ),
      };
    });
  };

  const cancelEnrollment = (activityId: string, studentId: string) => {
    persist((prev) => ({
      ...prev,
      enrollments: prev.enrollments.filter(
        (e) => !(e.activityId === activityId && e.studentId === studentId)
      ),
      activities: prev.activities.map((a) =>
        a.id === activityId
          ? { ...a, currentParticipants: Math.max(0, a.currentParticipants - 1) }
          : a
      ),
    }));
  };

  const submitEvidence: AppStoreContextType["submitEvidence"] = (input) => {
    persist((prev) => {
      const enrollment = prev.enrollments.find(
        (e) => e.activityId === input.activityId && e.studentId === input.studentId
      );
      if (!enrollment) return prev;

      const newEvidence: Evidence = {
        id: `ev-${Date.now()}`,
        enrollmentId: enrollment.id,
        type: input.fileName ? "file" : "reflection",
        title: input.title || (input.fileName ? `ไฟล์แนบ: ${input.fileName}` : "บันทึกสะท้อนการเรียนรู้"),
        description: input.description,
        fileUrl: input.fileName ? `/uploads/${input.fileName}` : undefined,
        reflection: input.reflection,
        submittedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        evidences: [newEvidence, ...prev.evidences],
      };
    });
  };

  const verifyAndAssess: AppStoreContextType["verifyAndAssess"] = (input) => {
    persist((prev) => {
      const enrollment = prev.enrollments.find((e) => e.id === input.enrollmentId);
      if (!enrollment) return prev;

      const skill = CRU_SKILLS.find((s) => s.id === input.skillId) || CRU_SKILLS[0];
      const newAssessment: SkillAssessment = {
        id: `as-${Date.now()}`,
        enrollmentId: enrollment.id,
        skillId: skill.id,
        level: input.level,
        assessedBy: input.assessedBy,
        assessedAt: new Date().toISOString(),
        verified: true,
        skill,
      };

      const evidence = prev.evidences.find((ev) => ev.enrollmentId === enrollment.id);
      const activity = prev.activities.find((a) => a.id === enrollment.activityId);

      const alreadyInPortfolio = prev.portfolioItems.some(
        (p) => p.studentId === enrollment.studentId && p.activityId === enrollment.activityId
      );

      const nextPortfolio = alreadyInPortfolio
        ? prev.portfolioItems.map((p) =>
            p.studentId === enrollment.studentId && p.activityId === enrollment.activityId
              ? { ...p, assessments: [...(p.assessments || []), newAssessment] }
              : p
          )
        : [
            {
              id: `pf-${Date.now()}`,
              studentId: enrollment.studentId,
              activityId: enrollment.activityId,
              evidenceId: evidence?.id,
              isPublic: true,
              displayOrder: prev.portfolioItems.length + 1,
              activity,
              evidence,
              assessments: [newAssessment],
            },
            ...prev.portfolioItems,
          ];

      return {
        ...prev,
        enrollments: prev.enrollments.map((e) =>
          e.id === enrollment.id
            ? { ...e, status: "attended", attendedAt: new Date().toISOString() }
            : e
        ),
        assessments: [newAssessment, ...prev.assessments],
        portfolioItems: nextPortfolio,
      };
    });
  };

  const togglePortfolioPublic = (portfolioItemId: string) => {
    persist((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.map((p) =>
        p.id === portfolioItemId ? { ...p, isPublic: !p.isPublic } : p
      ),
    }));
  };

  const addPortfolioItem: AppStoreContextType["addPortfolioItem"] = (input) => {
    persist((prev) => {
      const now = Date.now();
      const matchedSkill = CRU_SKILLS.find((s) => s.id === input.skillId) || CRU_SKILLS[0];

      const newActivity: Activity = {
        id: `act-pf-${now}`,
        title: input.title,
        description: input.description,
        category: input.category,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: "แฟ้มสะสมผลงานนักศึกษา",
        maxParticipants: 1,
        currentParticipants: 1,
        status: "completed",
        skills: [matchedSkill],
        organizerId: input.studentId,
        createdAt: new Date().toISOString(),
      };

      const newEnrollment: Enrollment = {
        id: `enr-pf-${now}`,
        activityId: newActivity.id,
        studentId: input.studentId,
        status: "attended",
        enrolledAt: new Date().toISOString(),
        attendedAt: new Date().toISOString(),
      };

      const newEvidence: Evidence = {
        id: `ev-pf-${now}`,
        enrollmentId: newEnrollment.id,
        type: "file",
        title: input.evidenceTitle || input.title,
        description: input.description,
        reflection: input.reflection,
        fileUrl: input.fileName ? `/uploads/${input.fileName}` : undefined,
        submittedAt: new Date().toISOString(),
      };

      const newPortfolioItem: PortfolioItem = {
        id: `pf-${now}`,
        studentId: input.studentId,
        activityId: newActivity.id,
        activity: newActivity,
        evidenceId: newEvidence.id,
        evidence: newEvidence,
        assessments: [],
        isPublic: true,
        displayOrder: prev.portfolioItems.length + 1,
      };

      return {
        ...prev,
        activities: [newActivity, ...prev.activities],
        enrollments: [newEnrollment, ...prev.enrollments],
        evidences: [newEvidence, ...prev.evidences],
        portfolioItems: [newPortfolioItem, ...prev.portfolioItems],
      };
    });
  };

  const resetAllData = () => {
    setState(EMPTY_STATE);
    localStorage.removeItem(STORE_KEY);
  };

  const radarData: SkillRadarData[] = React.useMemo(() => {
    return CRU_SKILLS.map((sk) => {
      const matched = state.assessments.filter((a) => a.skillId === sk.id);
      const avg =
        matched.length > 0
          ? Number(
              (matched.reduce((sum, a) => sum + a.level, 0) / matched.length).toFixed(1)
            )
          : 0;
      return { skill: sk.name, level: avg, maxLevel: 5 };
    });
  }, [state.assessments]);

  return (
    <AppStoreContext.Provider
      value={{
        activities: state.activities,
        enrollments: state.enrollments,
        evidences: state.evidences,
        assessments: state.assessments,
        portfolioItems: state.portfolioItems,
        radarData,
        createActivity,
        updateActivityStatus,
        deleteActivity,
        enrollActivity,
        cancelEnrollment,
        submitEvidence,
        verifyAndAssess,
        addPortfolioItem,
        togglePortfolioPublic,
        resetAllData,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = React.useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
