import dbConnect from '@/lib/db';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Cấu hình bảng giá và hoa hồng
const VIP_PACKAGES = {
  '1_month': { 
    price: 199000, 
    commissionRate: 0.10, // 10%
    days: 30,
    postLimit: 30 
  },
  '6_month': { 
    price: 954000, 
    commissionRate: 0.20, // 20%
    days: 180,
    postLimit: 180 
  },
  '12_month': { 
    price: 1188000, 
    commissionRate: 0.30, // 30%
    days: 365,
    postLimit: 999999 // Không giới hạn
  }
};

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const { packageId } = await req.json(); // Ví dụ: '1_month'
    const selectedPackage = VIP_PACKAGES[packageId];

    if (!selectedPackage) {
      return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
    }

    await dbConnect();
    
    // 1. Lấy thông tin Người Mua (Người B)
    const buyer = await User.findOne({ clerkId: user.id });
    
    // Kiểm tra tiền
    if (buyer.walletBalance < selectedPackage.price) {
      return NextResponse.json({ error: "Số dư không đủ. Vui lòng nạp thêm tiền!" }, { status: 400 });
    }

    // 2. TRỪ TIỀN NGƯỜI MUA
    buyer.walletBalance -= selectedPackage.price;
    
    // Cập nhật trạng thái VIP cho B
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + selectedPackage.days));
    
    buyer.vipPackage = packageId;
    buyer.vipExpiry = expiryDate;
    buyer.postCount = 0; // Reset số bài đăng
    
    await buyer.save();

    // 3. CHIA HOA HỒNG CHO NGƯỜI GIỚI THIỆU (NGƯỜI A)
    if (buyer.referredBy) {
      const referrer = await User.findOne({ referralCode: buyer.referredBy });
      
      // Điều kiện nhận hoa hồng: A phải tồn tại VÀ A cũng phải là Đối tác (đã đóng 200k)
      if (referrer && referrer.isPartner) {
        const commissionAmount = selectedPackage.price * selectedPackage.commissionRate;
        
        // Cộng tiền cho A
        referrer.walletBalance += commissionAmount;
        await referrer.save();

        console.log(`Đã chia hoa hồng: ${commissionAmount} LAK cho ${referrer.email}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Đăng ký gói ${packageId} thành công!`,
      data: buyer 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
