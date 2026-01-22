import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

// --- SỬA LẠI ĐÚNG CHUẨN: Dùng tên 'dynamic' ---
import dynamic from 'next/dynamic'; 

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const AuthSync = dynamic(() => import('@/components/AuthSync'), { ssr: false });
const MandatoryReferral = dynamic(() => import('@/components/MandatoryReferral'), { ssr: false });
// ----------------------------------------------

import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "@/components/Footer"; 
import WarningMarquee from "@/components/WarningMarquee"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lao Market",
  description: "Sàn thương mại điện tử Lào",
};

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
            <div className="min-h-screen">
               {children}
            </div>
            <Footer />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
