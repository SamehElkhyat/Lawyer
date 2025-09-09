"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show navbar on sign-in page
  if (pathname === '/Auth/SignIn') {
    return null;
  }

  return (
    <header className="w-full border-b bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Right: Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/justice-scale.png" alt="النظام القانوني" width={32} height={32} />
            <div className="hidden sm:block">
              <h2 className="font-bold text-gray-800 text-lg">النظام القانوني</h2>
              <p className="text-xs text-emerald-600 font-medium"></p>
            </div>
          </Link>

          {/* Center: Nav links */}
          <nav className="hidden lg:flex items-center gap-8 text-slate-700">
            <Link className="hover:text-emerald-600 transition-colors font-medium relative group" href="/">
              الرئيسية
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="hover:text-emerald-600 transition-colors font-medium relative group" href="/services">
              الخدمات الإلكترونية
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="hover:text-emerald-600 transition-colors font-medium relative group" href="/verification">
              خدمات التحقق
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link className="hover:text-emerald-600 transition-colors font-medium relative group" href="/directory">
              دليل المرخصين
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 transition-all group-hover:w-full"></span>
            </Link>
            <div className="flex items-center gap-1 cursor-pointer select-none hover:text-emerald-600 transition-colors font-medium group">
              <span>تواصل معنا</span>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </nav>

          {/* Left: Search + CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex p-2 rounded-full hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors" aria-label="البحث">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-4.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
              </svg>
            </button>
            
            <Link href="/Auth/SignIn" className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>تسجيل الدخول</span>
            </Link>
            
            <button 
              className="lg:hidden p-2 rounded-md border border-gray-200 text-slate-700 hover:bg-gray-50 transition-colors" 
              onClick={() => setOpen(!open)} 
              aria-label="Toggle menu"
            >
              <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t bg-white/98 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-4">
            <Link className="block py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium" href="/" onClick={() => setOpen(false)}>
              الرئيسية
            </Link>
            <Link className="block py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium" href="/services" onClick={() => setOpen(false)}>
              الخدمات الإلكترونية
            </Link>
            <Link className="block py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium" href="/verification" onClick={() => setOpen(false)}>
              خدمات التحقق
            </Link>
            <Link className="block py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium" href="/directory" onClick={() => setOpen(false)}>
              دليل المرخصين
            </Link>
            <Link className="block py-2 text-slate-700 hover:text-emerald-600 transition-colors font-medium" href="/contact" onClick={() => setOpen(false)}>
              تواصل معنا
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <Link 
                href="/Auth/SignIn" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md w-full justify-center"
                onClick={() => setOpen(false)}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span>تسجيل الدخول</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


