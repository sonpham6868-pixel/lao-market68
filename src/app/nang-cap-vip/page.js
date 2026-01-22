'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradeVip() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async (pkgId, price, name) => {
    if (!confirm(`Bạn có chắc muốn mua gói ${name} với giá ${price.toLocaleString()} LAK?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/vip/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkgId }),
      });
      const data = await res.json();

      if (data.success) {
        alert('Nâng cấp thành công! Chúc mừng bạn.');
        router.push('/vi-cua-toi'); // Mua xong về ví xem
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (error) {
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">Nâng Cấp VIP - Bán Hàng Nhanh Hơn</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* GÓI 1 THÁNG */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold text-gray-800">VIP 1 Tháng</h2>
          <p className="text-4xl font-bold text-blue-600 my-4">199.000 LAK</p>
          <ul className="space-y-3 text-gray-600 mb-8">
            <li>✅ 30 bài đăng miễn phí</li>
            <li>✅ Duyệt bài ưu tiên</li>
            <li>✅ Hết hạn sau 30 ngày</li>
          </ul>
          <button 
            disabled={loading}
            onClick={() => handleBuy('1_month', 199000, 'VIP 1 Tháng')}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
          >
            MUA NGAY
          </button>
        </div>

        {/* GÓI 6 THÁNG - HOT */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-400 relative transform md:-translate-y-4">
          <span className="absolute top-0 right-0 bg-yellow-400 text-white font-bold px-4 py-1 rounded-bl-lg">PHỔ BIẾN NHẤT</span>
          <h2 className="text-2xl font-bold text-gray-800">VIP 6 Tháng</h2>
          <p className="text-4xl font-bold text-yellow-600 my-4">954.000 LAK</p>
          <ul className="space-y-3 text-gray-600 mb-8">
            <li>✅ 180 bài đăng miễn phí</li>
            <li>✅ Tiết kiệm 20% so với gói tháng</li>
            <li>✅ Huy hiệu VIP Bạc</li>
          </ul>
          <button 
             disabled={loading}
             onClick={() => handleBuy('6_month', 954000, 'VIP 6 Tháng')}
             className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 shadow-lg"
          >
            MUA NGAY
          </button>
        </div>

        {/* GÓI 12 THÁNG */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold text-gray-800">VIP 12 Tháng</h2>
          <p className="text-4xl font-bold text-purple-600 my-4">1.188.000 LAK</p>
          <ul className="space-y-3 text-gray-600 mb-8">
            <li>✅ **Không giới hạn** bài đăng</li>
            <li>✅ Huy hiệu VIP Vàng</li>
            <li>✅ Tiết kiệm 50% chi phí</li>
          </ul>
          <button 
             disabled={loading}
             onClick={() => handleBuy('12_month', 1188000, 'VIP 12 Tháng')}
             className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700"
          >
            MUA NGAY
          </button>
        </div>
      </div>
    </div>
  );
}
