import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Th1", revenue: 10 },
  { name: "Th2", revenue: 20 },
  { name: "Th3", revenue: 28 },
  { name: "Th4", revenue: 35 },
  { name: "Th5", revenue: 40 },
  { name: "Th6", revenue: 38 },
  { name: "Th7", revenue: 45 },
  { name: "Th8", revenue: 50 },
  { name: "Th9", revenue: 42 },
  { name: "Th10", revenue: 48 },
  { name: "Th11", revenue: 55 },
  { name: "Th12", revenue: 60 },
];

export default function Dashboard() {
  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Tổng quan hệ thống
        </h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Người dùng", value: "12.4K", icon: "👤" },
          { label: "Vé đã đặt", value: "8.3K", icon: "🎫" },
          { label: "Phim hoạt động", value: "64", icon: "🎥" },
          { label: "Doanh thu hôm nay", value: "45.2M", icon: "💰" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 shadow hover:shadow-md transition flex flex-col items-start"
          >
            <div className="text-purple-600 text-3xl mb-2">{item.icon}</div>
            <p className="text-2xl font-semibold">{item.value}</p>
            <p className="text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-800 font-semibold">
              Thống kê doanh thu theo tháng
            </h2>
            <select className="border rounded-lg px-3 py-1 text-sm">
              <option>Theo Tuần</option>
              <option>Theo Tháng</option>
              <option>Theo Năm</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#9b5cfb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-gray-800 font-semibold mb-4">
            Top Phim Bán Chạy
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                name: "Avengers: Endgame",
                revenue: "12.4M VND",
                img: "https://lumiere-a.akamaihd.net/v1/images/avengers_endgame_eng_p71_hd_2000x2818_961af0dc.png?region=0,0,2000,2818",
              },
              {
                name: "Spider-Man: No Way Home",
                revenue: "9.7M VND",
                img: "https://i.imgur.com/JkQ8mYv.jpg",
              },
              {
                name: "Doctor Strange: Multiverse",
                revenue: "7.8M VND",
                img: "https://i.imgur.com/j5YF1FJ.jpg",
              },
            ].map((movie, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={movie.img}
                  alt={movie.name}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {movie.name}
                  </p>
                  <p className="text-xs text-gray-500">{movie.revenue}</p>
                </div>
                <span className="text-purple-600 font-semibold">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
