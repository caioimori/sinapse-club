"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ChevronDown, ChevronRight, Video, FileText } from "lucide-react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  price_cents: number;
  is_published: boolean;
  total_lessons: number;
  total_duration_minutes: number;
  created_at: string;
  modules?: Module[];
};

type Module = {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  lessons?: Lesson[];
};

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  type: string;
  video_url: string | null;
  video_duration: number;
  content: string | null;
  is_preview: boolean;
  sort_order: number;
};

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  // New course form
  const [newCourse, setNewCourse] = useState({ title: "", description: "", slug: "", type: "perpetual", price_cents: 0 });
  // New module form
  const [newModule, setNewModule] = useState({ title: "", courseId: "" });
  // New lesson form
  const [newLesson, setNewLesson] = useState({ title: "", description: "", type: "video", video_url: "", video_duration: 0, is_preview: false, moduleId: "" });

  useEffect(() => { fetchCourses(); }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data } = await supabase
      .from("courses")
      .select("*, modules(*, lessons(* order by sort_order) order by sort_order)" as any)
      .order("created_at", { ascending: false });
    setCourses((data as any) || []);
    setLoading(false);
  }

  async function createCourse() {
    const slug = newCourse.slug || newCourse.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await (supabase as any).from("courses").insert({
      title: newCourse.title,
      description: newCourse.description,
      slug,
      type: newCourse.type,
      price_cents: newCourse.price_cents,
      instructor_id: user?.id,
      is_published: false,
    });
    if (!error) {
      setNewCourse({ title: "", description: "", slug: "", type: "perpetual", price_cents: 0 });
      setShowCreate(false);
      fetchCourses();
    }
  }

  async function togglePublish(course: Course) {
    await (supabase as any).from("courses").update({ is_published: !course.is_published }).eq("id", course.id);
    fetchCourses();
  }

  async function deleteCourse(id: string) {
    await (supabase as any).from("courses").delete().eq("id", id);
    fetchCourses();
  }

  async function addModule(courseId: string) {
    const maxOrder = courses.find(c => c.id === courseId)?.modules?.length || 0;
    await (supabase as any).from("modules").insert({
      course_id: courseId,
      title: newModule.title,
      sort_order: maxOrder,
    });
    setNewModule({ title: "", courseId: "" });
    fetchCourses();
  }

  async function deleteModule(id: string) {
    await (supabase as any).from("modules").delete().eq("id", id);
    fetchCourses();
  }

  async function addLesson(moduleId: string) {
    const mod = courses.flatMap(c => c.modules || []).find(m => m.id === moduleId);
    const maxOrder = mod?.lessons?.length || 0;
    await (supabase as any).from("lessons").insert({
      module_id: moduleId,
      title: newLesson.title,
      description: newLesson.description || null,
      type: newLesson.type,
      video_url: newLesson.video_url || null,
      video_duration: newLesson.video_duration,
      is_preview: newLesson.is_preview,
      sort_order: maxOrder,
    });
    setNewLesson({ title: "", description: "", type: "video", video_url: "", video_duration: 0, is_preview: false, moduleId: "" });
    setEditingLesson(null);
    fetchCourses();
  }

  async function deleteLesson(id: string) {
    await (supabase as any).from("lessons").delete().eq("id", id);
    fetchCourses();
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin — Cursos</h1>
          <p className="text-sm text-muted-foreground">{courses.length} cursos</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo curso
        </Button>
      </div>

      {/* Create course form */}
      {showCreate && (
        <div className="rounded-xl border border-border p-6 space-y-4 bg-muted/30">
          <h3 className="font-semibold">Criar curso</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Titulo</Label>
              <Input value={newCourse.title} onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))} placeholder="Nome do curso" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL)</Label>
              <Input value={newCourse.slug} onChange={e => setNewCourse(p => ({ ...p, slug: e.target.value }))} placeholder="auto-gerado se vazio" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Descricao</Label>
              <Input value={newCourse.description} onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))} placeholder="Descricao breve" />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" value={newCourse.type} onChange={e => setNewCourse(p => ({ ...p, type: e.target.value }))}>
                <option value="perpetual">Perpetuo</option>
                <option value="launch">Lancamento</option>
                <option value="mini">Mini-curso</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Preco (centavos, 0 = gratis)</Label>
              <Input type="number" value={newCourse.price_cents} onChange={e => setNewCourse(p => ({ ...p, price_cents: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={createCourse} disabled={!newCourse.title}>Criar</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Course list */}
      <div className="space-y-3">
        {courses.map(course => (
          <div key={course.id} className="rounded-xl border border-border overflow-hidden">
            {/* Course header */}
            <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
              <button onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)} className="shrink-0">
                {expandedCourse === course.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{course.title}</span>
                  <Badge variant={course.is_published ? "default" : "outline"} className="text-[10px]">
                    {course.is_published ? "PUBLICADO" : "RASCUNHO"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{course.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{course.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-muted-foreground mr-2">
                  {course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0} aulas
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePublish(course)}>
                  {course.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCourse(course.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Expanded: modules + lessons */}
            {expandedCourse === course.id && (
              <div className="border-t border-border bg-muted/10">
                {(course.modules || []).map(mod => (
                  <div key={mod.id} className="border-b border-border/50 last:border-0">
                    {/* Module header */}
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-muted/30">
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium flex-1">{mod.title}</span>
                      <span className="text-xs text-muted-foreground">{mod.lessons?.length || 0} aulas</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingLesson(editingLesson === mod.id ? null : mod.id); setNewLesson(p => ({ ...p, moduleId: mod.id })); }}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteModule(mod.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Lessons */}
                    {(mod.lessons || []).map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-3 px-8 py-2 text-sm hover:bg-muted/20">
                        {lesson.type === "video" ? <Video className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {lesson.is_preview && <Badge variant="outline" className="text-[9px] px-1">PREVIEW</Badge>}
                        {lesson.video_duration > 0 && (
                          <span className="text-xs text-muted-foreground">{Math.floor(lesson.video_duration / 60)}:{(lesson.video_duration % 60).toString().padStart(2, "0")}</span>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteLesson(lesson.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}

                    {/* Add lesson form */}
                    {editingLesson === mod.id && (
                      <div className="px-8 py-3 bg-muted/20 space-y-3 border-t border-border/30">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input placeholder="Titulo da aula" value={newLesson.title} onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))} />
                          <Input placeholder="URL do video (Bunny/YouTube/Vimeo)" value={newLesson.video_url} onChange={e => setNewLesson(p => ({ ...p, video_url: e.target.value }))} />
                          <Input placeholder="Duracao (segundos)" type="number" value={newLesson.video_duration || ""} onChange={e => setNewLesson(p => ({ ...p, video_duration: parseInt(e.target.value) || 0 }))} />
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id={`preview-${mod.id}`} checked={newLesson.is_preview} onChange={e => setNewLesson(p => ({ ...p, is_preview: e.target.checked }))} />
                            <Label htmlFor={`preview-${mod.id}`} className="text-sm">Preview gratuito</Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => addLesson(mod.id)} disabled={!newLesson.title}>Adicionar</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingLesson(null)}>Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add module */}
                <div className="px-6 py-3 flex gap-2">
                  <Input
                    placeholder="Nome do modulo"
                    value={newModule.courseId === course.id ? newModule.title : ""}
                    onChange={e => setNewModule({ title: e.target.value, courseId: course.id })}
                    className="max-w-xs"
                  />
                  <Button size="sm" variant="outline" onClick={() => addModule(course.id)} disabled={!newModule.title || newModule.courseId !== course.id}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Modulo
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {courses.length === 0 && !showCreate && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-2">Nenhum curso ainda</p>
          <p className="text-sm">Clique em "Novo curso" para comecar.</p>
        </div>
      )}
    </div>
  );
}
