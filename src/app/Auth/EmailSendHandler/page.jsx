"use client";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthApi from "@/app/Hooks/useAuthApi";
import { Toaster } from "sonner";

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4" dir="rtl">
    <div className="flex items-center space-x-3 space-x-reverse">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <span className="text-emerald-600 font-semibold">جاري التحميل...</span>
    </div>
  </div>
);

// Component that uses useSearchParams
const EmailSendContent = () => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPasswordByEmail } = useAuthApi();
  
  // Get the identity from URL params if available
  const identity = searchParams.get('identity') || '';
  const method = searchParams.get('method') || 'email';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!identity) {
      router.push('/Auth/ResetPassword');
      return;
    }

    setIsResending(true);
    try {
      await resetPasswordByEmail({ identity });
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error('Failed to resend email:', error);
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

            {/* Success Icon */}
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg
                  className="w-10 h-10 text-white"
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
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                تم إرسال رابط تعيين كلمة المرور
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed">
                تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-emerald-600"
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
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                تم الإرسال بنجاح!
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                لقد تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. 
                يرجى التحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها.
              </p>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
                  <div className="text-right">
                    <h3 className="font-semibold text-blue-800 text-sm mb-1">
                      تعليمات مهمة:
                    </h3>
                    <ul className="text-blue-700 text-xs space-y-1">
                      <li>• تحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها</li>
                      <li>• الرابط صالح لمدة 15 دقيقة فقط</li>
                      <li>• لا تشارك الرابط مع أي شخص آخر</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Resend Section */}
            <div className="space-y-4">
              {!canResend ? (
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">
                    يمكنك طلب إرسال الرابط مرة أخرى خلال:
                  </p>
                  <div className="inline-flex items-center space-x-2 space-x-reverse bg-gray-100 rounded-full px-4 py-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700 font-mono text-sm">
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    "إعادة إرسال الرابط"
                  )}
                </button>
              )}

              {/* Back to Sign In */}
              <Link
                href="/Auth/SignIn"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl block text-center"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                لم تستلم الرسالة؟
              </p>
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <Link
                  href="/Auth/ResetPassword"
                  className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  جرب طريقة أخرى
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/support"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  تواصل مع الدعم
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

// Main component with Suspense wrapper
const EmailSendHandler = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EmailSendContent />
    </Suspense>
  );
};

export default EmailSendHandler;
