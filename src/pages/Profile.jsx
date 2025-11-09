import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProfileApi } from "../api/authApi";
import {
  FaHeart,
  FaListUl,
  FaHistory,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../utils/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gray-800 text-yellow-400 font-semibold"
      : "text-gray-400 hover:text-white";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        const data = await getProfileApi(token);
        setUser(data);
      } catch (err) {
        console.error("Lỗi lấy thông tin user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] bg-[#0f0f0f]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-[80vh] bg-[#0f0f0f]">
        <p className="text-gray-400 text-lg">Không tìm thấy thông tin người dùng</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] font-sans text-gray-200">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#111] p-6 flex flex-col justify-between rounded-r-[50px] shadow-xl">
        <div>
          <h2 className="text-xl font-bold mb-6 text-white">Quản lý tài khoản</h2>
          <nav className="flex flex-col gap-3">
            <Link to="/favorites" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive("/favorites")}`}>
              <FaHeart className="text-pink-500 w-5 h-5" /> Yêu thích
            </Link>
            <Link to="/list" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive("/list")}`}>
              <FaListUl className="text-blue-500 w-5 h-5" /> Danh sách
            </Link>
            <Link to="/continue" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive("/continue")}`}>
              <FaHistory className="text-yellow-400 w-5 h-5" /> Xem tiếp
            </Link>
            <Link to="/notifications" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive("/notifications")}`}>
              <FaBell className="text-red-500 w-5 h-5" /> Thông báo
            </Link>
            <Link to="/profile" className={`flex items-center gap-3 p-3 rounded-lg transition ${isActive("/profile")}`}>
              <FaUserCircle className="text-yellow-400 w-5 h-5" /> Tài khoản
            </Link>
          </nav>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-6">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={user.avatar_url || "/default-avatar.png"}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
            />
            <div>
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            <FaSignOutAlt /> Thoát
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start py-10 px-8">
        <div className="bg-[#181818] rounded-3xl p-10 shadow-2xl border border-[#2a2a2a] w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-4 text-white">Tài khoản</h2>
          <p className="text-gray-400 mb-8">Thông tin cá nhân của bạn</p>

          <div className="flex flex-col gap-4 bg-[#121212] rounded-2xl p-6 shadow-inner border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
              />
              <div className="flex flex-col gap-1">
                <p className="text-white font-semibold text-lg">{user.username}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <p className="text-gray-400 text-sm capitalize">{user.gender || "Chưa cập nhật"}</p>
                {user.is_premium && (
                  <span className="text-yellow-400 font-semibold text-sm">Premium</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <p className="text-gray-300">
                <span className="font-medium text-white">👤 Username:</span> {user.username}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">📧 Email:</span> {user.email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">⚥ Giới tính:</span> {user.gender || "Chưa cập nhật"}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">💎 Premium:</span> {user.is_premium ? "Có" : "Không"}
              </p>
            </div>
          </div>

          <button
            className="mt-7 w-full py-3 rounded-xl bg-linear-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
            onClick={() => alert("Chức năng chỉnh sửa thông tin sắp ra mắt 😄")}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </main>
    </div>
  );
}
