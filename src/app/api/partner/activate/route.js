import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    await dbConnect();
    const dbUser = await User.findOne({ clerkId: user.id });

    // 1. Kiểm tra xem đã kích hoạt chưa
    if (dbUser.isPartner) {
      return NextResponse.json({ error: "Bạn đã là Đối tác rồi!" }, { status: 400 });
    }

    // 2. Kiểm tra tiền trong ví (Phí 200.000)
    const PARTNER_FEE = 200000;
    if (dbUser.walletBalance < PARTNER_FEE) {
      return NextResponse.json({ error: "Số dư không đủ. Cần 200.000 LAK" }, { status: 400 });
    }

    // 3. Trừ tiền và Cấp mã
    // Tạo mã random 6 ký tự (Ví dụ: SON999)
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    dbUser.walletBalance -= PARTNER_FEE;
    dbUser.isPartner = true;
    dbUser.referralCode = newCode;
    
    await dbUser.save();

    return NextResponse.json({ success: true, message: "Kích hoạt thành công!", data: dbUser });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
