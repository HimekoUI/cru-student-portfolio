"use client";

import React from "react";
import { User, UserRole } from "@/types";

export interface TestAccount {
  username: string;
  password: string;
  role: UserRole;
  user: User;
}

export const TEST_ACCOUNTS: TestAccount[] = [
  {
    username: "student_test",
    password: "password123",
    role: "student",
    user: {
      id: "stu-test-01",
      email: "student_test@chandra.ac.th",
      fullName: "นักศึกษา ทดสอบ (Student Test)",
      studentId: "6600000001",
      faculty: "คณะวิทยาศาสตร์",
      department: "วิทยาการคอมพิวเตอร์",
      yearLevel: 3,
      role: "student",
      createdAt: "2026-11-25T00:00:00Z",
    },
  },
  {
    username: "lecturer_test",
    password: "password123",
    role: "lecturer",
    user: {
      id: "lec-test-01",
      email: "lecturer_test@chandra.ac.th",
      fullName: "อาจารย์ ทดสอบ (Lecturer Test)",
      faculty: "คณะวิทยาศาสตร์",
      department: "วิทยาการคอมพิวเตอร์",
      role: "lecturer",
      createdAt: "2026-11-25T00:00:00Z",
    },
  },
  {
    username: "admin_test",
    password: "password123",
    role: "admin",
    user: {
      id: "adm-test-01",
      email: "admin_test@chandra.ac.th",
      fullName: "ผู้ดูแลระบบ ทดสอบ (Admin Test)",
      faculty: "สำนักส่งเสริมวิชาการและงานทะเบียน",
      role: "admin",
      createdAt: "2026-11-25T00:00:00Z",
    },
  },
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithCredentials: (
    username: string,
    password: string,
    portalRole: UserRole
  ) => Promise<{ ok: boolean; error?: string; user?: User }>;
  register: (data: {
    fullName: string;
    username: string;
    password: string;
    studentId?: string;
    faculty?: string;
    role: UserRole;
  }) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registeredUsers: User[];
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = "cru_active_user";
const STORAGE_CUSTOM_ACCOUNTS_KEY = "cru_custom_accounts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [customAccounts, setCustomAccounts] = React.useState<TestAccount[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
      const savedCustom = localStorage.getItem(STORAGE_CUSTOM_ACCOUNTS_KEY);
      if (savedCustom) setCustomAccounts(JSON.parse(savedCustom));
    } catch {
      // ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const allAccounts = React.useMemo(
    () => [...TEST_ACCOUNTS, ...customAccounts],
    [customAccounts]
  );

  const loginWithCredentials = async (
    username: string,
    password: string,
    portalRole: UserRole
  ): Promise<{ ok: boolean; error?: string; user?: User }> => {
    const cleanUser = username.trim().toLowerCase();
    const matched = allAccounts.find(
      (acc) =>
        (acc.username.toLowerCase() === cleanUser ||
          acc.user.email.toLowerCase() === cleanUser) &&
        acc.password === password
    );

    if (!matched) {
      return { ok: false, error: "Username หรือ Password ไม่ถูกต้อง" };
    }

    if (matched.role !== portalRole) {
      const roleThai =
        matched.role === "student"
          ? "นักศึกษา"
          : matched.role === "lecturer"
          ? "อาจารย์"
          : "ผู้ดูแลระบบ";
      return {
        ok: false,
        error: `บัญชีนี้เป็นสิทธิ์ "${roleThai}" กรุณาเลือกทางเข้าให้ตรงกับบทบาท`,
      };
    }

    setUser(matched.user);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(matched.user));
    return { ok: true, user: matched.user };
  };

  const register = async (data: {
    fullName: string;
    username: string;
    password: string;
    studentId?: string;
    faculty?: string;
    role: UserRole;
  }): Promise<User> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.username.includes("@")
        ? data.username
        : `${data.username}@chandra.ac.th`,
      fullName: data.fullName,
      studentId: data.role === "student" ? data.studentId : undefined,
      faculty: data.faculty || "คณะวิทยาศาสตร์",
      department: "วิทยาการคอมพิวเตอร์",
      yearLevel: data.role === "student" ? 1 : undefined,
      role: data.role,
      createdAt: new Date().toISOString(),
    };

    const newAccount: TestAccount = {
      username: data.username.trim(),
      password: data.password,
      role: data.role,
      user: newUser,
    };

    const updated = [...customAccounts, newAccount];
    setCustomAccounts(updated);
    localStorage.setItem(STORAGE_CUSTOM_ACCOUNTS_KEY, JSON.stringify(updated));

    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const switchRole = (role: UserRole) => {
    const found = TEST_ACCOUNTS.find((a) => a.role === role);
    if (found) {
      setUser(found.user);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(found.user));
    }
  };

  const registeredUsers = React.useMemo(
    () => allAccounts.map((a) => a.user),
    [allAccounts]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithCredentials,
        register,
        logout,
        switchRole,
        registeredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
