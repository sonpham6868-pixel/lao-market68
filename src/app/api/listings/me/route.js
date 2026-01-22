import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Lấy danh sách tin của chính mình
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    await dbConnect();

    // Tìm tin có sellerId trùng với ID người dùng
    const myListings = await Listing.find({ sellerId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: myListings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa tin của mình
export async function DELETE(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await dbConnect();

    // Chỉ xóa được nếu tin đó là CỦA MÌNH
    const deleted = await Listing.findOneAndDelete({ _id: id, sellerId: user.id });

    if (!deleted) {
      return NextResponse.json({ error: "Không tìm thấy hoặc không có quyền xóa" }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: "Đã xóa tin!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
