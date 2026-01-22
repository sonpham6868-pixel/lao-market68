export const dynamic = 'force-dynamic'; // <--- DÒNG QUAN TRỌNG NHẤT: BẮT BUỘC LẤY DỮ LIỆU MỚI
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// ============================================================
// HÀM KIỂM TRA QUYỀN ADMIN (BẢO MẬT)
// ============================================================
async function checkAdmin() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null; 

  await dbConnect();
  const user = await User.findOne({ clerkId: clerkUser.id });
  
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user; 
}

// 1. GET: LẤY DANH SÁCH USER
export async function GET() {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) return NextResponse.json({ error: "⛔ BẠN KHÔNG CÓ QUYỀN ADMIN!" }, { status: 403 });

    // Lấy danh sách mới nhất, không dùng Cache
    const users = await User.find({}).sort({ kycStatus: -1, createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. PUT: THỰC THI LỆNH (GIỮ NGUYÊN NHƯ CŨ)
export async function PUT(request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { userId, action, value } = body; 

    if (userId === adminUser._id.toString() && (action === 'ban' || action === 'set_admin')) {
       return NextResponse.json({ error: "Không thể thao tác trên chính mình!" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User không tồn tại" }, { status: 404 });

    let message = "";

    switch (action) {
      case 'balance': 
        user.walletBalance += Number(value);
        message = `Số dư mới: ${user.walletBalance.toLocaleString()}`;
        break;

      case 'vip': 
        user.vipPackage = value;
        message = `VIP: ${value}`;
        break;

      case 'ban': 
        user.isBanned = value; 
        message = value ? "Đã KHÓA" : "Đã MỞ";
        break;
      
      case 'assign_ref':
        user.referredBy = value;
        message = `Đã duyệt user!`;
        break;

      case 'set_admin':
         user.role = 'admin';
         message = "Đã thăng chức ADMIN!";
         break;

      case 'kyc_approve':
        user.kycStatus = 'approved';
        message = "✅ Đã duyệt hồ sơ!";
        break;

      case 'kyc_reject':
        user.kycStatus = 'rejected';
        message = "❌ Đã từ chối hồ sơ.";
        break;

      default:
        return NextResponse.json({ error: "Lệnh sai" }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ success: true, message });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
