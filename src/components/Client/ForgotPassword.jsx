import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 sửa ở đây: import useNavigate
import { forgotPasswordApi } from "../../api/authApi";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Vui lòng nhập email!");
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      toast.success("Gửi email khôi phục thành công!");
      navigate("/login"); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Lỗi khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
      <div className="bg-[#1b1e2b] p-6 rounded-2xl shadow-xl w-[420px] text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Quên mật khẩu</h2>
          <button onClick={() => navigate("/login")}>✕</button>
        </div>

        <p className="text-sm text-gray-300 mb-3">
          Nếu bạn đã có tài khoản,{" "}
          <span
            onClick={() => navigate("/login")} 
            className="text-yellow-400 cursor-pointer"
          >
            đăng nhập
          </span>
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
