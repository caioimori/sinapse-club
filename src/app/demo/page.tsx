import { sanitizeHtml } from "@/lib/sanitize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Newspaper, Bot, Code, Briefcase, Rocket, MessageCircle,
  Settings, Search, Bell, Heart, Repeat2, Share, Bookmark,
  MoreHorizontal, Sparkles, Users, Image, BarChart3, Smile,
  MapPin, Globe, CalendarDays, GitFork, LinkIcon,
} from "lucide-react";
import Link from "next/link";

// Mock data
const MOCK_PROFILE = {
  username: "caioimori",
  display_name: "Caio Imori",
  avatar_url: null,
  role: "admin",
  bio: "Builder. Automatizo tudo com AI. Fundador do sinapse.club.",
  location: "Sao Paulo, BR",
  github_username: "caioimori",
  points: 1250,
  streak_days: 14,
  followers: 127,
  following: 43,
};

const MOCK_POSTS = [
  {
    id: "1",
    author: { username: "caioimori", display_name: "Caio Imori", avatar_url: null, role: "admin" },
    title: null,
    content: "<p>Acabei de testar o Claude 4.5 com o novo context window de 1M tokens. A diferenca de qualidade e absurda comparado com o 3.5. Principalmente pra code review e refactoring de projetos grandes.</p><p>Alguem mais testou? O que acharam?</p>",
    type: "post",
    space: { name: "LLMs & Agents", icon: "🤖" },
    likes: 42,
    comments: 18,
    reposts: 7,
    time: "2h",
  },
  {
    id: "2",
    author: { username: "sinapse-bot", display_name: "sinapse.club", avatar_url: null, role: "instructor" },
    title: "Anthropic lanca Claude 4.5 com janela de contexto de 1M tokens",
    content: "<p>A Anthropic anunciou hoje o Claude 4.5, com uma janela de contexto expandida para 1 milhao de tokens. O modelo apresenta melhorias significativas em raciocinio, codigo e instrucoes complexas.</p>",
    type: "curated",
    source: "x",
    space: { name: "AI News", icon: "📰" },
    likes: 89,
    comments: 34,
    reposts: 23,
    time: "4h",
    hasTranslation: true,
  },
  {
    id: "3",
    author: { username: "devmaria", display_name: "Maria Santos", avatar_url: null, role: "pro" },
    title: null,
    content: "<p>Montei um agent autonomo com Claude Code + MCP que faz deploy automatico quando os testes passam. O fluxo:</p><p>1. Push no GitHub<br>2. Claude Code roda os testes<br>3. Se passar, faz deploy na Vercel<br>4. Manda notificacao no Slack</p><p>Tudo sem intervencao humana. 🤯</p>",
    type: "post",
    space: { name: "Coding & Tools", icon: "🛠️" },
    likes: 67,
    comments: 22,
    reposts: 15,
    time: "6h",
  },
  {
    id: "4",
    author: { username: "sinapse-bot", display_name: "sinapse.club", avatar_url: null, role: "instructor" },
    title: "Google DeepMind publica paper sobre Gemini 2.5 Pro",
    content: "<p>O paper tecnico do Gemini 2.5 Pro foi publicado no arXiv. Os benchmarks mostram avancos em raciocinio matematico e compreensao de codigo, com performance comparavel ao Claude 4.5 em diversas tarefas.</p>",
    type: "curated",
    source: "rss",
    space: { name: "AI News", icon: "📰" },
    likes: 45,
    comments: 12,
    reposts: 8,
    time: "8h",
    hasTranslation: true,
  },
  {
    id: "5",
    author: { username: "rafaeldev", display_name: "Rafael Oliveira", avatar_url: null, role: "pro" },
    title: null,
    content: "<p>Pessoal, estou fazendo transicao de backend Java para AI/ML. Alguem recomenda um roadmap atualizado pra 2026? Ja sei Python basico e estou estudando transformers.</p>",
    type: "post",
    space: { name: "Carreira AI", icon: "💼" },
    likes: 23,
    comments: 31,
    reposts: 2,
    time: "10h",
  },
];

const spaces = [
  { name: "AI News", emoji: "📰", active: true },
  { name: "LLMs & Agents", emoji: "🤖", active: false },
  { name: "Coding & Tools", emoji: "🛠️", active: false },
  { name: "Carreira AI", emoji: "💼", active: false },
  { name: "Show & Tell", emoji: "🚀", active: false },
  { name: "Off-topic", emoji: "💬", active: false },
];

const sourceIcons: Record<string, { icon: string; label: string; color: string }> = {
  x: { icon: "𝕏", label: "X", color: "text-foreground" },
  rss: { icon: "◉", label: "Blog", color: "text-foreground" },
  reddit: { icon: "↑", label: "Reddit", color: "text-foreground" },
};

export const metadata = { title: "Demo — sinapse.club" };

