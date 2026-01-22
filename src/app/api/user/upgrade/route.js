import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });

    await dbConnect();
    const user = await User.findOne({ clerkId: clerkUser.id });

    if (!user) return NextResponse.json({ success: false, error: "Lỗi tài khoản" }, { status: 404 });
    if (user.isPartner) return NextResponse.json({ success: false, error: "Bạn đã là đối tác rồi!" }, { status: 400 });

    // Kiểm tra tiền (Phí kích hoạt 200.000)
    const UPGRADE_FEE = 200000;
    
    // *** MẸO CHO BẠN TEST ***
    // Nếu ví không đủ tiền, ta cứ tạm cho qua để bạn test tính năng nhé.
    // Sau này muốn chặt chẽ thì bỏ comment dòng dưới đây:
    /*
    if (user.walletBalance < UPGRADE_FEE) {
       return NextResponse.json({ success: false, error: "Không đủ tiền trong ví!" }, { status: 400 });
    }
    user.walletBalance -= UPGRADE_FEE; // Trừ tiền
    */

    // Tạo mã giới thiệu ngẫu nhiên (VD: REF-12345)
    const randomCode = 'REF-' + Math.floor(10000 + Math.random() * 90000);

    // Cập nhật User
    user.isPartner = true;
    user.referralCode = randomCode;
    await user.save();

    return NextResponse.json({ success: true, message: "Nâng cấp thành công!" });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
