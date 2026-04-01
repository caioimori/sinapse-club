import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideoPlayer } from "@/components/courses/video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle, Clock, BookOpen, Lock } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("title")
    .eq("slug", slug)
    .single();
  const course = data as { title: string } | null;
  return { title: course?.title || "Curso" };
}

export default async function CourseDetailPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { slug } = await params;
  const { lesson: lessonParam } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch course with modules and lessons
  const { data: course } = await supabase
    .from("courses")
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(username, display_name, avatar_url),
      modules(*, lessons(* ORDER BY sort_order) ORDER BY sort_order)
    ` as any)
    .eq("slug", slug)
    .eq("is_published", true)
    .single() as any;

  if (!course) notFound();

  // Check enrollment
  let isEnrolled = false;
  if (user) {
    const { data } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "active")
      .single();
    isEnrolled = !!data;
  }

  // Get all lessons flat
  const allLessons = (course.modules || []).flatMap((m: any) => m.lessons || []);
  const currentLesson = lessonParam
    ? allLessons.find((l: any) => l.id === lessonParam)
    : allLessons[0];

  // Get progress
  let progressMap = new Map<string, any>();
  if (user && isEnrolled) {
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_id, status, progress_pct, last_position")
      .eq("user_id", user.id)
      .eq("course_id", course.id);
    (data || []).forEach((p: any) => progressMap.set(p.lesson_id, p));
  }

  const canWatch = isEnrolled || currentLesson?.is_preview || course.price_cents === 0;
  const price = course.price_cents === 0 ? "Gratis" : `R$ ${(course.price_cents / 100).toFixed(0)}`;
  const currentProgress = currentLesson ? progressMap.get(currentLesson.id) : null;

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100dvh-3.5rem)] lg:h-[calc(100dvh-3.5rem)]">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Video / Lock */}
        {canWatch && currentLesson?.video_url ? (
          <VideoPlayer
            videoUrl={currentLesson.video_url}
            lessonId={currentLesson.id}
            courseId={course.id}
            initialPosition={currentProgress?.last_position || 0}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-muted">
            {!canWatch ? (
              <div className="text-center space-y-3">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Compre o curso para acessar</p>
                <Button className="bg-foreground border-0">{price}</Button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Selecione uma aula</p>
              </div>
            )}
          </div>
        )}

        {/* Course info */}
        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="mt-1 text-muted-foreground">{course.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center text-xs text-white font-medium">
                {course.instructor?.display_name?.[0] || "?"}
              </div>
              <span className="text-sm">{course.instructor?.display_name || course.instructor?.username}</span>
            </div>
            <Badge variant="outline">{course.total_lessons} aulas</Badge>
            <Badge variant="outline">
              <Clock className="mr-1 h-3 w-3" />
              {Math.floor(course.total_duration_minutes / 60)}h{course.total_duration_minutes % 60 > 0 ? (course.total_duration_minutes % 60) : ""}
            </Badge>
          </div>

          {currentLesson && (
            <div className="border-t border-border pt-4">
              <h2 className="text-lg font-semibold">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="mt-1 text-sm text-muted-foreground">{currentLesson.description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar — lesson list */}
      <div className="hidden w-80 flex-shrink-0 border-l border-border lg:block">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Conteudo do curso</h3>
          <p className="text-xs text-muted-foreground mt-1">{allLessons.length} aulas</p>
        </div>
        <ScrollArea className="h-[calc(100%-60px)]">
          {(course.modules || []).map((mod: any) => (
            <div key={mod.id}>
              <div className="px-4 py-2 bg-muted/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{mod.title}</p>
              </div>
              {(mod.lessons || []).map((lesson: any) => {
                const prog = progressMap.get(lesson.id);
                const isCompleted = prog?.status === "completed";
                const isCurrent = currentLesson?.id === lesson.id;
                const accessible = isEnrolled || lesson.is_preview || course.price_cents === 0;
                return (
                  <Link
                    key={lesson.id}
                    href={accessible ? `/courses/${slug}?lesson=${lesson.id}` : "#"}
                    className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-border/50 transition-colors ${
                      isCurrent ? "bg-foreground/5 border-l-2 border-l-foreground" : "hover:bg-muted/50"
                    } ${!accessible ? "opacity-50" : ""}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />
                    ) : !accessible ? (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{lesson.title}</p>
                      {lesson.video_duration > 0 && (
                        <p className="text-xs text-muted-foreground">{Math.floor(lesson.video_duration / 60)}:{(lesson.video_duration % 60).toString().padStart(2, "0")}</p>
                      )}
                    </div>
                    {lesson.is_preview && !isEnrolled && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0">Preview</Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
