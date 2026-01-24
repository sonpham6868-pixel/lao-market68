export const dynamic = 'force-dynamic'; // Bắt buộc Web chạy động để tránh lỗi treo Build

import { Inter } from "next/font/google";//
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "@/components/Footer"; 
import TopSection from "@/components/TopSection"; 

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
            
            {/* Header và Auth đã được chuyển vào đây để tắt SSR an toàn */}
            <TopSection />
            
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
