"use client";

import Link from "next/link";
import { BookOpen, Clock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  type: string;
  price_cents: number;
  total_lessons: number;
  total_duration_minutes: number;
  is_enrolled?: boolean;
  progress_pct?: number;
  instructor: {
    display_name: string | null;
    username: string;
  };
}

export function CourseCard({
  slug,
  title,
  description,
  thumbnail_url,
  type,
  price_cents,
  total_lessons,
  total_duration_minutes,
  is_enrolled = false,
  progress_pct = 0,
  instructor,
}: CourseCardProps) {
  const hours = Math.floor(total_duration_minutes / 60);
  const mins = total_duration_minutes % 60;
  const duration = hours > 0 ? `${hours}h${mins > 0 ? mins : ""}` : `${mins}min`;
  const price = price_cents === 0 ? "Gratis" : `R$ ${(price_cents / 100).toFixed(0)}`;

  return (
    <Link href={`/courses/${slug}`} className="group block">
      <div className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {thumbnail_url ? (
            <img src={thumbnail_url} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sinapse-purple-900 to-sinapse-purple-700">
              <BookOpen className="h-12 w-12 text-sinapse-purple-300" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {type === "launch" && (
            <Badge className="absolute top-2 right-2 bg-sinapse-purple-600">Lancamento</Badge>
          )}
          {type === "mini" && (
            <Badge className="absolute top-2 right-2 bg-sinapse-cyan-600">Mini-curso</Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-sinapse-purple-400 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{instructor.display_name || instructor.username}</span>
            <span>·</span>
            <span>{total_lessons} aulas</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}
            </span>
          </div>

          {/* Progress or price */}
          {is_enrolled ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{Math.round(progress_pct)}% concluido</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-synapse transition-all"
                  style={{ width: `${progress_pct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <span className="text-lg font-bold">{price}</span>
              <Button size="sm" className="gradient-synapse border-0">
                {price_cents === 0 ? "Comecar" : "Comprar"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
