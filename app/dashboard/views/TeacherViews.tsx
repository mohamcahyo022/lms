"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Check,
  Loader2,
  FileText,
  Clock,
  AlertCircle,
  ImageIcon,
  UploadCloud,
} from "lucide-react";
import { Course, Material, TeacherStep } from "../types";
import {
  Badge,
  Btn,
  F,
  Modal,
  Field,
  FInput,
  FArea,
  FSelect,
  RichEditor,
  RichContent,
  LEVEL_CLR,
} from "../components/SharedUI";
import { LogicTeacher } from "../LogicTeacher";
import { createClient } from "@/lib/supabase/browser";

// Komponen Pembantu untuk menampilkan pesan error berwarna merah
const ErrorMsg = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium"
    >
      <AlertCircle size={12} /> {msg}
    </motion.div>
  );
};

// ─── STEP 1: KURSUS ───
// ─── FUNGSI KOMPRES GAMBAR (Tanpa Library Tambahan) ───
const compressImage = (file: File, maxSizeMB: number = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxDimension = 1200; // Maksimal resolusi 1200px

        if (width > height && width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Kompres ke format JPEG dengan kualitas 70% agar ukurannya di bawah 1MB
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                },
              );
              resolve(newFile);
            } else {
              reject(new Error("Kompresi gagal"));
            }
          },
          "image/jpeg",
          0.7,
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

