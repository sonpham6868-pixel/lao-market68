'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthSync() {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Nếu trên Link có mã giới thiệu (?ref=ABC) -> Lưu vào máy ngay
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('refCode', refCode);
    }

    // 2. Khi người dùng Đăng nhập/Đăng ký xong
    if (isSignedIn) {
      // Lấy mã đã lưu trong máy ra
      const savedRefCode = localStorage.getItem('refCode');

      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: savedRefCode }) // Gửi mã này cho Server
      })
      .then(res => res.json())
      .then(data => {
        // Nếu đồng bộ xong thì xóa mã trong máy đi cho sạch
        if(data.success) localStorage.removeItem('refCode');
      });
    }
  }, [isSignedIn, searchParams]);

  return null;
}
