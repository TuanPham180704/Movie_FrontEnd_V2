import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaTicketAlt, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { getProfileApi } from "../../api/authApi";
import { toast } from "react-toastify";

export default function Sidebar({
  user: propUser,
  onLogout,
  active = "profile",
}) {
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);

  useEffect(() => {
    if (!propUser) {
      const fetchUser = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Bạn chưa đăng nhập!");
          setLoading(false);
          return;
        }
        try {
          const data = await getProfileApi(token);
          setUser(data);
        } catch (err) {
          console.error(err);
          toast.error("Không thể tải thông tin user!");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [propUser]);

  const menuItems = [
    {
      id: "profile",
      icon: <FaUser />,
      label: "Tài khoản cá nhân",
      path: "/profile",
    },
    {
      id: "tickets",
      icon: <FaTicketAlt />,
      label: "Vé đã đặt",
      path: "/my-tickets",
    },
    {
      id: "my-premium",
      icon: <FaCrown />,
      label: "Gói đã mua",
      path: "/my-premium",
    },
  ];

  return (
    <aside className="bg-[#1A1A1A] w-80 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-6">Quản lý tài khoản</h2>

        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 cursor-pointer transition ${
                  active === item.id
                    ? "text-yellow-400 font-medium"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-700 pt-4">
        {loading ? (
          <p className="text-gray-400">Đang tải thông tin...</p>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar_url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">{user?.username || "Người dùng"}</p>
              {user?.is_premium && (
                <span className="text-yellow-400 text-sm">🌟 Premium</span>
              )}
              <p className="text-gray-400 text-sm">{user?.email || ""}</p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-2 mt-4 text-gray-400 hover:text-white"
        >
          <FaSignOutAlt /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
