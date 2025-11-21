import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/authApi";
import { toast } from "react-toastify";
import logoWeb from "../assets/logoWeb.png";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      verify: false,
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    });
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                id="username"
                {...register("username")}
                className={`w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none 
                  ${
                    errors.username
                      ? "ring-2 ring-red-500"
                      : "focus:ring-2 focus:ring-yellow-400"
                  }`}
                placeholder="Tên hiển thị"
              />
              {errors.username && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none
                  ${
                    errors.email
                      ? "ring-2 ring-red-500"
                      : "focus:ring-2 focus:ring-yellow-400"
                  }`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
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
                placeholder="Mật khẩu"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-xl"
              >
                {showPassword ? "🙈" : "👁"}
              </button>

              {errors.password && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                {...register("confirmPassword")}
                className={`w-full p-3 rounded-lg bg-[#1e293b] text-gray-100 focus:outline-none
                  ${
                    errors.confirmPassword
                      ? "ring-2 ring-red-500"
                      : "focus:ring-2 focus:ring-yellow-400"
                  }`}
                placeholder="Nhập lại mật khẩu"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-3 text-xl"
              >
                {showConfirm ? "🙈" : "👁"}
              </button>

              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                id="verify"
                {...register("verify")}
                className="accent-yellow-400"
              />
              <label htmlFor="verify">Xác minh bạn là con người</label>
            </div>
            {errors.verify && (
              <p className="text-sm text-red-400 mt-1">
                {errors.verify.message}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isLoading || isSubmitting}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition"
            >
              {mutation.isLoading || isSubmitting
                ? "Đang đăng ký..."
                : "Đăng ký"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
