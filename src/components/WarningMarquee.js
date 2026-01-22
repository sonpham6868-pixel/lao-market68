'use client';
import { useLanguage } from "@/context/LanguageContext";

export default function WarningMarquee() {
  const { t } = useLanguage();

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden relative shadow-md z-40">
      <div className="whitespace-nowrap animate-marquee font-bold text-sm md:text-base tracking-wide">
        {t.marqueeWarning} &nbsp; • &nbsp; {t.marqueeWarning} &nbsp; • &nbsp; {t.marqueeWarning}
      </div>
    </div>
  );
}