// ─── STEP 1: KURSUS ───
const Step1 = ({ courses, setTCourse, setTStep, loadData }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [delId, setDelId] = useState<number | string | null>(null);
  const [statusCourse, setStatusCourse] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // State khusus Gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    category: "",
    instructor: "",
    level: "Beginner" as Course["level"],
    description: "",
    couponCode: "",
    duration: "",
    totalStudents: 0,
    rating: 0,
    image_url: "", // Tambahan kolom image
  });

  const openAdd = () => {
    setForm({
      title: "",
      category: "",
      instructor: "",
      level: "Beginner",
      description: "",
      couponCode: "",
      duration: "",
      totalStudents: 0,
      rating: 0,
      image_url: "",
    });
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (c: any) => {
    setForm({
      title: c.title || "",
      category: c.category || "",
      instructor: c.instructor || "",
      level: c.level || "Beginner",
      description: c.description || "",
      couponCode: c.coupon_code || c.couponCode || "",
      duration: c.duration || "",
      totalStudents: c.total_students || c.totalStudents || 0,
      rating: c.rating || 0,
      image_url: c.image_url || c.imageUrl || "",
    });
    setEditId(c.id);
    setImageFile(null);
    setImagePreview(c.image_url || c.imageUrl || null); // Tampilkan gambar lama jika ada
    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.title.trim()) err.title = "Judul kursus wajib diisi";
    if (!form.category.trim()) err.category = "Kategori wajib diisi";
    if (!form.instructor.trim()) err.instructor = "Nama instruktur wajib diisi";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Fungsi Handle Upload & Kompresi Gambar
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "File harus berupa gambar (JPG/PNG)" });
      return;
    }

    // Munculkan preview sementara secepat kilat
    setImagePreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: "" });

    // Kompres gambar jika ukurannya lebih dari 1MB (1024 * 1024 bytes)
    let finalFile = file;
    if (file.size > 1024 * 1024) {
      finalFile = await compressImage(file);
    }
    setImageFile(finalFile);
  };

  const save = async () => {
    if (!validate()) return;
    setIsSaving(true);

    let uploadedImageUrl = form.image_url;

    // JIKA ADA FILE GAMBAR BARU, UPLOAD KE SUPABASE STORAGE
    if (imageFile) {
      try {
        const supabase = createClient();
        const fileExt = "jpg"; // Karena hasil kompresi kita adalah JPG
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload ke bucket bernama 'courses'
        const { data, error } = await supabase.storage
          .from("foto_course") // Pastikan bucket ini sudah kamu buat!
          .upload(`images/${fileName}`, imageFile);

        if (error) throw error;

        // Ambil URL Publik untuk disimpan ke Database
        const { data: publicUrlData } = supabase.storage
          .from("foto_course")
          .getPublicUrl(`images/${fileName}`);

        uploadedImageUrl = publicUrlData.publicUrl;
      } catch (err: any) {
        setErrors({ ...errors, image: `Gagal upload gambar: ${err.message}` });
        setIsSaving(false);
        return; // Hentikan penyimpanan jika upload gagal
      }
    }

    // Gabungkan URL gambar ke dalam payload database
    const payload = { ...form, image_url: uploadedImageUrl };
    const success = await LogicTeacher.saveCourse(payload, editId);

    if (success) {
      setShowForm(false);
      await loadData();
    }
    setIsSaving(false);
  };

  const confirmToggleStatus = async () => {
    if (!statusCourse) return;
    await LogicTeacher.toggleCourseStatus(statusCourse.id, statusCourse.status);
    setStatusCourse(null);
    await loadData();
  };

  const confirmDel = async () => {
    if (!delId) return;
    const success = await LogicTeacher.deleteCourse(delId);
    if (success) {
      setDelId(null);
      await loadData();
    }
  };

  if (showForm) {
    return (
      <div style={{ fontFamily: F }}>
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 cursor-pointer"
        >
          <ChevronLeft size={15} /> Back to Courses
        </button>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            {editId ? "Edit Course" : "Create New Course"}
          </h3>
          <div className="space-y-4">
            {/* AREA UPLOAD GAMBAR */}
            <Field label="Course Image / Cover">
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={24} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors rounded-xl cursor-pointer text-sm font-semibold">
                    <UploadCloud size={16} /> Pilih Gambar (Otomatis Kompres
                    &lt; 1MB)
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <ErrorMsg msg={errors.image} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Title" required>
                <FInput
                  value={form.title}
                  onChange={(v) => {
                    setForm({ ...form, title: v });
                    setErrors({ ...errors, title: "" });
                  }}
                  placeholder="e.g. AWS Solutions Architect"
                />
                <ErrorMsg msg={errors.title} />
              </Field>
              <Field label="Category" required>
                <FInput
                  value={form.category}
                  onChange={(v) => {
                    setForm({ ...form, category: v });
                    setErrors({ ...errors, category: "" });
                  }}
                  placeholder="e.g. Cloud Computing"
                />
                <ErrorMsg msg={errors.category} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Instructor" required>
                <FInput
                  value={form.instructor}
                  onChange={(v) => {
                    setForm({ ...form, instructor: v });
                    setErrors({ ...errors, instructor: "" });
                  }}
                  placeholder="e.g. Dr. Sarah Mitchell"
                />
                <ErrorMsg msg={errors.instructor} />
              </Field>
              <Field label="Level">
                <FSelect
                  value={form.level}
                  onChange={(v) => setForm({ ...form, level: v as any })}
                  options={["Beginner", "Intermediate", "Advanced"]}
                />
              </Field>
            </div>
            <Field label="Coupon Code">
              <FInput
                value={form.couponCode}
                onChange={(v) => setForm({ ...form, couponCode: v })}
                placeholder="e.g. EDU2026"
              />
            </Field>
            <Field label="Description">
              <FArea
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                placeholder="What will students learn?"
                rows={3}
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <Btn
                variant="secondary"
                onClick={() => setShowForm(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Btn>
              <Btn onClick={save} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : editId ? (
                  "Save Changes"
                ) : (
                  "Create Course"
                )}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">All Courses</h2>
          <p className="text-sm text-slate-500">
            {courses.length} total ·{" "}
            {courses.filter((c: any) => c.status === "Published").length}{" "}
            published
          </p>
        </div>
        <Btn onClick={openAdd}>
          <Plus size={15} /> Add Course
        </Btn>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Course",
                  "Category",
                  "Instructor",
                  "Level",
                  "Status",
                  "Chapters",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c: any) => (
                <motion.tr
                  key={c.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Kolom Judul & Gambar bersandingan */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
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
                      <span className="text-sm font-semibold">{c.title}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <Badge label={c.category} color={c.color} sm />
                  </td>
                  <td className="px-4 py-3 text-xs">{c.instructor}</td>
                  <td className="px-4 py-3">
                    <Badge label={c.level} color={LEVEL_CLR[c.level]} sm />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setStatusCourse(c)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${c.status === "Published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {c.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {c.materials?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setTCourse(c);
                          setTStep("materials");
                        }}
                        className="p-2 hover:text-blue-600 cursor-pointer"
                      >
                        <Layers size={13} />
                      </button>
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 hover:text-orange-600 cursor-pointer"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => setDelId(c.id)}
                        className="p-2 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={statusCourse !== null}
        onClose={() => setStatusCourse(null)}
        title="Ubah Status Kursus?"
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-orange-50 text-orange-500">
            <Check size={24} />
          </div>
          <p className="text-sm mb-5 text-slate-600">
            Yakin ingin mengubah status kursus <br />
            <strong className="text-slate-900">
              {statusCourse?.title}
            </strong>{" "}
            menjadi{" "}
            <strong
              className={
                statusCourse?.status === "Draft"
                  ? "text-green-600"
                  : "text-slate-600"
              }
            >
              {statusCourse?.status === "Draft" ? "Published" : "Draft"}
            </strong>
            ?
          </p>
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              onClick={() => setStatusCourse(null)}
              className="flex-1"
            >
              Batal
            </Btn>
            <Btn onClick={confirmToggleStatus} className="flex-1">
              Ya, Ubah
            </Btn>
          </div>
        </div>
      </Modal>
      <Modal
        open={delId !== null}
        onClose={() => setDelId(null)}
        title="Delete Course?"
      >
        <div className="p-6 text-center">
          <Trash2 size={24} className="mx-auto mb-4 text-red-500" />
          <p className="text-sm mb-5">Hapus kursus ini secara permanen?</p>
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              onClick={() => setDelId(null)}
              className="flex-1"
            >
              Batal
            </Btn>
            <Btn variant="danger" onClick={confirmDel} className="flex-1">
              Hapus
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── STEP 2: BAB & KUIS ───
const Step2 = ({
  courses,
  tCourse,
  setTStep,
  setTCourse,
  setTMaterial,
  loadData,
}: any) => {
  const fresh = courses.find((c: any) => c.id === tCourse?.id) ?? tCourse!;
  const [tab, setTab] = useState<"materials" | "quiz">("materials");
  const [showMatForm, setShowMatForm] = useState(false);
  const [editMatId, setEditMatId] = useState<number | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [delMatId, setDelMatId] = useState<number | string | null>(null);
  const [delQuizId, setDelQuizId] = useState<number | string | null>(null);

  const [matForm, setMatForm] = useState({
    title: "",
    description: "",
    type: "lesson" as Material["type"],
  });
  const [quizForm, setQuizForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    type: "pre" as "pre" | "post",
  });

  // State Errors
  const [matErrors, setMatErrors] = useState<Record<string, string>>({});
  const [quizErrors, setQuizErrors] = useState<Record<string, string>>({});

  const TYPE_CLR: Record<Material["type"], string> = {
    lesson: "#2563EB",
    exercise: "#16A34A",
    quiz: "#9333EA",
  };

  const validateMat = () => {
    const err: Record<string, string> = {};
    if (!matForm.title.trim()) err.title = "Judul bab wajib diisi";
    setMatErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateQuiz = () => {
    const err: Record<string, string> = {};
    if (!quizForm.question.trim()) err.question = "Pertanyaan kuis wajib diisi";
    if (quizForm.options.some((opt) => !opt.trim()))
      err.options = "Semua 4 opsi jawaban harus diisi";
    setQuizErrors(err);
    return Object.keys(err).length === 0;
  };

  const saveMat = async () => {
    if (!validateMat()) return;
    setIsSaving(true);
    const success = await LogicTeacher.saveChapter(
      matForm,
      fresh.id,
      editMatId,
    );
    if (success) {
      setShowMatForm(false);
      await loadData();
    }
    setIsSaving(false);
  };

  const confirmDelMat = async () => {
    if (!delMatId) return;
    await LogicTeacher.deleteChapter(delMatId);
    setDelMatId(null);
    await loadData();
  };

  const openAddChapter = () => {
    setMatForm({ title: "", description: "", type: "lesson" });
    setEditMatId(null);
    setMatErrors({});
    setShowMatForm(true);
  };
  const openEditChapter = (mat: any) => {
    setMatForm({
      title: mat.title || "",
      description: mat.description || "",
      type: mat.type || "lesson",
    });
    setEditMatId(mat.id);
    setMatErrors({});
    setShowMatForm(true);
  };

  const addQuizQ = async () => {
    if (!validateQuiz()) return;
    const payload = {
      course_id: fresh.id,
      question: quizForm.question,
      options: quizForm.options,
      correct_index: quizForm.correct,
      quiz_type: quizForm.type,
    };
    const success = await LogicTeacher.saveQuiz(payload);
    if (success) {
      setQuizForm({
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        type: "pre",
      });
      setQuizErrors({});
      await loadData();
    }
  };

  const confirmDelQuiz = async () => {
    if (!delQuizId) return;
    await LogicTeacher.deleteQuiz(delQuizId);
    setDelQuizId(null);
    await loadData();
  };

  if (showMatForm) {
    return (
      <div style={{ fontFamily: F }}>
        <button
          onClick={() => setShowMatForm(false)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 cursor-pointer"
        >
          <ChevronLeft size={15} /> Back to Materials
        </button>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl">
          <h3 className="font-bold text-slate-900 mb-5">
            {editMatId ? "Edit Chapter" : "Add Chapter"}
          </h3>
          <div className="space-y-4">
            <Field label="Title" required>
              <FInput
                value={matForm.title}
                onChange={(v) => {
                  setMatForm({ ...matForm, title: v });
                  setMatErrors({ ...matErrors, title: "" });
                }}
                placeholder="e.g. AWS Foundations"
              />
              <ErrorMsg msg={matErrors.title} />
            </Field>
            <Field label="Type">
              <div className="flex gap-2">
                {(["lesson", "exercise", "quiz"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setMatForm({ ...matForm, type: t })}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize cursor-pointer"
                    style={{
                      background: matForm.type === t ? TYPE_CLR[t] : "white",
                      color: matForm.type === t ? "white" : "#64748B",
                      borderColor: matForm.type === t ? TYPE_CLR[t] : "#E2E8F0",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Description">
              <FArea
                value={matForm.description}
                onChange={(v) => setMatForm({ ...matForm, description: v })}
                placeholder="What's covered?"
                rows={3}
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <Btn
                variant="secondary"
                onClick={() => setShowMatForm(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Btn>
              <Btn onClick={saveMat} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : editMatId ? (
                  "Save Changes"
                ) : (
                  "Add Chapter"
                )}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F }}>
      <button
        onClick={() => {
          setTStep("courses");
          setTCourse(null);
        }}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-1 transition-colors cursor-pointer"
      >
        <ChevronLeft size={15} /> All Courses
      </button>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {fresh.title}
          </h2>
          <p className="text-sm text-slate-500">
            {fresh.materials?.length || 0} chapters · Content Management
          </p>
        </div>
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {(["materials", "quiz"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-sm font-semibold capitalize cursor-pointer"
            style={{
              background: tab === t ? "white" : "transparent",
              color: tab === t ? "#0F172A" : "#64748B",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t === "materials" ? "Materials" : "Quiz Bank"}
          </button>
        ))}
      </div>

      {tab === "materials" && (
        <div>
          <div className="flex justify-end mb-4">
            <Btn onClick={openAddChapter}>
              <Plus size={15} /> Add Chapter
            </Btn>
          </div>
          {!fresh.materials || fresh.materials.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
              <Layers size={36} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No chapters yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fresh.materials.map((mat: any, i: number) => (
                <motion.div
                  key={mat.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{
                      background:
                        TYPE_CLR[mat.type as keyof typeof TYPE_CLR] ||
                        "#FF8C00",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900 text-sm">
                        {mat.title}
                      </span>
                      <Badge
                        label={mat.type}
                        color={TYPE_CLR[mat.type as keyof typeof TYPE_CLR]}
                        sm
                      />
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {mat.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {mat.subMaterials?.length || 0} lessons
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Btn
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTMaterial(mat);
                        setTStep("editor");
                      }}
                    >
                      <FileText size={13} /> Lessons
                    </Btn>
                    <button
                      onClick={() => openEditChapter(mat)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDelMatId(mat.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "quiz" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Add Quiz Question</h3>
            <div className="space-y-4">
              <Field label="Question Type">
                <div className="flex gap-2">
                  {(["pre", "post"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuizForm({ ...quizForm, type: t })}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                      style={{
                        background: quizForm.type === t ? "#FF8C00" : "white",
                        color: quizForm.type === t ? "white" : "#64748B",
                        borderColor:
                          quizForm.type === t ? "#FF8C00" : "#E2E8F0",
                      }}
                    >
                      {t === "pre" ? "Pre-Test" : "Post-Test"}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Question" required>
                <FInput
                  value={quizForm.question}
                  onChange={(v) => {
                    setQuizForm({ ...quizForm, question: v });
                    setQuizErrors({ ...quizErrors, question: "" });
                  }}
                  placeholder="Enter the question…"
                />
                <ErrorMsg msg={quizErrors.question} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                {quizForm.options.map((opt, i) => (
                  <Field
                    key={i}
                    label={`Option ${String.fromCharCode(65 + i)}${quizForm.correct === i ? " ✓ correct" : ""}`}
                  >
                    <div className="flex gap-2">
                      <FInput
                        value={opt}
                        onChange={(v) => {
                          const o = [...quizForm.options];
                          o[i] = v;
                          setQuizForm({ ...quizForm, options: o });
                          setQuizErrors({ ...quizErrors, options: "" });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      />
                      <button
                        onClick={() => setQuizForm({ ...quizForm, correct: i })}
                        className="w-9 h-[42px] flex items-center justify-center rounded-xl border transition-colors shrink-0 cursor-pointer"
                        style={{
                          borderColor:
                            quizForm.correct === i ? "#16A34A" : "#E2E8F0",
                          background:
                            quizForm.correct === i ? "#F0FDF4" : "white",
                        }}
                      >
                        <Check
                          size={13}
                          color={quizForm.correct === i ? "#16A34A" : "#CBD5E1"}
                        />
                      </button>
                    </div>
                  </Field>
                ))}
              </div>
              <ErrorMsg msg={quizErrors.options} />
              <Btn onClick={addQuizQ} disabled={isSaving}>
                <Plus size={14} /> Add Question
              </Btn>
            </div>
          </div>

          {(["pre", "post"] as const).map((type) => {
            const list =
              type === "pre" ? fresh.preTest || [] : fresh.postTest || [];
            return (
              <div key={type}>
                <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Badge
                    label={type === "pre" ? "Pre-Test" : "Post-Test"}
                    color={type === "pre" ? "#2563EB" : "#9333EA"}
                  />
                  {list.length} questions
                </h3>
                {list.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center bg-white border border-slate-200 rounded-xl">
                    No questions yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {list.map((q: any, i: number) => (
                      <div
                        key={q.id}
                        className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3"
                      >
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{
                            background: type === "pre" ? "#2563EB" : "#9333EA",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 mb-1">
                            {q.question}
                          </p>
                          <p className="text-xs text-slate-400">
                            Correct:{" "}
                            <span className="text-green-600 font-semibold">
                              {q.options[q.correct_index ?? q.correct ?? 0]}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => setDelQuizId(q.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={delMatId !== null}
        onClose={() => setDelMatId(null)}
        title="Hapus Bab?"
      >
        <div className="p-6 text-center">
          <Trash2 size={24} className="mx-auto mb-4 text-red-500" />
          <p className="text-sm mb-5">
            Hapus Bab ini beserta seluruh materi di dalamnya?
          </p>
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              onClick={() => setDelMatId(null)}
              className="flex-1"
            >
              Batal
            </Btn>
            <Btn variant="danger" onClick={confirmDelMat} className="flex-1">
              Hapus
            </Btn>
          </div>
        </div>
      </Modal>
      <Modal
        open={delQuizId !== null}
        onClose={() => setDelQuizId(null)}
        title="Hapus Soal Kuis?"
      >
        <div className="p-6 text-center">
          <Trash2 size={24} className="mx-auto mb-4 text-red-500" />
          <p className="text-sm mb-5">Yakin ingin menghapus soal ini?</p>
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              onClick={() => setDelQuizId(null)}
              className="flex-1"
            >
              Batal
            </Btn>
            <Btn variant="danger" onClick={confirmDelQuiz} className="flex-1">
              Hapus
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── STEP 3: MATERI LESSON ───
const Step3 = ({
  courses,
  tCourse,
  tMaterial,
  setTStep,
  setTMaterial,
  loadData,
}: any) => {
  const freshCourse =
    courses.find((c: any) => c.id === tCourse?.id) ?? tCourse!;
  const freshMaterial =
    freshCourse.materials?.find((m: any) => m.id === tMaterial?.id) ??
    tMaterial!;
  const [showForm, setShowForm] = useState(false);
  const [editSubId, setEditSubId] = useState<number | string | null>(null);
  const [previewId, setPreviewId] = useState<number | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteSubId, setDeleteSubId] = useState<number | string | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "<p>Start writing your lesson content here…</p>",
    duration: "",
  });

  // State Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSub = () => {
    const err: Record<string, string> = {};
    if (!form.title.trim()) err.title = "Judul pelajaran wajib diisi";

    if (!form.duration.trim()) {
      err.duration = "Durasi pelajaran wajib di isi";
    } else if (!/^\d+$/.test(form.duration.trim())) {
      err.duration = "Hanya boleh di isi angka (contoh: 20)";
    }
    // Cek apakah konten kosong (hanya tag html tanpa text atau gambar)
    const plainText = form.content.replace(/<[^>]+>/g, "").trim();
    if (
      !plainText &&
      !form.content.includes("<img") &&
      !form.content.includes("<iframe")
    ) {
      err.content = "Konten pelajaran tidak boleh kosong";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const openAddSub = () => {
    setForm({ title: "", content: "<p>Start writing…</p>", duration: "" });
    setEditSubId(null);
    setErrors({});
    setShowForm(true);
  };
  const openEditSub = (s: any) => {
    setForm({
      title: s.title || "",
      content: s.content || "",
      duration: s.duration || "",
    });
    setEditSubId(s.id);
    setErrors({});
    setShowForm(true);
  };

  const saveSub = async () => {
    if (!validateSub()) return;
    setIsSaving(true);
    const success = await LogicTeacher.saveLesson(
      form,
      freshMaterial.id,
      editSubId,
    );
    if (success) {
      setShowForm(false);
      await loadData();
    }
    setIsSaving(false);
  };

  const confirmDelSub = async () => {
    if (!deleteSubId) return;
    await LogicTeacher.deleteLesson(deleteSubId);
    setDeleteSubId(null);
    await loadData();
  };
  const prevSub = freshMaterial.subMaterials?.find(
    (s: any) => s.id === previewId,
  );

  if (showForm) {
    return (
      <div style={{ fontFamily: F }}>
        <button
          onClick={() => setShowForm(false)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors cursor-pointer"
        >
          <ChevronLeft size={15} /> Back to Lessons
        </button>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-6">
            {editSubId ? "Edit Lesson" : "Create New Lesson"}
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Lesson Title" required>
                <FInput
                  value={form.title}
                  onChange={(v) => {
                    setForm({ ...form, title: v });
                    setErrors({ ...errors, title: "" });
                  }}
                  placeholder="e.g. Introduction to Cloud Computing"
                />
                <ErrorMsg msg={errors.title} />
              </Field>
              <Field label="Duration" required>
                <FInput
                  value={form.duration}
                  onChange={(v) => {
                    setForm({ ...form, duration: v });
                    setErrors({ ...errors, duration: "" });
                  }}
                  placeholder="e.g. 15"
                />
                <ErrorMsg msg={errors.duration} />
              </Field>
            </div>
            <Field label="Lesson Content (Rich Text)" required>
              <div className="text-xs text-slate-500 mb-2">
                Tips: You can embed images or YouTube videos directly into the
                editor below.
              </div>
              <div
                className={
                  errors.content ? "border border-red-500 rounded-xl" : ""
                }
              >
                <RichEditor
                  value={form.content}
                  onChange={(v) => {
                    setForm({ ...form, content: v });
                    setErrors({ ...errors, content: "" });
                  }}
                />
              </div>
              <ErrorMsg msg={errors.content} />
            </Field>
            <div className="flex gap-3 pt-2">
              <Btn
                variant="secondary"
                onClick={() => setShowForm(false)}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Btn>
              <Btn onClick={saveSub} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : editSubId ? (
                  "Save Changes"
                ) : (
                  "Create Lesson"
                )}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: F }}>
      <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-1">
        <button
          onClick={() => {
            setTStep("courses");
            setTCourse(null);
            setTMaterial(null);
          }}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          Courses
        </button>
        <ChevronRight size={12} />
        <button
          onClick={() => {
            setTStep("materials");
            setTMaterial(null);
          }}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          {freshCourse.title}
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-900 font-semibold">
          {freshMaterial.title}
        </span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {freshMaterial.title}
          </h2>
          <p className="text-sm text-slate-500">
            {freshMaterial.subMaterials?.length || 0} lessons
          </p>
        </div>
        <Btn onClick={openAddSub}>
          <Plus size={15} /> Add Lesson
        </Btn>
      </div>

      {!freshMaterial.subMaterials ||
      freshMaterial.subMaterials.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <FileText size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No lessons yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {freshMaterial.subMaterials.map((sub: any, i: number) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-sm mb-0.5 truncate">
                  {sub.title}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {sub.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {sub.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FileText size={10} />
                    Rich Content
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewId(sub.id)}
                >
                  Preview
                </Btn>
                <button
                  onClick={() => openEditSub(sub)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setDeleteSubId(sub.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <Modal
        open={!!prevSub}
        onClose={() => setPreviewId(null)}
        title={`Preview: ${prevSub?.title}`}
        wide
      >
        {prevSub && (
          <div className="p-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <RichContent html={prevSub.content} />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={deleteSubId !== null}
        onClose={() => setDeleteSubId(null)}
        title="Hapus Materi?"
      >
        <div className="p-6 text-center">
          <Trash2 size={24} className="mx-auto mb-4 text-red-500" />
          <p className="text-sm mb-5">
            Yakin ingin menghapus materi pelajaran ini?
          </p>
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              onClick={() => setDeleteSubId(null)}
              className="flex-1"
            >
              Batal
            </Btn>
            <Btn variant="danger" onClick={confirmDelSub} className="flex-1">
              Hapus
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const TeacherPanelView = (props: any) => {
  return (
    <div style={{ fontFamily: F }}>
      {props.tStep === "courses" && <Step1 {...props} />}
      {props.tStep === "materials" && <Step2 {...props} />}
      {props.tStep === "editor" && <Step3 {...props} />}
    </div>
  );
};
