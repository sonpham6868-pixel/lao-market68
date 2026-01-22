import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporterId: { type: String }, // Người báo cáo (nếu có đăng nhập)
    targetListingId: { type: String }, // Bài viết bị báo cáo
    targetUserId: { type: String }, // Người bị báo cáo (Chủ bài viết)
    reason: { type: String, required: true }, // Lý do
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }, // pending: Chờ xử lý
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
