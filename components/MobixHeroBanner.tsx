"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Smartphone,
  ShieldCheck,
  UploadCloud,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  Zap,
  Star,
  CheckCircle2,
  Code2,
  TrendingUp,
  Award,
} from "lucide-react";
import type { AppDoc } from "@/types/app";
import { formatBytes } from "@/lib/utils/slug";

interface MobixHeroBannerProps {
  featuredApp?: AppDoc;
}

export function MobixHeroBanner({ featuredApp }: MobixHeroBannerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tab definitions explaining what Mobix is (Iklan & Penjelasan Mobix)
  const slides = [
    {
      id: "intro",
      tabLabel: "Apa itu Mobix?",
      badge: "🚀 Platform Komunitas #1",
      title: "Satu Tempat untuk Semua Aplikasi Android",
      gradientText: "Gratis & Tanpa Iklan",
      description:
        "Mobix adalah ekosistem distribusi aplikasi & game mobile berbasis komunitas. Jelajahi, unduh, dan bagikan aplikasi Android tanpa batas unduhan, tanpa jebakan iklan, dan 100% gratis selamanya.",
      highlights: [
        "100% Gratis & Tanpa Iklan Pop-up",
        "Unduh APK & AAB Langsung dari Server",
        "Katalog Komunitas yang Terus Berkembang",
      ],
      primaryCta: { label: "Jelajahi Aplikasi", href: "#recommended" },
      secondaryCta: { label: "Tentang Mobix", href: "/about" },
      theme: "from-[#01875f] via-[#016547] to-[#0a382a]",
    },
    {
      id: "developer",
      tabLabel: "Untuk Developer",
      badge: "⚡ Distribusi Tanpa Batas",
      title: "Rilis & Bagikan Aplikasimu ke Seluruh Dunia",
      gradientText: "Tanpa Biaya Langganan",
      description:
        "Tidak perlu melalui proses yang rumit atau biaya pendaftaran mahal. Unggah file APK/AAB buatanmu langsung ke komunitas, dapatkan ulasan jujur, serta pantau statistik unduhan secara transparan.",
      highlights: [
        "Proses Unggah Cepat dalam 3 Menit",
        "Statistik Unduhan & Analitik Real-time",
        "Dukungan Langsung dari Pengguna & Komunitas",
      ],
      primaryCta: { label: "Unggah Aplikasi Sekarang", href: "/register" },
      secondaryCta: { label: "Cara Kerja", href: "/about" },
      theme: "from-[#0369a1] via-[#0284c7] to-[#0c4a6e]",
    },
    {
      id: "security",
      tabLabel: "Cepat & Aman",
      badge: "🛡️ Keamanan & Kenyamanan #1",
      title: "Pengalaman Unduh Bersih",
      gradientText: "Zero Link Shortener",
      description:
        "Tinggalkan pengalaman mengunduh yang melelahkan karena penyingkat tautan (link shortener) atau pop-up berbahaya. Mobix menyajikan unduhan file langsung (Direct Download) dengan kecepatan maksimal.",
      highlights: [
        "Kecepatan Unduh Maksimal (High-Speed CDN)",
        "Bebas Malware, Adware & Penipuan",
        "Riwayat Versi & Transparansi Detail File",
      ],
      primaryCta: { label: "Cari Aplikasi Pilihan", href: "/search" },
      secondaryCta: { label: "Lihat Kategori", href: "#categories" },
      theme: "from-[#4f46e5] via-[#4338ca] to-[#312e81]",
    },
    {
      id: "spotlight",
      tabLabel: "Spotlight Unggulan",
      badge: "🌟 Pilihan Komunitas Hari Ini",
      title: featuredApp ? featuredApp.name : "Karya Terbaik Komunitas",
      gradientText: "Aplikasi Pilihan Mingguan",
      description: featuredApp
        ? featuredApp.description
        : "Temukan aplikasi inovatif yang dikembangkan oleh developer lokal dan internasional yang masuk dalam daftar aplikasi paling dicari minggu ini.",
      highlights: [
        featuredApp ? `Kategori: ${featuredApp.category.toUpperCase()}` : "Terverifikasi oleh Tim Mobix",
        featuredApp ? `Ukuran: ${formatBytes(featuredApp.apkSizeBytes)}` : "Rating Tinggi dari Komunitas",
        "Siap diunduh dan digunakan langsung",
      ],
      primaryCta: {
        label: featuredApp ? "Lihat Detail & Unduh" : "Lihat Semua Populer",
        href: featuredApp ? `/apps/${featuredApp.slug}` : "/search",
      },
      secondaryCta: { label: "Lihat Semua Kategori", href: "/search" },
      theme: "from-[#b45309] via-[#d97706] to-[#78350f]",
    },
  ];

  // Auto-play interval (every 6.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const currentSlide = slides[activeTab];

  const handlePrev = () => {
    setActiveTab((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient & Animated Glows */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentSlide.theme} transition-colors duration-700 ease-in-out`}
      />
      
      {/* Decorative Glass Overlay & Mesh Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 size-96 rounded-full bg-black/20 blur-3xl pointer-events-none" />

      {/* Top Navigation Tabs */}
      <div className="relative z-10 border-b border-white/10 bg-black/15 backdrop-blur-md px-4 pt-3 pb-2 sm:px-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((slide, index) => {
              const isActive = index === activeTab;
              return (
                <button
                  key={slide.id}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md scale-100"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {index === 0 && <Smartphone className="size-3.5 sm:size-4 text-emerald-600" />}
                  {index === 1 && <Code2 className="size-3.5 sm:size-4 text-sky-500" />}
                  {index === 2 && <ShieldCheck className="size-3.5 sm:size-4 text-indigo-500" />}
                  {index === 3 && <Award className="size-3.5 sm:size-4 text-amber-500" />}
                  <span>{slide.tabLabel}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrev}
              className="rounded-lg bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs font-medium text-white/80 px-2">
              {activeTab + 1} / {slides.length}
            </span>
            <button
              onClick={handleNext}
              className="rounded-lg bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
              aria-label="Next Slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Banner Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-white">
              {/* Badge */}
              <div className="mb-3.5 flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm">
                <Sparkles className="size-3.5 text-yellow-300 animate-pulse" />
                <span>{currentSlide.badge}</span>
              </div>

              {/* Title & Gradient Text */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">
                {currentSlide.title}
                <span className="block mt-1 bg-gradient-to-r from-yellow-200 via-emerald-100 to-white bg-clip-text text-transparent">
                  {currentSlide.gradientText}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-2xl font-normal">
                {currentSlide.description}
              </p>

              {/* Highlights Checkmarks */}
              <div className="mb-8 space-y-2 w-full">
                {currentSlide.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/95 font-medium">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                      <CheckCircle2 className="size-3.5 text-yellow-300" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  href={currentSlide.primaryCta.href}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-900 shadow-xl transition hover:bg-emerald-50 hover:scale-105 active:scale-95 group"
                >
                  <span>{currentSlide.primaryCta.label}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 text-store" />
                </Link>

                <Link
                  href={currentSlide.secondaryCta.href}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/20 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15 hover:border-white/50 active:scale-95"
                >
                  <span>{currentSlide.secondaryCta.label}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Mockup Showcase / Interactive Preview */}
            <div className="lg:col-span-5 flex items-center justify-center">
              {activeTab === 0 && (
                <div className="relative w-full max-w-sm sm:max-w-md">
                  {/* Floating Glass Box - Mobix Ecosystem */}
                  <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-black text-lg shadow-md">
                          M
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Mobix Store</h4>
                          <p className="text-[11px] text-emerald-200">Komunitas Aplikasi Android</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-bold text-emerald-200 border border-emerald-400/30">
                        v1.0 Community
                      </span>
                    </div>

                    {/* App Showcase Mini Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-black/25 p-3 border border-white/10 transition hover:bg-black/35">
                        <div className="relative size-12 shrink-0 rounded-xl overflow-hidden bg-white/20">
                          <Image src="/images/logo_hpp_snap.png" alt="HPP Snap" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">HPP Snap</p>
                          <p className="text-[10px] text-white/70 truncate">Keuangan & Bisnis • 18.2 MB</p>
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-yellow-300 font-semibold">
                            <Star className="size-3 fill-yellow-300" /> 4.9 (Komunitas)
                          </div>
                        </div>
                        <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
                          Unduh
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl bg-black/25 p-3 border border-white/10 transition hover:bg-black/35">
                        <div className="relative size-12 shrink-0 rounded-xl overflow-hidden bg-white/20">
                          <Image src="/images/logo_ibu_carelink.png" alt="Ibu Carelink" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">Ibu Carelink</p>
                          <p className="text-[10px] text-white/70 truncate">Kesehatan & Medis • 25.4 MB</p>
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-yellow-300 font-semibold">
                            <Star className="size-3 fill-yellow-300" /> 4.8 (Komunitas)
                          </div>
                        </div>
                        <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
                          Unduh
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-emerald-300" />
                        <span>Ribuan Pengguna Aktif</span>
                      </div>
                      <span className="font-bold text-yellow-300">Gratis Selamanya</span>
                    </div>
                  </div>

                  {/* Floating Badges */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -top-6 -right-4 rounded-2xl border border-white/20 bg-emerald-900/90 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md flex items-center gap-2"
                  >
                    <Zap className="size-4 text-yellow-300 fill-yellow-300" />
                    <span>Zero Ads Guarantee</span>
                  </motion.div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="relative w-full max-w-sm sm:max-w-md">
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500 text-white">
                          <UploadCloud className="size-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Portal Developer</h4>
                          <p className="text-[11px] text-sky-200">Upload APK & AAB Mudah</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-sky-500/30 px-2.5 py-0.5 text-[10px] font-bold text-sky-200">
                        Instant Live
                      </span>
                    </div>

                    <div className="space-y-3 bg-black/30 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between text-xs font-mono text-sky-300">
                        <span>Status Upload: Selesai</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10 text-center">
                          <p className="text-[10px] text-white/60">Total Unduhan</p>
                          <p className="text-sm font-extrabold text-white mt-0.5">+4,820</p>
                        </div>
                        <div className="rounded-xl bg-white/5 p-2.5 border border-white/10 text-center">
                          <p className="text-[10px] text-white/60">Ulasan Positif</p>
                          <p className="text-sm font-extrabold text-yellow-300 mt-0.5">99.4%</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-white/80">
                      <span>⚡ Akses Server Langsung</span>
                      <Link href="/register" className="text-sky-300 font-bold hover:underline flex items-center gap-1">
                        Mulai Sekarang <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="relative w-full max-w-sm sm:max-w-md">
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl text-white text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-indigo-500/30 border border-indigo-400/40 shadow-inner">
                      <ShieldCheck className="size-9 text-indigo-300 animate-bounce" />
                    </div>
                    <h4 className="text-lg font-bold">100% Bersih & Terverifikasi</h4>
                    <p className="text-xs text-white/80 mt-1 max-w-xs mx-auto">
                      Semua berkas APK/AAB diunggah dari developer asli dan dapat diunduh tanpa iklan pop-up berbahaya.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-black/25 p-3 border border-white/10">
                        <Zap className="size-5 text-yellow-300 mx-auto mb-1" />
                        <p className="text-[10px] font-bold">Direct CDN</p>
                        <p className="text-[9px] text-white/60">No Shortlink</p>
                      </div>
                      <div className="rounded-xl bg-black/25 p-3 border border-white/10">
                        <ShieldCheck className="size-5 text-emerald-300 mx-auto mb-1" />
                        <p className="text-[10px] font-bold">Safe File</p>
                        <p className="text-[9px] text-white/60">Verified</p>
                      </div>
                      <div className="rounded-xl bg-black/25 p-3 border border-white/10">
                        <TrendingUp className="size-5 text-sky-300 mx-auto mb-1" />
                        <p className="text-[10px] font-bold">High Speed</p>
                        <p className="text-[9px] text-white/60">Max Bandwidth</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="relative w-full max-w-sm sm:max-w-md">
                  {featuredApp ? (
                    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl text-white">
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 shadow-md bg-black/30">
                        {featuredApp.screenshots?.[0] ? (
                          <Image src={featuredApp.screenshots[0]} alt={featuredApp.name} fill className="object-cover" />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-amber-900/50 text-xl font-bold">
                            {featuredApp.name}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative size-8 rounded-lg overflow-hidden bg-white ring-1 ring-white/20">
                              <Image src={featuredApp.logoURL} alt="" fill className="object-cover" />
                            </div>
                            <span className="text-sm font-bold text-white drop-shadow">{featuredApp.name}</span>
                          </div>
                          <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            Top Pick
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-white/80 line-clamp-2 mb-4">
                        {featuredApp.description}
                      </p>

                      <Link
                        href={`/apps/${featuredApp.slug}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 transition shadow-lg"
                      >
                        <Download className="size-4" />
                        Unduh {featuredApp.name} Sekarang
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-2xl text-white text-center">
                      <Award className="size-12 text-amber-300 mx-auto mb-2" />
                      <h4 className="text-base font-bold">Jelajahi Pilihan Paling Populer</h4>
                      <p className="text-xs text-white/80 mt-1 mb-4">
                        Lihat daftar aplikasi yang paling sering diunduh oleh komunitas minggu ini.
                      </p>
                      <Link
                        href="/search"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-gray-900 hover:bg-amber-50 transition shadow"
                      >
                        <span>Lihat Katalog Lengkap</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Bar: Auto-play Progress & Mobile Navigation */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Progress indicators for each slide */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                aria-label={`Slide ${idx + 1}`}
                className="group relative h-1.5 flex-1 sm:w-12 rounded-full bg-white/20 overflow-hidden transition-all"
              >
                <div
                  className={`absolute inset-y-0 left-0 bg-white transition-all duration-300 ${
                    idx === activeTab ? "w-full" : "w-0 group-hover:w-1/2"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
              {isPaused ? "Tergantung (Jeda otomatis)" : "Berputar otomatis • Klik tab untuk memilih"}
            </span>

            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={handlePrev}
                className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-1.5 font-medium">{activeTab + 1}/{slides.length}</span>
              <button
                onClick={handleNext}
                className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
