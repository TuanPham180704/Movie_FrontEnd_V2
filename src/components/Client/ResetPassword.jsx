import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi";
import { toast } from "react-toastify";
export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi(token, newPassword, confirmPassword);
      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-transparent p-8 rounded-2xl w-[340px] text-center"
      >
        <h2 className="text-white text-xl font-bold mb-4">
          Thiết lập lại mật khẩu
        </h2>

        <input
          type="password"
          placeholder="Mật khẩu mới"
          className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 rounded-md px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          className="w-full bg-[#1a1a1a] text-white placeholder-gray-400 rounded-md px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#fbc567] hover:bg-[#f5b947] text-black font-semibold py-2 px-8 rounded-md transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Hoàn thành"}
        </button>
      </form>
    </div>
  );
}
