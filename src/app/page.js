export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#0070f3', fontSize: '40px' }}>
         CHÚC MỪNG SƠN! 
      </h1>
      <h2 style={{ color: 'green' }}>
        WEB ĐÃ CHẠY TRÊN TÊN MIỀN LAOMARKET.NET 🚀
      </h2>
      <p>Kết nối từ Lào sang Singapore thành công!</p>
    </div>
  );
}
