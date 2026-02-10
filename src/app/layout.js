import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lao Market",
  description: "Sàn thương mại điện tử số 1 tại Lào",
};

export default function RootLayout({ children }) {
  return (
    /* Bọc toàn bộ ứng dụng trong ClerkProvider để quản lý đăng nhập */
    <ClerkProvider>
      <html lang="vi">
        <body className={inter.className}>
          {/* Nơi hiển thị nội dung các trang con (page.js) */}
          <div className="min-h-screen flex flex-col">
             {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
