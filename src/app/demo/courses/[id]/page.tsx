import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown, ChevronUp, Check, Circle, ThumbsUp, ThumbsDown,
  ArrowRight, Globe, Play, Send, ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════

const MOCK_COURSE = {
  title: "LLMs & Prompt Engineering",
  modules: [
    {
      id: "m1",
      title: "Comece por aqui.",
      lessons: [
        { id: "l1", title: "Sobre o curso.", completed: true },
        { id: "l2", title: "O que voce vai aprender.", completed: true },
        { id: "l3", title: "Configurando o ambiente.", completed: true },
        { id: "l4", title: "Comunidade de alunos.", completed: false },
        { id: "l5", title: "Termo de uso.", completed: true },
      ],
    },
    {
      id: "m2",
      title: "1. Fundamentos de LLMs.",
      lessonsCount: 11,
      lessons: [
        { id: "l6", title: "O que sao LLMs?", completed: true },
        { id: "l7", title: "Tokens e tokenizacao.", completed: true },
        { id: "l8", title: "Context window.", completed: true },
        { id: "l9", title: "Temperature e top-p.", completed: false },
        { id: "l10", title: "System prompts.", completed: false },
        { id: "l11", title: "Few-shot learning.", completed: false },
        { id: "l12", title: "Chain of thought.", completed: false },
        { id: "l13", title: "Structured outputs.", completed: false },
        { id: "l14", title: "Tool use / Function calling.", completed: false },
        { id: "l15", title: "Streaming.", completed: false },
        { id: "l16", title: "Exercicio pratico.", completed: false },
      ],
    },
    {
      id: "m3",
      title: "2. Prompt Engineering Avancado.",
      lessonsCount: 9,
      lessons: [
        { id: "l17", title: "Meta-prompting.", completed: false },
        { id: "l18", title: "Prompt chaining.", completed: false },
        { id: "l19", title: "Self-consistency.", completed: false },
        { id: "l20", title: "Tree of thought.", completed: false },
        { id: "l21", title: "ReAct pattern.", completed: false },
        { id: "l22", title: "Retrieval augmented generation.", completed: false },
        { id: "l23", title: "Prompt injection defense.", completed: false },
        { id: "l24", title: "Evaluation e benchmarks.", completed: false },
        { id: "l25", title: "Projeto final.", completed: false },
      ],
    },
    {
      id: "m4",
      title: "3. Claude Code na pratica.",
      lessonsCount: 7,
      lessons: [
        { id: "l26", title: "Setup e CLAUDE.md.", completed: false },
        { id: "l27", title: "Workflows de desenvolvimento.", completed: false },
        { id: "l28", title: "MCP Servers.", completed: false },
        { id: "l29", title: "Hooks e automacao.", completed: false },
        { id: "l30", title: "Multi-agent orchestration.", completed: false },
        { id: "l31", title: "Deploy pipeline.", completed: false },
        { id: "l32", title: "Projeto real: SaaS com AI.", completed: false },
      ],
    },
    {
      id: "m5",
      title: "Certificado",
      lessonsCount: 1,
      lessons: [
        { id: "l33", title: "Certificado do curso.", completed: false },
      ],
    },
  ],
};

const CURRENT_LESSON = {
  id: "l9",
  title: "Temperature e top-p.",
  moduleTitle: "1. Fundamentos de LLMs.",
  duration: "12:47",
  description: "Nesta aula voce vai entender como os parametros de temperature e top-p afetam a criatividade e previsibilidade das respostas de um LLM. Vamos explorar quando usar cada configuracao.",
};

const NEXT_LESSON = {
  id: "l10",
  title: "System prompts.",
  module: "MODULO 01 • FUNDAMENTOS",
};

const MOCK_COMMENTS = [
  { name: "Rafael O.", time: "14:23", text: "Excelente explicacao! Agora entendi a diferenca entre temperature 0 e 1. Na pratica, uso 0 para code e 0.7 para texto criativo." },
  { name: "Maria S.", time: "09:15", text: "Dica: no Claude, temperature 1 com top-p 0.9 da resultados incriveis para brainstorming." },
  { name: "Carlos R.", time: "18:40", text: "Professor, existe alguma recomendacao de temperature para RAG applications?" },
  { name: "Ana C.", time: "11:02", text: "Muito claro e direto ao ponto. Melhor explicacao que ja vi sobre o tema." },
];

// ═══════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════

function ProgressCircle({ completed, total, size = 28 }: { completed: number; total: number; size?: number }) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
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
      {progress > 0 && (
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
      )}
    </svg>
  );
}

