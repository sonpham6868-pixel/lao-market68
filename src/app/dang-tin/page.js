'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { useLanguage } from '@/context/LanguageContext';

export default function CreateListing() {
  const { t } = useLanguage();
  const router = useRouter();
  const [displayPrice, setDisplayPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const [formData, setFormData] = useState({
    title: '', price: '', currency: 'LAK', 
    category: 'xe_co', // Mặc định
    location: '', description: '', images: [],
    contactPhone: '', contactWhatsapp: ''
  });

  // --- KIỂM TRA KYC TRƯỚC KHI CHO ĐĂNG TIN ---
  useEffect(() => {
    const checkKYC = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        
        // Nếu user tồn tại nhưng chưa KYC thành công (approved)
        if (data.success && data.data.kycStatus !== 'approved') {
          // Ngoại lệ: Nếu là Admin thì cho qua luôn để test
          if (data.data.role === 'admin') return; 

          // Thông báo và chuyển hướng
          alert(t.kycAlert || "Bạn cần xác minh danh tính để đăng tin!");
          router.push('/kyc'); 
        }
      } catch (e) { 
        console.error("Lỗi kiểm tra KYC:", e); 
      }
    };
    
    checkKYC();
  }, [t.kycAlert, router]);
  // ---------------------------------------------

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\./g, '');
    if (!isNaN(rawValue) && rawValue !== '') {
      const formatted = Number(rawValue).toLocaleString('vi-VN');
      setDisplayPrice(formatted);
      setFormData({ ...formData, price: rawValue });
    } else if (rawValue === '') {
      setDisplayPrice('');
      setFormData({ ...formData, price: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) { alert(t.uploadError); return; }
    if (!formData.contactPhone) { alert(t.phoneError); return; }

    setLoading(true);
    
    let finalData = { ...formData };
    if (formData.category === 'khac' && customCategory) {
       finalData.title = `[${customCategory}] ${finalData.title}`;
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        alert(t.successMsg);
        router.push('/');
      } else {
        const err = await res.json();
        alert('Lỗi: ' + (err.error || 'Server Error'));
      }
    } catch (error) {
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">{t.createTitle}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* UPLOAD ẢNH */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <label className="block text-gray-700 font-bold mb-2">
              {t.imgLabel} ({t.imgCount}: <span className="text-red-600 font-bold">{formData.images.length}</span>)
            </label>
            <div className="flex flex-wrap gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                  <img src={url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({...formData, images: newImages});
                    }} className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs">X</button>
                </div>
              ))}
              <CldUploadWidget uploadPreset="laomarket_preset" options={{ multiple: true, maxFiles: 5 }}
                onSuccess={(result) => {
                  if (result?.info?.secure_url) {
                    setFormData(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }));
                  }
                }}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-20 h-20 bg-white border-2 border-dashed border-blue-400 flex flex-col items-center justify-center text-blue-500 rounded text-xs">
                    {t.addImg}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* DANH MỤC MỚI */}
          <div>
              <label className="block text-gray-700 font-bold mb-2">{t.categoryAll}</label>
              <select className="w-full border p-3 rounded bg-blue-50" value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="xe_co">{t.cat_car}</option>
                  <option value="bat_dong_san">{t.cat_house}</option>
                  <option value="viec_lam">{t.cat_job}</option>
                  <option value="dien_thoai">{t.cat_phone}</option>
                  <option value="sim">{t.cat_sim}</option>
                  <option value="bien_xe_may">{t.cat_bike_plate}</option>
                  <option value="bien_o_to">{t.cat_car_plate}</option>
                  <option value="khac">{t.cat_other}</option>
              </select>
          </div>

          {/* NẾU CHỌN "KHÁC" -> HIỆN Ô NHẬP TAY */}
          {formData.category === 'khac' && (
            <div className="animate-fade-in">
              <label className="block text-gray-700 font-bold mb-2">{t.otherTypeLabel}</label>
              <input type="text" className="w-full border p-3 rounded border-blue-300 focus:ring-2 focus:ring-blue-200"
                placeholder="VD: Laptop, Tủ lạnh, Quần áo..."
                value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
            </div>
          )}

          {/* TIÊU ĐỀ */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">{t.titleLabel}</label>
            <input type="text" required className="w-full border p-3 rounded"
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          {/* GIÁ & ĐƠN VỊ */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-2">{t.priceLabel}</label>
              <input type="text" required className="w-full border p-3 rounded font-bold text-red-600"
                value={displayPrice} onChange={handlePriceChange} placeholder="0" />
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700 font-bold mb-2">{t.unitLabel}</label>
              <select className="w-full border p-3 rounded" value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}>
                <option value="LAK">LAK</option><option value="USD">USD</option><option value="THB">THB</option>
              </select>
            </div>
          </div>

          {/* LIÊN HỆ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-gray-700 font-bold mb-2">{t.phoneLabel}</label>
                <input type="text" required className="w-full border p-3 rounded"
                  value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} />
             </div>
             <div>
                <label className="block text-gray-700 font-bold mb-2">{t.whatsappLabel}</label>
                <input type="text" className="w-full border p-3 rounded"
                  value={formData.contactWhatsapp} onChange={(e) => setFormData({...formData, contactWhatsapp: e.target.value})} />
             </div>
          </div>

          <div>
              <label className="block text-gray-700 font-bold mb-2">{t.locationLabel}</label>
              <input type="text" required className="w-full border p-3 rounded"
              value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">{t.descLabel}</label>
            <textarea rows="4" className="w-full border p-3 rounded"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition shadow-lg text-lg">
            {loading ? t.loading : t.submitBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
