"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Code2,
  MessageSquare,
  Bot,
  Gamepad2,
  ChartLine,
  Star,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────

// ✅ FIX: Ditambahkan 'as const' dan 'as any' agar TypeScript Vercel aman
const fadeUp = (delay = 0) =>
  ({
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
    },
  }) as any;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
} as any;

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Fitur", href: "#features" },
    { label: "Tentang", href: "#about" },
    { label: "Ulasan", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } as any}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#FF8C00" }}
          >
            <GraduationCap size={17} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            UBIG <span style={{ color: "#FF8C00" }}>LMS</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
          >
            Login
          </a>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #FF8C00, #FFA726)",
              boxShadow: "0 4px 14px rgba(255,140,0,0.35)",
            }}
          >
            Register
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <div className="w-5 space-y-1.5">
            <div className="h-0.5 bg-current rounded-full" />
            <div className="h-0.5 bg-current rounded-full w-4" />
            <div className="h-0.5 bg-current rounded-full" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-b border-slate-100 px-6 pb-5"
          >
            <div className="pt-3 space-y-1">
              {links.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-medium text-slate-700 hover:text-orange-500 transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="/login"
                className="block mt-3 px-5 py-3 rounded-xl text-sm font-semibold text-white text-center"
                style={{
                  background: "linear-gradient(135deg, #FF8C00, #FFA726)",
                }}
              >
                Akses Portal
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 22 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width / 2) / 35);
    mouseY.set((e.clientY - r.top - r.height / 2) / 35);
  };

  return (
    <section
      className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center"
      onMouseMove={handleMouse}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="grid lg:grid-cols-2 gap-14 items-center w-full">
        {/* Left */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div
            variants={fadeUp(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-7"
            style={{
              borderColor: "rgba(255,140,0,0.3)",
              background: "rgba(255,140,0,0.06)",
              color: "#FF8C00",
            }}
          >
            <Sparkles size={13} />
            Platform Pelatihan IT Next-Gen
          </motion.div>

          <div className="mb-6 space-y-1">
            {["Kuasai IT,", "Lebih Cerdas."].map((word, i) => (
              <motion.div
                key={word}
                variants={fadeUp(i * 0.13)}
                className="block text-[3.8rem] sm:text-[4.8rem] leading-[1.05] font-extrabold tracking-tight"
              >
                {i === 0 ? (
                  <span
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #FF8C00 0%, #FFA726 50%, #FFB74D 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {word}
                  </span>
                ) : (
                  <span className="text-slate-900">{word}</span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUp(0.28)}
            className="text-slate-500 text-lg leading-relaxed max-w-lg mb-9"
          >
            Platform pembelajaran cerdas dari{" "}
            <strong>PT. Universal Big Data (UBIG)</strong> yang beradaptasi
            dengan kecepatan belajar Anda dan melacak setiap progres belajar
            anda.
          </motion.p>

          <motion.div variants={fadeUp(0.36)} className="flex flex-wrap gap-4">
            <motion.a
              href="/login"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px rgba(255,140,0,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #FF8C00, #FFA726)",
                boxShadow: "0 4px 18px rgba(255,140,0,0.3)",
              }}
            >
              Mulai Gratis <ArrowRight size={16} />
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-slate-700 text-sm border-2 border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer"
            >
              Lihat Demo
            </motion.button>
          </motion.div>

          <motion.div
            variants={fadeUp(0.44)}
            className="mt-11 flex items-center gap-8 pt-8 border-t border-slate-100"
          >
            {[
              { val: "12K+", label: "Siswa Aktif" },
              { val: "4.9★", label: "Rata-rata Ulasan" },
              { val: "98%", label: "Tingkat Kelulusan" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div
                  className="text-2xl font-extrabold"
                  style={{ color: "#FF8C00" }}
                >
                  {val}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right – animated SVG illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            {
              duration: 0.9,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1] as const,
            } as any
          }
          style={{ x: springX, y: springY }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-[500px] aspect-square mx-auto">
            {/* Soft glow */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-8 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,140,0,0.15) 0%, transparent 70%)",
              }}
            />

            <svg
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-sm"
            >
              {/* Background card */}
              <rect
                x="60"
                y="60"
                width="380"
                height="380"
                rx="32"
                fill="white"
                stroke="#F1F5F9"
                strokeWidth="1.5"
                filter="url(#cardShadow)"
              />
              <defs>
                <filter
                  id="cardShadow"
                  x="-5%"
                  y="-5%"
                  width="110%"
                  height="110%"
                >
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="24"
                    floodColor="#64748B"
                    floodOpacity="0.08"
                  />
                </filter>
              </defs>

              {/* Circular progress ring */}
              <circle
                cx="250"
                cy="220"
                r="90"
                stroke="#F1F5F9"
                strokeWidth="16"
                fill="none"
              />
              <motion.circle
                cx="250"
                cy="220"
                r="90"
                stroke="url(#ringGrad)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="565"
                initial={{ strokeDashoffset: 565 }}
                animate={{ strokeDashoffset: 565 * 0.22 }}
                transition={{ duration: 2.2, delay: 0.6, ease: "easeOut" }}
                style={{ transformOrigin: "250px 220px", rotate: "-90deg" }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF8C00" />
                  <stop offset="100%" stopColor="#FFA726" />
                </linearGradient>
              </defs>

              {/* Center text */}
              <text
                x="250"
                y="210"
                textAnchor="middle"
                fontSize="36"
                fontWeight="800"
                fill="#FF8C00"
                fontFamily="Poppins, sans-serif"
              >
                78%
              </text>
              <text
                x="250"
                y="234"
                textAnchor="middle"
                fontSize="11"
                fill="#94A3B8"
                fontFamily="Poppins, sans-serif"
              >
                Progres Belajar
              </text>

              {/* Stat cards */}
              <rect
                x="90"
                y="336"
                width="140"
                height="68"
                rx="14"
                fill="#FFF7ED"
                stroke="#FED7AA"
                strokeWidth="1"
              />
              <text
                x="160"
                y="363"
                textAnchor="middle"
                fontSize="22"
                fontWeight="800"
                fill="#FF8C00"
                fontFamily="Poppins, sans-serif"
              >
                +15.6%
              </text>
              <text
                x="160"
                y="382"
                textAnchor="middle"
                fontSize="10"
                fill="#94A3B8"
                fontFamily="Poppins, sans-serif"
              >
                Kenaikan Nilai
              </text>

              <rect
                x="270"
                y="336"
                width="140"
                height="68"
                rx="14"
                fill="#F0FDF4"
                stroke="#BBF7D0"
                strokeWidth="1"
              />
              <text
                x="340"
                y="363"
                textAnchor="middle"
                fontSize="22"
                fontWeight="800"
                fill="#16A34A"
                fontFamily="Poppins, sans-serif"
              >
                2.4×
              </text>
              <text
                x="340"
                y="382"
                textAnchor="middle"
                fontSize="10"
                fill="#94A3B8"
                fontFamily="Poppins, sans-serif"
              >
                Pemahaman Cepat
              </text>

              {/* Floating subject tags */}
              {[
                { label: "☁️ Cloud", x: 92, y: 100 },
                { label: "🔐 Security", x: 316, y: 100 },
                { label: "⚡ Web Dev", x: 92, y: 152 },
                { label: "📊 Big Data", x: 323, y: 152 },
              ].map(({ label, x, y }) => (
                <g key={label}>
                  <rect
                    x={x}
                    y={y}
                    width={label.includes("Security") ? 92 : 80}
                    height={28}
                    rx={10}
                    fill="#F8FAFC"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                  <text
                    x={x + (label.includes("Security") ? 46 : 40)}
                    y={y + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="#475569"
                    fontFamily="Poppins, sans-serif"
                  >
                    {label}
                  </text>
                </g>
              ))}

              {/* Orbiting dots */}
              {[0, 72, 144, 216, 288].map((deg, i) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const cx = 250 + 90 * Math.cos(rad);
                const cy = 220 + 90 * Math.sin(rad);
                return (
                  <motion.circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill={i === 0 ? "#FF8C00" : "#E2E8F0"}
                    animate={{
                      r: i === 0 ? [5, 7, 5] : undefined,
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2.5,
                      delay: i * 0.4,
                      repeat: Infinity,
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features Bento Grid ──────────────────────────────────────────────────────

function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: BookOpen,
      title: "Materi Interaktif",
      desc: "Belajar dari materi terstruktur, selesaikan pre-test & post-test, serta dapatkan sertifikat IT resmi dengan mudah.",
      size: "lg",
      active: true,
    },
    {
      icon: Code2,
      title: "Live Coding",
      desc: "Tulis, uji, dan eksekusi kode Anda langsung di dalam browser tanpa perlu setup environment lokal.",
      size: "md",
      active: false,
    },
    {
      icon: Bot,
      title: "AI Asisten",
      desc: "Dapatkan bantuan 24/7 dari tutor AI pintar kami kapanpun Anda merasa kesulitan memahami materi.",
      size: "sm",
      active: false,
    },
    {
      icon: MessageSquare,
      title: "Forum Komunitas",
      desc: "Ruang diskusi komunitas untuk memecahkan bug dan berkolaborasi langsung dengan mentor UBIG.",
      size: "md",
      active: false,
    },
    {
      icon: ChartLine,
      title: "Analisis Belajar",
      desc: "Pantau kemajuan Anda, skor kuis, dan kecepatan belajar dalam dashboard analitik yang komprehensif.",
      size: "sm",
      active: false,
    },
    {
      icon: Gamepad2,
      title: "Mini Games",
      desc: "Pengalaman belajar berbasis game agar pemahaman konsep IT yang rumit menjadi lebih menyenangkan.",
      size: "sm",
      active: false,
    },
  ];

  const sizeClass: Record<string, string> = {
    lg: "md:col-span-2 md:row-span-2",
    md: "md:col-span-1 md:row-span-2",
    sm: "md:col-span-1 md:row-span-1",
  };

  return (
    <section
      id="features"
      className="py-24 px-6 max-w-7xl mx-auto"
      ref={ref}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="text-center mb-16"
      >
        <motion.div
          variants={fadeUp()}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-5"
          style={{
            borderColor: "rgba(255,140,0,0.3)",
            background: "rgba(255,140,0,0.06)",
            color: "#FF8C00",
          }}
        >
          <Sparkles size={13} /> Peta Fitur UBIG LMS
        </motion.div>
        <motion.h2
          variants={fadeUp(0.1)}
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
        >
          Dirancang untuk{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #FF8C00, #FFA726)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            performa maksimal
          </span>
        </motion.h2>
        <motion.p
          variants={fadeUp(0.18)}
          className="text-slate-500 text-lg max-w-xl mx-auto"
        >
          Semua yang Anda butuhkan untuk mengubah cara Anda menyerap, mengingat,
          dan menerapkan ilmu IT dalam satu platform.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="grid md:grid-cols-3 auto-rows-[164px] gap-4"
      >
        {features.map(({ icon: Icon, title, desc, size, active }, i) => (
          <motion.div
            key={title}
            variants={fadeUp(i * 0.07)}
            whileHover={{
              y: -4,
              boxShadow: "0 16px 40px rgba(255,140,0,0.12)",
              borderColor: "rgba(255,140,0,0.35)",
            }}
            className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 ${sizeClass[size]}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                  style={{
                    background: active
                      ? "rgba(255,140,0,0.1)"
                      : "rgba(100,116,139,0.1)",
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: active ? "#FF8C00" : "#64748B" }}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                {!active && (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-slate-100 text-slate-500">
                    Segera Hadir
                  </span>
                )}
                {active && (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                    Tersedia Sekarang
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
              {(size === "lg" || size === "md") && (
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              )}
              {size === "sm" && (
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                  {desc}
                </p>
              )}
            </div>
            {/* Corner accent */}
            <div
              className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "rgba(255,140,0,0.07)" }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── About / Stats ────────────────────────────────────────────────────────────

function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { val: "15.6%", label: "Kenaikan Nilai", color: "#FF8C00" },
    { val: "2.4×", label: "Belajar Lebih Cepat", color: "#16A34A" },
    { val: "12K+", label: "Peserta Aktif", color: "#2563EB" },
  ];

  return (
    <section
      id="about"
      className="py-24 px-6"
      style={{ background: "#F8FAFC", fontFamily: "Poppins, sans-serif" }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-14 items-center"
        >
          {/* Left – metrics */}
          <motion.div variants={fadeUp()}>
            <div className="relative bg-white rounded-3xl border border-slate-200 p-10 shadow-sm overflow-hidden">
              {/* Pulsing orange aura */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,140,0,0.2) 0%, transparent 70%)",
                }}
              />

              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 relative z-10">
                Dampak Akademik Terbukti
              </h3>
              <p className="text-slate-500 text-sm mb-8 relative z-10">
                Peserta pelatihan di UBIG LMS selama 90+ hari melihat hasil
                nyata.
              </p>

              <div className="space-y-5 relative z-10">
                {stats.map(({ val, label, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.55 }}
                    className="flex items-center gap-5"
                  >
                    <div
                      className="text-3xl font-extrabold w-24 shrink-0"
                      style={{ color }}
                    >
                      {val}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-700 mb-1.5">
                        {label}
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={
                            inView
                              ? {
                                  width:
                                    i === 0 ? "78%" : i === 1 ? "92%" : "65%",
                                }
                              : {}
                          }
                          transition={{
                            delay: 0.5 + i * 0.15,
                            duration: 1,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust badge */}
              <motion.div
                variants={fadeUp(0.4)}
                className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3
"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,140,0,0.1)" }}
                >
                  <CheckCircle size={18} style={{ color: "#FF8C00" }} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Data diambil dari{" "}
                  <strong className="text-slate-700">4.200 peserta</strong> di
                  berbagai kelas Web Development, Big Data, dan Jaringan.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right – copy */}
          <motion.div variants={stagger}>
            <motion.div
              variants={fadeUp()}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-6"
              style={{
                borderColor: "rgba(255,140,0,0.3)",
                background: "rgba(255,140,0,0.06)",
                color: "#FF8C00",
              }}
            >
              <TrendingUp size={13} /> Inovasi Pedagogis
            </motion.div>
            <motion.h2
              variants={fadeUp(0.1)}
              className="text-4xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight"
            >
              Kami meredefinisi cara{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #FF8C00, #FFA726)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                manusia belajar teknologi
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp(0.18)}
              className="text-slate-500 leading-relaxed mb-5"
            >
              E-learning tradisional hanya memberikan materi searah. UBIG LMS
              dibangun dengan teknik pengulangan berkala (spaced repetition) dan
              praktik aktif — pilar pembentukan memori jangka panjang yang
              terbukti secara kognitif.
            </motion.p>
            <motion.p
              variants={fadeUp(0.26)}
              className="text-slate-500 leading-relaxed mb-8"
            >
              Mesin pembelajaran kami memantau cara Anda belajar — di mana Anda
              ragu, apa yang Anda lewati, dan konsep mana yang mudah dipahami —
              lalu menyesuaikan kurikulum secara *real-time*.
            </motion.p>

            <motion.div variants={fadeUp(0.34)} className="space-y-3">
              {[
                "Algoritma pengulangan berkala didukung riset 40 tahun",
                "Praktik silang (interleaved) di berbagai domain IT",
                "Evaluasi instan dengan perbaikan korektif otomatis",
                "Skala tingkat kesulitan yang disesuaikan secara personal",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,140,0,0.1)" }}
                  >
                    <Check size={11} style={{ color: "#FF8C00" }} />
                  </div>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Reviews Marquee ──────────────────────────────────────────────────────────

const reviews = [
  {
    name: "Rina Kusuma",
    role: "Web Developer",
    rating: 5,
    text: "UBIG LMS sangat membantu saya dalam menguasai framework terbaru. Kuis-kuisnya sangat terstruktur dan menantang.",
    initials: "RK",
    accent: "#FF8C00",
  },
  {
    name: "Dito Prakoso",
    role: "Data Analyst",
    rating: 5,
    text: "Saya sudah mencoba berbagai platform, tapi materi Big Data di sini jauh lebih terstruktur. Pemahaman saya naik drastis.",
    initials: "DP",
    accent: "#2563EB",
  },
  {
    name: "Siska Anggraeni",
    role: "System Administrator",
    rating: 5,
    text: "Analisis progres belajarnya sangat jelas. Saya jadi tahu persis materi mana yang perlu saya ulang.",
    initials: "SA",
    accent: "#16A34A",
  },
  {
    name: "Fachri Alamsyah",
    role: "Software Engineer",
    rating: 4,
    text: "Dashboard-nya bikin ketagihan belajar. Melihat nilai saya terus naik memotivasi saya untuk login setiap hari.",
    initials: "FA",
    accent: "#9333EA",
  },
  {
    name: "Amalia Putri",
    role: "Cloud Specialist",
    rating: 5,
    text: "Kurikulumnya pas banget dengan tingkat kemampuan saya. Sertifikasi AWS saya selesai dalam waktu singkat.",
    initials: "AP",
    accent: "#DB2777",
  },
  {
    name: "Bagas Wicaksono",
    role: "Network Engineer",
    rating: 5,
    text: "Nilai ujian saya naik 18% dalam dua bulan. Atasan saya sadar akan peningkatan ini. Gak perlu diragukan lagi.",
    initials: "BW",
    accent: "#EA580C",
  },
];

function ReviewCard({
  name,
  role,
  rating,
  text,
  initials,
  accent,
}: (typeof reviews)[0]) {
  return (
    <div
      className="shrink-0 w-80 bg-white border border-slate-200 rounded-3xl p-6 mx-3"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: accent }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            fill={i < rating ? "#FF8C00" : "transparent"}
            style={{ color: i < rating ? "#FF8C00" : "#CBD5E1" }}
          />
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">"{text}"</p>
    </div>
  );
}

function Reviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section
      id="reviews"
      className="py-24 overflow-hidden"
      ref={ref}
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="text-center mb-14 px-6"
      >
        <motion.div
          variants={fadeUp()}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-5"
          style={{
            borderColor: "rgba(255,140,0,0.3)",
            background: "rgba(255,140,0,0.06)",
            color: "#FF8C00",
          }}
        >
          <Star size={13} /> Ulasan Peserta
        </motion.div>
        <motion.h2
          variants={fadeUp(0.1)}
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
        >
          12.000+ pelajar{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #FF8C00, #FFA726)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            telah membuktikannya
          </span>
        </motion.h2>
      </motion.div>

      {/* Row 1 */}
      <div className="flex overflow-hidden mb-4">
        <motion.div
          animate={{ x: [0, -2400] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex"
        >
          {[...reviews, ...reviews, ...reviews].map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </motion.div>
      </div>

      {/* Row 2 – reversed */}
      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: [-2400, 0] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          className="flex"
        >
          {[...reviews, ...reviews, ...reviews].reverse().map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Sertifikasi apa saja yang dicakup oleh UBIG LMS?",
    a: "Saat ini kami berfokus pada kelas Web Development, Big Data, Analisis Data, dan Jaringan Komputer. Kelas baru akan terus ditambahkan sesuai dengan kebutuhan industri teknologi.",
  },
  {
    q: "Apakah saya bisa belajar secara offline?",
    a: "Untuk saat ini, Anda memerlukan koneksi internet yang aktif untuk mengakses materi dan memastikan progres belajar Anda tersinkronisasi dengan sempurna di database cloud kami.",
  },
  {
    q: "Apakah fitur Live Coding sudah tersedia?",
    a: "Fitur Live Coding, AI Asisten, dan Mini Games saat ini sedang dalam tahap pengembangan akhir (Segera Hadir). Kami akan merilisnya secara bertahap untuk memastikan pengalaman terbaik.",
  },
  {
    q: "Bagaimana sistem Pre-Test dan Post-Test bekerja?",
    a: "Sebelum memulai kursus, Anda harus mengikuti Pre-Test untuk mengukur pengetahuan awal. Setelah materi selesai, Post-Test akan terbuka. Anda diwajibkan mencapai nilai minimal kelulusan untuk mendapatkan sertifikat.",
  },
  {
    q: "Bagaimana cara mendapatkan kode kupon untuk mendaftar?",
    a: "Kode kupon didistribusikan secara langsung oleh mentor atau instansi yang bekerja sama dengan UBIG. Masukkan kode tersebut pada saat pendaftaran (enroll) untuk mendapatkan akses ke materi kelas.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="faq"
      className="py-24 px-6"
      style={{ background: "#F8FAFC", fontFamily: "Poppins, sans-serif" }}
      ref={ref}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.div
            variants={fadeUp()}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-5"
            style={{
              borderColor: "rgba(255,140,0,0.3)",
              background: "rgba(255,140,0,0.06)",
              color: "#FF8C00",
            }}
          >
            <BookOpen size={13} /> Pertanyaan Umum (FAQ)
          </motion.div>
          <motion.h2
            variants={fadeUp(0.1)}
            className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Yang sering{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #FF8C00, #FFA726)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ditanyakan
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="space-y-3"
        >
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              variants={fadeUp(i * 0.07)}
              className="bg-white border rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                borderColor: open === i ? "rgba(255,140,0,0.4)" : "#E2E8F0",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="shrink-0"
                  style={{ color: "#FF8C00" }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={
                      {
                        duration: 0.34,
                        ease: [0.22, 1, 0.36, 1] as const,
                      } as any
                    }
                  >
                    <div className="px-5 pb-5">
                      <div className="h-px bg-slate-100 mb-4" />
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const cols = [
    {
      title: "Layanan",
      links: [
        "Big Data Analytics",
        "Web Development",
        "Dokumentasi API",
        "Status Sistem",
      ],
    },
    {
      title: "Perusahaan",
      links: [
        "Tentang Kami",
        "Karir",
        "Hubungi Kami",
        "Kebijakan Privasi",
        "Syarat & Ketentuan",
      ],
    },
    {
      title: "Komunitas",
      links: [
        "Discord Group",
        "Forum Diskusi",
        "Papan Peringkat",
        "Grup Belajar",
      ],
    },
  ];

  const socials = [{ icon: X, label: "X" }];

  return (
    <footer
      className="border-t border-slate-200 py-16 px-6"
      style={{ background: "#F8FAFC", fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#FF8C00" }} // Logo kembali Orange
              >
                <GraduationCap size={17} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                UBIG <span style={{ color: "#FF8C00" }}>LMS</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Platform pembelajaran IT cerdas dari PT. Universal Big Data untuk
              melahirkan talenta teknologi masa depan.
            </p>

            {/* Newsletter */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-700 mb-3">
                📬 Newsletter — info kursus baru &amp; tips IT
              </p>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.p
                    key="thanks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-semibold flex items-center gap-1.5"
                    style={{ color: "#FF8C00" }}
                  >
                    <Check size={13} /> Berlangganan berhasil! Sampai jumpa di
                    email Anda.
                  </motion.p>
                ) : (
                  <motion.div key="form" className="flex gap-2">
                    <input
                      type="email"
                      placeholder="email.anda@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400 text-slate-900 placeholder-slate-400"
                      style={{ background: "white" }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => email && setSubscribed(true)}
                      className="px-3 py-2 rounded-lg text-white text-xs font-semibold cursor-pointer"
                      style={{ background: "#FF8C00" }}
                    >
                      <ArrowRight size={14} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav columns */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#FF8C00" }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={
                        link === "Tentang Kami" ? "https://ubig.co.id/" : "#"
                      }
                      target={link === "Tentang Kami" ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2026 PT. Universal Big Data (UBIG). Hak Cipta Dilindungi
            Undang-Undang.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.15, color: "#FF8C00" }}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:border-orange-300 transition-colors cursor-pointer"
              >
                <Icon size={14} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #fff; overflow-x: hidden; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: rgba(255,140,0,0.4); border-radius: 3px; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #0F172A;
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
          transition: background-color 5000s ease-in-out 0s;
        }
        .focus\\:ring-2:focus { box-shadow: 0 0 0 3px rgba(255,140,0,0.2); }
      `}</style>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
