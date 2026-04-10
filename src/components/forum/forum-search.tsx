'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string | null;
  content_plain: string | null;
  created_at: string;
  author: { username: string; display_name: string | null; avatar_url: string | null } | null;
  category: { name: string; slug: string } | null;
}

export function ForumSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    search(val);
  }

  function handleClear() {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }

  function handleSelect(id: string) {
    router.push(`/forum/thread/${id}`);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar no fórum..."
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5"
          >
            <X className="h-4 w-4 text-zinc-500 hover:text-zinc-300 transition-colors" />
          </button>
        )}
      </div>
      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-10 left-0 right-0 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-zinc-500">Buscando...</div>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              onMouseDown={() => handleSelect(r.id)}
              className="w-full text-left px-4 py-3 hover:bg-zinc-900 border-b border-zinc-800 last:border-0 transition-colors"
            >
              <div className="text-sm font-medium text-zinc-200 truncate">
                {r.title ?? 'Sem título'}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {r.category?.name && <span>{r.category.name}</span>}
                {r.category?.name && r.author?.display_name && <span> · </span>}
                {r.author?.display_name ?? r.author?.username}
              </div>
            </button>
          ))}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-3 text-sm text-zinc-500">Nenhum resultado para &ldquo;{query}&rdquo;</div>
          )}
        </div>
      )}
    </div>
  );
}
