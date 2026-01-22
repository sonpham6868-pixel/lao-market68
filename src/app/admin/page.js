'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('kyc'); 
  
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- HÀM LẤY DỮ LIỆU (ĐÃ SỬA: CẤM CACHE) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime(); // Mẹo: Thêm thời gian để trình duyệt biết là lệnh mới
      
      if (activeTab === 'users' || activeTab === 'kyc') {
        // THÊM: cache: 'no-store'
        const res = await fetch(`/api/admin/users?t=${timestamp}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setUsers(data.data);
      } 
      else if (activeTab === 'listings') {
        const res = await fetch(`/api/admin/listings?type=listings&t=${timestamp}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setListings(data.data);
      }
      else if (activeTab === 'reports') {
        const res = await fetch(`/api/admin/listings?type=reports&t=${timestamp}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) setReports(data.data);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user, activeTab]);

  const sendCommand = async (userId, action, value) => {
    try {
      const res = await fetch('/api/admin/users', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, action, value })
      });
      const data = await res.json();
      if(data.success) { 
        alert(data.message); 
        fetchData(); // Tải lại ngay sau khi xử lý
      }
      else { alert("Lỗi: " + data.error); }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  const handleKyc = (u, isApprove) => {
    if(confirm(isApprove ? "Duyệt hồ sơ này?" : "Từ chối hồ sơ này?")) {
      sendCommand(u._id, isApprove ? 'kyc_approve' : 'kyc_reject', true);
    }
  };
  const handleDeleteListing = async (id) => {
    if (!confirm("Xóa bài này vĩnh viễn?")) return;
    await fetch(`/api/admin/listings?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Lọc danh sách chờ duyệt
  const pendingKycUsers = users.filter(u => u.kycStatus === 'pending');

  if (!isLoaded || !user) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">👮‍♂️ ADMIN CONTROL CENTER</h1>
        <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
          🔄 Tải lại dữ liệu
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        <button onClick={() => setActiveTab('kyc')} className={`px-4 py-2 rounded font-bold flex items-center gap-2 ${activeTab==='kyc' ? 'bg-orange-500 text-white' : 'bg-white'}`}>
          🕵️ DUYỆT HỒ SƠ 
          {pendingKycUsers.length > 0 && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-bounce">{pendingKycUsers.length}</span>}
        </button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded font-bold ${activeTab==='users' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
          👥 Người dùng
        </button>
        <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 rounded font-bold ${activeTab==='listings' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
          📝 Tin đăng
        </button>
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded font-bold ${activeTab==='reports' ? 'bg-red-600 text-white' : 'bg-white'}`}>
          🚨 Khiếu nại ({reports.length})
        </button>
      </div>

      {loading && <p className="text-center text-gray-500 italic mb-4">Đang cập nhật dữ liệu mới nhất...</p>}

      {/* === TAB 1: DUYỆT KYC === */}
      {activeTab === 'kyc' && (
        <div>
          {pendingKycUsers.length === 0 ? (
            <div className="text-center py-10 bg-white rounded shadow text-gray-500">
              <p className="text-xl">✅ Sạch sẽ! Không có hồ sơ nào cần duyệt.</p>
              <p className="text-sm mt-2">Gợi ý: Kiểm tra Tab 'Người dùng' xem dữ liệu đã vào chưa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingKycUsers.map(u => (
                <div key={u._id} className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{u.email}</h3>
                      <p className="text-sm text-gray-500">Đăng ký: {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded font-bold text-xs animate-pulse">CHỜ DUYỆT</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-bold mb-1 text-gray-500">1. CCCD / Hộ chiếu</p>
                      <a href={u.kycImages?.[0]} target="_blank" rel="noreferrer">
                        <img src={u.kycImages?.[0]} className="w-full h-40 object-cover rounded border hover:scale-105 transition cursor-zoom-in" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-1 text-gray-500">2. Ảnh Selfie</p>
                      <a href={u.kycImages?.[1]} target="_blank" rel="noreferrer">
                        <img src={u.kycImages?.[1]} className="w-full h-40 object-cover rounded border hover:scale-105 transition cursor-zoom-in" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => handleKyc(u, false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded">
                      ❌ TỪ CHỐI
                    </button>
                    <button onClick={() => handleKyc(u, true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow-lg">
                      ✅ DUYỆT NGAY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB 2: QUẢN LÝ USER === */}
      {activeTab === 'users' && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Email / ID</th>
                <th className="p-3 text-left">Trạng thái KYC</th>
                <th className="p-3 text-left">Ví / VIP</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className={u.isBanned ? "bg-red-50" : ""}>
                  <td className="p-3">
                    <div className="font-bold">{u.email}</div>
                    <div className="text-xs text-gray-500">ID: {u._id.slice(-6)}</div>
                  </td>
                  <td className="p-3">
                    {/* LOGIC HIỂN THỊ TRẠNG THÁI KYC */}
                    {u.kycStatus === 'approved' && <span className="text-green-600 font-bold border border-green-600 px-2 rounded text-xs">ĐÃ DUYỆT</span>}
                    {u.kycStatus === 'pending' && <span className="text-orange-600 font-bold bg-orange-100 px-2 rounded text-xs">CHỜ DUYỆT</span>}
                    {(!u.kycStatus || u.kycStatus === 'none') && <span className="text-gray-400 text-xs">Chưa gửi</span>}
                    {u.kycStatus === 'rejected' && <span className="text-red-600 font-bold text-xs">ĐÃ TỪ CHỐI</span>}
                  </td>
                  <td className="p-3">
                    <div className="text-blue-600 font-bold">{u.walletBalance?.toLocaleString()}</div>
                    <div className="text-xs uppercase">{u.vipPackage}</div>
                  </td>
                  <td className="p-3 flex gap-1 justify-center">
                    <button onClick={()=>sendCommand(u._id,'balance', Number(prompt("Nhập tiền:")))} className="bg-green-500 text-white px-2 rounded">💰</button>
                    <button onClick={()=>sendCommand(u._id,'vip', prompt("Gói VIP:", "1_month"))} className="bg-purple-500 text-white px-2 rounded">👑</button>
                    <button onClick={()=>sendCommand(u._id,'ban', !u.isBanned)} className="bg-red-500 text-white px-2 rounded">🔒</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === TAB 3 & 4 (GIỮ NGUYÊN CODE CŨ) === */}
      {/* (Phần Listings và Reports bạn giữ nguyên logic hiển thị như cũ hoặc copy từ bài trước nếu bị mất) */}
      {activeTab === 'listings' && <div className="p-4 bg-white">Danh sách tin đăng (Đang cập nhật...)</div>}
      {activeTab === 'reports' && <div className="p-4 bg-white">Danh sách báo cáo (Đang cập nhật...)</div>}
    </div>
  );
}
