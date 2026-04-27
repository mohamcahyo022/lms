"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe,
  Users,
  Layers,
  TrendingUp,
  ChevronRight,
  Search,
  CheckCircle2,
  Star,
  Clock,
  Check,
  PlayCircle,
  Zap,
  PanelLeftClose,
  X,
  FileText,
  Lock,
  ChevronLeft,
  BookMarked,
  Tag,
  Loader2,
  ImageIcon, // Tambahan Icon Gambar
  XCircle, // Tambahan Icon Error Kupon
} from "lucide-react";
import { Course, StudyPhase, View } from "../types";
import {
  Badge,
  Bar,
  Btn,
  F,
  Modal,
  Field,
  FInput,
  RichContent,
  QuizRunner,
  LEVEL_CLR,
} from "../components/SharedUI";

export const HomeView = ({
  courses,
  enrolledIds,
  navigate,
  userName,
}: {
  courses: Course[];
  enrolledIds: Set<number>;
  userName: string;
  navigate: (v: View) => void;
}) => {
  const hour = new Date().getHours();
  let greeting = "Selamat malam";
  if (hour < 12) greeting = "Selamat pagi";
  else if (hour < 18) greeting = "Selamat siang";

  const enrolled = courses.filter((c) => enrolledIds.has(c.id));
  const published = courses.filter((c) => c.status === "Published").length;
  const totalStudents = courses.reduce((s, c) => s + (c.totalStudents || 0), 0);
  const totalChapters = courses.reduce(
    (s, c) => s + (c.materials?.length || 0),
    0,
  );

  const stats = [
    {
      label: "Enrolled",
      value: String(enrolledIds.size),
      Icon: BookOpen,
      color: "#FF8C00",
    },
    {
      label: "Published",
      value: String(published),
      Icon: Globe,
      color: "#2563EB",
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      Icon: Users,
      color: "#16A34A",
      trend: "+12%",
    },
    {
      label: "Total Chapters",
      value: String(totalChapters),
      Icon: Layers,
      color: "#9333EA",
    },
  ];

  return (
    <div className="space-y-8" style={{ fontFamily: F }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {userName.split(" ")[0]}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            You are enrolled in{" "}
            <strong className="text-orange-500">{enrolled.length}</strong>{" "}
            course{enrolled.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Btn onClick={() => navigate("student-catalogue")}>
          <BookOpen size={15} /> Browse Courses
        </Btn>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, trend }) => (
          <motion.div
            key={label}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {label}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {value}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp size={11} /> {trend} this month
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {enrolled.length > 0 && (
        <div>
          <h2 className="font-bold text-slate-900 mb-4">My Enrollments</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {enrolled.map((c: any) => (
              <motion.div
                key={c.id}
                whileHover={{ x: 3 }}
                onClick={() => navigate("student-catalogue")}
                className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 cursor-pointer"
              >
                {/* TAMPILAN GAMBAR THUMBNAIL */}
                <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {c.image_url || c.imageUrl ? (
                    <img
                      src={c.image_url || c.imageUrl}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={16} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {c.materials?.length || 0} chapters · {c.duration || "0h"}
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">Featured Courses</h2>
          <button
            onClick={() => navigate("student-catalogue")}
            className="text-sm font-semibold hover:underline cursor-pointer"
            style={{ color: "#FF8C00", fontFamily: F }}
          >
            View all →
          </button>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses
            .filter((c) => c.status === "Published")
            .slice(0, 3)
            .map((c: any) => (
              <motion.div
                key={c.id}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("student-catalogue")}
              >
                {/* TAMPILAN GAMBAR THUMBNAIL */}
                <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {c.image_url || c.imageUrl ? (
                    <img
                      src={c.image_url || c.imageUrl}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={14} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-400">{c.instructor}</div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const StudentCatalogueView = ({
  courses,
  enrolledIds,
  onSelect,
}: {
  courses: Course[];
  enrolledIds: Set<number>;
  onSelect: (c: Course) => void;
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const published = courses.filter((c) => c.status === "Published");
  const cats = [
    "All",
    ...Array.from(new Set(published.map((c) => c.category))),
  ];
  const filtered = published.filter(
    (c) =>
      (filter === "All" || c.category === filter) &&
      c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ fontFamily: F }}>
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900">
          Available Courses
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {published.length} courses · {enrolledIds.size} enrolled
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white"
            style={{ fontFamily: F }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
              style={{
                background: filter === cat ? "#FF8C00" : "white",
                color: filter === cat ? "white" : "#64748B",
                borderColor: filter === cat ? "#FF8C00" : "#E2E8F0",
                fontFamily: F,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl">
          <BookOpen size={40} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium">
            Tidak ada kursus yang ditemukan.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course: any) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.09)" }}
              onClick={() => onSelect(course)}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col"
            >
              {/* TAMPILAN GAMBAR COVER 16:9 */}
              <div className="aspect-[16/9] w-full bg-slate-100 relative overflow-hidden border-b border-slate-100 flex items-center justify-center">
                {course.image_url || course.imageUrl ? (
                  <img
                    src={course.image_url || course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon size={32} className="text-slate-300" />
                )}
                {/* Badge Level Melayang */}
                <div className="absolute top-3 right-3">
                  <Badge label={course.level} color={LEVEL_CLR[course.level]} />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
                    {course.category}
                  </span>
                  {enrolledIds.has(course.id) && (
                    <CheckCircle2 size={16} color="#16A34A" />
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-tight mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  by {course.instructor}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                  {course.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Users size={12} className="text-slate-400" />{" "}
                    {(course.totalStudents || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={12} fill="currentColor" />{" "}
                    {(course.rating || 0) > 0 ? course.rating : "New"}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Clock size={12} className="text-slate-400" />{" "}
                    {course.duration || "0h"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const StudentDetailView = ({
  course,
  isEnrolled,
  onEnroll,
  onStart,
  onBack,
}: {
  course: any;
  isEnrolled: boolean;
  onEnroll: (coupon: string) => Promise<boolean>;
  onStart: () => void;
  onBack: () => void;
}) => {
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponVal, setCouponVal] = useState("");
  const [couponState, setCouponState] = useState<
    "idle" | "checking" | "ok" | "fail"
  >("idle");

  const totalLessons =
    course.materials?.reduce(
      (s: any, m: any) => s + (m.subMaterials?.length || 0),
      0,
    ) || 0;

  const verifyCoupon = async () => {
    setCouponState("checking");
    const isSuccess = await onEnroll(couponVal.trim());
    if (isSuccess) {
      setCouponState("ok");
      setTimeout(() => setShowCoupon(false), 900);
    } else setCouponState("fail");
  };

  return (
    <div style={{ fontFamily: F }}>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} /> Back to Courses
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* BANNER COVER GAMBAR BESAR */}
            <div className="w-full h-48 sm:h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
              {course.image_url || course.imageUrl ? (
                <img
                  src={course.image_url || course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                  <ImageIcon size={48} />
                  <span className="text-sm font-medium">
                    Cover tidak tersedia
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge label={course.category} color="#FF8C00" />
                <Badge
                  label={course.level}
                  color={LEVEL_CLR[course.level] || "#2563EB"}
                />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
                {course.title}
              </h1>
              <p className="text-sm text-slate-500 mb-6">
                by{" "}
                <strong className="text-slate-700">{course.instructor}</strong>
              </p>

              <h3 className="font-bold text-slate-900 mb-2">
                Deskripsi Kursus
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Statistik Bawah */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Students",
                value: (course.totalStudents || 0).toLocaleString(),
                Icon: Users,
              },
              {
                label: "Rating",
                value: course.rating > 0 ? `${course.rating}★` : "New",
                Icon: Star,
              },
              {
                label: "Duration",
                value: course.duration || "0h",
                Icon: Clock,
              },
              {
                label: "Lessons",
                value: String(totalLessons),
                Icon: BookMarked,
              },
            ].map(({ label, value, Icon }) => (
              <div
                key={label}
                className="bg-white border border-slate-200 rounded-2xl p-3 text-center"
              >
                <Icon size={16} className="mx-auto mb-1.5 text-orange-500" />
                <div className="text-base font-bold text-slate-900">
                  {value}
                </div>
                <div className="text-[10px] text-slate-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Kurikulum */}
          <div className="bg-white border border-slate-200 rounded-2xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Curriculum</h2>
              <Badge
                label={`${course.materials?.length || 0} chapters`}
                color="#FF8C00"
              />
            </div>
            <div className="divide-y divide-slate-100">
              {course.materials?.map((mat: any) => (
                <div key={mat.id}>
                  <div className="px-5 py-3 bg-slate-50 flex items-center gap-2">
                    <Layers size={14} className="text-orange-500" />
                    <span className="text-sm font-semibold text-slate-800">
                      {mat.title}
                    </span>
                    <Badge
                      label={`${mat.subMaterials?.length || 0} lessons`}
                      color="#FF8C00"
                      sm
                    />
                  </div>
                  {mat.subMaterials?.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="px-5 py-3 flex items-center gap-3"
                    >
                      {isEnrolled ? (
                        <FileText
                          size={14}
                          className="text-slate-400 shrink-0"
                        />
                      ) : (
                        <Lock size={14} className="text-slate-300 shrink-0" />
                      )}
                      <span className="text-sm text-slate-700 flex-1">
                        {sub.title}
                      </span>
                      {sub.duration && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {sub.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {(!course.materials || course.materials.length === 0) && (
                <div className="p-6 text-center text-sm text-slate-400">
                  Belum ada kurikulum untuk kursus ini.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan (Enrollment Card) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-20">
            <div className="p-6 border-b border-slate-100">
              <div className="text-3xl font-extrabold text-slate-900 mb-1">
                Course
              </div>
              <p className="text-xs text-slate-400">
                One-time · Lifetime access
              </p>
            </div>
            <div className="p-6 space-y-3">
              {isEnrolled ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl p-3 border border-green-200">
                    <CheckCircle2 size={16} color="#16A34A" /> You are enrolled!
                  </div>
                  <Btn
                    onClick={onStart}
                    className="w-full justify-center"
                    size="lg"
                  >
                    <PlayCircle size={16} /> Start Learning
                  </Btn>
                </>
              ) : (
                <>
                  <Btn
                    onClick={() => setShowCoupon(true)}
                    className="w-full justify-center"
                    size="lg"
                  >
                    <Zap size={16} /> Enroll with Coupon
                  </Btn>
                  <p className="text-center text-xs text-slate-400">
                    Gunakan kupon dari guru untuk akses.
                  </p>
                </>
              )}

              <div className="pt-2 space-y-2">
                {[
                  `${course.materials?.length || 0} chapters`,
                  `${totalLessons} lessons`,
                  "Lifetime access",
                  "Certificate",
                  "Pre-Test & Post-Test",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs text-slate-600"
                  >
                    <Check size={13} color="#16A34A" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Kupon */}
      <Modal
        open={showCoupon}
        onClose={() => {
          setShowCoupon(false);
          setCouponState("idle");
        }}
        title="Apply Coupon Code"
      >
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-orange-200 bg-orange-50">
            <Tag size={18} color="#FF8C00" className="shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Masukkan Kode Kupon
              </p>
              <p className="text-xs text-slate-500">
                Akses untuk <strong>{course.title}</strong>
              </p>
            </div>
          </div>
          <Field label="Coupon Code" required>
            <FInput
              value={couponVal}
              onChange={setCouponVal}
              placeholder="Ketik kode kupon di sini..."
            />
          </Field>
          {couponState === "fail" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-600 text-xs p-3 rounded-xl bg-red-50 border border-red-200"
            >
              <XCircle size={14} /> Kupon tidak valid atau salah!
            </motion.div>
          )}
          {couponState === "ok" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-green-600 text-xs p-3 rounded-xl bg-green-50 border border-green-200"
            >
              <CheckCircle2 size={14} /> Berhasil! Akses diberikan...
            </motion.div>
          )}
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              onClick={() => {
                setShowCoupon(false);
                setCouponState("idle");
              }}
              className="flex-1"
            >
              Batal
            </Btn>
            <Btn
              onClick={verifyCoupon}
              disabled={
                !couponVal.trim() ||
                couponState === "checking" ||
                couponState === "ok"
              }
              className="flex-1"
            >
              {couponState === "checking" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Zap size={14} />
              )}
              {couponState === "checking" ? "Mengecek..." : "Gunakan"}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const StudentStudyView = ({
  course,
  phase,
  setPhase,
  onBack,
}: {
  course: any;
  phase: StudyPhase;
  setPhase: (p: StudyPhase) => void;
  onBack: () => void;
}) => {
  const flat = course.materials.flatMap((m: any) =>
    m.subMaterials.map((s: any) => ({ ...s, chapterTitle: m.title })),
  );
  const [lessonIdx, setLessonIdx] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const curr = flat[lessonIdx];
  const pct = flat.length > 0 ? Math.round((done.size / flat.length) * 100) : 0;

  if (phase === "pretest")
    return (
      <div className="max-w-2xl mx-auto py-8">
        <QuizRunner
          questions={course.preTest}
          title="Pre-Test"
          type="pre"
          onFinish={() => setPhase("learning")}
        />
      </div>
    );
  if (phase === "posttest")
    return (
      <div className="max-w-2xl mx-auto py-8">
        <QuizRunner
          questions={course.postTest}
          title="Post-Test"
          type="post"
          onFinish={() => setPhase("completed")}
        />
      </div>
    );
  if (phase === "completed")
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold">Course Completed!</h2>
        <Btn onClick={onBack}>Back to Courses</Btn>
      </div>
    );

  return (
    <div
      className="flex h-[calc(100vh-56px)] overflow-hidden"
      style={{ fontFamily: F }}
    >
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="shrink-0 border-r border-slate-200 bg-white flex-col overflow-hidden"
        style={{ display: "flex" }}
      >
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-900 truncate">
            {course.title}
          </p>
          <Bar value={pct} h={4} />
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {course.materials.map((mat: any) => (
            <div key={mat.id}>
              <div className="px-4 py-2 flex items-center gap-2">
                <Layers size={12} className="text-orange-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {mat.title}
                </span>
              </div>
              {mat.subMaterials.map((sub: any) => {
                const gi = flat.findIndex((f: any) => f.id === sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => setLessonIdx(gi)}
                    className="w-full px-4 py-2.5 text-left text-xs cursor-pointer"
                    style={{
                      background:
                        gi === lessonIdx ? "rgba(255,140,0,0.08)" : undefined,
                      color: gi === lessonIdx ? "#FF8C00" : "#64748B",
                    }}
                  >
                    {sub.title}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </motion.aside>
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="cursor-pointer"
          >
            <PanelLeftClose size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {curr?.title}
            </p>
          </div>
          <button onClick={onBack} className="cursor-pointer">
            <X size={13} /> Exit
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
            {curr?.title}
          </h1>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <RichContent
              html={curr?.content ?? "<p>No content available.</p>"}
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Btn
              variant="secondary"
              onClick={() => setLessonIdx(Math.max(0, lessonIdx - 1))}
              disabled={lessonIdx === 0}
            >
              Previous
            </Btn>
            <Btn
              onClick={() => {
                setDone((prev) => new Set([...prev, lessonIdx]));
                if (lessonIdx < flat.length - 1) setLessonIdx(lessonIdx + 1);
                else setPhase("posttest");
              }}
            >
              Next
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};
