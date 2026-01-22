'use client'; // Đóng dấu Client Component
import dynamic from 'next/dynamic';
import WarningMarquee from "@/components/WarningMarquee";

// Tắt SSR ở đây thì Next.js mới cho phép
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const AuthSync = dynamic(() => import('@/components/AuthSync'), { ssr: false });
const MandatoryReferral = dynamic(() => import('@/components/MandatoryReferral'), { ssr: false });

export default function TopSection() {
  return (
    <>
      <AuthSync />
      <MandatoryReferral />
      <Header />
      <WarningMarquee />
    </>
  );
}
