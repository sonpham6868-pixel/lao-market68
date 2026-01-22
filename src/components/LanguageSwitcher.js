'use client';
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLanguage();

  const btnClass = (code) => 
    `p-1 rounded transition ${lang === code ? 'bg-white shadow scale-110' : 'opacity-50 hover:opacity-100'}`;

  return (
    <div className="flex items-center gap-2 mr-4 bg-blue-700 px-3 py-1 rounded-full border border-blue-500">
      <button onClick={() => switchLang('vi')} className={btnClass('vi')} title="Tiếng Việt">
        🇻🇳
      </button>
      <button onClick={() => switchLang('lo')} className={btnClass('lo')} title="Tiếng Lào">
        🇱🇦
      </button>
      <button onClick={() => switchLang('en')} className={btnClass('en')} title="English">
        🇬🇧
      </button>
    </div>
  );
}
