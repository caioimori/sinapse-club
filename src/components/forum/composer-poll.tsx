"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export interface PollData {
  options: string[];
  duration_days: number;
}

interface ComposerPollProps {
  poll: PollData;
  onChange: (poll: PollData) => void;
  onRemove: () => void;
}

export function ComposerPoll({ poll, onChange, onRemove }: ComposerPollProps) {
  function updateOption(index: number, value: string) {
    const next = [...poll.options];
    next[index] = value;
    onChange({ ...poll, options: next });
  }

  function addOption() {
    if (poll.options.length >= 4) return;
    onChange({ ...poll, options: [...poll.options, ""] });
  }

  function removeOption(index: number) {
    if (poll.options.length <= 2) return;
    const next = poll.options.filter((_, i) => i !== index);
    onChange({ ...poll, options: next });
  }

  return (
    <div className="mt-3 rounded-2xl border border-[var(--border-default)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-muted/30">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enquete</span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Options */}
      <div className="p-3 space-y-2">
        {poll.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Opção ${i + 1}${i < 2 ? " *" : ""}`}
                maxLength={80}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-background text-sm outline-none transition-colors"
              />
            </div>
            {poll.options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {poll.options.length < 4 && (
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar opção
          </button>
        )}
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 px-3 pb-3">
        <span className="text-xs text-muted-foreground">Duração:</span>
        {[1, 3, 7, 15, 30].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange({ ...poll, duration_days: d })}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              poll.duration_days === d
                ? "bg-foreground text-background"
                : "border border-[var(--border-default)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {d}d
          </button>
        ))}
      </div>
    </div>
  );
}
