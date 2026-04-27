"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
  Brain,
  BarChart3,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";

import { LoginLogic } from "./LogicLogin";

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = "login" | "register";
type SubmitState = "idle" | "loading" | "success";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 36, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir * -36,
    opacity: 0,
    transition: { duration: 0.28 },
  }),
};

// ─── Input Field ──────────────────────────────────────────────────────────────
interface FieldProps {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
  autoComplete?: string;
}

function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  suffix,
  autoComplete,
}: FieldProps) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-200 pointer-events-none">
        <Icon size={16} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm text-slate-900 placeholder-slate-400 border border-slate-200 outline-none transition-all duration-200 focus:border-orange-400"
        style={{ background: "white", fontFamily: "Poppins, sans-serif" }}
      />
      {suffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {suffix}
        </div>
      )}
    </div>
  );
}

// ─── Social Button ────────────────────────────────────────────────────────────
function SocialButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      type="button"
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(255,140,0,0.5)",
        boxShadow: "0 0 0 3px rgba(255,140,0,0.1)",
      }}
      whileTap={{ scale: 0.97 }}
      className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <Icon size={16} className="text-slate-500" />
      {label}
    </motion.button>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const colors = ["", "#EF4444", "#F59E0B", "#22C55E"];
  const labels = ["", "Lemah", "Sedang", "Kuat"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-2"
    >
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((lvl) => (
          <motion.div
            key={lvl}
            className="h-1.5 flex-1 rounded-full"
            style={{
              background: strength >= lvl ? colors[strength] : "#E2E8F0",
            }}
            transition={{ duration: 0.25 }}
          />
        ))}
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: colors[strength], fontFamily: "Poppins, sans-serif" }}
      >
        {labels[strength]}
      </span>
    </motion.div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [remember, setRemember] = useState(false);

  const handleGoogleLogin = async () => {
    await LoginLogic.loginWithGoogle();
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Email dan Kata Sandi tidak boleh kosong!",
        confirmButtonColor: "#FF8C00",
      });
      return;
    }

    if (state !== "idle") return;
    setState("loading");

    const { error } = await LoginLogic.loginWithEmail(email, password);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message,
        confirmButtonColor: "#FF8C00",
      });
      setState("idle");
      return;
    }

    setState("success");
    Swal.fire({
      icon: "success",
      title: "Login Berhasil!",
      text: "Mengalihkan ke Dashboard...",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push("/dashboard");
    });
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
          Selamat Datang
        </h2>
        <p className="text-sm text-slate-500">
          Lanjutkan perjalanan belajar Anda bersama UBIG.
        </p>
      </div>

      <div className="flex gap-3">
        <SocialButton
          icon={GoogleIcon}
          label="Google"
          onClick={handleGoogleLogin}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">
          atau masuk dengan email
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <Field
        icon={Mail}
        type="email"
        placeholder="Alamat email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />
      <Field
        icon={Lock}
        type={showPass ? "text" : "password"}
        placeholder="Kata sandi"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        suffix={
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-slate-400 hover:text-orange-500 transition-colors cursor-pointer"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setRemember(!remember)}
          className="flex items-center gap-2 cursor-pointer outline-none"
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white"}`}
          >
            <AnimatePresence>
              {remember && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-xs text-slate-600">Ingat saya</span>
        </button>
        <a
          href="#"
          className="text-xs font-semibold hover:underline cursor-pointer"
          style={{ color: "#FF8C00" }}
        >
          Lupa kata sandi?
        </a>
      </div>

      <SubmitButton state={state} onSubmit={handleSubmit} label="Masuk" />
      <p className="text-center text-xs text-slate-500 pt-1">
        Belum punya akun?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: "#FF8C00" }}
        >
          Daftar sekarang
        </button>
      </p>
    </div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Nama, Email, dan Kata Sandi harus diisi semua!",
        confirmButtonColor: "#FF8C00",
      });
      return;
    }

    if (state !== "idle") return;
    setState("loading");

    const { error } = await LoginLogic.registerWithEmail(email, password, name);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error.message,
        confirmButtonColor: "#FF8C00",
      });
      setState("idle");
      return;
    }

    setState("success");
    Swal.fire({
      icon: "success",
      title: "Pendaftaran Berhasil!",
      text: "Mengalihkan ke Dashboard...",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      router.push("/dashboard");
    });
  };

  return (
    <div className="space-y-4" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
          Buat Akun
        </h2>
        <p className="text-sm text-slate-500">
          Mulai tingkatkan keahlian IT Anda.
        </p>
      </div>

      <Field
        icon={User}
        type="text"
        placeholder="Nama lengkap"
        value={name}
        onChange={setName}
        autoComplete="name"
      />

      <Field
        icon={Mail}
        type="email"
        placeholder="Alamat email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />

      <div className="space-y-2">
        <Field
          icon={Lock}
          type={showPass ? "text" : "password"}
          placeholder="Buat kata sandi"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          suffix={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-400 hover:text-orange-500 transition-colors cursor-pointer"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        <AnimatePresence>
          {password && <PasswordStrength password={password} />}
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Dengan mendaftar, Anda menyetujui{" "}
        <a
          href="#"
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: "#FF8C00" }}
        >
          Syarat
        </a>{" "}
        dan{" "}
        <a
          href="#"
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: "#FF8C00" }}
        >
          Kebijakan Privasi
        </a>{" "}
        kami.
      </p>

      <SubmitButton state={state} onSubmit={handleSubmit} label="Daftar Akun" />
      <p className="text-center text-xs text-slate-500 pt-1">
        Sudah punya akun?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: "#FF8C00" }}
        >
          Masuk
        </button>
      </p>
    </div>
  );
}

