'use client';
import Link from "next/link";
// 1. Import đầy đủ các công cụ của Clerk
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useLanguage } from "@/context/language-context";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition group">
          <span className="text-4xl drop-shadow-md group-hover:scale-110 transition duration-300">🇱🇦</span>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold tracking-tight leading-none">Lao Market</h1>
            <span className="text-[10px] text-blue-200 font-medium tracking-[0.2em] uppercase">Buy & Sell</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          
          {/* Đổi ngôn ngữ */}
          <LanguageSwitcher />

          {/* KHI ĐÃ ĐĂNG NHẬP (Hiện menu quản lý) */}
          <SignedIn>
            <div className="hidden md:flex items-center gap-4 mr-2 border-r border-blue-400 pr-4">
              <Link href="/vi-cua-toi" className="flex items-center gap-1 text-blue-100 hover:text-white font-medium transition hover:underline">
                <span>💰</span> {t.myWallet}
              </Link>
              <Link href="/quan-ly-tin" className="flex items-center gap-1 text-blue-100 hover:text-white font-medium transition hover:underline">
                <span>📝</span> {t.myListings}
              </Link>
            </div>
          </SignedIn>

          {/* Nút Đăng Tin (Luôn hiện, màu vàng nổi bật) */}
          <Link href="/dang-tin">
            <button className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-bold hover:bg-yellow-300 transition shadow-md text-sm flex items-center gap-1 transform active:scale-95">
              <span>+</span> {t.postAd}
            </button>
          </Link>

          {/* KHU VỰC TÀI KHOẢN (ĐĂNG NHẬP / ĐĂNG KÝ) */}
          <div className="ml-2 flex items-center gap-2">
            
            {/* Nếu CHƯA đăng nhập -> Hiện 2 nút */}
            <SignedOut>
              {/* Nút ĐĂNG NHẬP (Nhẹ nhàng) */}
              <SignInButton mode="modal">
                <button className="text-white/90 font-semibold hover:text-white text-sm px-3 py-2 transition hover:bg-white/10 rounded-lg">
                  {t.login}
                </button>
              </SignInButton>

              {/* Nút ĐĂNG KÝ (Nổi bật - Màu trắng) */}
              <SignUpButton mode="modal">
                <button className="bg-white text-blue-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-lg text-sm">
                  {t.register}
                </button>
              </SignUpButton>
            </SignedOut>

            {/* Nếu ĐÃ đăng nhập -> Hiện Avatar */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

          </div>
        </div>
      </div>
    </header>
  );
}
