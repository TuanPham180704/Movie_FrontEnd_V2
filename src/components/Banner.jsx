export default function Banner() {
  return (
    <div className="relative h-80 md:h-[400px] bg-linear-to-r from-indigo-700 via-purple-700 to-pink-600 flex items-center justify-center text-center rounded-b-3xl shadow-lg">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Chào mừng đến với <span className="text-yellow-300">🎬DevChill</span>
        </h1>
        <p className="text-lg text-gray-200">
          Nơi thư giãn của dân lập trình — xem phim, chill nhạc, recharge năng
          lượng để code tiếp 🔥
        </p>
      </div>
    </div>
  );
}
