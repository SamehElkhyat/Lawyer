"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import useAuthApi from "@/app/Hooks/useAuthApi";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { setTokens } from "@/app/Redux/store";
const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuthApi();
  const router = useRouter();

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      identity: "",
      type: "",
    },
    onSubmit: async (values) => {
      if (!formik.values.type) {
        alert("يرجى اختيار طريقة إعادة تعيين كلمة المرور");
        return;
      }
      setIsLoading(true);
      try {
        const res = await forgotPassword(values);
        console.log("res", res);
        dispatch(
          setTokens({
            accessToken: res.token,
          })
        );
        console.log("✅ تم إرسال طلب إعادة تعيين كلمة المرور بنجاح", values);
        if (formik.values.type === "Email") {
          localStorage.setItem("OptGender", res.typeOfGender);
          router.push("/Auth/EmailSendHandler");
        } else if (formik.values.type === "WhatsApp") {
          localStorage.setItem("OptGender", res.typeOfGender);
          router.push("/Auth/WhatsAppCode");
        }

        setIsLoading(false);
      } catch (err) {
        console.error("❌ فشل في إرسال طلب إعادة تعيين كلمة المرور", err);
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
                إعادة تعيين كلمة المرور
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed">
                اختر طريقة إعادة تعيين كلمة المرور المناسبة لك
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

              {/* Reset Method Selection */}
              <div className="space-y-3">
                <label className="text-gray-700 font-semibold text-sm block">
                  اختر الطريقة لإعادة إنشاء كلمة المرور
                </label>

                {/* Email Option */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    formik.values.type === "Email"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => {
                    formik.setFieldValue("type", "Email");
                  }}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formik.values.type === "Email"
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formik.values.type === "Email" && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        عبر البريد الإلكتروني
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mr-8 mt-1">
                    سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                  </p>
                </div>

                {/* WhatsApp Option */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    formik.values.type === "WhatsApp"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                  onClick={() => {
                    formik.setFieldValue("type", "WhatsApp");
                  }}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formik.values.type === "WhatsApp"
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formik.values.type === "WhatsApp" && (
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687" />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        عبر رسالة واتساب
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mr-8 mt-1">
                    سيتم إرسال رمز التحقق إلى رقم الواتساب المسجل لديك
                  </p>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formik.values.type}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </div>
                ) : formik.values.type === "Email" ? (
                  "إرسال رابط إعادة التعيين"
                ) : formik.values.type === "WhatsApp" ? (
                  "إرسال رمز الواتساب"
                ) : (
                  "اختر طريقة الإرسال أولاً"
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
                onClick={() => router.push("/Auth/SignIn")}
                className="w-full border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold py-4 rounded-xl transition-all duration-300 hover:border-emerald-300"
              >
                التسجيل الدخول
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-center space-y-3">
              <Link
                href="/Auth/SignIn"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors block"
              >
                تذكرت كلمة المرور؟ تسجيل الدخول
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

        <Toaster />

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

export default ResetPassword;
