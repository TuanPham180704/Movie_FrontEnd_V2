import {
  AiOutlineDatabase,
  AiOutlineBell,
  AiOutlineInfoCircle,
  AiOutlineSync,
  AiOutlineFileText,
  AiOutlineWarning,
  AiOutlineApi,
  AiOutlineUser,
  AiOutlineVideoCamera,
  AiOutlineMail,
  AiOutlineBarChart,
  AiOutlineTool,
} from "react-icons/ai";

export default function SystemSettingsPage() {
  const systemSettings = [
    {
      title: "Phiên bản DevChill",
      icon: <AiOutlineInfoCircle className="text-indigo-500 w-6 h-6" />,
      description: "Version 2.3.1 - Cập nhật mới nhất",
      action: "Xem chi tiết",
      status: "OK",
    },
    {
      title: "Backup / Restore dữ liệu",
      icon: <AiOutlineDatabase className="text-green-500 w-6 h-6" />,
      description: "Sao lưu tự động hàng ngày",
      action: "Thực hiện",
      status: "Đang ổn định",
    },
    {
      title: "Thông báo hệ thống",
      icon: <AiOutlineBell className="text-yellow-500 w-6 h-6" />,
      description: "Nhận cảnh báo server, lỗi hoặc sự kiện",
      action: "Cấu hình",
      status: "Đang hoạt động",
    },
    {
      title: "Logs & Debug",
      icon: <AiOutlineFileText className="text-purple-500 w-6 h-6" />,
      description: "Xem logs runtime và lỗi ứng dụng",
      action: "Mở",
      status: "OK",
    },
    {
      title: "Restart / Clear Cache",
      icon: <AiOutlineSync className="text-blue-500 w-6 h-6" />,
      description: "Khởi động lại server hoặc xóa cache",
      action: "Thực hiện",
      status: "Chưa thực hiện",
    },
    {
      title: "Cảnh báo hệ thống",
      icon: <AiOutlineWarning className="text-red-500 w-6 h-6" />,
      description: "Kiểm tra trạng thái lỗi & sự cố",
      action: "Kiểm tra",
      status: "Có cảnh báo",
    },
    {
      title: "Cấu hình API",
      icon: <AiOutlineApi className="text-pink-500 w-6 h-6" />,
      description: "Quản lý API key, endpoints, rate limit",
      action: "Quản lý",
      status: "Hoạt động",
    },
    {
      title: "Quản lý người dùng",
      icon: <AiOutlineUser className="text-teal-500 w-6 h-6" />,
      description: "User stats, active/inactive, khóa/tắt",
      action: "Mở",
      status: "OK",
    },
    {
      title: "Quản lý rạp / phim",
      icon: <AiOutlineVideoCamera className="text-orange-500 w-6 h-6" />,
      description: "Config cinema rooms, showtimes, categories",
      action: "Cấu hình",
      status: "OK",
    },
    {
      title: "Email / SMS templates",
      icon: <AiOutlineMail className="text-pink-600 w-6 h-6" />,
      description: "Cấu hình nội dung thông báo tự động",
      action: "Chỉnh sửa",
      status: "Đang hoạt động",
    },
    {
      title: "Analytics & Reports",
      icon: <AiOutlineBarChart className="text-green-600 w-6 h-6" />,
      description: "Xem thống kê, báo cáo doanh thu, lượt xem",
      action: "Xem",
      status: "OK",
    },
    {
      title: "System Maintenance",
      icon: <AiOutlineTool className="text-gray-600 w-6 h-6" />,
      description: "Maintenance mode, uptime, health check",
      action: "Quản lý",
      status: "Chưa thực hiện",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Cài Đặt Hệ Thống DevChill
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemSettings.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
          >
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.status.includes("OK") ||
                  item.status.includes("Đang") ||
                  item.status.includes("Hoạt động")
                    ? "bg-green-100 text-green-800"
                    : item.status.includes("Cảnh báo")
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {item.status}
              </span>
              <button className="text-blue-600 hover:underline text-sm font-medium">
                {item.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
