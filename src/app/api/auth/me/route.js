import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Xác định xem ai đang hỏi?
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    await dbConnect();

    // 2. Tìm ví tiền của người đó trong kho
    const dbUser = await User.findOne({ clerkId: user.id });

    if (!dbUser) {
      return NextResponse.json({ error: "Chưa có dữ liệu" }, { status: 404 });
    }

    // 3. Trả về kết quả
    return NextResponse.json({ success: true, data: dbUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
