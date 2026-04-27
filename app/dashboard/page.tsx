"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Gamepad2, ChartLine, MessageSquare, Bot } from "lucide-react";

import { Course, View, TeacherStep, StudyPhase, Material } from "./types";
import { LogicCourse } from "./LogicCourse";
import { Sidebar, Topbar, EmptyPage, F } from "./components/SharedUI";
import {
  HomeView,
  StudentCatalogueView,
  StudentDetailView,
  StudentStudyView,
} from "./views/StudentViews";
import { TeacherPanelView } from "./views/TeacherViews";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [userRole, setUserRole] = useState<string>("student");
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  const [currentView, setCurrentView] = useState<View>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [studyPhase, setStudyPhase] = useState<StudyPhase>("pretest");

  const [tStep, setTStep] = useState<TeacherStep>("courses");
  const [tCourse, setTCourse] = useState<Course | null>(null);
  const [tMaterial, setTMaterial] = useState<Material | null>(null);

  const loadData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/");
      return;
    }

    setUserRole(user.user_metadata?.role || "student");
    setUserInfo({
      name: user.user_metadata?.full_name || "Pelajar",
      email: user.email || "",
    });

    const { courses: fetchedCourses, enrolledIds: fetchedEnrolled } =
      await LogicCourse.fetchDashboardData(user.id);

    setCourses(fetchedCourses);
    setEnrolledIds(fetchedEnrolled);
    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  if (!mounted) return null;

  const navigate = (v: View) => {
    setCurrentView(v);
    setIsMobileMenuOpen(false);
    if (!v.startsWith("teacher")) {
      setTStep("courses");
      setTCourse(null);
      setTMaterial(null);
    }
    if (
      !v.startsWith("student") &&
      v !== "student-detail" &&
      v !== "student-study"
    ) {
      setSelectedCourse(null);
      setStudyPhase("pretest");
    }
  };

  const handleSelectCourse = (c: Course) => {
    setSelectedCourse(c);
    setStudyPhase("pretest");
    setCurrentView("student-detail");
  };

  const handleEnroll = async (
    courseId: number | string,
    inputCoupon: string,
  ) => {
    const courseTarget = courses.find((c) => c.id === courseId);
    if (!courseTarget) return false;

    if (
      courseTarget.couponCode !== inputCoupon &&
      courseTarget.coupon_code !== inputCoupon
    ) {
      return false; // Kupon salah
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || "11111111-1111-1111-1111-111111111111"; // Dummy user

    const isSuccess = await LogicCourse.enrollUser(userId, courseId);
    if (isSuccess) {
      setEnrolledIds((prev) => new Set([...prev, courseId as number]));
      return true;
    }
    return false;
  };

  const handleStartLearning = () => {
    setStudyPhase("pretest");
    setCurrentView("student-study");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEnrolledIds(new Set());
    setSelectedCourse(null);
    setUserRole("student");
    router.push("/");
  };

  const freshSelected = selectedCourse
    ? (courses.find((c) => c.id === selectedCourse.id) ?? selectedCourse)
    : null;
  const isStudyMode = currentView === "student-study";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #F8FAFC; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px white inset !important; -webkit-text-fill-color: #0F172A; }

        .prose-et h2        { font-size:1.1rem; font-weight:800; color:#0F172A; margin:1.2rem 0 0.4rem; }
        .prose-et h3        { font-size:0.9rem; font-weight:700; color:#1E293B; margin:1rem 0 0.35rem; }
        .prose-et p         { margin:0 0 0.7rem; color:#475569; }
        .prose-et ul        { margin:0.4rem 0 0.7rem 1.2rem; list-style:disc; }
        .prose-et li        { margin-bottom:0.3rem; color:#475569; }
        .prose-et blockquote { border-left:3px solid #FF8C00; padding:0.4rem 0.75rem 0.4rem 1rem; background:rgba(255,140,0,0.06); border-radius:0 0.5rem 0.5rem 0; margin:0.9rem 0; font-style:italic; color:#64748B; }
        .prose-et pre       { background:#1E293B; color:#E2E8F0; padding:0.7rem 1rem; border-radius:0.5rem; font-size:0.78rem; overflow-x:auto; margin:0.7rem 0; }
        .prose-et a         { color:#FF8C00; text-decoration:underline; }
        .prose-et iframe    { width: 100%; aspect-ratio: 16/9; border-radius: 0.75rem; margin: 1rem 0; }
        .prose-et img       { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1rem 0; }
      `}</style>

      <div
        className="flex min-h-screen bg-slate-50 text-slate-900"
        style={{ fontFamily: F }}
      >
        {!isStudyMode && (
          <Sidebar
            currentView={currentView}
            navigate={navigate}
            collapsed={isSidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            mobileOpen={isMobileMenuOpen}
            setMobileOpen={setIsMobileMenuOpen}
            userRole={userRole}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {!isStudyMode && (
            <Topbar
              currentView={currentView}
              onHamburger={() => setIsMobileMenuOpen(true)}
              onLogout={handleLogout}
              userName={userInfo.name}
              userEmail={userInfo.email}
            />
          )}

          <main
            className={`flex-1 ${isStudyMode ? "" : "p-4 sm:p-6 overflow-y-auto"}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentView}-${freshSelected?.id}-${tStep}-${tCourse?.id}-${tMaterial?.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className={isStudyMode ? "h-full" : ""}
              >
                {/* ── TAMPILAN SISWA ── */}
                {currentView === "home" && (
                  <HomeView
                    courses={courses}
                    enrolledIds={enrolledIds}
                    navigate={navigate}
                    userName={userInfo.name}
                  />
                )}
                {currentView === "student-catalogue" && (
                  <StudentCatalogueView
                    courses={courses}
                    enrolledIds={enrolledIds}
                    onSelect={handleSelectCourse}
                  />
                )}
                {currentView === "student-detail" && freshSelected && (
                  <StudentDetailView
                    course={freshSelected}
                    isEnrolled={enrolledIds.has(freshSelected.id)}
                    onEnroll={(couponValue) =>
                      handleEnroll(freshSelected.id, couponValue)
                    }
                    onStart={handleStartLearning}
                    onBack={() => navigate("student-catalogue")}
                  />
                )}
                {currentView === "student-study" && freshSelected && (
                  <StudentStudyView
                    course={freshSelected}
                    phase={studyPhase}
                    setPhase={setStudyPhase}
                    onBack={() => {
                      navigate("student-catalogue");
                      setStudyPhase("pretest");
                    }}
                  />
                )}

                {/* ── TAMPILAN GURU ── */}
                {currentView === "teacher" && (
                  <TeacherPanelView
                    courses={courses}
                    setCourses={setCourses}
                    tStep={tStep}
                    setTStep={setTStep}
                    tCourse={tCourse}
                    setTCourse={setTCourse}
                    tMaterial={tMaterial}
                    setTMaterial={setTMaterial}
                    loadData={loadData}
                  />
                )}

                {/* ── FITUR COMING SOON ── */}
                {currentView === "live-coding" && (
                  <EmptyPage
                    title="Live Coding"
                    icon={Code2}
                    desc="Fitur Live Coding sedang dikembangkan."
                  />
                )}
                {currentView === "mini-game" && (
                  <EmptyPage
                    title="Mini Games"
                    icon={Gamepad2}
                    desc="Belajar sambil bermain! Segera hadir."
                  />
                )}
                {currentView === "analytics" && (
                  <EmptyPage
                    title="Analisis Belajar"
                    icon={ChartLine}
                    desc="Pantau grafik belajarmu di sini."
                  />
                )}
                {currentView === "discussion" && (
                  <EmptyPage
                    title="Ngobrolin Kode"
                    icon={MessageSquare}
                    desc="Forum diskusi antar siswa."
                  />
                )}
                {currentView === "ai-assistant" && (
                  <EmptyPage
                    title="AI Asisten"
                    icon={Bot}
                    desc="Tanya AI kapan saja."
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}
