import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/authApi";
import { setToken } from "../utils/auth";
import { toast } from "react-toastify";
import logoWeb from "../assets/logoWeb.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess(data) {
      const token = data?.user?.token;
      const user = data?.user?.user;
      if (token) {
        setToken(token);
        qc.invalidateQueries({ queryKey: ["me"] });
        toast.success(`Chào mừng ${user?.username || "bạn"} quay lại!`);
        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Đăng nhập thất bại, vui lòng thử lại");
      }
    },
    onError(err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
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
            <button className="text-gray-400 hover:text-white text-xl font-bold">
              ✕
            </button>
          </div>

          <h2 className="text-2xl font-bold mt-2 mb-1">Đăng nhập</h2>
          <p className="text-sm text-gray-400 mb-6">
            Nếu bạn chưa có tài khoản,{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              đăng ký ngay
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-300 mb-1"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" id="check" className="accent-yellow-400" />
              <label htmlFor="check">Xác minh bạn là con người</label>
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
            >
              {mutation.isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="text-center mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-400 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-600 py-3 rounded-lg mt-3 hover:bg-[#1e293b] transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              <span>Đăng nhập bằng Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
