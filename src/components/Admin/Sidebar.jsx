import { Link, useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaFilm,
  FaTicketAlt,
  FaClock,
  FaBuilding,
  FaFileAlt,
  FaUsers,
  FaCrown,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const active = (path) =>
    location.pathname === path
      ? "bg-purple-600 text-white"
      : "text-gray-300 hover:bg-purple-700 hover:text-white";

  return (
    <div className="w-64 bg-[#101322] h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 p-6">
          <div>
            <h1 className="text-white text-lg font-semibold">🎬 DevChill</h1>
            <p className="text-gray-400 text-sm">Quản lý rạp phim</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-6 py-3 ${active("/")}`}
          >
            <FaChartPie /> Tổng quan
          </Link>
          <Link
            to="/phim"
            className={`flex items-center gap-3 px-6 py-3 ${active("/phim")}`}
          >
            <FaFilm /> Quản lý phim
          </Link>
          <Link
            to="/dat-ve"
            className={`flex items-center gap-3 px-6 py-3 ${active("/dat-ve")}`}
          >
            <FaTicketAlt /> Quản lý Đặt vé
          </Link>
          <Link
            to="/suat-chieu"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/suat-chieu"
            )}`}
          >
            <FaClock /> Quản lý Suất chiếu
          </Link>
          <Link
            to="/rap"
            className={`flex items-center gap-3 px-6 py-3 ${active("/rap")}`}
          >
            <FaBuilding /> Quản lý Rạp Phim
          </Link>
          <Link
            to="/bao-cao"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/bao-cao"
            )}`}
          >
            <FaFileAlt /> Quản lý Báo Cáo
          </Link>
          <Link
            to="/khach-hang"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/khach-hang"
            )}`}
          >
            <FaUsers /> Quản lý Khách hàng
          </Link>
          <Link
            to="/premium"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/premium"
            )}`}
          >
            <FaCrown /> Quản lý Gói Premium
          </Link>
          <Link
            to="/cai-dat"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/cai-dat"
            )}`}
          >
            <FaCog /> Cài đặt
          </Link>
        </nav>
      </div>

      <div className="flex items-center justify-between bg-[#191d2e] mx-4 mb-4 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            AD
          </div>
          <div>
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-gray-400 text-xs">Quản trị viên</p>
          </div>
        </div>
        <FaSignOutAlt className="text-gray-400" />
      </div>
    </div>
  );
}
