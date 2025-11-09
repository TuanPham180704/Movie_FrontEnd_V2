export default function DevChillApp() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0b0b0f]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-10 rounded-3xl bg-linear-to-r from-blue-500 to-purple-500 w-[90%] max-w-5xl shadow-2xl">
        <div className="bg-[#2b2b2b] rounded-2xl w-[220px] h-[400px] flex items-center justify-center text-white text-xl font-semibold shadow-xl">
          Phone App
        </div>

        <div className="text-white max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Trải nghiệm <span className="text-white">DevChill</span> mọi lúc,
            mọi nơi
          </h2>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-5">
            Tải ứng dụng DevChill để xem phim yêu thích ngay trên điện thoại.
            Giao diện thân thiện, chất lượng HD, và đồng bộ tiến trình xem trên
            mọi thiết bị.
          </p>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <path d="M325.3 234.3 104.7 63.5c-4.8-3.8-11.7-.4-11.7 5.7v374.7c0 6.1 6.9 9.5 11.7 5.7l220.6-170.8c3.8-2.9 3.8-8.5 0-11.4z" />
            </svg>
            Tải cho Android
          </button>
        </div>
      </div>
    </div>
  );
}
