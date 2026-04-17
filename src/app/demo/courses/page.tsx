import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Bell, Menu, ChevronLeft, ChevronRight, Trophy,
} from "lucide-react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════

const MOCK_SECTIONS = [
  {
    title: "Fundamentos de AI",
    courses: [
      { id: "1", module: "MODULO 01", lessons: "12 AULAS", title: "INTRO A INTELIGENCIA ARTIFICIAL", subtitle: "CONCEITOS FUNDAMENTAIS", progress: 85, color: "bg-zinc-100" },
      { id: "2", module: "MODULO 02", lessons: "08 AULAS", title: "MACHINE LEARNING NA PRATICA", subtitle: "ALGORITMOS E MODELOS", progress: 60, color: "bg-zinc-100" },
      { id: "3", module: "MODULO 03", lessons: "15 AULAS", title: "DEEP LEARNING", subtitle: "REDES NEURAIS", progress: 30, color: "bg-zinc-100" },
      { id: "4", module: "MODULO 04", lessons: "10 AULAS", title: "NLP E TRANSFORMERS", subtitle: "PROCESSAMENTO DE LINGUAGEM", progress: 0, color: "bg-zinc-100" },
      { id: "5", module: "MODULO 05", lessons: "06 AULAS", title: "COMPUTER VISION", subtitle: "VISAO COMPUTACIONAL", progress: 100, color: "bg-zinc-100" },
    ],
  },
  {
    title: "LLMs & Prompt Engineering",
    courses: [
      { id: "6", module: "MODULO 01", lessons: "20 AULAS", title: "DOMINANDO O CHATGPT", subtitle: "DO BASICO AO AVANCADO", progress: 100, color: "bg-zinc-200" },
      { id: "7", module: "MODULO 02", lessons: "14 AULAS", title: "CLAUDE CODE MASTERCLASS", subtitle: "AUTOMACAO COM AI", progress: 75, color: "bg-zinc-200" },
      { id: "8", module: "MODULO 03", lessons: "09 AULAS", title: "PROMPT ENGINEERING", subtitle: "TECNICAS AVANCADAS", progress: 45, color: "bg-zinc-200" },
      { id: "9", module: "MODULO 04", lessons: "11 AULAS", title: "AI AGENTS", subtitle: "AGENTES AUTONOMOS", progress: 0, color: "bg-zinc-200" },
      { id: "10", module: "MODULO EXTRA", lessons: "05 AULAS", title: "MCP SERVERS", subtitle: "MODEL CONTEXT PROTOCOL", progress: 0, color: "bg-zinc-200" },
    ],
  },
  {
    title: "Coding & Tools",
    courses: [
      { id: "11", module: "MODULO 01", lessons: "16 AULAS", title: "PYTHON PARA AI", subtitle: "LINGUAGEM BASE", progress: 100, color: "bg-zinc-50 border border-border" },
      { id: "12", module: "MODULO 02", lessons: "12 AULAS", title: "LANGCHAIN & LLAMAINDEX", subtitle: "FRAMEWORKS DE LLM", progress: 50, color: "bg-zinc-50 border border-border" },
      { id: "13", module: "MODULO 03", lessons: "08 AULAS", title: "VECTOR DATABASES", subtitle: "RAG E EMBEDDINGS", progress: 20, color: "bg-zinc-50 border border-border" },
      { id: "14", module: "BONUS", lessons: "04 AULAS", title: "DEPLOY DE MODELOS", subtitle: "PRODUCAO E ESCALA", progress: 0, color: "bg-zinc-50 border border-border" },
    ],
  },
  {
    title: "Eventos & Workshops",
    courses: [
      { id: "15", module: "WORKSHOP", lessons: "EDICAO 03", title: "AI LAB 3: PROJETO SYNTH", subtitle: "PROJETO REAL", progress: undefined, color: "bg-zinc-800 text-white" },
      { id: "16", module: "WORKSHOP", lessons: "EDICAO 02", title: "AI LAB 2: PROJETO ATLAS", subtitle: "PROJETO REAL", progress: undefined, color: "bg-zinc-800 text-white" },
      { id: "17", module: "WORKSHOP", lessons: "EDICAO 01", title: "AI LAB 1: PROJETO NOVA", subtitle: "PROJETO REAL", progress: undefined, color: "bg-zinc-800 text-white" },
    ],
  },
  {
    title: "Bonus",
    courses: [
      { id: "18", module: "BONUS", lessons: "09 AULAS", title: "CRIANDO SAAS COM AI", subtitle: "DO ZERO AO DEPLOY", progress: 0, color: "bg-zinc-100", instructor: "RAFAEL OLIVEIRA" },
      { id: "19", module: "BONUS", lessons: "06 AULAS", title: "AI PARA DESIGNERS", subtitle: "MIDJOURNEY + DALL-E", progress: 0, color: "bg-zinc-100", instructor: "MARIA SANTOS" },
      { id: "20", module: "BONUS", lessons: "03 AULAS", title: "ETICA EM AI", subtitle: "RESPONSABILIDADE", progress: 0, color: "bg-zinc-100", instructor: "ANA COSTA" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════

function ProgressCircle({ progress, size = 24 }: { progress: number; size?: number }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-border"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-foreground"
      />
    </svg>
  );
}

function CourseCard({ course }: { course: typeof MOCK_SECTIONS[0]["courses"][0] }) {
  return (
    <Link
      href={`/demo/courses/${course.id}`}
      className="group block shrink-0 cursor-pointer"
      style={{ width: 260 }}
    >
      <div className={`relative h-[340px] rounded-xl overflow-hidden ${course.color} transition-transform group-hover:scale-[1.02]`}>
        {/* Top badges */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {course.module}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {course.lessons}
          </span>
        </div>

        {/* Center illustration placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`h-24 w-24 rounded-full border-2 ${course.color.includes("text-white") ? "border-white/30" : "border-foreground/10"} flex items-center justify-center`}>
            <div className={`h-16 w-16 rounded-full ${course.color.includes("text-white") ? "bg-white/10" : "bg-foreground/5"}`} />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-1">
          <h3 className="text-sm font-extrabold leading-tight tracking-tight">
            {course.title}
          </h3>
          <p className="text-[11px] font-medium uppercase tracking-wider opacity-60">
            {(course as any).instructor || course.subtitle}
          </p>
        </div>

        {/* Progress bar at very bottom */}
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

function CourseCarousel({ section }: { section: typeof MOCK_SECTIONS[0] }) {
  // Calculate average progress for courses that have progress
  const coursesWithProgress = section.courses.filter((c) => c.progress !== undefined);
  const avgProgress = coursesWithProgress.length > 0
    ? Math.round(coursesWithProgress.reduce((sum, c) => sum + (c.progress || 0), 0) / coursesWithProgress.length)
    : undefined;

  return (
    <section className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">{section.title}</h2>
          {avgProgress !== undefined && (
            <ProgressCircle progress={avgProgress} />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex gap-4 overflow-x-auto px-6 lg:px-10 pb-2 scrollbar-hide">
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

export const metadata = { title: "Cursos Demo — sinapse.club" };

export default function DemoCoursesPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* ═══ TOPBAR ═══ */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6 lg:px-10 shrink-0">
        <Link href="/demo" aria-label="sinapse" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sinapse.svg" alt="sinapse" className="h-6 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              className="w-64 pl-9 bg-muted border-0 rounded-full h-9"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors md:hidden">
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-foreground" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
            C
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero Banner */}
        <div className="relative mx-6 lg:mx-10 mt-6 mb-8 overflow-hidden rounded-2xl border border-border bg-muted">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 md:p-10 space-y-4">
              <Badge variant="outline" className="text-xs font-medium">
                Novo
              </Badge>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
                AI Agents Masterclass
              </h1>
              <p className="text-muted-foreground max-w-md">
                Aprenda a construir agentes autonomos com Claude Code, MCP Servers e
                frameworks modernos. Do conceito ao deploy.
              </p>
              <Button className="rounded-full px-6">
                Comecar agora
              </Button>
            </div>
            <div className="hidden md:flex items-center justify-center w-80 bg-foreground/5">
              <div className="h-32 w-32 rounded-full border-2 border-foreground/10 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-foreground/5" />
              </div>
            </div>
          </div>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-foreground" />
            <div className="h-2 w-2 rounded-full bg-foreground/20" />
            <div className="h-2 w-2 rounded-full bg-foreground/20" />
          </div>
        </div>

        {/* Course Sections (Netflix Carousels) */}
        <div className="space-y-8 pb-10">
          {MOCK_SECTIONS.map((section) => (
            <CourseCarousel key={section.title} section={section} />
          ))}
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Copyright &copy; 2026 sinapse.club. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
}
