"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichEditor } from "@/components/feed/rich-editor";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
}

interface Subcategory {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  icon: string | null;
}

export function ThreadCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [plain, setPlain] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await (supabase as any)
        .from("forum_categories")
        .select("id, slug, name, icon")
        .eq("is_active", true)
        .order("sort_order");
      if (data) {
        setCategories(data);

        // Pre-select from query params
        const categorySlug = searchParams.get("category");
        if (categorySlug) {
          const match = data.find(
            (c: Category) => c.slug === categorySlug
          );
          if (match) {
            setCategoryId(match.id);
          }
        }
      }
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setSubcategoryId("");
      return;
    }

    async function fetchSubcategories() {
      const { data } = await (supabase as any)
        .from("forum_subcategories")
        .select("id, slug, name, category_id, icon")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("sort_order");
      if (data) {
        setSubcategories(data);

        // Pre-select subcategory from query params
        const subSlug = searchParams.get("sub");
        if (subSlug) {
          const match = data.find(
            (s: Subcategory) => s.slug === subSlug
          );
          if (match) {
            setSubcategoryId(match.id);
          }
        }
      }
    }
    fetchSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!categoryId) {
      newErrors.category = "Selecione uma categoria";
    }
    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = "Titulo deve ter pelo menos 5 caracteres";
    }
    if (title.trim().length > 200) {
      newErrors.title = "Titulo deve ter no maximo 200 caracteres";
    }
    if (!plain.trim() || plain.trim().length < 20) {
      newErrors.content =
        "Conteudo deve ter pelo menos 20 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Parse tags
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const { data, error } = await (supabase as any)
      .from("posts")
      .insert({
        author_id: user.id,
        category_id: categoryId,
        subcategory_id: subcategoryId || null,
        title: title.trim(),
        content: html,
        content_plain: plain,
        type: "thread",
        tags: parsedTags,
      })
      .select("id")
      .single();

    if (error) {
      setErrors({ submit: "Erro ao criar thread. Tente novamente." });
      setLoading(false);
      return;
    }

    router.push(`/forum/thread/${data.id}`);
  }

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Categoria <span className="text-destructive">*</span>
        </Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubcategoryId("");
          }}
          className="flex h-9 w-full rounded-lg border border-border bg-muted px-3 py-1 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon || ""} {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category}</p>
        )}
      </div>

      {/* Subcategory (conditional) */}
      {subcategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subcategory" className="text-sm font-medium">
            Subcategoria
          </Label>
          <select
            id="subcategory"
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-border bg-muted px-3 py-1 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">
              Todas em{" "}
              {selectedCategory ? selectedCategory.name : "..."}
            </option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.icon || ""} {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Titulo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Qual a sua duvida ou topico?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="bg-muted border-border"
        />
        <div className="flex items-center justify-between">
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground tabular-nums">
            {title.length}/200
          </span>
        </div>
      </div>

      {/* Content (Rich Editor) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Conteudo <span className="text-destructive">*</span>
        </Label>
        <RichEditor
          onChange={(h, t) => {
            setHtml(h);
            setPlain(t);
          }}
          placeholder="Descreva seu topico em detalhes. Codigo, links e formatacao sao bem-vindos..."
          className="min-h-[200px]"
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium">
          Tags{" "}
          <span className="font-normal text-muted-foreground">
            (opcional, separadas por virgula)
          </span>
        </Label>
        <Input
          id="tags"
          placeholder="ex: nextjs, supabase, deploy"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-muted border-border"
        />
      </div>

      {/* Submit error */}
      {errors.submit && (
        <p className="text-sm text-destructive">{errors.submit}</p>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-foreground border-0 px-6"
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar Thread"}
        </Button>
      </div>
    </form>
  );
}
