export const dynamic = 'force-dynamic'; 
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import dynamicImport from 'next/dynamic'; 

// QUAN TRỌNG: Tắt SSR
const Header = dynamicImport(() => import('@/components/Header'), { ssr: false });
const AuthSync = dynamicImport(() => import('@/components/AuthSync'), { ssr: false });
const MandatoryReferral = dynamicImport(() => import('@/components/MandatoryReferral'), { ssr: false });

import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "@/components/Footer"; 
import WarningMarquee from "@/components/WarningMarquee"; 

const inter = Inter({ subsets: ["latin"] });
export const metadata = { title: "Lao Market", description: "Sàn TMĐT Lào" };

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="vi">
        <body className={inter.className}>
          <LanguageProvider>
            <AuthSync />
            <MandatoryReferral />
            <Header />
            <WarningMarquee />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
