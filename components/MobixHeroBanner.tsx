"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Smartphone, Code2, ArrowUpRight } from "lucide-react";
import type { AppDoc } from "@/types/app";

interface MobixHeroBannerProps {
  featuredApp?: AppDoc;
}

export function MobixHeroBanner({ featuredApp }: MobixHeroBannerProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Daftar gambar banner promosi penuh (Full Image Banners) bernuansa Emerald Green #01875f sesuai tema Mobix
  const slides = [
    {
      id: "promo",
      label: "Apa itu Mobix?",
      badge: "🚀 Komunitas Aplikasi #1",
      tag: "Gratis Selamanya & Tanpa Iklan Pop-up",
      image: "/images/banner_mobix_promo_v3.jpg",
      alt: "Banner Iklan Mobix - Satu Tempat untuk Semua Aplikasi Android Gratis",
      href: "#recommended",
      icon: Smartphone,
    },
    {
      id: "developer",
      label: "Portal Developer",
      badge: "⚡ Distribusi Tanpa Batas",
      tag: "Unggah APK/AAB Langsung Tanpa Biaya",
      image: "/images/banner_mobix_dev_v3.jpg",
      alt: "Banner Developer Mobix - Rilis & Bagikan Aplikasi Tanpa Batas",
      href: "/register",
      icon: Code2,
    },
    {
      id: "security",
      label: "Kecepatan & CDN",
      badge: "🛡️ Keamanan & Cepat #1",
      tag: "Direct Download & Zero Link Shortener",
      image: "/images/banner_mobix_fast_v3.jpg",
      alt: "Banner Keamanan & Kecepatan Unduh Mobix - Direct Download High-Speed CDN",
      href: "/search",
      icon: ShieldCheck,
    },
  ];

  // Auto-play interval (setiap 6.5 detik)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[activeSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto py-3 sm:py-4">
      {/* 1. Glowing Ambient Backdrop (Ambient Light Aura di belakang card) */}
      <div className="absolute -inset-1 sm:-inset-2 rounded-[32px] sm:rounded-[44px] bg-gradient-to-r from-store via-store-light to-[#016547] opacity-25 sm:opacity-35 blur-2xl transition-opacity duration-700 pointer-events-none group-hover:opacity-50" />

      {/* 2. Double Frosted Glass Bezel (Chassis Bingkai Kaca Elegan) */}
      <div
        className="relative overflow-hidden rounded-[26px] sm:rounded-[36px] p-1.5 sm:p-2.5 bg-gradient-to-b from-white/95 via-white/60 to-white/30 backdrop-blur-2xl border border-white/80 shadow-[0_25px_65px_-15px_rgba(1,135,95,0.22)] transition-all duration-500 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Inner Screen Container */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] max-h-[480px] overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#0a382a] shadow-inner">
          {/* Full Image Banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 size-full"
            >
              <Link href={current.href} className="block size-full relative">
                <Image
                  src={current.image}
                  alt={current.alt}
                  fill
                  priority={activeSlide === 0}
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Vignette Shadow & Inner Depth Ring */}
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[28px] ring-1 ring-inset ring-white/15 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]" />

          {/* 3. Floating Top Badges (Glass Status Header di Kiri Atas & Kanan Atas) */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 right-4 sm:right-6 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Pulsing Status Dot & Badge */}
              <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-white shadow-lg">
                <span className="relative flex size-2.5">
                  <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold tracking-wide text-white drop-shadow">
                  {current.badge}
                </span>
              </div>

              {/* Tag Tambahan (Muncul di Tablet/Desktop) */}
              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1.5 border border-white/20 text-xs font-semibold text-emerald-100 shadow-sm">
                <Sparkles className="size-3.5 text-yellow-300" />
                <span>{current.tag}</span>
              </div>
            </div>

            {/* Clickable Quick Action / Hint di Kanan Atas */}
            <Link
              href={current.href}
              className="pointer-events-auto hidden sm:flex items-center gap-1.5 rounded-full bg-store/85 hover:bg-store backdrop-blur-md px-3.5 py-1.5 border border-white/30 text-xs font-bold text-white shadow-lg transition duration-300 hover:scale-105 active:scale-95"
            >
              <span>Lihat Detail</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* 4. Tombol Navigasi Kiri / Kanan (Frosted Glass Rings) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-black/50 hover:bg-store border border-white/25 text-white backdrop-blur-xl opacity-75 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-2xl active:scale-95"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex size-10 sm:size-12 items-center justify-center rounded-2xl bg-black/50 hover:bg-store border border-white/25 text-white backdrop-blur-xl opacity-75 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-2xl active:scale-95"
            aria-label="Next Banner"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>

          {/* 5. Floating Dynamic Control Pill (Tab Switcher Mewah di Bagian Bawah Tengah) */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] sm:w-auto max-w-2xl">
            <div className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-full bg-black/65 backdrop-blur-2xl p-1.5 sm:p-2 border border-white/25 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
              {slides.map((slide, idx) => {
                const isActive = idx === activeSlide;
                const IconComponent = slide.icon;
                return (
                  <button
                    key={slide.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveSlide(idx);
                    }}
                    className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full transition-all duration-300 ${
                      isActive ? "text-white shadow-md" : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSlidePill"
                        className="absolute inset-0 bg-gradient-to-r from-store via-store-light to-store rounded-xl sm:rounded-full border border-white/35 shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <IconComponent className={`size-3.5 sm:size-4 transition-transform ${isActive ? "scale-110 text-yellow-300" : ""}`} />
                      <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
                        {slide.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
