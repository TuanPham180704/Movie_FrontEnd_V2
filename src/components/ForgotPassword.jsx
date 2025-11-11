import { useState } from "react";
import { forgotPasswordApi } from "../api/authApi";
import { toast } from "react-toastify";

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Vui lòng nhập email!");
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      toast.success("Gửi email khôi phục thành công!");
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1b1e2b] p-6 rounded-2xl shadow-xl w-[420px] text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Quên mật khẩu</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          Nếu bạn đã có tài khoản,{" "}
          <span className="text-yellow-400 cursor-pointer">đăng nhập</span>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full p-2 rounded bg-[#2a2d3e] text-sm mb-4 outline-none"
            placeholder="Email đăng ký"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-md"
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      </div>
    </div>
  );
}
