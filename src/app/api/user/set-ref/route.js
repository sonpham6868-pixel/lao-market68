import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const { code } = await request.json(); // Mã giới thiệu khách nhập
    if (!code) return NextResponse.json({ error: "Vui lòng nhập mã!" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ clerkId: clerkUser.id });

    // Nếu người dùng này đã có người giới thiệu rồi thì thôi
    if (user.referredBy) {
      return NextResponse.json({ success: true, message: "Đã có người giới thiệu rồi." });
    }

    // Tìm người chủ của mã này (Người giới thiệu)
    const referrer = await User.findOne({ referralCode: code });
    if (!referrer) {
      return NextResponse.json({ success: false, error: "Mã giới thiệu không tồn tại!" }, { status: 404 });
    }

    // Không được tự giới thiệu chính mình
    if (referrer.clerkId === user.clerkId) {
      return NextResponse.json({ success: false, error: "Không thể nhập mã của chính mình!" }, { status: 400 });
    }

    // Lưu lại
    user.referredBy = code;
    await user.save();

    return NextResponse.json({ success: true, message: "Kích hoạt thành công!" });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
