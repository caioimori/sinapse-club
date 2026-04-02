import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Cursos" };

// ═══════════════════════════════════════════════════════════
// Data
// ═══════════════════════════════════════════════════════════

const SECTIONS = [
  {
    title: "Fundamentos de AI",
    courses: [
      { id: "1", module: "MODULO 01", lessons: "12 AULAS", title: "INTRO A INTELIGENCIA ARTIFICIAL", subtitle: "CONCEITOS FUNDAMENTAIS", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
      { id: "2", module: "MODULO 02", lessons: "08 AULAS", title: "MACHINE LEARNING NA PRATICA", subtitle: "ALGORITMOS E MODELOS", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
      { id: "3", module: "MODULO 03", lessons: "15 AULAS", title: "DEEP LEARNING", subtitle: "REDES NEURAIS", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
      { id: "4", module: "MODULO 04", lessons: "10 AULAS", title: "NLP E TRANSFORMERS", subtitle: "PROCESSAMENTO DE LINGUAGEM", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
      { id: "5", module: "MODULO 05", lessons: "06 AULAS", title: "COMPUTER VISION", subtitle: "VISAO COMPUTACIONAL", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
    ],
  },
  {
    title: "LLMs & Prompt Engineering",
    courses: [
      { id: "6", module: "MODULO 01", lessons: "20 AULAS", title: "DOMINANDO O CHATGPT", subtitle: "DO BASICO AO AVANCADO", progress: 0, color: "bg-zinc-200 dark:bg-zinc-700" },
      { id: "7", module: "MODULO 02", lessons: "14 AULAS", title: "CLAUDE CODE MASTERCLASS", subtitle: "AUTOMACAO COM AI", progress: 0, color: "bg-zinc-200 dark:bg-zinc-700" },
      { id: "8", module: "MODULO 03", lessons: "09 AULAS", title: "PROMPT ENGINEERING", subtitle: "TECNICAS AVANCADAS", progress: 0, color: "bg-zinc-200 dark:bg-zinc-700" },
      { id: "9", module: "MODULO 04", lessons: "11 AULAS", title: "AI AGENTS", subtitle: "AGENTES AUTONOMOS", progress: 0, color: "bg-zinc-200 dark:bg-zinc-700" },
      { id: "10", module: "MODULO EXTRA", lessons: "05 AULAS", title: "MCP SERVERS", subtitle: "MODEL CONTEXT PROTOCOL", progress: 0, color: "bg-zinc-200 dark:bg-zinc-700" },
    ],
  },
  {
    title: "Coding & Tools",
    courses: [
      { id: "11", module: "MODULO 01", lessons: "16 AULAS", title: "PYTHON PARA AI", subtitle: "LINGUAGEM BASE", progress: 0, color: "bg-zinc-50 dark:bg-zinc-900 border border-border" },
      { id: "12", module: "MODULO 02", lessons: "12 AULAS", title: "LANGCHAIN & LLAMAINDEX", subtitle: "FRAMEWORKS DE LLM", progress: 0, color: "bg-zinc-50 dark:bg-zinc-900 border border-border" },
      { id: "13", module: "MODULO 03", lessons: "08 AULAS", title: "VECTOR DATABASES", subtitle: "RAG E EMBEDDINGS", progress: 0, color: "bg-zinc-50 dark:bg-zinc-900 border border-border" },
      { id: "14", module: "BONUS", lessons: "04 AULAS", title: "DEPLOY DE MODELOS", subtitle: "PRODUCAO E ESCALA", progress: 0, color: "bg-zinc-50 dark:bg-zinc-900 border border-border" },
    ],
  },
  {
    title: "Eventos & Workshops",
    courses: [
      { id: "15", module: "WORKSHOP", lessons: "EDICAO 03", title: "AI LAB 3: PROJETO SYNTH", subtitle: "PROJETO REAL", progress: undefined, color: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" },
      { id: "16", module: "WORKSHOP", lessons: "EDICAO 02", title: "AI LAB 2: PROJETO ATLAS", subtitle: "PROJETO REAL", progress: undefined, color: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" },
      { id: "17", module: "WORKSHOP", lessons: "EDICAO 01", title: "AI LAB 1: PROJETO NOVA", subtitle: "PROJETO REAL", progress: undefined, color: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900" },
    ],
  },
  {
    title: "Bonus",
    courses: [
      { id: "18", module: "BONUS", lessons: "09 AULAS", title: "CRIANDO SAAS COM AI", subtitle: "RAFAEL OLIVEIRA", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
      { id: "19", module: "BONUS", lessons: "06 AULAS", title: "AI PARA DESIGNERS", subtitle: "MARIA SANTOS", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
      { id: "20", module: "BONUS", lessons: "03 AULAS", title: "ETICA EM AI", subtitle: "ANA COSTA", progress: 0, color: "bg-zinc-100 dark:bg-zinc-800" },
    ],
  },
];

type Course = (typeof SECTIONS)[0]["courses"][0];

// ═══════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block shrink-0 cursor-pointer"
      style={{ width: 260 }}
    >
      <div
        className={`relative h-[340px] rounded-xl overflow-hidden ${course.color} transition-transform group-hover:scale-[1.02]`}
      >
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {course.module}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {course.lessons}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`h-24 w-24 rounded-full border-2 ${
              course.color.includes("text-white")
                ? "border-white/30"
                : "border-foreground/10"
            } flex items-center justify-center`}
          >
            <div
              className={`h-16 w-16 rounded-full ${
                course.color.includes("text-white")
                  ? "bg-white/10"
                  : "bg-foreground/5"
              }`}
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 space-y-1">
          <h3 className="text-sm font-extrabold leading-tight tracking-tight">
            {course.title}
          </h3>
          <p className="text-[11px] font-medium uppercase tracking-wider opacity-60">
            {course.subtitle}
          </p>
        </div>

        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-foreground/10">
            <div
              className="h-full bg-foreground transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}

function CourseCarousel({ section }: { section: (typeof SECTIONS)[0] }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{section.title}</h2>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {section.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-8 md:p-10 space-y-4">
            <Badge variant="outline" className="text-xs font-medium">
              Novo
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
              AI Agents Masterclass
            </h1>
            <p className="text-muted-foreground max-w-md">
              Aprenda a construir agentes autonomos com Claude Code, MCP Servers
              e frameworks modernos. Do conceito ao deploy.
            </p>
            <Button className="rounded-full px-6">Comecar agora</Button>
          </div>
          <div className="hidden md:flex items-center justify-center w-80 bg-foreground/5">
            <div className="h-32 w-32 rounded-full border-2 border-foreground/10 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-foreground/5" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 pb-4">
          <div className="h-2 w-2 rounded-full bg-foreground" />
          <div className="h-2 w-2 rounded-full bg-foreground/20" />
          <div className="h-2 w-2 rounded-full bg-foreground/20" />
        </div>
      </div>

      {/* Course Sections (Netflix Carousels) */}
      {SECTIONS.map((section) => (
        <CourseCarousel key={section.title} section={section} />
      ))}
    </div>
  );
}
