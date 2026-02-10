import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// 👇 QUAN TRỌNG: Import bộ ngôn ngữ (Kiểm tra đường dẫn này nhé)
import { LanguageProvider } from "@/context/language-context"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lao Market",
  description: "Sàn thương mại điện tử số 1 tại Lào",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {/* 👇 Bọc LanguageProvider vào bên trong ClerkProvider */}
      <LanguageProvider>
        <html lang="vi">
          <body className={inter.className}>
            <div className="min-h-screen flex flex-col">
               {children}
            </div>
          </body>
        </html>
      </LanguageProvider>
    </ClerkProvider>
  );
}
