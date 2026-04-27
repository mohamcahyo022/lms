import { createClient } from "@/lib/supabase/browser";
import Swal from "sweetalert2";

export const LogicCourse = {
  async fetchDashboardData(userId: string) {
    const supabase = createClient();

    // 1. Ambil ID kursus yang sudah diikuti user
    let enrolledIds = new Set<number>();
    const { data: myEnrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", userId);

    if (myEnrollments) {
      enrolledIds = new Set(myEnrollments.map((e) => e.course_id));
    }

    // 2. Ambil data kursus (Optimasi: Hanya ambil kolom yang penting agar loading cepat!)
    const { data: coursesData, error } = await supabase
      .from("courses")
      .select(
        `
        id, title, category, instructor, level, status, image_url, description, coupon_code,
        materials:chapters (
          id, title, type, order_index, description,
          subMaterials:lessons (id, title, duration, order_index, content)
        ),
        preTest:quizzes (id, question, options, correct_index, quiz_type),
        postTest:quizzes (id, question, options, correct_index, quiz_type),
        enrollments (user_id) 
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal memuat data kursus:", error.message);
      return { courses: [], enrolledIds };
    }

    // 3. Format dan hitung durasi otomatis
    const formattedCourses = (coursesData || []).map((c: any) => {
      const totalLessons = (c.materials || []).reduce(
        (acc: number, chap: any) => acc + (chap.subMaterials?.length || 0),
        0,
      );
      const totalMinutes = totalLessons * 15;
      const dynamicDuration =
        totalMinutes > 0
          ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
          : "0h";

      // Karena kita melakukan select enrollments(user_id), kita bisa hitung panjang arraynya
      const dynamicTotalStudents = c.enrollments ? c.enrollments.length : 0;

      return {
        ...c,
        duration: dynamicDuration,
        totalStudents: dynamicTotalStudents,
        preTest: (c.preTest || []).filter((q: any) => q.quiz_type === "pre"),
        postTest: (c.postTest || []).filter((q: any) => q.quiz_type === "post"),
        materials: (c.materials || [])
          .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
          .map((m: any) => ({
            ...m,
            subMaterials: (m.subMaterials || []).sort(
              (a: any, b: any) => (a.order_index || 0) - (b.order_index || 0),
            ),
          })),
      };
    });

    return { courses: formattedCourses, enrolledIds };
  },

  async enrollUser(userId: string, courseId: number | string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("enrollments")
      .insert([{ user_id: userId, course_id: courseId }]);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mendaftar",
        text: error.message,
      });
      return false;
    }
    return true;
  },
};
