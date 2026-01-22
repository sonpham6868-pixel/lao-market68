/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép load ảnh từ Cloudinary và Google (avatar)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.clerk.com' }, // Avatar của Clerk
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' } // Avatar Google
    ],
  },
  
  // --- BẢO MẬT HEADERS ---
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Chống người khác nhúng web bạn vào iframe để lừa đảo (Clickjacking)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Chống đoán trộm định dạng file
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin', // Bảo vệ thông tin đường dẫn
          },
        ],
      },
    ];
  },
};

export default nextConfig;
