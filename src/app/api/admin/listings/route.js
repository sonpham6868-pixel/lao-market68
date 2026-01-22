import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import Report from '@/models/Report';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import User from '@/models/User';

// KIỂM TRA QUYỀN ADMIN
async function checkAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  await dbConnect();
  const user = await User.findOne({ clerkId: clerkUser.id });
  if (!user || user.role !== 'admin') return null;
  return user;
}

// 1. GET: LẤY DANH SÁCH TIN ĐĂNG & BÁO CÁO
export async function GET(request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'listings' hoặc 'reports'

  try {
    if (type === 'reports') {
      // Lấy danh sách báo cáo
      const reports = await Report.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: reports });
    } else {
      // Lấy danh sách tin đăng (Mới nhất lên đầu)
      const listings = await Listing.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: listings });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. DELETE: XÓA BÀI ĐĂNG
export async function DELETE(request) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await Listing.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Đã xóa bài đăng!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
