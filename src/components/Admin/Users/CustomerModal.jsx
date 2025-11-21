import { useState } from "react";
import { updateUser } from "../../../api/userApi";

export default function CustomerModal({
  user,
  onClose,
  onReload,
  isEdit,
  setIsEdit,
}) {
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    gender: user.gender,
    role: user.role,
    is_premium: user.is_premium,
    is_active: user.is_active,
    avatar_url: user.avatar_url,
  });

  const handleSubmit = async () => {
    await updateUser(user.id, form);
    onReload();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[520px] shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">
          {isEdit ? "Cập nhật khách hàng" : "Chi tiết khách hàng"}
        </h2>

        {/* Thông tin */}
        <div className="space-y-3">
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
            <strong>Trạng thái: </strong>
            {user.is_active ? "Hoạt động" : "Bị khóa"}
          </p>
        </div>

        {isEdit && (
          <div className="mt-4">
            <label>Tên khách hàng</label>
            <input
              className="w-full mt-1 border p-2 rounded"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label className="mt-3">Giới tính</label>
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
