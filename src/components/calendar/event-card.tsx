"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Users, Video, Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface EventHost {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    type: string;
    access: string;
    start_at: string;
    end_at: string;
    meeting_url: string | null;
    recording_url: string | null;
    rsvp_count: number;
  };
  host: EventHost;
  isRsvpd: boolean;
  variant: "upcoming" | "recording";
}

const typeLabels: Record<string, { label: string; color: string }> = {
  live: { label: "Live", color: "bg-rose-500" },
  office_hours: { label: "Office Hours", color: "bg-muted-foreground" },
  workshop: { label: "Workshop", color: "bg-foreground" },
  ama: { label: "AMA", color: "bg-amber-500" },
};

export function EventCard({ event, host, isRsvpd, variant }: EventCardProps) {
  const [rsvpd, setRsvpd] = useState(isRsvpd);
  const [rsvpCount, setRsvpCount] = useState(event.rsvp_count);
  const router = useRouter();
  const supabase = createClient();

  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);
  const day = format(startDate, "dd", { locale: ptBR });
  const month = format(startDate, "MMM", { locale: ptBR }).toUpperCase();
  const weekday = format(startDate, "EEE", { locale: ptBR });
  const time = format(startDate, "HH:mm");
  const endTime = format(endDate, "HH:mm");
  const typeInfo = typeLabels[event.type] || typeLabels.live;

  // Google Calendar link
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(event.description || "")}`;

  async function toggleRsvp() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (rsvpd) {
      await (supabase as any).from("rsvps").delete().match({ event_id: event.id, user_id: user.id });
      setRsvpd(false);
      setRsvpCount((c) => c - 1);
    } else {
      await (supabase as any).from("rsvps").insert({ event_id: event.id, user_id: user.id, status: "confirmed" });
      setRsvpd(true);
      setRsvpCount((c) => c + 1);
    }
  }

  const isLive = new Date() >= startDate && new Date() <= endDate;

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80">
      {/* Date badge */}
      <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-muted p-2 text-center">
        <span className="text-xs font-medium text-muted-foreground uppercase">{month}</span>
        <span className="text-2xl font-bold">{day}</span>
        <span className="text-xs text-muted-foreground capitalize">{weekday}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{event.title}</h3>
              {isLive && (
                <Badge className="bg-rose-500 animate-[synapse-pulse_2s_ease-in-out_infinite] text-xs">
                  AO VIVO
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {time} - {endTime} BRT
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {rsvpCount} confirmados
              </span>
              <Badge className={cn("text-[10px] px-1.5 py-0 text-white", typeInfo.color)}>
                {typeInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center text-[10px] text-white font-medium">
            {host.display_name?.[0] || host.username[0]}
          </div>
          <span>{host.display_name || host.username}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {variant === "upcoming" && (
            <>
              <Button
                size="sm"
                className={rsvpd ? "bg-foreground/20 text-muted-foreground border border-border" : "bg-foreground border-0"}
                onClick={toggleRsvp}
              >
                {rsvpd ? "✓ Confirmado" : "Confirmar presenca"}
              </Button>
              {isLive && event.meeting_url && (
                <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Video className="h-3.5 w-3.5" /> Entrar
                  </Button>
                </a>
              )}
              <a href={gcalUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Google Cal
                </Button>
              </a>
            </>
          )}
          {variant === "recording" && event.recording_url && (
            <a href={event.recording_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-foreground border-0 gap-1">
                <Play className="h-3.5 w-3.5" /> Assistir gravacao
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
