import dbConnect from '@/lib/db';
import Report from '@/models/Report';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const clerkUser = await currentUser();
    // Cho phép cả người chưa đăng nhập báo cáo (để tăng lượng tin báo), 
    // nhưng nếu đăng nhập thì lưu ID để dễ liên hệ.
    
    const body = await request.json();
    const { targetListingId, targetUserId, reason } = body;

    if (!targetListingId || !reason) {
      return NextResponse.json({ error: "Thiếu thông tin báo cáo!" }, { status: 400 });
    }

    await dbConnect();

    // Tạo đơn tố cáo mới
    const newReport = await Report.create({
      reporterId: clerkUser ? clerkUser.id : 'anonymous', // Nếu không đăng nhập thì ghi là 'ẩn danh'
      targetListingId,
      targetUserId,
      reason,
      status: 'pending' // Chờ xử lý
    });

    return NextResponse.json({ success: true, message: "Đã gửi báo cáo thành công!" });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
