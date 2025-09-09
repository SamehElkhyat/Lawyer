"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import useAuthApi from "@/app/Hooks/useAuthApi";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthApi();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      identity: "",
      password: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await login({
          identity: values.identity,
          password: values.password,
        });
        setIsLoading(false);

        console.log("✅ تسجيل دخول ناجح", res);
        // اعمل redirect أو خزن التوكن أو أي حاجة تانية
      } catch (err) {
        console.error("❌ فشل تسجيل الدخول", err);
        setIsLoading(false);
      }
    },
  });

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-l from-emerald-600 to-teal-700 p-8 text-center relative">
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full blur-md"></div>

            {/* Back Button */}
            <Link
              href="/"
              className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>

            {/* National Access Logo */}
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Image
                  src="/justice-scale.png"
                  alt="National Access"
                  width={32}
                  height={32}
                  className="brightness-0 invert"
                />
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                تسجيل الدخول عبر النظام الوطني
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed">
                تسجيل الدخول عبر النظام القانوني
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* National ID Input */}
              <div className="space-y-2">
                <label
                  htmlFor="identity"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  رقم بطاقة الأحوال / الإقامة
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="identity"
                    value={formik.values.identity}
                    onChange={formik.handleChange}
                    placeholder="ادخل رقم الهوية أو الإقامة"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0V5a2 2 0 014 0v1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="ادخل كلمة المرور"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700"
                    required
                  />
                  {/* <button
                    type="button"
                    onClick={() => formik.setFieldValue("password", !showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.122 15.122m-4.242-4.242L5.636 5.636m9.486 9.486L19.364 19.364M15.122 15.122L5.636 5.636"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button> */}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    أو عن طريق
                  </span>
                </div>
              </div>

              {/* Alternative Login */}
              <button
                type="button"
                className="w-full border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold py-4 rounded-xl transition-all duration-300 hover:border-emerald-300"
                onClick={() => router.push("/Auth/FastLogin")}
              >
                التسجيل عبر الدخول السريع
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-center space-y-3">
              <Link
                href="/Auth/ForgotPassword"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors block"
              >
                نسيت كلمة المرور؟
              </Link>

              <Link
                href="/Auth/Register"
                className="text-gray-600 hover:text-gray-700 text-sm transition-colors block"
              >
                ليس لديك حساب؟
                <span className="text-emerald-600 font-semibold mr-1">
                  إنشاء حساب جديد
                </span>
              </Link>

              <div className="flex items-center justify-center space-x-4 space-x-reverse pt-4">
                <Link
                  href="/privacy"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  سياسة الخصوصية
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/terms"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  شروط الاستخدام
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Toaster/>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs text-gray-600 font-medium">
              محمي بتشفير SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
