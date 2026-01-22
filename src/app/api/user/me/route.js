import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });

    await dbConnect();

    // Tìm User trong DB
    let user = await User.findOne({ clerkId: clerkUser.id });

    // Nếu chưa có (Lần đầu đăng nhập) -> Tự động tạo mới
    if (!user) {
      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        walletBalance: 0, // Tặng 0 đồng khởi nghiệp
      });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
