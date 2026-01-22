'use client';
import { useState, useEffect, use } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function ListingDetail({ params }) {
  // Giải nén params (Next.js 15 bắt buộc dùng React.use() hoặc await)
  const { id } = use(params);
  
  const { t } = useLanguage();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- STATE CHO PHẦN BÁO CÁO ---
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Gọi API lấy chi tiết tin đăng
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        if (data.success) setListing(data.data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    if (id) fetchListing();
  }, [id]);

  // --- HÀM GỬI BÁO CÁO ---
  const handleReport = async () => {
    if (!reportReason) return alert("Vui lòng chọn lý do!");
    
    setIsReporting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetListingId: listing._id,
          targetUserId: listing.userId, // ID người đăng bài
          reason: reportReason
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(t.reportSent || "Đã gửi báo cáo cho Admin!");
        setShowReportModal(false);
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (e) { alert("Lỗi kết nối"); }
    finally { setIsReporting(false); }
  };

  if (loading) return <div className="p-10 text-center">{t.loading}</div>;
  if (!listing) return <div className="p-10 text-center text-red-500">{t.notFound}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 1. HÌNH ẢNH */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-black flex items-center justify-center h-96">
            <img src={listing.images[0]} className="max-h-full max-w-full object-contain" />
          </div>
          
          {/* 2. THÔNG TIN */}
          <div className="p-6 flex flex-col justify-between">
             <div>
                <div className="flex justify-between items-start">
                   <h1 className="text-2xl font-bold text-gray-800 mb-2">{listing.title}</h1>
                   {/* NÚT BÁO CÁO */}
                   <button 
                     onClick={() => setShowReportModal(true)}
                     className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition"
                     title={t.reportBtn}
                   >
                     🚨 <span className="hidden md:inline font-semibold">{t.reportBtn || "Báo cáo"}</span>
                   </button>
                </div>

                <p className="text-3xl font-bold text-red-600 mb-4">
                  {Number(listing.price).toLocaleString()} {listing.currency}
                </p>
                
                <div className="space-y-2 text-gray-600 mb-6">
                   <p>📅 {t.postedDate}: {new Date(listing.createdAt).toLocaleDateString()}</p>
                   <p>📍 {listing.location}</p>
                   <p>📂 {t[`cat_${listing.category}`] || listing.category}</p>
                </div>
                
                <div className="border-t pt-4">
                   <h3 className="font-bold mb-2">{t.descLabel}:</h3>
                   <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                     {listing.description || t.noDesc}
                   </p>
                </div>
             </div>

             {/* 3. NÚT LIÊN HỆ */}
             <div className="mt-8 grid grid-cols-2 gap-4">
               <a href={`tel:${listing.contactPhone}`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded text-center shadow flex justify-center items-center gap-2 transition transform hover:scale-105">
                 📞 {t.call}
               </a>
               {listing.contactWhatsapp && (
                 <a href={`https://wa.me/${listing.contactWhatsapp}`} target="_blank" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded text-center shadow flex justify-center items-center gap-2 transition transform hover:scale-105">
                   💬 {t.chat}
                 </a>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* --- MODAL BÁO CÁO (POPUP) --- */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              🚨 {t.reportBtn || "Báo cáo vi phạm"}
            </h3>
            
            <p className="mb-2 font-bold text-gray-700">{t.reasonLabel || "Lý do:"}</p>
            <div className="space-y-2 mb-6">
              {['Lừa đảo (Scam)', 'Hàng giả / Kém chất lượng', 'Spam / Tin rác', 'Thông tin sai sự thật'].map((r) => (
                <label key={r} className="flex items-center gap-2 p-3 border rounded hover:bg-red-50 cursor-pointer transition">
                  <input 
                    type="radio" 
                    name="reason" 
                    value={r}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="accent-red-600 w-5 h-5"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded font-bold hover:bg-gray-300 transition"
              >
                {t.back || "Hủy"}
              </button>
              <button 
                onClick={handleReport}
                disabled={isReporting}
                className="flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition"
              >
                {isReporting ? "..." : (t.submitBtn || "Gửi báo cáo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
