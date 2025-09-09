import Image from "next/image";
import React from "react";

const MainScreen = () => {
  const cards = [
    {
      id: 1,
      title: "طور",
      subtitle: "عقارية",
      description:
        "لمقدمي الخدمات العقارية تقديم المساندة والدعم والتدخل اللازم لعملائنا لضمان الامتثال.",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
    {
      id: 2,
      title: "نواقل قانونيه",
      subtitle: "قانونية",
      description:
        "خدمات قانونية مخصصة في النقل البحري والشحن و التأمين والنزاعات التجارية المرتبطة .",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
    {
      id: 3,
      title: "رصد",
      subtitle: "رصد",
      description:
        "خدمة مراقبة وإدارة الالتزام الداخلي,وتحليل المخاطر ,والامتثال للأنظمة والقوانين.",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
    {
      id: 4,
      title: "حرز",
      subtitle: "Individuals",
      description:
        "لإدارة القانونية الاستراتيجية :في ظل البيئة التنظيمية المتطورة,يقدم حرز حلول قانونية متقدمة .",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
    {
      id: 5,
      title: "إيلاف",
      subtitle: "Judges",
      description:
        "لإدارة المنازعات والحلول البديلة :بناء جسور التفاهم بين اللأطراف المتنازعة عبر حلول قانونية رشيدة .",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
    {
      id: 6,
      title: "مؤازر",
      subtitle: "Experts",
      description: "للأطباء والممارسين الصحيين والمنشأت الطبية .",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
    {
      id: 7,
      title: "خدمات قانونية",
      subtitle: "Translators",
      description:
        "تم تطوير خدمات قانونية مخصصة لتلبية حاجات الأفراد والمنشأت التجارية والمنتجعات السياحية في المملكة العربية السعودية .",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },

    {
      id: 8,
      title: "خدمات تحت الإنشاء",
      subtitle: "Translators",
      description:
        "",
      bgGradient: "bg-slate-50",
      textColor: "text-slate-700",
      accentColor: "slate",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
    
      
      {/* Main Content */}
      <div className="p-8 mt-20 ">
        <div className="max-w-9xl mx-auto flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Header Section */}
              <div className={`${card.bgGradient} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    
                    <Image src="/justice-scale.png" alt="logo" width={24} height={24} />
                   
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${card.textColor} font-medium`}>{card.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Main Content Section */}
              <div className="p-6">
                {/* Main title */}
                <h3 className={`text-2xl font-bold ${card.textColor} text-center mb-4`}>
                  {card.title}
                </h3>

                {/* Description */}
                <p className={`text-sm ${card.textColor} text-center mb-6 leading-relaxed`}>
                  {card.description}
                </p>

                {/* Illustration area */}
                <div className="h-32 flex items-center justify-center mb-6">


                  {/* Calm & Luxury Legal Design */}
                  <div className="relative w-24 h-24 mx-auto">
                    {/* Elegant Background with Soft Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 rounded-full shadow-inner border border-gray-200/30"></div>
                    
                    {/* Refined Icon Container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      
                      {card.id === 1 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"/>
                        </svg>
                      )}
                      {card.id === 2 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25m0-9L3 16.5m9-9v9"/>
                        </svg>
                      )}
                      {card.id === 3 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      )}
                      {card.id === 4 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
                        </svg>
                      )}
                      {card.id === 5 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75C6.488 21.294 5.05 21.731 3.741 21.99A.75.75 0 013 21.25V4.109c0-27.18 2.187-.532 4.12-.532h.355M12 20.25c1.472 0 2.882.265 4.185.75 1.327.249 2.765.686 4.074.945a.75.75 0 00.741-.74V4.109c0-.27-.18-.532-.355-.532h-.355c-1.933 0-4.12-.182-4.12-.532"/>
                        </svg>
                      )}
                      {card.id === 6 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                        </svg>
                      )}
                      {card.id === 7 && (
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Subtle Luxury Accents */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-full opacity-40"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-slate-300 to-gray-400 rounded-full opacity-30"></div>
                    
                    {/* Professional Border Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200/50 shadow-sm"></div>
                  </div>
                  
                  {/* Elegant Background Texture */}
                  <div className="absolute inset-0 opacity-3">
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 via-transparent to-stone-200 rounded-lg"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_60%,_rgba(148,163,184,0.03)_100%)] rounded-lg"></div>
                  </div>
               
                </div>

                {/* Hover Login Button */}
                <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-b-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg">
                    <span className="text-sm">←</span>
                    <span className="text-sm">تسجيل الدخول</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default MainScreen;
