import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { logout } from "../../utils/auth";
import { toast } from "react-toastify";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const active = (path) =>
    location.pathname === path
      ? "bg-purple-600 text-white"
      : "text-gray-300 hover:bg-purple-700 hover:text-white";

  const handleLogout = () => {
    logout();
    toast.info("Đã Đăng Xuất!");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-[#101322] h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 p-6">
          <div>
            <h1 className="text-white text-lg font-semibold">🎬 DevChill</h1>
            <p className="text-gray-400 text-sm">Quản lý Rạp Phim</p>
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
            to="/admin/movies"
            className={`flex items-center gap-3 px-6 py-3 ${active("/phim")}`}
          >
            <FaFilm /> Quản lý Phim
          </Link>
          <Link
            to="/admin/tickets"
            className={`flex items-center gap-3 px-6 py-3 ${active("/dat-ve")}`}
          >
            <FaTicketAlt /> Quản lý Đặt Vé
          </Link>
          <Link
            to="/suat-chieu"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/suat-chieu"
            )}`}
          >
            <FaClock /> Quản lý Suất Chiếu
          </Link>
          <Link
            to="/rap"
            className={`flex items-center gap-3 px-6 py-3 ${active("/rap")}`}
          >
            <FaBuilding /> Quản Lý Rạp Phim
          </Link>
          <Link
            to="/bao-cao"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/bao-cao"
            )}`}
          >
            <FaFileAlt /> Quản Lý Báo Cáo
          </Link>
          <Link
            to="/admin/customers"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/admin/customers"
            )}`}
          >
            <FaUsers /> Quản Lý Khách hàng
          </Link>
          <Link
            to="/premium"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/premium"
            )}`}
          >
            <FaCrown /> Quản Lý Gói Premium
          </Link>
          <Link
            to="/cai-dat"
            className={`flex items-center gap-3 px-6 py-3 ${active(
              "/cai-dat"
            )}`}
          >
            <FaCog /> Cài Đặt
          </Link>
        </nav>
      </div>

      <div
        className="flex items-center justify-between bg-[#191d2e] mx-4 mb-4 p-3 rounded-lg cursor-pointer"
        onClick={handleLogout}
      >
        <div className="flex items-center gap-2">
          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            AD
          </div>
          <div>
            <p className="text-white text-sm font-medium">Admin</p>
            <p className="text-gray-400 text-xs">Quản Trị Viên</p>
          </div>
        </div>
        <FaSignOutAlt className="text-gray-400" />
      </div>
    </div>
  );
}
