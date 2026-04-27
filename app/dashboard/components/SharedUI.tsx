"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  XCircle,
  Home,
  BookOpen,
  GraduationCap,
  Code2,
  MessageSquare,
  Bot,
  Gamepad2,
  ChartLine,
  Menu,
  ChevronDown,
  LogOut,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { View } from "../types";

export const LEVEL_CLR: Record<string, string> = {
  Beginner: "#16A34A",
  Intermediate: "#2563EB",
  Advanced: "#DC2626",
};
export const F = "'Poppins', sans-serif";

export const Badge = ({
  label,
  color,
  sm,
}: {
  label: string;
  color: string;
  sm?: boolean;
}) => (
  <span
    className={`inline-flex items-center rounded-full font-semibold ${sm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"}`}
    style={{ background: `${color}18`, color, fontFamily: F }}
  >
    {label}
  </span>
);

export const Bar = ({
  value,
  color = "#FF8C00",
  h = 6,
}: {
  value: number;
  color?: string;
  h?: number;
}) => (
  <div
    className="w-full rounded-full bg-slate-100 overflow-hidden"
    style={{ height: h }}
  >
    <motion.div
      className="h-full rounded-full"
      style={{ background: color }}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value, 100)}%` }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
  </div>
);

export const Btn = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}) => {
  const sz = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  };
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg,#FF8C00,#FFA726)",
      color: "white",
      boxShadow: "0 4px 14px rgba(255,140,0,0.28)",
    },
    secondary: {
      background: "white",
      color: "#374151",
      border: "1.5px solid #E2E8F0",
    },
    danger: {
      background: "#FEF2F2",
      color: "#DC2626",
      border: "1.5px solid #FEE2E2",
    },
    ghost: { background: "transparent", color: "#64748B" },
  };
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all select-none ${sz[size]} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={{ fontFamily: F, ...styles[variant] }}
    >
      {children}
    </motion.button>
  );
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{
          background: "rgba(15,23,42,0.48)",
          backdropFilter: "blur(4px)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[88vh] flex flex-col overflow-hidden`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900" style={{ fontFamily: F }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label
      className="block text-xs font-semibold text-slate-600 mb-1.5"
      style={{ fontFamily: F }}
    >
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export const FInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string | null | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none bg-white transition-all"
    style={{ fontFamily: F }}
    onFocus={(e) => {
      e.target.style.borderColor = "#FF8C00";
      e.target.style.boxShadow = "0 0 0 3px rgba(255,140,0,0.12)";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#E2E8F0";
      e.target.style.boxShadow = "none";
    }}
  />
);

export const FArea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string | null | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none bg-white transition-all"
    style={{ fontFamily: F }}
    onFocus={(e) => {
      e.target.style.borderColor = "#FF8C00";
      e.target.style.boxShadow = "0 0 0 3px rgba(255,140,0,0.12)";
    }}
    onBlur={(e) => {
      e.target.style.borderColor = "#E2E8F0";
      e.target.style.boxShadow = "none";
    }}
  />
);

export const FSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none bg-white cursor-pointer"
    style={{ fontFamily: F }}
    onFocus={(e) => (e.target.style.borderColor = "#FF8C00")}
    onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
  >
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

export const RichContent = ({ html }: { html: string }) => (
  <div
    className="prose-et text-slate-700 text-sm leading-7"
    style={{ fontFamily: F }}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
      Memuat Editor...
    </div>
  ),
});
export const RichEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="mb-10"
      />
      <style>{` .ql-toolbar.ql-snow { border-radius: 0.75rem 0.75rem 0 0; border-color: transparent; border-bottom: 1px solid #E2E8F0; background: #F8FAFC; } .ql-container.ql-snow { border-radius: 0 0 0.75rem 0.75rem; border-color: transparent; font-family: 'Poppins', sans-serif; font-size: 0.875rem; } .ql-editor { min-height: 200px; color: #1E293B; } .ql-editor:focus { box-shadow: inset 0 0 0 2px rgba(255,140,0,0.1); } `}</style>
    </div>
  );
};

