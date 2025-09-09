"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuthApi from "@/app/Hooks/useAuthApi";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("personal"); // "personal" or "company"
  const { register } = useAuthApi();
  const router = useRouter();

  // Validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "الاسم يجب أن يكون أكثر من حرفين")
      .required("الاسم الكامل مطلوب"),
    identity: Yup.string()
      .matches(/^[0-9]{10}$/, "رقم الهوية يجب أن يكون 10 أرقام")
      .required("رقم الهوية مطلوب"),
    dateOfBirth: Yup.date()
      .max(new Date(), "تاريخ الميلاد لا يمكن أن يكون في المستقبل")
      .required("تاريخ الميلاد مطلوب"),
    address: Yup.string()
      .min(10, "العنوان يجب أن يكون أكثر من 10 أحرف")
      .required("العنوان مطلوب"),
    phoneNumber: Yup.string()
      .matches(/^[0-9+\-\s()]+$/, "رقم الهاتف غير صحيح")
      .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
      .required("رقم الهاتف مطلوب"),
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    contractType: Yup.string().required("نوع العقد مطلوب"),
    contractHours: Yup.string().required("ساعات العقد مطلوبة"),
    contractDuration: Yup.date()
      .min(new Date(), "مدة العقد يجب أن تكون في المستقبل")
      .required("مدة العقد مطلوبة"),
    passwordHash: Yup.string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .matches(/(?=.*[a-z])/, "كلمة المرور يجب أن تحتوي على حرف صغير")
      .matches(/(?=.*[A-Z])/, "كلمة المرور يجب أن تحتوي على حرف كبير")
      .matches(/(?=.*[0-9])/, "كلمة المرور يجب أن تحتوي على رقم")
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("passwordHash")], "كلمة المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
    picture: Yup.mixed(),
    contract: Yup.mixed().required("ملف العقد مطلوب"),
    // Company-specific fields (conditional validation)
    typeOfLegal: Yup.string().when("$userType", {
      is: "company",
      then: () => Yup.string().required("نوع الكيان القانوني مطلوب"),
      otherwise: () => Yup.string(),
    }),
    companyName: Yup.string().when("$userType", {
      is: "company",
      then: () => Yup.string().required("اسم الشركة مطلوب"),
      otherwise: () => Yup.string(),
    }),
    commercialRegisterNumber: Yup.string().when("$userType", {
      is: "company",
      then: () => Yup.string().required("رقم السجل التجاري مطلوب"),
      otherwise: () => Yup.string(),
    }),
    articlesOfIncorporation: Yup.mixed().when("$userType", {
      is: "company",
      then: (schema) =>
        schema
          .nullable(false) // يمنع null
          .required("عقد التأسيس مطلوب"),
      otherwise: (schema) => schema.nullable(false), // حتى لو مش مطلوب، ما يقبلش null
    }),
    articlesOfIncorporationExpiry: Yup.date().when("$userType", {
      is: "company",
      then: () =>
        Yup.date()
          .min(new Date(), "تاريخ انتهاء عقد التأسيس يجب أن يكون في المستقبل")
          .required("تاريخ انتهاء عقد التأسيس مطلوب"),
      otherwise: () => Yup.date(),
    }),
    commercialRegisterFile: Yup.mixed().when("$userType", {
      is: "company",
      then: (schema) =>
        schema
          .nullable(false) // ما يقبلش null
          .required("ملف السجل التجاري مطلوب"),
      otherwise: (schema) => schema.nullable(false), // حتى لو مش مطلوب، ما يقبلش null
    }),

    commercialRegisterExpiry: Yup.date().when("$userType", {
      is: "company",
      then: () =>
        Yup.date().min(
          new Date(),
          "تاريخ انتهاء السجل التجاري يجب أن يكون في المستقبل"
        ),
      otherwise: () => Yup.date(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      identity: "",
      dateOfBirth: "",
      address: "",
      phoneNumber: "",
      email: "",
      contractType: "",
      contractHours: "",
      contractDuration: "",
      passwordHash: "",
      confirmPassword: "",
      picture: null,
      contract: null,
      // Company fields
      typeOfLegal: "",
      companyName: "",
      commercialRegisterNumber: "",
      articlesOfIncorporation: null,
      articlesOfIncorporationExpiry: "",
      commercialRegisterFile: null,
      commercialRegisterExpiry: "",
    },
    validationSchema,
    validationContext: { userType },
    onSubmit: async (values) => {
      setIsLoading(true);
      console.log("values", values);
      try {
        // Prepare FormData for file uploads
        const formData = new FormData();

        // Add all text fields
        formData.append("fullName", values.fullName);
        formData.append("identity", values.identity);
        formData.append("dateOfBirth", values.dateOfBirth);
        formData.append("address", values.address);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("email", values.email);
        formData.append("contractType", values.contractType);
        formData.append("contractHours", values.contractHours);
        formData.append("contractDuration", values.contractDuration);
        formData.append("passwordHash", values.passwordHash);
        formData.append("confirmPassword", values.confirmPassword);

        // Add file fields
        if (values.picture) {
          formData.append("picture", values.picture);
        }
        if (values.contract) {
          formData.append("contract", values.contract);
        }

        // Add company-specific fields if userType is company
        if (userType === "company") {
          formData.append("typeOfLegal", values.typeOfLegal);
          formData.append("companyName", values.companyName);
          formData.append(
            "commercialRegisterNumber",
            values.commercialRegisterNumber
          );
          formData.append(
            "articlesOfIncorporationExpiry",
            values.articlesOfIncorporationExpiry
          );
          if (values.commercialRegisterExpiry) {
            formData.append(
              "commercialRegisterExpiry",
              values.commercialRegisterExpiry
            );
          }

          if (values.articlesOfIncorporation) {
            formData.append(
              "articlesOfIncorporation",
              values.articlesOfIncorporation
            );
          }
          if (values.commercialRegisterFile) {
            formData.append(
              "commercialRegisterFile",
              values.commercialRegisterFile
            );
          }
        }

        // Add user type
        // formData.append("userType", userType);

        const res = await register(formData);
        setIsLoading(false);
        localStorage.setItem("token", res.token);
        toast.success("تم إنشاء الحساب بنجاح");
        console.log("✅ تم إنشاء الحساب بنجاح", res);
        router.push("/Auth/SignIn");
      } catch (err) {
        toast.error("فشل في إنشاء الحساب");
        console.error("❌ فشل في إنشاء الحساب", err);
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

      <div className="w-full max-w-2xl relative">
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
                إنشاء حساب جديد
              </h1>

              <p className="text-emerald-100 text-sm leading-relaxed">
                انضم إلى النظام القانوني وابدأ رحلتك معنا
              </p>
            </div>
          </div>
          <Toaster />
          {/* Form Section */}
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* User Type Selector */}
              <div className="space-y-2">
                <label className="text-gray-700 font-semibold text-sm block">
                  نوع الحساب *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType("personal")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      userType === "personal"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div className="font-semibold">شخص</div>
                      <div className="text-xs text-gray-500">حساب شخصي</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("company")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      userType === "company"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <div className="font-semibold">شركة</div>
                      <div className="text-xs text-gray-500">حساب مؤسسة</div>
                    </div>
                  </button>
                </div>
              </div>
              {/* Full Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل اسمك الكامل"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="example@email.com"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="05xxxxxxxx"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Identity Number Input */}
              <div className="space-y-2">
                <label
                  htmlFor="identity"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  رقم الهوية / الإقامة *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="identity"
                    value={formik.values.identity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="ادخل رقم الهوية أو الإقامة"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.identity && formik.errors.identity
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                {formik.touched.identity && formik.errors.identity && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.identity}
                  </p>
                )}
              </div>

              {/* Date of Birth Input */}
              <div className="space-y-2">
                <label
                  htmlFor="dateOfBirth"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  تاريخ الميلاد *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  العنوان *
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل العنوان الكامل"
                    rows={3}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 resize-none ${
                      formik.touched.address && formik.errors.address
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                    required
                  />
                  <div className="absolute left-4 top-4">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.address}
                  </p>
                )}
              </div>

              {/* Contract Type Input */}
              <div className="space-y-2">
                <label
                  htmlFor="contractType"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  نوع العقد *
                </label>
                <div className="relative">
                  <select
                    name="contractType"
                    value={formik.values.contractType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                      formik.touched.contractType && formik.errors.contractType
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                    required
                  >
                    <option value="">اختر نوع العقد</option>
                    <option value="full-time">دوام كامل</option>
                    <option value="part-time">دوام جزئي</option>
                    <option value="contract">عقد مؤقت</option>
                    <option value="freelance">عمل حر</option>
                  </select>
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.contractType && formik.errors.contractType && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.contractType}
                  </p>
                )}
              </div>

              {/* Contract Hours Input */}
              <div className="space-y-2">
                <label
                  htmlFor="contractHours"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  ساعات العقد *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="contractHours"
                    value={formik.values.contractHours}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثال: 40 ساعة أسبوعياً"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.contractHours &&
                      formik.errors.contractHours
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.contractHours &&
                  formik.errors.contractHours && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.contractHours}
                    </p>
                  )}
              </div>

              {/* Contract Duration Input */}
              <div className="space-y-2">
                <label
                  htmlFor="contractDuration"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  مدة العقد *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="contractDuration"
                    value={formik.values.contractDuration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                      formik.touched.contractDuration &&
                      formik.errors.contractDuration
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.contractDuration &&
                  formik.errors.contractDuration && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.contractDuration}
                    </p>
                  )}
              </div>

              {/* Picture Upload */}
              <div className="space-y-2">
                <label
                  htmlFor="picture"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  الصورة الشخصية (اختياري)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("picture", file);
                    }}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                      formik.touched.picture && formik.errors.picture
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.picture && formik.errors.picture && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.picture}
                  </p>
                )}
              </div>

              {/* Contract Upload */}
              <div className="space-y-2">
                <label
                  htmlFor="contract"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  ملف العقد *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="contract"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("contract", file);
                    }}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                      formik.touched.contract && formik.errors.contract
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                {formik.touched.contract && formik.errors.contract && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.contract}
                  </p>
                )}
              </div>

              {/* Company-specific fields */}
              {userType === "company" && (
                <>
                  {/* Type of Legal Entity */}
                  <div className="space-y-2">
                    <label
                      htmlFor="typeOfLegal"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      نوع الكيان القانوني *
                    </label>
                    <div className="relative">
                      <select
                        name="typeOfLegal"
                        value={formik.values.typeOfLegal}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                          formik.touched.typeOfLegal &&
                          formik.errors.typeOfLegal
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                      >
                        <option value="">اختر نوع الكيان القانوني</option>
                        <option value="llc">شركة ذات مسؤولية محدودة</option>
                        <option value="corporation">شركة مساهمة</option>
                        <option value="partnership">شراكة</option>
                        <option value="sole-proprietorship">مؤسسة فردية</option>
                      </select>
                    </div>
                    {formik.touched.typeOfLegal &&
                      formik.errors.typeOfLegal && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.typeOfLegal}
                        </p>
                      )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="companyName"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      اسم الشركة *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="companyName"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="أدخل اسم الشركة"
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                          formik.touched.companyName &&
                          formik.errors.companyName
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>
                    {formik.touched.companyName &&
                      formik.errors.companyName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.companyName}
                        </p>
                      )}
                  </div>

                  {/* Commercial Register Number */}
                  <div className="space-y-2">
                    <label
                      htmlFor="commercialRegisterNumber"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      رقم السجل التجاري *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="commercialRegisterNumber"
                        value={formik.values.commercialRegisterNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="أدخل رقم السجل التجاري"
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                          formik.touched.commercialRegisterNumber &&
                          formik.errors.commercialRegisterNumber
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
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
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    {formik.touched.commercialRegisterNumber &&
                      formik.errors.commercialRegisterNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.commercialRegisterNumber}
                        </p>
                      )}
                  </div>

                  {/* Articles of Incorporation */}
                  <div className="space-y-2">
                    <label
                      htmlFor="articlesOfIncorporation"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      عقد التأسيس *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="articlesOfIncorporation"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("articlesOfIncorporation", file);
                        }}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                          formik.touched.articlesOfIncorporation &&
                          formik.errors.articlesOfIncorporation
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {formik.touched.articlesOfIncorporation &&
                      formik.errors.articlesOfIncorporation && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.articlesOfIncorporation}
                        </p>
                      )}
                  </div>

                  {/* Articles of Incorporation Expiry */}
                  <div className="space-y-2">
                    <label
                      htmlFor="articlesOfIncorporationExpiry"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      تاريخ انتهاء عقد التأسيس *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="articlesOfIncorporationExpiry"
                        value={formik.values.articlesOfIncorporationExpiry}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                          formik.touched.articlesOfIncorporationExpiry &&
                          formik.errors.articlesOfIncorporationExpiry
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {formik.touched.articlesOfIncorporationExpiry &&
                      formik.errors.articlesOfIncorporationExpiry && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.articlesOfIncorporationExpiry}
                        </p>
                      )}
                  </div>

                  {/* Commercial Register File */}
                  <div className="space-y-2">
                    <label
                      htmlFor="commercialRegisterFile"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      ملف السجل التجاري *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="commercialRegisterFile"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue("commercialRegisterFile", file);
                        }}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                          formik.touched.commercialRegisterFile &&
                          formik.errors.commercialRegisterFile
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {formik.touched.commercialRegisterFile &&
                      formik.errors.commercialRegisterFile && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.commercialRegisterFile}
                        </p>
                      )}
                  </div>

                  {/* Commercial Register Expiry */}
                  <div className="space-y-2">
                    <label
                      htmlFor="commercialRegisterExpiry"
                      className="text-gray-700 font-semibold text-sm block"
                    >
                      تاريخ انتهاء السجل التجاري (اختياري)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="commercialRegisterExpiry"
                        value={formik.values.commercialRegisterExpiry}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right text-gray-700 ${
                          formik.touched.commercialRegisterExpiry &&
                          formik.errors.commercialRegisterExpiry
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {formik.touched.commercialRegisterExpiry &&
                      formik.errors.commercialRegisterExpiry && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.commercialRegisterExpiry}
                        </p>
                      )}
                  </div>
                </>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="passwordHash"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  كلمة المرور *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="passwordHash"
                    value={formik.values.passwordHash}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="ادخل كلمة المرور"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-right placeholder-gray-400 text-gray-700 ${
                      formik.touched.passwordHash && formik.errors.passwordHash
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
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
                {formik.touched.passwordHash && formik.errors.passwordHash && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.passwordHash}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-semibold text-sm block"
                >
                  تأكيد كلمة المرور *
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
                        : "border-gray-200 focus:border-emerald-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
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
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formik.isValid}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري إنشاء الحساب...</span>
                  </div>
                ) : (
                  "إنشاء حساب جديد"
                )}
              </button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-center space-y-3">
              <Link
                href="/Auth/SignIn"
                className="text-gray-600 hover:text-gray-700 text-sm transition-colors block"
              >
                لديك حساب بالفعل؟
                <span className="text-emerald-600 font-semibold mr-1">
                  تسجيل الدخول
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

export default RegisterPage;
