"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  courseId: string;
  initialPosition?: number;
  onComplete?: () => void;
}

export function VideoPlayer({
  videoUrl,
  lessonId,
  courseId,
  initialPosition = 0,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const supabase = createClient();

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (initialPosition > 0) video.currentTime = initialPosition;
  }, [initialPosition]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);

    // Save progress every 10 seconds
    if (Math.floor(video.currentTime) % 10 === 0 && video.currentTime > 0) {
      saveProgress(video.currentTime, video.duration);
    }
  }

  function handleEnded() {
    setPlaying(false);
    saveProgress(duration, duration, true);
    onComplete?.();
  }

  async function saveProgress(position: number, total: number, completed = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase as any).from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      status: completed ? "completed" : "in_progress",
      progress_pct: Math.min((position / total) * 100, 100),
      last_position: Math.floor(position),
      completed_at: completed ? new Date().toISOString() : undefined,
    }, {
      onConflict: "user_id,lesson_id",
    });
  }

  function cycleSpeed() {
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  }

  return (
    <div className="relative group aspect-video rounded-xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <div
          className="mb-3 h-1 cursor-pointer rounded-full bg-white/20"
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full gradient-synapse transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={togglePlay}>
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <span className="text-xs text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={cycleSpeed} className="rounded bg-white/10 px-2 py-0.5 text-xs text-white hover:bg-white/20">
              {speed}x
            </button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => videoRef.current?.requestFullscreen()}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Big play button (when paused) */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sinapse-purple-600/90 text-white">
            <Play className="h-8 w-8 ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
