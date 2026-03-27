import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/courses/course-card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Cursos",
};

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(username, display_name)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // Get user enrollments
  let enrolledIds = new Set<string>();
  if (user) {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", user.id)
      .eq("status", "active");
    enrolledIds = new Set((enrollments || []).map((e: any) => e.course_id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cursos</h1>
        <p className="text-muted-foreground">Aprenda AI com cursos praticos em portugues</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge variant="default" className="bg-sinapse-purple-600 cursor-pointer">Todos</Badge>
        <Badge variant="outline" className="cursor-pointer">Perpetuos</Badge>
        <Badge variant="outline" className="cursor-pointer">Lancamentos</Badge>
        <Badge variant="outline" className="cursor-pointer">Mini-cursos</Badge>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any) => (
            <CourseCard
              key={course.id}
              id={course.id}
              slug={course.slug}
              title={course.title}
              description={course.description}
              thumbnail_url={course.thumbnail_url}
              type={course.type}
              price_cents={course.price_cents}
              total_lessons={course.total_lessons}
              total_duration_minutes={course.total_duration_minutes}
              is_enrolled={enrolledIds.has(course.id)}
              instructor={course.instructor}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24">
          <div className="mb-4 text-5xl">📚</div>
          <h3 className="mb-2 text-lg font-semibold">Em breve</h3>
          <p className="text-sm text-muted-foreground">
            Cursos gravados sobre AI, LLMs, automacao e mais.
          </p>
        </div>
      )}
    </div>
  );
}
