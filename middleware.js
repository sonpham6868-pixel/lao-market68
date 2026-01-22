import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Định nghĩa các khu vực cần bảo vệ nghiêm ngặt
const isProtectedRoute = createRouteMatcher([
  '/vi-cua-toi(.*)', // Trang ví
  '/quan-ly-tin(.*)', // Trang quản lý tin
  '/dang-tin(.*)',    // Trang đăng tin
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)' // Trang Admin
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 2. Bảo vệ trang Admin (Quan trọng nhất)
  // Nếu cố vào /admin mà chưa đăng nhập -> Bắt đăng nhập
  if (isAdminRoute(req)) {
    await auth.protect();
    
    // Lấy thông tin role từ Clerk (Nếu bạn đã setup role bên Clerk dashboard)
    // Tuy nhiên, để an toàn nhất, ta sẽ check thêm ở bước API gọi về Database
    // Ở đây ta tạm thời chỉ bắt buộc phải đăng nhập mới được bén mảng tới Admin
  }

  // 3. Bảo vệ các trang cá nhân
  if (isProtectedRoute(req)) {
    await auth.protect(); // Chưa đăng nhập thì đá ra trang Login
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Bỏ qua các file tĩnh nội bộ (_next)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Luôn chạy middleware cho API và tRPC
    '/(api|trpc)(.*)',
  ],
};
