import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'LAK' },
    category: { type: String, default: 'xe_co' },
    location: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    
    // LIÊN HỆ
    contactPhone: { type: String, required: true }, 
    contactWhatsapp: { type: String },

    sellerId: { type: String, required: true },
    
    // QUAN TRỌNG: ĐỘ ƯU TIÊN (Để ghim tin)
    priority: { type: Number, default: 0 }, // 0: Thường, 1: VIP Thấp, 2: VIP Cao, 3: Siêu VIP
    
    status: { type: String, enum: ['active', 'sold', 'expired'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date },
  }
);

export default mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
