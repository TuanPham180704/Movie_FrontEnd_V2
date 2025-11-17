import { useState } from "react";

export default function ChangePassword({ isOpen, onClose, onSubmit }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ oldPassword, newPassword, confirmPassword });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#2C2F48] p-6 rounded-2xl shadow-xl w-[350px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-white mb-4 text-center">
          Đổi mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            id="old-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="p-2 rounded bg-[#1F2235] text-white outline-none"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 rounded bg-[#1F2235] text-white outline-none"
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 rounded bg-[#1F2235] text-white outline-none"
            required
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="submit"
              id="submit-change-password"
              className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400"
            >
              Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