function ContentSidebar() {
  const allLessons = MOCK_COURSE.modules.flatMap((m) => m.lessons);
  const completed = allLessons.filter((l) => l.completed).length;
  const total = allLessons.length;
  const progressPct = Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      {/* Overall progress */}
      <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
        <ProgressCircle completed={completed} total={total} size={32} />
        <div>
          <p className="text-sm font-semibold">Meu progresso — {progressPct}%</p>
          <p className="text-xs text-muted-foreground">{completed} de {total} aulas</p>
        </div>
      </div>

      {/* Modules */}
      {MOCK_COURSE.modules.map((mod) => {
        const modCompleted = mod.lessons.filter((l) => l.completed).length;
        const modTotal = mod.lessons.length;

        return (
          <div key={mod.id} className="rounded-lg border border-border overflow-hidden">
            {/* Module header */}
            <div className="flex items-center gap-3 p-3 bg-muted/50">
              <ProgressCircle completed={modCompleted} total={modTotal} />
              <div>
                <p className="text-sm font-semibold">{mod.title}</p>
                <p className="text-xs text-muted-foreground">{modTotal} aulas</p>
              </div>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-border/50">
              {mod.lessons.map((lesson, idx) => {
                const isCurrent = lesson.id === CURRENT_LESSON.id;
                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      isCurrent ? "bg-foreground/5 border-l-2 border-l-foreground" : "hover:bg-muted/30"
                    }`}
                  >
                    {lesson.completed ? (
                      <Check className="h-4 w-4 shrink-0 text-foreground" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={isCurrent ? "font-medium" : ""}>
                      {idx + 1}. {lesson.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════

export const metadata = { title: "Aula Demo — sinapse.club" };

export default function DemoLessonPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* ═══ TOPBAR ═══ */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6 shrink-0">
        <Link href="/demo/courses" className="text-xl font-bold">
          sinapse.club
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
            C
          </div>
        </div>
      </header>

      {/* ═══ MAIN ═══ */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Video Player Placeholder */}
          <div className="relative aspect-video bg-zinc-900 flex items-center justify-center">
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                {CURRENT_LESSON.moduleTitle}
              </Badge>
            </div>
            <div className="text-center text-white space-y-4">
              <h2 className="text-3xl font-extrabold">{CURRENT_LESSON.title.replace(".", "")}</h2>
              <button className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                <Play className="h-8 w-8 text-white ml-1" />
              </button>
              <p className="text-sm text-white/60">00:00 / {CURRENT_LESSON.duration}</p>
            </div>
          </div>

          {/* Collapsible content sidebar (mobile) */}
          <details className="lg:hidden border-b border-border">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30">
              <span className="text-sm font-medium">Ver conteudos</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </summary>
            <div className="px-4 pb-4">
              <ContentSidebar />
            </div>
          </details>

          {/* Breadcrumb */}
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/demo/courses" className="hover:text-foreground transition-colors">Inicio</Link>
              <span>&gt;</span>
              <span>{MOCK_COURSE.title}</span>
            </div>
          </div>

          {/* Lesson title & description */}
          <div className="px-6 py-4 space-y-3">
            <h1 className="text-2xl font-bold">{CURRENT_LESSON.title}</h1>
            <p className="text-muted-foreground">{CURRENT_LESSON.description}</p>
          </div>

          {/* Audio version */}
          <div className="px-6 pb-4">
            <p className="text-sm font-semibold mb-2">Aula em formato de audio</p>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shrink-0">
                <Play className="h-4 w-4 ml-0.5" />
              </button>
              <div className="flex-1 h-1 bg-border rounded-full">
                <div className="h-full w-0 bg-foreground rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">0:00 / {CURRENT_LESSON.duration}</span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 py-4">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors">
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors">
              <ThumbsDown className="h-4 w-4" />
            </button>
            <Button variant="outline" size="sm" className="rounded-full gap-1.5">
              <Check className="h-3.5 w-3.5" />
              Marcar como visto
            </Button>
          </div>

          {/* Next lesson card */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {NEXT_LESSON.module}
                </p>
                <p className="font-semibold">{NEXT_LESSON.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </div>

          <Separator />

          {/* Comments */}
          <div className="px-6 py-6 space-y-4">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-border">
              <button className="pb-2.5 text-sm font-semibold border-b-2 border-foreground">
                O que achou da aula? Comente aqui:
              </button>
              <button className="pb-2.5 text-sm text-muted-foreground">
                Tem duvidas? Coloque aqui:
              </button>
            </div>

            {/* Comment input */}
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background shrink-0">
                C
              </div>
              <div className="flex-1 flex items-center gap-2 rounded-full border border-border px-4 py-2">
                <input
                  type="text"
                  placeholder="Deixe seu comentario"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-4">
              {MOCK_COMMENTS.map((comment, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
                    {comment.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{comment.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="text-sm font-medium hover:underline">
              Carregar mais
            </button>
          </div>

          {/* Footer */}
          <footer className="border-t border-border py-6 text-center">
            <p className="text-xs text-muted-foreground">
              Copyright &copy; 2026 sinapse.club. Todos os direitos reservados.
            </p>
          </footer>
        </div>

        {/* ═══ DESKTOP SIDEBAR — Lesson List ═══ */}
        <aside className="hidden lg:block w-[340px] shrink-0 border-l border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <Link href="/demo/courses" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
              <ChevronLeft className="h-4 w-4" />
              Voltar aos cursos
            </Link>
            <h3 className="font-bold">{MOCK_COURSE.title}</h3>
          </div>
          <div className="p-4">
            <ContentSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
