'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// 1. TẠO COMPONENT CON: Chứa logic gây lỗi
function ReferralWorker() {
  const searchParams = useSearchParams(); // <--- Lệnh gây lỗi nằm ở đây
  const { user } = useUser();

  useEffect(() => {
    // Logic lấy mã Ref
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('refCode', refCode);
    }

    // Logic cập nhật User
    if (user) {
      const storedRef = localStorage.getItem('refCode');
      if (storedRef) {
        // Gửi lên server (giả lập)
        fetch('/api/user/update-ref', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({ refCode: storedRef })
        }).catch(err => console.error(err));
        
        localStorage.removeItem('refCode');
      }
    }
  }, [searchParams, user]);

  return null;
}

// 2. COMPONENT CHÍNH: Bọc Suspense ra ngoài
export default function MandatoryReferral() {
  return (
    // Cái khiên bảo vệ Suspense nằm ở đây
    <Suspense fallback={null}>
      <ReferralWorker />
    </Suspense>
  );
}