export default function DemoPage() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="hidden lg:flex w-[280px] flex-shrink-0 flex-col border-r border-border">
        {/* Logo */}
        <div className="flex h-14 items-center px-6 border-b border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sinapse.svg" alt="sinapse" className="h-6 w-auto" />
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className="px-3">
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Spaces
            </p>
            <nav className="space-y-1">
              {spaces.map((space) => (
                <div
                  key={space.name}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
                    space.active
                      ? "bg-muted text-foreground border-l-2 border-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{space.emoji}</span>
                  <span>{space.name}</span>
                </div>
              ))}
            </nav>
          </div>

          <Separator className="my-4" />

          <div className="px-3">
            <nav className="space-y-1">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Configuracoes</span>
              </div>
            </nav>
          </div>
        </ScrollArea>

        {/* User */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-muted cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">
              C
            </div>
            <div className="flex-1 truncate">
              <p className="truncate font-medium text-sm">{MOCK_PROFILE.display_name}</p>
              <p className="truncate text-xs text-muted-foreground">@{MOCK_PROFILE.username}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-6">
          <div className="flex flex-1 items-center gap-4 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Buscar conteudo..." className="pl-9 bg-muted border-0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-foreground" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">
                C
              </div>
            </div>
          </div>
        </header>

        {/* Feed content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl border-x border-border min-h-full">
            {/* Tabs */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
              <div className="flex">
                <button className="flex-1 py-3.5 text-center text-sm font-semibold border-b-2 border-foreground flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> Para voce
                </button>
                <button className="flex-1 py-3.5 text-center text-sm font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                  <Users className="h-4 w-4" /> Seguindo
                </button>
              </div>
            </div>

            {/* Composer */}
            <div className="flex gap-3 px-4 py-3 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-medium text-white shrink-0">
                C
              </div>
              <div className="flex-1 min-w-0">
                <p className="py-3 text-lg text-muted-foreground/60">O que esta acontecendo?</p>
              </div>
            </div>

            {/* Posts */}
            {MOCK_POSTS.map((post) => (
              <article key={post.id} className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/30">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${
                    post.author.role === "instructor" ? "bg-muted-foreground" : "bg-foreground"
                  }`}>
                    {post.author.display_name[0]}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate font-semibold text-sm">{post.author.display_name}</span>
                      {post.author.role !== "free" && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-foreground/50 text-muted-foreground">
                          {post.author.role === "admin" ? "ADMIN" : post.author.role === "instructor" ? "BOT" : "PRO"}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">@{post.author.username}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Source badge */}
                  {post.type === "curated" && post.source && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-mono ${sourceIcons[post.source]?.color}`}>
                        {sourceIcons[post.source]?.icon}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        via {sourceIcons[post.source]?.label}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  {post.title && (
                    <h3 className="font-semibold mb-1">{post.title}</h3>
                  )}

                  {/* Content */}
                  <div
                    className="prose dark:prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                  />

                  {/* Translation toggle */}
                  {post.hasTranslation && (
                    <button className="mt-2 flex items-center gap-1.5 text-xs text-foreground hover:underline">
                      <Globe className="h-3 w-3" />
                      Ver original (EN)
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
                    <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-foreground/5">
                        <MessageCircle className="h-[18px] w-[18px]" />
                      </div>
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-foreground/5">
                        <Repeat2 className="h-[18px] w-[18px]" />
                      </div>
                      <span className="text-xs">{post.reposts}</span>
                    </button>
                    <button className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-foreground/5">
                        <Heart className="h-[18px] w-[18px]" />
                      </div>
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <div className="flex items-center">
                      <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
                        <Bookmark className="h-[18px] w-[18px]" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors">
                        <Share className="h-[18px] w-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="flex h-16 items-center justify-around border-t border-border bg-background px-2 lg:hidden">
          {[
            { icon: Newspaper, label: "Home", active: true },
            { icon: Search, label: "Buscar", active: false },
            { icon: Bell, label: "Alertas", active: false },
            { icon: Users, label: "Perfil", active: false },
          ].map((item) => (
            <div key={item.label} className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${item.active ? "text-foreground" : "text-muted-foreground"}`}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* ═══ RIGHT PANEL (trending/who to follow) ═══ */}
      <aside className="hidden xl:flex w-[320px] flex-shrink-0 flex-col border-l border-border p-4 gap-4 overflow-y-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Buscar" className="pl-9 bg-muted border-0 rounded-full" />
        </div>

        {/* Trending */}
        <div className="rounded-xl border border-border p-4">
          <h3 className="font-bold mb-3">Trending em AI</h3>
          {[
            { topic: "Claude 4.5", posts: "2.4K posts" },
            { topic: "Gemini 2.5 Pro", posts: "1.8K posts" },
            { topic: "MCP Servers", posts: "945 posts" },
            { topic: "AI Agents", posts: "3.1K posts" },
            { topic: "Cursor vs Claude Code", posts: "687 posts" },
          ].map((t) => (
            <div key={t.topic} className="py-2 hover:bg-muted/50 -mx-2 px-2 rounded cursor-pointer">
              <p className="text-sm font-semibold">{t.topic}</p>
              <p className="text-xs text-muted-foreground">{t.posts}</p>
            </div>
          ))}
        </div>

        {/* Who to follow */}
        <div className="rounded-xl border border-border p-4">
          <h3 className="font-bold mb-3">Quem seguir</h3>
          {[
            { name: "Maria Santos", username: "devmaria", role: "pro" },
            { name: "Rafael Oliveira", username: "rafaeldev", role: "pro" },
            { name: "Ana Costa", username: "anacosta.ai", role: "premium" },
          ].map((u) => (
            <div key={u.username} className="flex items-center gap-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">
                {u.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{u.name}</p>
                <p className="text-xs text-muted-foreground">@{u.username}</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                Seguir
              </Button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          © 2026 sinapse.club · <Link href="/" className="hover:underline">Sobre</Link> · <Link href="/" className="hover:underline">Termos</Link>
        </p>
      </aside>
    </div>
  );
}
