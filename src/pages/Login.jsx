import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/authApi";
import { setToken } from "../utils/auth";
import { toast } from "react-toastify";
import logoWeb from "../assets/logoWeb.png";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth";

export default function Login() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess(data) {
      const token = data?.token;
      const user = data?.user;

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
      toast.error(err?.response?.data?.error || "Login failed");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
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

          <h2 className="text-2xl font-bold mt-2 mb-1">Đăng nhập</h2>
          <p className="text-sm text-gray-400 mb-6">
            Nếu bạn chưa có tài khoản,{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              đăng ký ngay
            </Link>
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                id="email"
                className={`w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none
                  ${
                    errors.email
                      ? "ring-2 ring-red-500"
                      : "focus:ring-2 focus:ring-yellow-400"
                  }`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Mật khẩu
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={`w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none
                    ${
                      errors.password
                        ? "ring-2 ring-red-500"
                        : "focus:ring-2 focus:ring-yellow-400"
                    }`}
                  placeholder="Nhập mật khẩu"
                />

                <span
                  className="absolute right-3 top-3 text-xl cursor-pointer select-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>

              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading || isSubmitting}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
            >
              {mutation.isLoading || isSubmitting
                ? "Đang đăng nhập..."
                : "Đăng nhập"}
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
