import { createClient } from "@/lib/supabase/browser";
import Swal from "sweetalert2";

// Template Notifikasi Mini di Pojok Kanan
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const LogicTeacher = {
  // ─── KURSUS ───
  async saveCourse(form: any, editId: number | string | null) {
    const supabase = createClient();

    // Siapkan data yang mau dikirim
    const payload: any = {
      title: form.title,
      category: form.category,
      instructor: form.instructor,
      level: form.level,
      description: form.description,
      coupon_code: form.couponCode,
      image_url: form.image_url,
    };

    // Jika ini adalah kursus baru, otomatis set statusnya jadi Draft
    if (!editId) {
      payload.status = "Draft";
    }

    const { error } = editId
      ? await supabase.from("courses").update(payload).eq("id", editId)
      : await supabase.from("courses").insert([payload]);

    if (error) {
      Swal.fire("Gagal", error.message, "error");
      return false;
    }
    Toast.fire({
      icon: "success",
      title: editId ? "Kursus Diperbarui" : "Kursus Dibuat",
    });
    return true;
  },

  async toggleCourseStatus(id: number | string, currentStatus: string) {
    const supabase = createClient();
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    const { error } = await supabase
      .from("courses")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) Swal.fire("Gagal", error.message, "error");
  },

  async deleteCourse(id: number | string) {
    const supabase = createClient();

    try {
      // 1. Ambil ID semua Bab (chapters) milik kursus ini
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id")
        .eq("course_id", id);

      const deleteTasks = [];

      // 2. Jika ada Bab, kumpulkan tugas hapus SEMUA Materi (lessons)
      if (chapters && chapters.length > 0) {
        const chapterIds = chapters.map((c) => c.id);
        deleteTasks.push(
          supabase.from("lessons").delete().in("chapter_id", chapterIds),
        );
      }

      // 3. Masukkan tugas hapus lainnya secara BERSAMAAN (Paralel agar tidak lemot!)
      deleteTasks.push(
        supabase.from("chapters").delete().eq("course_id", id),
        supabase.from("quizzes").delete().eq("course_id", id),
        supabase.from("enrollments").delete().eq("course_id", id),
      );

      // JALANKAN SEMUA TUGAS HAPUS ANAKNYA SERENTAK!
      await Promise.all(deleteTasks);

      // 4. Terakhir, setelah semua "Anaknya" bersih, baru kita hapus "Induk" Kursusnya!
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) {
        Swal.fire("Gagal", error.message, "error");
        return false;
      }

      Toast.fire({
        icon: "success",
        title: "Kursus dihapus!",
      });
      return true;
    } catch (err: any) {
      Swal.fire("Error System", err.message, "error");
      return false;
    }
  },

  // ─── CHAPTERS (MATERI) ───
  async saveChapter(
    form: any,
    courseId: string | number,
    chapterId: number | string | null,
  ) {
    const supabase = createClient();
    const payload = {
      course_id: courseId,
      title: form.title,
      description: form.description,
      type: form.type,
      order_index: form.order || 1,
    };

    const { error } = chapterId
      ? await supabase.from("chapters").update(payload).eq("id", chapterId)
      : await supabase.from("chapters").insert([payload]);

    if (error) {
      Swal.fire("Gagal", error.message, "error");
      return false;
    }
    Toast.fire({ icon: "success", title: "Bab disimpan" });
    return true;
  },

  async deleteChapter(id: number | string) {
    const supabase = createClient();
    const { error } = await supabase.from("chapters").delete().eq("id", id);
    if (error) Swal.fire("Gagal", error.message, "error");
  },

  // ─── LESSONS (SUB-MATERI) ───
  async saveLesson(
    form: any,
    chapterId: string | number,
    lessonId: number | string | null,
  ) {
    const supabase = createClient();
    const payload = {
      chapter_id: chapterId,
      title: form.title,
      duration: form.duration,
      content: form.content,
      order_index: form.order || 1,
    };

    const { error } = lessonId
      ? await supabase.from("lessons").update(payload).eq("id", lessonId)
      : await supabase.from("lessons").insert([payload]);

    if (error) {
      Swal.fire("Gagal", error.message, "error");
      return false;
    }
    Toast.fire({ icon: "success", title: "Pelajaran disimpan" });
    return true;
  },

  async deleteLesson(id: number | string) {
    const supabase = createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) Swal.fire("Gagal", error.message, "error");
  },

  // ─── QUIZ ───
  async saveQuiz(payload: any) {
    const supabase = createClient();
    const { error } = await supabase.from("quizzes").insert([payload]);
    if (error) {
      Swal.fire("Gagal", error.message, "error");
      return false;
    }
    Toast.fire({ icon: "success", title: "Pertanyaan ditambahkan" });
    return true;
  },

  async deleteQuiz(id: number | string) {
    const supabase = createClient();
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) Swal.fire("Gagal", error.message, "error");
  },
};
