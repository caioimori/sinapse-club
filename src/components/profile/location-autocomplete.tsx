"use client";

import { useEffect, useRef, useState } from "react";

interface Suggestion {
  label: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

/**
 * Lightweight location autocomplete backed by Photon (OpenStreetMap).
 * Photon is CORS-friendly, free, and doesn't require auth. We debounce
 * queries to 250ms to stay under the soft fair-use limit.
 */
export function LocationAutocomplete({ value, onChange, placeholder }: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=pt&limit=6`,
          { signal: ac.signal },
        );
        if (!res.ok) throw new Error("photon");
        const data = (await res.json()) as {
          features?: Array<{
            properties?: {
              name?: string;
              city?: string;
              state?: string;
              country?: string;
              type?: string;
            };
          }>;
        };
        const items = (data.features ?? [])
          .map((f) => {
            const p = f.properties ?? {};
            const parts = [p.name, p.city && p.city !== p.name ? p.city : null, p.state, p.country]
              .filter(Boolean)
              .join(", ");
            return { label: parts };
          })
          .filter((s, i, arr) => s.label && arr.findIndex((x) => x.label === s.label) === i);
        setSuggestions(items);
      } catch {
        // ignore aborts and network errors — show nothing
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value.trim().length >= 2 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        maxLength={80}
        className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-background text-[15px] outline-none focus:border-foreground transition-colors"
        autoComplete="off"
      />
      {open && (loading || suggestions.length > 0) && (
        <ul
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-[var(--border-default)] bg-background shadow-xl"
          role="listbox"
        >
          {loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">Buscando...</li>
          )}
          {suggestions.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onMouseDown={() => {
                  onChange(s.label);
                  setOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-muted/70 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
