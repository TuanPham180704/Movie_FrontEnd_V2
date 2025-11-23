import { useState, useEffect } from "react";
import { updateUser } from "../../../api/userApi";
import { toast } from "react-toastify";

export default function CustomerModal({
  user,
  onClose,
  onReload,
  isEdit,
  setIsEdit,
}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    gender: "unknown",
    role: "user",
    is_premium: false,
    is_active: true,
    avatar_url: "",
  });

  useEffect(() => {
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      gender: user.gender || "unknown",
      role: user.role || "user",
      is_premium: user.is_premium || false,
      is_active: user.is_active ?? true,
      avatar_url: user.avatar_url || "",
    });
  }, [user]);

  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password; // nếu không nhập password thì không gửi
      await updateUser(user.id, payload); // gọi API cập nhật
      toast.success("Cập nhật thông tin thành công");
      onReload(); // load lại danh sách
      onClose(); // đóng modal
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[520px] shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {isEdit ? "Cập nhật khách hàng" : "Chi tiết khách hàng"}
        </h2>

        {/* Thông tin chi tiết */}
        <div className="space-y-3">
          <p>
            <strong>Username: </strong> {user.username}
          </p>
          <p>
            <strong>Email: </strong> {user.email}
          </p>
          <p>
            <strong>Giới tính: </strong> {user.gender}
          </p>
          <p>
            <strong>Vai trò: </strong> {user.role}
          </p>
          <p>
            <strong>Premium: </strong> {user.is_premium ? "Có" : "Không"}
          </p>
          <p>
            <strong>Trạng thái: </strong>{" "}
            {user.is_active ? "Hoạt động" : "Bị khóa"}
          </p>
          <p>
            <strong>Avatar URL: </strong> {user.avatar_url || "Chưa có"}
          </p>
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-20 h-20 rounded mt-2 object-cover"
            />
          )}
        </div>
        {isEdit && (
          <div className="mt-4 space-y-3">
            <div>
              <label>Tên khách hàng</label>
              <input
                className="w-full mt-1 border p-2 rounded"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                className="w-full mt-1 border p-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label>Mật khẩu mới</label>
              <input
                type="password"
                className="w-full mt-1 border p-2 rounded"
                placeholder="Để trống nếu không đổi"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label>Giới tính</label>
              <select
                className="w-full border p-2 rounded mt-1"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="unknown">Không xác định</option>
              </select>
            </div>

            <div>
              <label>Vai trò</label>
              <select
                className="w-full border p-2 rounded mt-1"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label>
                <input
                  type="checkbox"
                  checked={form.is_premium}
                  onChange={(e) =>
                    setForm({ ...form, is_premium: e.target.checked })
                  }
                />
                Premium
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Hoạt động
              </label>
            </div>

            <div>
              <label>Avatar URL</label>
              <input
                className="w-full mt-1 border p-2 rounded"
                value={form.avatar_url}
                onChange={(e) =>
                  setForm({ ...form, avatar_url: e.target.value })
                }
              />
              {form.avatar_url && (
                <img
                  src={form.avatar_url}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded mt-2 object-cover"
                />
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Đóng
          </button>

          {isEdit ? (
            <button
              className="px-4 py-2 bg-violet-600 text-white rounded"
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-violet-100 text-violet-800 rounded"
              onClick={() => setIsEdit(true)}
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
