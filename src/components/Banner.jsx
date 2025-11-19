export default function Banner() {
  return (
    <div className="relative h-80 md:h-[400px] bg-linear-to-r from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center text-center rounded-b-3xl shadow-lg px-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          🎬 Chào mừng đến với <span className="text-yellow-300">DevChill</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-100">
          Đặt vé xem phim nhanh chóng, tiện lợi và nhận ưu đãi hấp dẫn
        </h2>
        <p className="text-md md:text-lg text-gray-200">
          Trải nghiệm xem phim online, chọn ghế yêu thích và thanh toán an toàn
          ngay trên DevChill!
        </p>
      </div>
    </div>
  );
}
