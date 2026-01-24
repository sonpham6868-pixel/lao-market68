import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Loi: Chua khai bao MONGODB_URI trong file .env');
}

// Cơ chế Caching: Giúp dùng lại kết nối cũ, không mở mới liên tục gây treo máy
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached database connection"); // Báo hiệu dùng lại kết nối cũ
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Thời gian chờ tối đa 10 giây, quá thì báo lỗi chứ không treo mãi
      serverSelectionTimeoutMS: 10000, 
    };

    console.log("Creating new database connection..."); // Báo hiệu tạo mới
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB Connected Successfully!");
      return mongoose;
    }).catch((err) => {
        console.error("MongoDB Connection Error:", err);
        throw err;
    });
  }
  
  try {
      cached.conn = await cached.promise;
  } catch (e) {
      cached.promise = null;
      throw e;
  }

  return cached.conn;
}

export default connectDB;
