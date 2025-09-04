'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// Custom hook for animated counting
const useAnimatedCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * (end - start) + start);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [end, duration, start, isAnimating]);

  const startAnimation = () => {
    setIsAnimating(true);
  };

  return [count, startAnimation];
};

export default function NumbersSection() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const [remoteSessions, startRemoteSessions] = useAnimatedCounter(83915);
  const [executionRequests, startExecutionRequests] = useAnimatedCounter(32218);
  const [electronicPowers, startElectronicPowers] = useAnimatedCounter(135629);
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      startRemoteSessions();
      startExecutionRequests();
      startElectronicPowers();
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated, startRemoteSessions, startExecutionRequests, startElectronicPowers]);
  return (
    <div className="min-h-screen bg-[#ededed]">
      <div className="py-16 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            {/* Logo */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
               
                <Image src="/justice-scale.png" alt="logo" width={24} height={24} />
              </div>
              <p className="text-lg text-gray-600 font-medium">بيانات | Data</p>
            </div>

            {/* Main Title */}
            <h2 className="text-2xl font-medium text-gray-700 mb-4">
               بيانات / اخر 7 أيام
            </h2>
          </div>

          {/* Statistics Section */}
          <div ref={ref} className="flex flex-col md:flex-row items-center justify-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Remote Court Sessions */}
            <div className="flex-1 text-center py-8 md:py-0 md:px-12">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#083889'}}>
                  {remoteSessions.toLocaleString()}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed px-4">
                  جلسات المحاكمة<br />
                  عن بعد خلال 7 أيام
                </p>
              </div>
            </div>

            {/* Execution Requests */}
            <div className="flex-1 text-center py-8 md:py-0 md:px-12">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#083889'}}>
                  {executionRequests.toLocaleString()}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed px-4">
                  طلبات التنفيذ<br />
                  التي تم انهائها إلكترونيا
                </p>
              </div>
            </div>

            {/* Electronic Powers of Attorney */}
            <div className="flex-1 text-center py-8 md:py-0 md:px-12">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M15.75 4.5c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M15.75 4.5l-3-3m3 3l3-3" />
                  </svg>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#083889'}}>
                  {electronicPowers.toLocaleString()}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed px-4">
                  الوكالات الإلكترونية<br />
                  الصادرة خلال اخر 7 أيام
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 text-center">
            <div className="mb-8">
              <p className="text-lg text-gray-700 mb-6">
                الحل الأمثل لطلب البيانات الموثوقة وخلق فرص جديدة لأعمال
              </p>
              <button className="text-white px-8 py-3 rounded-lg font-medium text-base flex items-center gap-2 mx-auto transition-colors duration-200" style={{backgroundColor: '#083889'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#062a66'} onMouseLeave={(e) => e.target.style.backgroundColor = '#083889'}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>دخول لبيانات</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
