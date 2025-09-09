"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import useAuthApi from "@/app/Hooks/useAuthApi";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { resetPassword } = useAuthApi();
  const router = useRouter();
  const isMountedRef = useRef(true);

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "ضعيف جداً";
      case 2:
        return "ضعيف";
      case 3:
        return "متوسط";
      case 4:
        return "قوي";
      case 5:
        return "قوي جداً";
      default:
        return "";
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "text-red-600 bg-red-100";
      case 2:
        return "text-orange-600 bg-orange-100";
      case 3:
        return "text-yellow-600 bg-yellow-100";
      case 4:
        return "text-blue-600 bg-blue-100";
      case 5:
        return "text-green-600 bg-green-100";
      default:
        return "";
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.password) {
        errors.password = "كلمة المرور الجديدة مطلوبة";
      } else if (values.password.length < 8) {
        errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "كلمة المرور غير متطابقة";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!isMountedRef.current) {
        setSubmitting(false);
        return;
      }
      try {
        setIsLoading(true);
        setStatus(null);
        await resetPassword({
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        
        // Only update state and navigate if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
          setSubmitting(false);
          router.push("/Auth/SignIn");
        }
      } catch (err) {
        console.error("❌ فشل في إعادة تعيين كلمة المرور", err);
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
          setSubmitting(false);
          setStatus("حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.");
        }
      }
    },
  });

  // Update password strength when password changes
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    formik.handleChange(e);
    
    // Only update state if component is still mounted
    if (isMountedRef.current) {
      setPasswordStrength(checkPasswordStrength(password));
    }
  };

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
              href="/Auth/SignIn"
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

            {/* Lock Icon */}
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                إعادة تعيين كلمة المرور
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed">
                أدخل كلمة المرور الجديدة لحسابك
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={handlePasswordChange}
                    onBlur={formik.handleBlur}
                    placeholder="ادخل كلمة المرور الجديدة"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formik.values.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        قوة كلمة المرور:
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStrengthColor(
                          passwordStrength
                        )}`}
                      >
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="flex space-x-1 space-x-reverse">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-red-400"
                                : passwordStrength === 3
                                ? "bg-yellow-400"
                                : passwordStrength === 4
                                ? "bg-blue-400"
                                : "bg-green-400"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أعد إدخال كلمة المرور"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-300 focus:border-red-500"
                        : formik.values.confirmPassword &&
                          formik.values.password ===
                            formik.values.confirmPassword
                        ? "border-green-300 focus:border-green-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
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
                  </button>

                  {/* Password Match Indicator */}
                  {formik.values.confirmPassword && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {formik.values.password ===
                      formik.values.confirmPassword ? (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 text-sm mb-2">
                  متطلبات كلمة المرور:
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li
                    className={`flex items-center space-x-2 space-x-reverse ${
                      formik.values.password.length >= 8 ? "text-green-600" : ""
                    }`}
                  >
                    <span>
                      {formik.values.password.length >= 8 ? "✓" : "•"}
                    </span>
                    <span>8 أحرف على الأقل</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 space-x-reverse ${
                      /[A-Z]/.test(formik.values.password)
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    <span>
                      {/[A-Z]/.test(formik.values.password) ? "✓" : "•"}
                    </span>
                    <span>حرف كبير واحد على الأقل</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 space-x-reverse ${
                      /[a-z]/.test(formik.values.password)
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    <span>
                      {/[a-z]/.test(formik.values.password) ? "✓" : "•"}
                    </span>
                    <span>حرف صغير واحد على الأقل</span>
                  </li>
                  <li
                    className={`flex items-center space-x-2 space-x-reverse ${
                      /[0-9]/.test(formik.values.password)
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    <span>
                      {/[0-9]/.test(formik.values.password) ? "✓" : "•"}
                    </span>
                    <span>رقم واحد على الأقل</span>
                  </li>
                </ul>
              </div>

              {/* Error Status Display */}
              {formik.status && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm">{formik.status}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  formik.isSubmitting ||
                  !formik.isValid ||
                  !formik.values.password ||
                  !formik.values.confirmPassword
                }
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading || formik.isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري التحديث...</span>
                  </div>
                ) : (
                  "تحديث كلمة المرور"
                )}
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
                العودة لتسجيل الدخول
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
