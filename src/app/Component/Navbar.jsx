"use client";

import Image from "next/image";
import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Right: Logo */}
          <div className="flex items-center gap-3">
            <Image src="/justice-scale.png" alt="logo" width={28} height={28} />
          </div>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-slate-700">
            <a className="hover:text-slate-900" href="#">الخدمات الإلكترونية</a>
            <a className="hover:text-slate-900" href="#">خدمات التحقق</a>
            <a className="hover:text-slate-900" href="#">دليل المرخصين</a>
            <div className="flex items-center gap-1 cursor-pointer select-none">
              <span>تواصل معنا</span>
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            <button className="p-2 rounded-full hover:bg-slate-100" aria-label="Search">
              <svg className="w-5 h-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-4.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
              </svg>
            </button>
          </nav>

          {/* Left: CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <a href="#" className="hidden md:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              <span>تسجيل الدخول</span>
            </a>
            <button className="md:hidden p-2 rounded-md border text-slate-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-3">
            <a className="block" href="#">الخدمات الإلكترونية</a>
            <a className="block" href="#">خدمات التحقق</a>
            <a className="block" href="#">دليل المرخصين</a>
            <a className="block" href="#">تواصل معنا</a>
            <a href="#" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              <span>تسجيل الدخول</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


