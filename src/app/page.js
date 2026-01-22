'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bộ lọc tìm kiếm
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: 'all',
    minPrice: '',
    maxPrice: ''
  });

  // Hàm gọi API lấy danh sách tin
  const fetchListings = async () => {
    setLoading(true);
    try {
      // Tạo chuỗi query từ bộ lọc (bỏ qua các giá trị rỗng)
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.location) params.append('location', filters.location);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi trang vừa tải
  useEffect(() => { fetchListings(); }, []);

  // Xử lý khi bấm nút Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* 1. HERO SECTION (PHẦN ĐẦU TRANG) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4 shadow-lg">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Lao Market 🇱🇦
          </h1>
          <p className="text-blue-100 mb-8 text-lg font-medium">
            {t.home} - {t.cat_car}, {t.cat_house}, {t.cat_job} & {t.cat_sim}
          </p>

          {/* FORM TÌM KIẾM */}
          <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={filters.keyword}
              onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
            
            <input 
              type="text" 
              placeholder={t.locationPlaceholder} 
              className="w-full md:w-1/4 p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />

            {/* SELECT DANH MỤC ĐẦY ĐỦ */}
            <select 
              className="w-full md:w-1/4 p-3 border rounded-lg bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">{t.categoryAll}</option>
              <option value="xe_co">{t.cat_car}</option>
              <option value="bat_dong_san">{t.cat_house}</option>
              <option value="viec_lam">{t.cat_job}</option>
              <option value="dien_thoai">{t.cat_phone}</option>
              <option value="sim">{t.cat_sim}</option>
              <option value="bien_xe_may">{t.cat_bike_plate}</option>
              <option value="bien_o_to">{t.cat_car_plate}</option>
              <option value="khac">{t.cat_other}</option>
            </select>

            <button 
              onClick={handleSearch}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-3 rounded-lg transition shadow-md transform active:scale-95"
            >
              {t.searchBtn} 
            </button>
          </div>
          
          {/* LỌC GIÁ */}
          <div className="mt-4 flex justify-center gap-4 text-white text-sm font-semibold">
             <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded backdrop-blur-sm">
               <span>💰</span>
               <input 
                 type="number" placeholder={t.minPrice} className="p-1 rounded text-black w-24 text-center focus:outline-none"
                 value={filters.minPrice} onChange={(e)=>setFilters({...filters, minPrice: e.target.value})}
               />
               <span>-</span>
               <input 
                 type="number" placeholder={t.maxPrice} className="p-1 rounded text-black w-24 text-center focus:outline-none"
                 value={filters.maxPrice} onChange={(e)=>setFilters({...filters, maxPrice: e.target.value})}
               />
             </div>
          </div>
        </div>
      </div>

      {/* 2. KẾT QUẢ TÌM KIẾM */}
      <main className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
          {t.newListing}
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {listings.length} tin
          </span>
        </h3>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-blue-600 text-xl font-semibold animate-pulse">⏳ {t.loading}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-500 text-xl">Chưa tìm thấy tin nào phù hợp.</p>
            <button onClick={() => {setFilters({keyword:'', location:'', category:'all', minPrice:'', maxPrice:''}); fetchListings();}} className="mt-4 text-blue-600 underline hover:text-blue-800">
              Xóa bộ lọc để xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <Link key={item._id} href={`/san-pham/${item._id}`}>
                {/* --- LOGIC VIP: VIỀN VÀNG & NỀN SÁNG --- */}
                <div className={`
                  bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 border group relative h-full flex flex-col
                  ${item.priority > 0 ? 'border-yellow-400 ring-2 ring-yellow-100 scale-[1.01]' : 'border-gray-100 hover:border-blue-200'}
                `}>
                  
                  {/* NHÃN VIP (Chỉ hiện nếu priority > 0) */}
                  {item.priority > 0 && (
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 z-10 rounded-br-lg shadow-md flex items-center gap-1">
                      <span>👑</span> VIP
                    </div>
                  )}

                  {/* ẢNH SẢN PHẨM */}
                  <div className="h-48 overflow-hidden relative bg-gray-200">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/300'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                      {item.location}
                    </div>
                  </div>
                  
                  {/* THÔNG TIN */}
                  <div className={`p-4 flex-1 flex flex-col justify-between ${item.priority > 0 ? 'bg-yellow-50/40' : ''}`}>
                    <div>
                      <h4 className={`font-bold text-lg mb-1 line-clamp-2 ${item.priority > 0 ? 'text-blue-800' : 'text-gray-800'} group-hover:text-blue-600`}>
                        {/* Nếu VIP thì thêm icon lửa */}
                        {item.priority > 0 && "🔥 "} 
                        {item.title}
                      </h4>
                      <p className="text-red-600 font-extrabold text-xl mb-2">
                        {Number(item.price).toLocaleString()} {item.currency}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs capitalize truncate max-w-[100px]">
                        {/* Hiển thị tên danh mục đẹp hơn */}
                        {item.category === 'xe_co' ? t.cat_car : 
                         item.category === 'bat_dong_san' ? t.cat_house :
                         item.category === 'viec_lam' ? t.cat_job :
                         item.category === 'sim' ? t.cat_sim : item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