export const QuizRunner = ({
  questions,
  title,
  type = "pre",
  onFinish,
}: {
  questions: any[];
  title: string;
  type?: "pre" | "post";
  onFinish: (pct: number) => void;
}) => {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [chosen, setChosen] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [finalPct, setFinalPct] = useState(0);

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  if (!q && !finished) return null;

  const next = () => {
    const na = [...answers];
    na[idx] = chosen;
    setAnswers(na);
    if (isLast) {
      const score = na.filter(
        (a, i) => a === (questions[i]?.correct_index ?? questions[i]?.correct),
      ).length;
      const pct = Math.round((score / questions.length) * 100);
      setFinalPct(pct);
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setChosen(null);
    }
  };

  const retry = () => {
    setIdx(0);
    setAnswers(Array(questions.length).fill(null));
    setChosen(null);
    setFinished(false);
  };

  if (finished)
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-14 px-6"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl font-extrabold text-white"
          style={{
            background:
              finalPct >= 70
                ? "linear-gradient(135deg,#22C55E,#16A34A)"
                : "linear-gradient(135deg,#FF8C00,#FFA726)",
            boxShadow: `0 0 0 10px ${finalPct >= 70 ? "#22C55E20" : "#FF8C0020"}`,
          }}
        >
          {finalPct}%
        </div>
        <h3
          className="text-xl font-bold text-slate-900 mb-2"
          style={{ fontFamily: F }}
        >
          {finalPct >= 70 ? "🎉 Kerja Bagus!" : "📚 Tetap Semangat!"}
        </h3>
        <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: F }}>
          Kamu menjawab benar {Math.round((finalPct / 100) * questions.length)}{" "}
          dari {questions.length} soal.
        </p>
        {type === "post" && finalPct <= 90 ? (
          <div className="space-y-3 max-w-xs mx-auto">
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
              <XCircle size={14} className="inline mr-1 mb-0.5" /> Nilai
              Post-Test harus di atas 90 untuk lulus.
            </div>
            <Btn onClick={retry} className="w-full justify-center">
              <RotateCcw size={15} /> Coba Lagi
            </Btn>
          </div>
        ) : (
          <div className="max-w-xs mx-auto">
            <Btn
              onClick={() => onFinish(finalPct)}
              className="w-full justify-center"
            >
              {type === "pre" ? "Lanjut ke Materi" : "Selesaikan Kursus"}{" "}
              <ChevronRight size={15} />
            </Btn>
          </div>
        )}
      </motion.div>
    );

  return (
    <div style={{ fontFamily: F }}>
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-900 text-base">{title}</h2>
          <Badge label={`${idx + 1} / ${questions.length}`} color="#FF8C00" />
        </div>
        <Bar value={(idx / questions.length) * 100} />
      </div>
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start gap-3 mb-6">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "#FF8C00" }}
              >
                {idx + 1}
              </div>
              <p className="font-semibold text-slate-900 text-sm leading-snug">
                {q.question}
              </p>
            </div>
            <div className="space-y-2.5">
              {q.options.map((opt: string, i: number) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setChosen(i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left transition-all cursor-pointer"
                  style={{
                    background: chosen === i ? "#FF8C00" : "white",
                    borderColor: chosen === i ? "#FF8C00" : "#E2E8F0",
                    color: chosen === i ? "white" : "#374151",
                    fontFamily: F,
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      borderColor:
                        chosen === i ? "rgba(255,255,255,0.6)" : "#CBD5E1",
                      color: chosen === i ? "white" : "#94A3B8",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
        <Btn onClick={next} disabled={chosen === null}>
          {isLast ? "Submit Quiz" : "Next"} <ChevronRight size={14} />
        </Btn>
      </div>
    </div>
  );
};

export const EmptyPage = ({
  title,
  icon: Icon,
  desc,
}: {
  title: string;
  icon: any;
  desc: string;
}) => (
  <div
    className="flex items-center justify-center h-full min-h-[60vh]"
    style={{ fontFamily: "Poppins, sans-serif" }}
  >
    <div className="text-center bg-white border border-slate-200 p-10 rounded-3xl max-w-sm w-full shadow-sm">
      <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon size={40} />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-500">{desc}</p>
      <div className="mt-8 text-xs font-bold text-orange-500 bg-orange-50 px-4 py-2 rounded-lg inline-block uppercase tracking-wider">
        Coming Soon
      </div>
    </div>
  </div>
);

const NAV_ITEMS = [
  { id: "home" as View, label: "Home", Icon: Home },
  { id: "student-catalogue" as View, label: "Courses", Icon: BookOpen },
  { id: "teacher" as View, label: "Teacher Panel", Icon: GraduationCap },
  { id: "live-coding", label: "Live Coding", Icon: Code2 },
  { id: "discussion", label: "Ngobrolin Kode", Icon: MessageSquare },
  { id: "ai-assistant", label: "AI Asisten", Icon: Bot },
  { id: "mini-game", label: "Mini Game", Icon: Gamepad2 },
  { id: "analytics", label: "Analisis Belajar", Icon: ChartLine },
];

export const Sidebar = ({
  currentView,
  navigate,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  userRole,
}: {
  currentView: View;
  navigate: (v: View) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  userRole: string;
}) => {
  const activeId: string = currentView.startsWith("teacher")
    ? "teacher"
    : currentView.startsWith("student")
      ? "student-catalogue"
      : currentView;
  const handleNav = (id: View) => {
    navigate(id);
    setMobileOpen(false);
  };

  const Inner = () => (
    <>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-100 shrink-0">
        <div className="relative w-8 h-8 shrink-0">
          <img
            src="/logo.png"
            alt="EduTrack"
            className="w-8 h-8 rounded-xl object-cover absolute inset-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#FF8C00" }}
          >
            <GraduationCap size={17} className="text-white" />
          </div>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-extrabold text-slate-900 text-lg tracking-tight whitespace-nowrap"
              style={{ fontFamily: F }}
            >
              UBIG<span style={{ color: "#FF8C00" }}> LMS</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.filter((item) =>
          item.id === "teacher" ? userRole === "teacher" : true,
        ).map(({ id, label, Icon }) => {
          const isActive = activeId === id;
          return (
            <motion.button
              key={id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNav(id as View)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer"
              style={{
                background: isActive ? "rgba(255,140,0,0.1)" : "transparent",
                color: isActive ? "#FF8C00" : "#64748B",
                fontFamily: F,
              }}
            >
              <Icon size={17} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-semibold whitespace-nowrap flex-1"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="navPip"
                  className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "#FF8C00" }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-100 hidden lg:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs font-medium cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight size={15} />
          ) : (
            <>
              <ChevronLeft size={15} />
              <span style={{ fontFamily: F }}>Collapse</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 60 : 220 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="hidden lg:flex shrink-0 border-r border-slate-200 bg-white flex-col h-screen sticky top-0 overflow-hidden z-40"
      >
        <Inner />
      </motion.aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/40 lg:hidden cursor-pointer"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-[90] w-[240px] bg-white border-r border-slate-200 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
              <Inner />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Topbar = ({
  currentView,
  onHamburger,
  onLogout,
  userName,
  userEmail,
}: {
  currentView: View;
  onHamburger: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const LABELS: Partial<Record<View, string>> = {
    home: "Dashboard",
    "student-catalogue": "Courses",
    "student-detail": "Course Detail",
    "student-study": "Study Mode",
    teacher: "Teacher Panel",
    "live-coding": "Live Coding",
  };
  return (
    <header
      className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30"
      style={{ fontFamily: F }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onHamburger}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Menu size={18} />
        </button>
        <span className="text-sm text-slate-500 hidden sm:block">
          {LABELS[currentView] ?? "Dashboard"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg,#FF8C00,#FFA726)" }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">
              {userName}
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.17 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{userEmail}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      style={{ fontFamily: F }}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
