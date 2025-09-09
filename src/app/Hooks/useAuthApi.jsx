// hooks/useAuthApi.js
"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setTokens, clearTokens } from "../Redux/store";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // 🟢 مسار auth فقط

const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { refreshToken, accessToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const RefreshToken = async () => {
    try {
      const res = await axios.post(`${API_BASE}/Resend-Access-Toekn`, {
        refreshToken,
      });

      dispatch(
        setTokens({
          accessToken: res.data.token,
          refreshToken: res.data.refreshToken || refreshToken,
        })
      );

      return res.data.token;
    } catch (error) {
      dispatch(clearTokens());
      toast.error("انتهت الجلسة. برجاء تسجيل الدخول مرة أخرى.");
      throw error;
    }
  };

  // 🟢 تسجيل الدخول
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/Login`, credentials);

      dispatch(
        setTokens({
          accessToken: res.data.token,
          refreshToken: res.data.refreshToken,
        })
      );

      setData(res.data);

      toast.success("تم تسجيل الدخول بنجاح ✅");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل تسجيل الدخول ❌");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const fastLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    console.log("credentials", credentials);
    try {
      const res = await axios.post(
        `${API_BASE}/Login-OTP?Identity=${credentials.Identity}`
      );
      dispatch(
        setTokens({
          accessToken: res.data.token,
        })
      );
      setData(res.data);
      toast.success("تم تسجيل الدخول بنجاح");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل تسجيل الدخول");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const whatsAppCode = async (info) => {
    setLoading(true);
    setError(null);
    console.log("info", info);
    console.log("accessToken", accessToken);
    try {
      const res = await axios.post(
        `${API_BASE}/Verify/Verify-WhatsApp-Code`,
        info,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(
        setTokens({
          accessToken: res.data.token,
          refreshToken: res.data.refreshToken,
        })
      );
      setData(res.data);
      toast.success("تم التحقق بنجاح");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل التحقق");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (info) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/Register/User`, info);
      setData(res.data);
      toast.success("تم إنشاء الحساب بنجاح");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل إنشاء الحساب");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/Forget-Password`, credentials);
      toast.success("تم إرسال رابط لتعديل كلمة المرور بنجاح");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل إرسال رابط لتعديل كلمة المرور");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordByEmail = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${API_BASE}/Reset-Email-Password`,
        credentials
      );
      toast.success(
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح"
      );
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل في إرسال رابط إعادة تعيين كلمة المرور");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordByWhatsApp = async (credentials) => {
    setLoading(true);
    setError(null);
    console.log("credentials", credentials);
    console.log("accessToken", accessToken);
    try {
      const res = await axios.post(
        `${API_BASE}/Reset-Whats-Password`,
        credentials,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("تم إرسال رمز التحقق إلى رقم الواتساب المسجل لديك بنجاح");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل في إرسال رمز التحقق عبر الواتساب");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/Reset-Password`, credentials);
      toast.success("تم تحديث كلمة المرور بنجاح");
      return res.data;
    } catch (err) {
      setError(err);
      toast.error("فشل في تحديث كلمة المرور");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    RefreshToken,
    login,
    register,
    forgotPassword,
    resetPasswordByEmail,
    resetPasswordByWhatsApp,
    resetPassword,
    fastLogin,
    whatsAppCode,
    loading,
    error,
    data,
  };
};

export default useAuthApi;
