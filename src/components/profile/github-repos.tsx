"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, GitFork, Circle, EyeOff, Eye } from "lucide-react";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

interface GitHubReposProps {
  username: string;
  repos: Repo[];
  hiddenRepos: string[];
  /** When true, the viewer is the owner of the profile and can toggle visibility. */
  isOwner: boolean;
  /** When true, trigger a silent /api/github/sync on mount (owner view only). */
  autoSync?: boolean;
}

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export function GitHubRepos({ username, repos, hiddenRepos, isOwner, autoSync = false }: GitHubReposProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [hidden, setHidden] = useState<Set<string>>(new Set(hiddenRepos));
  const [syncing, setSyncing] = useState(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!autoSync || !isOwner || syncedRef.current) return;
    syncedRef.current = true;
    setSyncing(true);
    fetch("/api/github/sync", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.repos) startTransition(() => router.refresh());
      })
      .finally(() => setSyncing(false));
  }, [autoSync, isOwner, router]);

  async function toggleHidden(repoName: string) {
    const nowHidden = !hidden.has(repoName);
    const next = new Set(hidden);
    if (nowHidden) next.add(repoName);
    else next.delete(repoName);
    setHidden(next);
    await fetch("/api/github/hide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo: repoName, hidden: nowHidden }),
    });
  }

  // For public (non-owner) viewers, silently drop hidden repos.
  const visible = isOwner ? repos : repos.filter((r) => !hidden.has(r.name));

  if (!visible || visible.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum repositorio para mostrar{isOwner ? "" : ` de @${username}`}.</p>
        {syncing && <p className="text-xs mt-2">Sincronizando...</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {syncing && isOwner && (
        <p className="text-xs text-muted-foreground text-center">Atualizando do GitHub...</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((repo) => {
          const isHidden = hidden.has(repo.name);
          return (
            <div
              key={repo.name}
              className={`group relative rounded-xl border border-border p-4 transition-all space-y-2 ${
                isHidden ? "opacity-50" : "hover:border-border hover:bg-card/50"
              }`}
            >
              {isOwner && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleHidden(repo.name);
                  }}
                  className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/80 border border-border opacity-0 group-hover:opacity-100 hover:bg-muted transition-all cursor-pointer"
                  aria-label={isHidden ? "Mostrar no perfil" : "Ocultar do perfil"}
                  title={isHidden ? "Mostrar no perfil" : "Ocultar do perfil"}
                >
                  {isHidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              )}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground hover:underline truncate">
                    {repo.name}
                  </span>
                </div>

                {repo.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{repo.description}</p>
                )}

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] text-muted-foreground font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <Circle
                        className="h-2.5 w-2.5 fill-current"
                        style={{ color: langColors[repo.language] || "#8b8b8b" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {repo.forks_count}
                    </span>
                  )}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
