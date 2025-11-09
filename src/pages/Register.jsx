
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/authApi";
import { toast } from "react-toastify";
import logoWeb from "../assets/logoWeb.png";


export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess() {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    },
    onError(err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Đăng ký thất bại");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }
    mutation.mutate({ username, email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0b0b0f]">
      <div className="flex w-[850px] bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl">
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#0b1220] p-8 text-white relative">
          <img
            src={logoWeb}
            alt="DevChill Background"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 flex flex-col justify-end h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black">
                ▶
              </div>
              <h1 className="text-xl font-semibold">DevChill</h1>
            </div>
            <p className="text-gray-300 text-sm">Phim hay cả rổ</p>
          </div>
        </div>

        <div className="flex-1 bg-[#0b1220] p-8 text-white">
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
          </div>

          <h2 className="text-2xl font-bold mt-2 mb-1">Tạo tài khoản mới</h2>
          <p className="text-sm text-gray-400 mb-6">
            Nếu bạn đã có tài khoản,{" "}
            <Link to="/login" className="text-yellow-400 hover:underline">
              đăng nhập
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Tên hiển thị"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              className="w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                id="verify"
                className="accent-yellow-400"
                required
              />
              <label htmlFor="verify">Xác minh bạn là con người</label>
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
            >
              {mutation.isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
