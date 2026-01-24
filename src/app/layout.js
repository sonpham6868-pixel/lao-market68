export const dynamic = 'force-dynamic';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Test Web",
  description: "Kiem tra ket noi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* Tạm thời bỏ hết ClerkProvider và TopSection */}
        <div style={{ padding: '20px' }}>
            {children}
        </div>
      </body>
    </html>
  );
}
