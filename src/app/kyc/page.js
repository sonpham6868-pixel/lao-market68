'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/context/LanguageContext';
import { CldUploadWidget } from 'next-cloudinary';
import { useRouter } from 'next/navigation';

export default function KycPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [idImage, setIdImage] = useState('');     
  const [selfieImage, setSelfieImage] = useState(''); 
  const [status, setStatus] = useState('none');   
  const [loading, setLoading] = useState(false);

  // --- THAY TÊN CLOUD CỦA BẠN VÀO DÒNG DƯỚI ĐÂY ---
  const MY_CLOUD_NAME = "dybqfn43y"; // <--- VÍ DỤ: "dsdfh453"
  // ------------------------------------------------

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        if (data.success) setStatus(data.data.kycStatus);
      } catch (err) { console.error(err); }
    };
    checkStatus();
  }, []);

  const handleSubmit = async () => {
    if (!idImage || !selfieImage) return alert("⚠️ Vui lòng tải đủ 2 ảnh!");
    setLoading(true);
    try {
      const res = await fetch('/api/user/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycImages: [idImage, selfieImage] })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Đã gửi hồ sơ thành công!");
        setStatus('pending');
        router.push('/');
      } else {
        alert("❌ Lỗi Server: " + data.error);
      }
    } catch (err) { alert("Lỗi kết nối!"); }
    finally { setLoading(false); }
  };

  const handleUploadError = (err) => {
    console.error("Cloudinary Error:", err);
    alert(`❌ Lỗi Upload!\n1. Kiểm tra tên Cloud Name: ${MY_CLOUD_NAME}\n2. Preset: Laomarket_preset\n3. Mode: Unsigned`);
  };

  if (status === 'pending') return (
    <div className="p-20 text-center"><h1 className="text-3xl mb-4">⏳</h1><h2 className="text-xl font-bold text-yellow-600">Hồ sơ đang chờ duyệt...</h2></div>
  );

  if (status === 'approved') return (
    <div className="p-20 text-center"><h1 className="text-3xl mb-4">✅</h1><h2 className="text-xl font-bold text-green-600">Đã xác minh thành công!</h2><button onClick={() => router.push('/dang-tin')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Đăng tin ngay</button></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-blue-800 mb-2 text-center">{t.kycTitle}</h1>
        <p className="text-gray-500 text-center mb-8">{t.kycDesc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Ô 1: CCCD */}
          <div className="text-center">
            <p className="font-bold mb-2 text-sm uppercase text-gray-600">{t.uploadCCCD}</p>
            <div className={`border-2 border-dashed rounded-lg h-48 flex items-center justify-center bg-gray-50 overflow-hidden relative ${idImage ? 'border-green-500' : 'border-gray-300'}`}>
              {idImage ? <img src={idImage} className="w-full h-full object-contain" /> : <span className="text-4xl text-gray-300">🆔</span>}
              
              <CldUploadWidget 
                signatureEndpoint={null} // Bắt buộc null cho Unsigned
                options={{
                  cloudName: MY_CLOUD_NAME, // <--- GỌI TÊN CLOUD TRỰC TIẾP
                  uploadPreset: "Laomarket_preset", 
                  sources: ['local', 'camera'],
                  multiple: false
                }}
                onError={handleUploadError} 
                onSuccess={(res) => setIdImage(res.info.secure_url)}
              >
                {({ open }) => (
                  <button onClick={() => open()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">Upload</button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* Ô 2: SELFIE */}
          <div className="text-center">
            <p className="font-bold mb-2 text-sm uppercase text-gray-600">{t.uploadSelfie}</p>
            <div className={`border-2 border-dashed rounded-lg h-48 flex items-center justify-center bg-gray-50 overflow-hidden relative ${selfieImage ? 'border-green-500' : 'border-gray-300'}`}>
              {selfieImage ? <img src={selfieImage} className="w-full h-full object-cover" /> : <span className="text-4xl text-gray-300">🤳</span>}
              
              <CldUploadWidget 
                signatureEndpoint={null}
                options={{
                  cloudName: MY_CLOUD_NAME, // <--- GỌI TÊN CLOUD TRỰC TIẾP
                  uploadPreset: "Laomarket_preset",
                  sources: ['local', 'camera'],
                  multiple: false
                }}
                onError={handleUploadError} 
                onSuccess={(res) => setSelfieImage(res.info.secure_url)}
              >
                {({ open }) => (
                  <button onClick={() => open()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">Upload</button>
                )}
              </CldUploadWidget>
            </div>
          </div>

        </div>

        <button onClick={handleSubmit} disabled={loading} className={`w-full text-white font-bold py-4 rounded-lg transition shadow-lg text-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {loading ? t.loading : t.submitKyc}
        </button>
      </div>
    </div>
  );
}
