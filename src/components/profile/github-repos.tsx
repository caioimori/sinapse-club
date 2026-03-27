"use client";

import { Star, GitFork, Circle } from "lucide-react";

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

export function GitHubRepos({ username, repos }: GitHubReposProps) {
  if (!repos || repos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum repositorio encontrado para @{username}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {repos.map((repo) => (
        <a
          key={repo.name}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-border p-4 hover:border-sinapse-purple-600/50 hover:bg-card/50 transition-all space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-sinapse-cyan-400 hover:underline truncate">
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
                  className="rounded-full bg-sinapse-cyan-400/10 px-2 py-0.5 text-[10px] text-sinapse-cyan-400 font-medium"
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
      ))}
    </div>
  );
}
