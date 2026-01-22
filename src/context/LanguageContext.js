'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '@/utils/dictionary';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('vi'); // Mặc định là Tiếng Việt

  // Khi web vừa tải lên, kiểm tra xem khách đã chọn ngôn ngữ trước đó chưa
  useEffect(() => {
    const savedLang = localStorage.getItem('appLang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // Hàm đổi ngôn ngữ
  const switchLang = (code) => {
    setLang(code);
    localStorage.setItem('appLang', code); // Lưu vào bộ nhớ máy khách
  };

  // Trả về từ điển đúng ngôn ngữ đang chọn
  const t = dictionary[lang];

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook để các trang con dùng dễ dàng
export function useLanguage() {
  return useContext(LanguageContext);
}
