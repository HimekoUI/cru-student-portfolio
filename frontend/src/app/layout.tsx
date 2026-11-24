import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/stores/auth-context";
import { AppStoreProvider } from "@/stores/app-store";
import { ToastProvider } from "@/components/ui/toast";

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-thai",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CRU Student Portfolio — ระบบกิจกรรมและแฟ้มสะสมผลงาน มรภ.จันทรเกษม",
  description:
    "ระบบรวบรวมประสบการณ์ระหว่างเรียน หลักฐานเชิงประจักษ์ กราฟทักษะ และสร้าง Resume PDF สำหรับนักศึกษามหาวิทยาลัยราชภัฏจันทรเกษม",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${ibmPlexThai.variable} ${inter.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <AppStoreProvider>
            <ToastProvider>{children}</ToastProvider>
          </AppStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
