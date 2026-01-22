import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.log("❌ KYC API: Chưa đăng nhập Clerk");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { kycImages } = body;

    console.log("🚀 BẮT ĐẦU GỬI KYC...");
    console.log("User Clerk ID:", clerkUser.id);
    console.log("Ảnh nhận được:", kycImages);

    await dbConnect();

    // Dùng lệnh findOneAndUpdate: TÌM và ÉP CẬP NHẬT ngay lập tức
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: clerkUser.id }, // Tìm người có Clerk ID này
      { 
        $set: { 
          kycStatus: 'pending', // Ép chuyển thành Chờ duyệt
          kycImages: kycImages  // Ép lưu ảnh
        }
      },
      { new: true } // Trả về kết quả mới nhất để kiểm tra
    );

    if (!updatedUser) {
      console.log("❌ LỖI: Không tìm thấy User này trong Database MongoDB!");
      return NextResponse.json({ error: "Không tìm thấy hồ sơ gốc trong Database" }, { status: 404 });
    }

    console.log("✅ CẬP NHẬT THÀNH CÔNG! Trạng thái mới:", updatedUser.kycStatus);

    return NextResponse.json({ success: true, message: "Đã gửi hồ sơ thành công!" });

  } catch (error) {
    console.error("❌ LỖI SERVER KYC:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
