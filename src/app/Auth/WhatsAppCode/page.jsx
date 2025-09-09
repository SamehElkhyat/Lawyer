"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuthApi from "@/app/Hooks/useAuthApi";
import { useRouter } from "next/navigation";

const WhatsAppCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber] = useState("05xxxxxxxx"); // This should come from previous step or props
  const inputRefs = useRef([]);
  const { whatsAppCode } = useAuthApi();
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validation schema
  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .length(6, "رمز التحقق يجب أن يكون 6 أرقام")
      .matches(/^[0-9]+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط")
      .required("رمز التحقق مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await whatsAppCode({
          typeOfGenerate: localStorage.getItem("OptGender"),
          code: values.verificationCode,
        });
        setIsLoading(false);
        console.log("✅ تم التحقق بنجاح", res);
        const resetGender = localStorage.getItem("OptGender");
        if (resetGender === "ForgetPassword") {
          router.push("/Auth/ResetPassword");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("❌ فشل في التحقق", err);
        setIsLoading(false);
        // Reset code inputs on error
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    },
  });

  // Handle individual digit input
  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^[0-9]$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Update formik value
    const fullCode = newCode.join("");
    formik.setFieldValue("verificationCode", fullCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (fullCode.length === 6) {
      formik.setFieldValue("verificationCode", fullCode);
      setTimeout(() => {
        formik.handleSubmit();
      }, 100);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        formik.setFieldValue("verificationCode", newCode.join(""));
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (digits.length > 0) {
      const newCode = digits
        .split("")
        .concat(Array(6 - digits.length).fill(""));
      setCode(newCode.slice(0, 6));
      formik.setFieldValue("verificationCode", digits);

      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Resend code
  const handleResendCode = async () => {
    setIsResending(true);
    setCountdown(60); // 60 seconds countdown

    try {
      // Call your resend API here
      console.log("إعادة إرسال الرمز إلى:", phoneNumber);
      // await resendVerificationCode(phoneNumber);
    } catch (err) {
      console.error("فشل في إعادة الإرسال:", err);
    } finally {
      setIsResending(false);
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
              href="/Auth/FastLogin"
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

            {/* WhatsApp Logo */}
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg
                  className="w-12 h-12 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                تأكيد رمز واتساب
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed">
                أدخل الرمز المرسل إلى رقم {phoneNumber}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Verification Code Inputs */}
              <div className="space-y-4">
                <label className="text-gray-700 font-semibold text-sm block text-center">
                  رمز التحقق المرسل عبر واتساب
                </label>

                <div className="flex justify-center gap-3" dir="ltr">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all duration-200 ${
                        digit
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 focus:border-emerald-500"
                      } focus:ring-0 focus:outline-none`}
                      placeholder="•"
                    />
                  ))}
                </div>

                {formik.touched.verificationCode &&
                  formik.errors.verificationCode && (
                    <p className="text-red-500 text-xs text-center mt-2">
                      {formik.errors.verificationCode}
                    </p>
                  )}
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">تحقق من واتساب</p>
                    <p>
                      تم إرسال رمز مكون من 6 أرقام إلى رقم هاتفك عبر واتساب.
                      يرجى إدخال الرمز أعلاه.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || code.join("").length !== 6}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري التحقق...</span>
                  </div>
                ) : (
                  "تأكيد الرمز"
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">
                    يمكنك إعادة إرسال الرمز خلال{" "}
                    <span className="font-bold text-emerald-600">
                      {countdown}
                    </span>{" "}
                    ثانية
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {isResending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>

              {/* Alternative Login */}
              <button
                type="button"
                onClick={() => router.push("/Auth/SignIn")}
                className="w-full border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold py-4 rounded-xl transition-all duration-300 hover:border-emerald-300"
              >
                تسجيل الدخول بكلمة المرور
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-center space-y-3">
              <Link
                href="/Auth/FastLogin"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors block"
              >
                تغيير رقم الهاتف
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

export default WhatsAppCode;
