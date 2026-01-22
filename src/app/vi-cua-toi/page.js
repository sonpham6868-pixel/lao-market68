'use client';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function MyWallet() {
  const { t } = useLanguage(); 
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu ví từ Server
  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      if (data.success) {
        setDbUser(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Hàm xử lý kích hoạt Partner
  const handleActivatePartner = async () => {
    // Hỏi xác nhận trước khi trừ tiền (giả lập)
    if (!confirm("Bạn có chắc muốn kích hoạt gói Partner (200.000 LAK)?")) return;
    
    try {
      const res = await fetch('/api/user/upgrade', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Chúc mừng! Bạn đã trở thành Đối Tác.");
        fetchUserData(); // Tải lại trang để hiện mã
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (error) {
      alert("Lỗi kết nối");
    }
  };

  if (!user || loading) return <div className="p-10 text-center">{t.loading}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        
        {/* 1. THẺ VÍ TIỀN (MÀU XANH) */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">
                {t.balance} {/* Số dư khả dụng */}
              </p>
              <h1 className="text-4xl font-bold">
                {dbUser?.walletBalance?.toLocaleString() || 0} LAK
              </h1>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">💰</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-2 rounded-full font-bold transition shadow-lg flex-1">
              + {t.deposit} {/* Nạp tiền */}
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-bold transition backdrop-blur-sm flex-1 border border-white/30">
              {t.history} {/* Lịch sử */}
            </button>
          </div>
        </div>

        {/* 2. KHU VỰC ĐỐI TÁC (MÀU TRẮNG) */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🤝 {t.partnerProg} {/* Chương trình Đối Tác */}
            {dbUser?.isPartner && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">ACTIVE</span>
            )}
          </h2>

          {dbUser?.isPartner ? (
            // --- TRƯỜNG HỢP 1: ĐÃ LÀ PARTNER (HIỆN MÃ & NÚT SHARE) ---
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 text-center">
              <p className="text-green-800 mb-2 font-medium">{t.refCode}</p>
              
              {/* Mã code to đùng */}
              <div className="text-4xl font-mono font-black text-green-600 tracking-widest bg-white py-4 rounded-xl border border-green-200 shadow-inner select-all mb-6">
                {dbUser?.referralCode}
              </div>

              {/* Nút Chia sẻ thông minh */}
              <button 
                onClick={() => {
                  // Tạo link: ten-mien-cua-ban/?ref=MA_GIOI_THIEU
                  const link = `${window.location.origin}/?ref=${dbUser.referralCode}`;
                  navigator.clipboard.writeText(link); // Copy vào bộ nhớ máy
                  alert("✅ Đã copy link giới thiệu thành công!\n\n" + link);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg transform active:scale-95"
              >
                <span>🚀</span> {t.shareBtn || "Chia sẻ Link Ngay"}
              </button>

              <p className="text-sm text-green-600 mt-4 italic">
                {t.commissionInfo}
              </p>
            </div>
          ) : (
            // --- TRƯỜNG HỢP 2: CHƯA LÀ PARTNER (HIỆN NÚT KÍCH HOẠT) ---
            <div className="text-center py-4">
              <p className="text-gray-500 mb-6">
                {t.noCode} {/* Kích hoạt để lấy mã */}
              </p>
              <button 
                onClick={handleActivatePartner}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition transform w-full"
              >
                {t.activateBtn} {/* Kích hoạt ngay (200k) */}
              </button>
              <p className="text-xs text-gray-400 mt-3 italic">
                {t.lifetimeFee} {/* Phí trọn đời */}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
