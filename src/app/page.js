import connectDB from "@/lib/db";

export const dynamic = 'force-dynamic'; // Bắt buộc chạy động để tránh lỗi Build

export default async function Home() {
  // Thử kết nối nhẹ 1 cái xem sao
  await connectDB();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-green-600">
           LAO MARKET - KẾT NỐI THÀNH CÔNG! 🚀
        </h1>
        <p className="mt-4">Hệ thống đang được bảo trì để nâng cấp.</p>
      </div>
    </main>
  );
}
