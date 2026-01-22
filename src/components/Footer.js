'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext'; // <--- Import này quan trọng

export default function Footer() {
  const { t } = useLanguage(); // <--- Lấy từ điển ra dùng

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Cột 1: Thông tin */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🇱🇦</span>
              <h2 className="text-2xl font-bold">Lao Market</h2>
            </div>
            {/* Dùng t.footerDesc thay vì chữ cứng */}
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {t.footerDesc}
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">{t.footerLinks}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition">{t.home}</Link></li>
              <li><Link href="/dang-tin" className="hover:text-white transition">{t.postAd}</Link></li>
              <li><Link href="/vi-cua-toi" className="hover:text-white transition">{t.myWallet}</Link></li>
              <li><Link href="#" className="hover:text-white transition">{t.policy}</Link></li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-400">{t.footerContact}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span>📍</span> Vientiane, Laos
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +856 20 9999 9999
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span> support@laomarket.com
              </li>
              <li className="pt-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Support 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lao Market. {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
