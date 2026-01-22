import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });

    // Đọc mã giới thiệu được gửi lên (nếu có)
    const body = await req.json().catch(() => ({})); 
    const referrerCode = body.referralCode;

    await dbConnect();

    // Tìm xem user này đã có chưa
    let dbUser = await User.findOne({ clerkId: user.id });

    // NẾU LÀ NGƯỜI MỚI TINH (Chưa có trong DB)
    if (!dbUser) {
      // Tạo mã giới thiệu ngẫu nhiên cho chính họ
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Kiểm tra xem Mã người giới thiệu (referrerCode) có hợp lệ không?
      let validReferrer = null;
      if (referrerCode) {
        // Tìm ông A xem có tồn tại và đã kích hoạt Partner chưa?
        const partner = await User.findOne({ referralCode: referrerCode, isPartner: true });
        if (partner) {
            validReferrer = referrerCode; // Nếu A hợp lệ thì ghi nhận
        }
      }

      dbUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        referralCode: randomCode,
        referredBy: validReferrer, // <--- LƯU MÃ CỦA NGƯỜI A VÀO ĐÂY
        role: "member",
        walletBalance: 0,
      });
    }

    return NextResponse.json({ success: true, data: dbUser });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
