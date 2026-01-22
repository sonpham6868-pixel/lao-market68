import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    
    // QUYỀN HẠN
    role: { type: String, default: 'user' }, // admin, user
    isBanned: { type: Boolean, default: false }, 

    // VÍ TIỀN & VIP
    walletBalance: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    vipPackage: { type: String, default: 'free' }, 
    isPartner: { type: Boolean, default: false },
    
    // GIỚI THIỆU
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },
    
    // --- QUAN TRỌNG: NGĂN KÉO ĐỰNG KYC (NẾU THIẾU CÁI NÀY LÀ KHÔNG LƯU ĐƯỢC) ---
    kycStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    kycImages: { type: [String], default: [] }, 
    // -------------------------------------------------------------------------
    
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