// ─── Submit Button ────────────────────────────────────────────────────────────
function SubmitButton({
  state,
  onSubmit,
  label,
}: {
  state: SubmitState;
  onSubmit: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileHover={
        state === "idle"
          ? { scale: 1.02, boxShadow: "0 8px 28px rgba(255,140,0,0.4)" }
          : {}
      }
      whileTap={state === "idle" ? { scale: 0.97 } : {}}
      onClick={onSubmit}
      disabled={state !== "idle"}
      className={`relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden ${state === "idle" ? "cursor-pointer" : "cursor-wait"}`}
      style={{
        background:
          state === "success"
            ? "linear-gradient(135deg, #22C55E, #16A34A)"
            : "linear-gradient(135deg, #FF8C00, #FFA726)",
        boxShadow: "0 4px 16px rgba(255,140,0,0.3)",
        fontFamily: "Poppins, sans-serif",
        transition: "background 0.4s ease",
      }}
    >
      {state === "idle" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1,
          }}
        />
      )}
      <AnimatePresence mode="wait">
        {state === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 size={18} className="animate-spin" />
          </motion.div>
        ) : state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check size={18} /> Selesai!
          </motion.div>
        ) : (
          <motion.div
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            {label} <ArrowRight size={15} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Google Icon (inline SVG) ─────────────────────────────────────────────────
function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56C11.242 14.1 10.211 14.42 9 14.42c-2.392 0-4.415-1.612-5.138-3.783H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.862 10.637A5.41 5.41 0 0 1 3.58 9c0-.566.098-1.115.282-1.637V5.03H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.03l2.905-2.393z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 5.03L3.862 7.363C4.585 5.193 6.608 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Left Branding Panel ──────────────────────────────────────────────────────
function BrandPanel() {
  const features = [
    { icon: Brain, text: "Kurikulum adaptif yang menyesuaikan kemampuan Anda" },
    {
      icon: BarChart3,
      text: "Analitik real-time dan pemantauan progres belajar",
    },
    { icon: Zap, text: "Evaluasi dan umpan balik instan pada setiap kuis" },
    { icon: Star, text: "Terbukti meningkatkan nilai kelulusan hingga 15,6%" },
  ];
  return (
    <div
      className="hidden lg:flex lg:flex-col h-full w-[45%] relative overflow-hidden shrink-0"
      style={{
        background:
          "linear-gradient(145deg, #FFF7ED 0%, #FFFBF5 60%, #FEF3C7 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,140,0,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,0,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,167,38,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-12">
        <a
          href="/"
          className="flex items-center gap-2.5 mb-auto cursor-pointer w-fit"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#FF8C00" }}
          >
            <GraduationCap size={19} className="text-white" />
          </div>
          <span
            className="font-bold text-slate-900 text-xl tracking-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            UBIG <span style={{ color: "#FF8C00" }}>LMS</span>
          </span>
        </a>

        <div className="my-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6"
              style={{
                borderColor: "rgba(255,140,0,0.3)",
                background: "rgba(255,140,0,0.08)",
                color: "#FF8C00",
              }}
            >
              <Sparkles size={12} /> Bergabung dengan 12.000+ peserta
            </div>
            <h1
              className="text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Karier IT Anda
              <br />
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #FF8C00 0%, #FFA726 60%, #FFB74D 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                dimulai di sini.
              </span>
            </h1>
            <p
              className="text-slate-600 text-sm leading-relaxed mb-10 max-w-xs"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pembelajaran interaktif dan terstruktur. Pantau progres Anda,
              kembangkan keahlian, dan raih sertifikasi IT lebih cepat dari
              sebelumnya.
            </p>
            <div className="space-y-4">
              {features.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      background: "rgba(255,140,0,0.1)",
                      borderColor: "rgba(255,140,0,0.2)",
                    }}
                  >
                    <Icon size={14} style={{ color: "#FF8C00" }} />
                  </div>
                  <span className="text-sm text-slate-600">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [dir, setDir] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const switchTo = (next: Mode) => {
    setDir(next === "register" ? 1 : -1);
    setMode(next);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: white; margin: 0; overflow-x: hidden; }
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { -webkit-text-fill-color: #0F172A !important; -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important; transition: background-color 5000s ease-in-out 0s; caret-color: #0F172A; }
        input:focus { box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.18); }
        .animate-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F8FAFC; }
        ::-webkit-scrollbar-thumb { background: rgba(255,140,0,0.4); border-radius: 3px; }
      `}</style>

      <div
        className="h-screen w-full flex overflow-hidden"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Panel Samping - Muncul di Layar Besar */}
        <BrandPanel />

        {/* Panel Kanan (Form) */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white relative overflow-y-auto">
          {/* Logo untuk Mobile (Layar Kecil) */}
          <a
            href="/"
            className="lg:hidden absolute top-6 left-6 flex items-center gap-2 cursor-pointer"
          >
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[400px] my-auto pt-10 lg:pt-0"
          >
            <div className="relative flex p-1 mb-6 bg-slate-100 rounded-2xl cursor-pointer">
              <motion.div
                layout
                layoutId="pill"
                className="absolute top-1 bottom-1 rounded-xl shadow-sm"
                style={{
                  background: "white",
                  width: "calc(50% - 4px)",
                  left: mode === "login" ? "4px" : "calc(50%)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchTo(m)}
                  className="relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
                  style={{
                    color: mode === m ? "#0F172A" : "#94A3B8",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {m === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden relative">
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(255,140,0,0.08) 0%, transparent 70%)",
                }}
              />
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={mode}
                  custom={dir}
                  variants={slideVariants as any}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {mode === "login" ? (
                    <LoginForm onSwitch={() => switchTo("register")} />
                  ) : (
                    <RegisterForm onSwitch={() => switchTo("login")} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-center mt-5 text-xs text-slate-400">
              <link
                href="/"
                className="hover:text-slate-600 transition-colors cursor-pointer"
              >
                ← Kembali ke Beranda UBIG
              </link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
