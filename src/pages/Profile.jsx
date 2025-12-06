import { useEffect, useState } from "react";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
} from "../api/authApi";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChangePassword from "../components/Client/ChangePassword";
import Sidebar from "./Client/SideBar";
import {
  FaHeart,
  FaListUl,
  FaHistory,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    gender: "unknown",
    avatar_url: "",
  });
  const handleChangePassword = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await changePasswordApi(token, data);
      toast.success(res.message || "Đổi mật khẩu thành công!");
      setShowChangePassword(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Đổi mật khẩu thất bại, vui lòng thử lại!"
      );
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      try {
        const data = await getProfileApi(token);
        setUser(data);
        setFormData({
          email: data.email || "",
          username: data.username || "",
          gender: data.gender || "unknown",
          avatar_url: data.avatar_url || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin tài khoản!");
      }
    };

    fetchProfile();
  }, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await updateProfileApi(token, formData);
      toast.success("Cập nhật thông tin thành công!");
      setUser((prev) => ({ ...prev, ...formData }));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật thông tin!");
    }
  };
  const handleLogout = () => {
    removeToken();
    toast.info("Đã đăng xuất!");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white flex justify-center py-10">
      <div className="flex gap-10 w-10/12">
        <Sidebar user={user} onLogout={handleLogout} active="profile" />
        <main className="flex-1 bg-[#1A1A1A] rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-2">Tài khoản</h2>
          <p className="text-gray-400 mb-8">Cập nhật thông tin tài khoản</p>

          <form onSubmit={handleSubmit} className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email-input"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full bg-[#222] border border-gray-700 rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Tên hiển thị</label>
                <input
                  type="text"
                  name="username"
                  id="username-input"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#222] border border-gray-700 rounded-lg p-3"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Giới tính</label>
                <div className="flex items-center gap-5 text-gray-300">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      className="mr-1"
                      id="gender-male"
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      className="mr-1"
                      id="gender-female"
                    />
                    Nữ
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="unknown"
                      checked={formData.gender === "unknown"}
                      onChange={handleChange}
                      className="mr-1"
                      id="gender-unknown"
                    />
                    Không xác định
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-6 rounded-lg"
                id="update-profile-btn"
              >
                Cập nhật
              </button>

              <p className="text-gray-400">
                Đổi mật khẩu, nhấn vào{" "}
                <span
                  onClick={() => setShowChangePassword(true)}
                  className="text-yellow-400 cursor-pointer"
                  id="change-password-link"
                >
                  đây
                </span>
              </p>
            </div>
            <div className="flex flex-col items-center justify-start gap-3">
              <img
                src={
                  formData.avatar_url ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                id="profile-avatar"
                className="w-32 h-32 rounded-full object-cover"
              />

              <label className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-4 rounded cursor-pointer text-center">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
              </label>
            </div>
          </form>
        </main>
      </div>
      <ChangePassword
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
