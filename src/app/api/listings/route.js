import dbConnect from '@/lib/db';
import Listing from '@/models/Listing';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 1. GET: LẤY TIN (ĐÃ SẮP XẾP ƯU TIÊN VIP)
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const keyword = searchParams.get('keyword');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filter = { status: 'active' };

    if (keyword) filter.$or = [{ title: { $regex: keyword, $options: 'i' } }, { description: { $regex: keyword, $options: 'i' } }];
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (category && category !== 'all') filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // --- SẮP XẾP QUAN TRỌNG ---
    // 1. priority giảm dần (VIP lên đầu)
    // 2. createdAt giảm dần (Mới nhất lên đầu)
    const listings = await Listing.find(filter).sort({ priority: -1, createdAt: -1 });
    
    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: ĐĂNG TIN (TỰ ĐỘNG GÁN PRIORITY)
export async function POST(request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ success: false, error: "Chưa đăng nhập!" }, { status: 401 });

    const body = await request.json();
    await dbConnect();

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return NextResponse.json({ success: false, error: "Lỗi tài khoản" }, { status: 404 });

    // --- CẤU HÌNH VIP & PHÍ ---
    let limit = 0;       
    let feePerPost = 0;  
    let expiryDays = 30; 
    let priorityScore = 0; // Điểm ưu tiên mặc định

    switch (user.vipPackage) {
      case '12_month':
        limit = 999999;
        feePerPost = 0;
        expiryDays = 60;
        priorityScore = 3; // SIÊU VIP (Luôn đứng đầu)
        break;
      case '6_month':
        limit = 180;
        feePerPost = 4000;
        expiryDays = 30;
        priorityScore = 2; // VIP VỪA
        break;
      case '1_month':
        limit = 30;
        feePerPost = 5000;
        expiryDays = 30;
        priorityScore = 1; // VIP THẤP
        break;
      default: // KHÁCH THƯỜNG
        limit = 0;         
        feePerPost = 10000; 
        expiryDays = 7;    
        priorityScore = 0; // KHÔNG ƯU TIÊN
        break;
    }

    // --- TRỪ TIỀN (LOGIC CŨ) ---
    let isCharged = false;
    let commission = 0;

    if (user.postCount >= limit) {
      if (user.walletBalance < feePerPost) {
        return NextResponse.json({ 
          success: false, 
          error: `Phí đăng tin là ${feePerPost.toLocaleString()} LAK. Ví không đủ tiền.` 
        }, { status: 400 });
      }
      user.walletBalance -= feePerPost;
      isCharged = true;
      commission = feePerPost * 0.1;
    }

    // --- TÍNH NGÀY HẾT HẠN ---
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expiryDays);

    // --- TẠO TIN MỚI ---
    const newListing = await Listing.create({
      ...body,
      sellerId: clerkUser.id,
      status: 'active',
      expiredAt: expirationDate,
      priority: priorityScore // <--- LƯU ĐIỂM ƯU TIÊN VÀO ĐÂY
    });

    // --- CHIA HOA HỒNG ---
    if (isCharged && commission > 0 && user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });
      if (referrer && referrer.isPartner) {
        referrer.walletBalance += commission;
        await referrer.save();
      }
    }

    user.postCount += 1;
    await user.save();
    
    return NextResponse.json({ success: true, data: newListing }, { status: 201 });

  } catch (error) {
    console.error("Lỗi đăng tin:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
