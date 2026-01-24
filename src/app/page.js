// import connectDB from "@/lib/db"; // <--- Tạm thời đóng lại
export const dynamic = 'force-dynamic';

export default function Home() {
  // await connectDB(); // <--- Không kết nối Database nữa

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'green', fontSize: '30px' }}>
         CHÚC MỪNG! WEB ĐÃ HOẠT ĐỘNG! 🚀
      </h1>
      <p>Đây là phiên bản kiểm tra kết nối.</p>
      <p>Nếu bạn thấy dòng này nghĩa là Vercel và Middleware đã ngon lành.</p>
    </div>
  );
}
