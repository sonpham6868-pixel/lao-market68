
export const dynamic = 'force-dynamic'; // <--- THÊM DÒNG NÀY Ở TRÊN CÙNG

import { Inter } from "next/font/google";
import "./globals.css";
// ... (các phần dưới giữ nguyên)
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "@/components/Footer"; 
import TopSection from "@/components/TopSection"; // Gọi file mới vào

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
            
            {/* Toàn bộ phần Header/Auth đã được chuyển vào đây */}
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
