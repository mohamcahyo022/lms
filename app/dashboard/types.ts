export interface SubMaterial {
  id: number;
  title: string;
  order: number;
  content: string;
  imageUrl?: string;
  videoTitle?: string;
  duration?: string;
}

export interface Material {
  id: number;
  title: string;
  order: number;
  type: "lesson" | "exercise" | "quiz";
  description: string;
  subMaterials: SubMaterial[];
}

export interface QuizQ {
  id: number;
  question: string;
  options: string[];
  correct: number;
  correct_index?: number;
}

export interface Course {
  id: number;
  title: string;
  category: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Draft" | "Published";
  description: string;
  color: string;
  icon: string;
  totalStudents: number;
  rating: number;
  duration: string;
  couponCode: string;
  coupon_code?: string;
  materials: Material[];
  preTest: QuizQ[];
  postTest: QuizQ[];
}

export type View =
  | "home"
  | "student-catalogue"
  | "student-detail"
  | "student-study"
  | "teacher"
  | "live-coding"
  | "mini-game"
  | "analytics"
  | "discussion"
  | "ai-assistant";

export type TeacherStep = "courses" | "materials" | "editor";
export type StudyPhase = "pretest" | "learning" | "posttest" | "completed";
