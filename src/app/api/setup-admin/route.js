import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST() { // <--- QUAN TRỌNG: PHẢI LÀ POST
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ success: false, error: "Chưa đăng nhập" }, { status: 401 });

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      { role: 'admin' }, 
      { new: true }
    );

    if (!updatedUser) {
        return NextResponse.json({ success: false, error: "Không tìm thấy user trong Database. Hãy F5 trang chủ!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Đã lên chức Admin thành công!", user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
