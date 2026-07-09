"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { AppDoc } from "@/types/app";

interface MobixHeroBannerProps {
  featuredApp?: AppDoc;
}

export function MobixHeroBanner({ featuredApp }: MobixHeroBannerProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Daftar gambar banner promosi penuh (Full Image Banners) v3 dengan logo resmi Mobix
  const slides = [
    {
      id: "promo",
      image: "/images/banner_mobix_promo_v3.jpg",
      alt: "Banner Iklan Mobix - Satu Tempat untuk Semua Aplikasi Android Gratis",
      href: "#recommended",
    },
    {
      id: "developer",
      image: "/images/banner_mobix_dev_v3.jpg",
      alt: "Banner Developer Mobix - Rilis & Bagikan Aplikasi Tanpa Batas",
      href: "/register",
    },
    {
      id: "security",
      image: "/images/banner_mobix_fast_v3.jpg",
      alt: "Banner Keamanan & Kecepatan Unduh Mobix - Direct Download High-Speed CDN",
      href: "/search",
    },
  ];

  // Auto-play interval (setiap 6 detik)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const current = slides[activeSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto py-3 sm:py-4">
      {/* 1. Glowing Ambient Backdrop (Pendaran cahaya hijau lembut di belakang kartu) */}
      <div className="absolute -inset-1 sm:-inset-2 rounded-[32px] sm:rounded-[44px] bg-gradient-to-r from-store via-store-light to-[#016547] opacity-25 sm:opacity-35 blur-2xl transition-opacity duration-700 pointer-events-none group-hover:opacity-50" />

      {/* 2. Double Frosted Glass Bezel (Chassis Bingkai Kaca Elegan) */}
      <div
        className="relative overflow-hidden rounded-[26px] sm:rounded-[36px] p-1.5 sm:p-2.5 bg-gradient-to-b from-white/95 via-white/60 to-white/30 backdrop-blur-2xl border border-white/80 shadow-[0_25px_65px_-15px_rgba(1,135,95,0.22)] transition-all duration-500 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Inner Screen Container yang Bersih dari Elemen yang Terlalu Rame */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] max-h-[480px] overflow-hidden rounded-[20px] sm:rounded-[28px] bg-[#0a382a] shadow-inner">
          {/* Full Image Banner tanpa Tertutup Elemen Tombol Navigasi atau Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0 size-full"
            >
              <Link href={current.href} className="block size-full relative">
                <Image
                  src={current.image}
                  alt={current.alt}
                  fill
                  priority={activeSlide === 0}
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Vignette Inner Shadow halus */}
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[28px] ring-1 ring-inset ring-white/15 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]" />

          {/* 3. Hanya Indicator Saja di Bawah (Minimalis Tanpa Tombol Next/Prev) */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-black/45 border border-white/20 px-3 py-1.5 backdrop-blur-md shadow-lg">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeSlide
                    ? "w-7 bg-emerald-400 shadow-sm ring-1 ring-white/50"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
