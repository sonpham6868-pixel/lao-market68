'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu
  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings/me');
      const data = await res.json();
      if (data.success) setListings(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  // Hàm xóa tin
  const handleDelete = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa tin này chứ?")) return;
    
    const res = await fetch(`/api/listings/me?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    
    if (data.success) {
      alert("Đã xóa thành công!");
      fetchListings(); // Tải lại danh sách
    } else {
      alert("Lỗi: " + data.error);
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải danh sách...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Quản Lý Tin Đăng</h1>
          <Link href="/dang-tin">
            <button className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">
              + Đăng tin mới
            </button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white p-10 rounded text-center shadow">
            <p className="text-gray-500 mb-4">Bạn chưa đăng tin nào cả.</p>
            <Link href="/dang-tin" className="text-blue-600 underline">Đăng ngay đi!</Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề / Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đăng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={item.images[0]} alt="Xe" className="h-16 w-16 object-cover rounded border" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{item.title}</div>
                      <div className="text-sm text-red-600 font-bold">
                        {Number(item.price).toLocaleString()} {item.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/san-pham/${item._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Xem
                      </Link>
                      <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
