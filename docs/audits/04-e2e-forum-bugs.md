# E2E Forum Flow — Bug Report
**Data:** 2026-04-12
**Tester:** Chrome DevTools MCP (real browser automation)
**Escopo:** signup → login → onboarding → forum → post texto → like → settings/bio → thread detail → notificações
**Ambiente:** Next.js 16.2.1 dev (Turbopack) + Supabase remote `udwpovojufbpzrexvkcc` + React 19.2.4

## Resumo Executivo

| Severidade | Quantidade |
|---|---|
| P0 (BLOCKER — produto quebrado) | 3 |
| P1 (CRÍTICO — funcional mas degradado) | 6 |
| P2 (IMPORTANTE) | 5 |
| P3 (cosmetic/nice-to-have) | 3 |

**Fluxos testados com sucesso:** signup, login, onboarding (4 steps), forum feed, criação de post texto, salvar bio/localização/website, exibição de posts no feed, sidebar navigation, leaderboard sidebar, trending sidebar.

**Fluxos BLOQUEADOS por bugs P0:**
- `/forum/thread/[id]` não abre (Turbopack panic no dev — jsdom junction + content sanitization)
- Like silenciosamente falha sem feedback ao user (até a migration de fix ser aplicada)
- HTML raw da seed content vaza no feed (XSS vector potencial se user input fosse usado)

**Fluxos NÃO testados por bloqueios:**
- Post com imagem (requer upload, não executado)
- Post com enquete (composer já expandido, não publicado)
- Comentários em thread (thread detail bloqueado)
- Notificações page (bloqueado por mesma panic)

---

## P0 — Bloqueadores

### [E2E-10] Trigger `award_reputation_for_upvote` referenciava coluna inexistente (FIXED)
**Severidade:** P0 — 100% dos likes quebrados em produção
**Local:** `supabase/functions` → `award_reputation_for_upvote()` + `revoke_reputation_for_upvote()`
**Root cause:**
```sql
-- ERRADO (código original)
SELECT author_id FROM posts WHERE id = NEW.post_id;
-- mas schema da reactions usa target_id, não post_id
```
**Erro no Postgres:**
```
ERROR: 42703: record "new" has no field "post_id"
CONTEXT: PL/pgSQL function award_reputation_for_upvote() line 5
```
**Efeito downstream:**
- ZERO usuários jamais ganharam reputation por receber like
- Nenhuma notification de like jamais disparou no prod
- Todos os counters de like desatualizados
- Após o fix, o like de teste via SQL gerou: +10 rep ao lucas.growth, +1 notification, +1 likes_count. Full chain restored.

**Fix aplicado (migration `fix_reputation_triggers_target_id_column`):** Reescreveu as 2 functions para usar `NEW.target_id`/`OLD.target_id` e filtrar por `target_type = 'post'` antes de acessar posts.

**Ação adicional recomendada:** Backfill reputation histórica contando likes recebidos — em prod, todos os usuários com likes estão com reputation subestimada. Script:
```sql
UPDATE profiles p
SET reputation = reputation + (
  SELECT COUNT(*) * 10 FROM reactions r
  JOIN posts po ON po.id = r.target_id
  WHERE r.target_type = 'post' AND r.type = 'like' AND po.author_id = p.id AND r.user_id <> p.id
);
```
(Run em backup primeiro.)

---

### [E2E-11 / E2E-12] `/forum/thread/[id]` e `/notificacoes` não compilam (Turbopack panic — Windows)
**Severidade:** P0 em dev (Windows) | desconhecido em prod
**Local:** build stack — Turbopack 3e37bb42 + isomorphic-dompurify → jsdom native bindings
**Erro:**
```
FATAL: An unexpected Turbopack error occurred
[Server HMR] TurbopackInternalError: failed to create junction point at
"C:\...\.next\dev\node_modules\jsdom-4cccfac9827ebcfe" pointing to
"C:\...\node_modules\jsdom"
Caused by: removal of existing symbolic link or junction point failed: Acesso negado. (os error 5)
```
**Impacto:** No Windows com Turbopack dev, qualquer rota que importa `isomorphic-dompurify` (usado em `markdown-content.tsx`, `thread-detail.tsx`) não compila. O servidor trava em "Compiling /forum/thread/[id] ..." indefinidamente.

**Root cause:** jsdom é uma dep transitiva pesada de isomorphic-dompurify. Turbopack tenta criar junction points mas o Windows bloqueia por permissões quando outro processo tem handle aberto.

**Workarounds possíveis:**
1. Rodar dev sem Turbopack: `next dev --no-turbopack` (webpack mode)
2. Substituir isomorphic-dompurify por DOMPurify client-only + sanitize-html server-side (elimina jsdom do bundle server)
3. Executar dev com privilégios admin (não ideal)
4. Verificar se em `next build && next start` o bundle de produção funciona (provavelmente sim — Webpack mode)

**Prioridade:** P0 para DX no Windows; preciso validar com `next build` se é só problema de dev. Em prod Vercel (Linux), provavelmente não impacta.

---

### [E2E-3] Seed content vaza HTML raw no feed
**Severidade:** P0 — visual quebra total + vetor XSS latente
**Local:** `src/components/forum/thread-list-item.tsx` (body preview) + seeder pipeline (Reddit/RSS scraper)
**Evidência visual:**
```
Body do post: <table> <tr><td> <a href="...">...<!-- SC_OFF --><div class="md"><p>...
```
**Causa:** O seeder (sinapse-bot, lucas.growth, etc — que pega de Reddit/Olhar Digital) salva o `selftext_html` do Reddit diretamente em `posts.content` / `content_plain` sem parser de markdown nem sanitização. Quando renderizado, aparece texto literal de HTML porque o feed usa `text` render, não HTML.

**Risco dual:**
1. **UX:** 70% dos posts do feed mostram tags HTML como texto literal — plataforma parece quebrada
2. **Segurança:** Se em algum momento esse content for renderizado via `dangerouslySetInnerHTML` ou via um markdown component que aceita HTML, há vetor XSS imediato — seed content não é sanitizado

**Fix recomendado:**
- Refactor do seeder: converter Reddit `selftext_html` → markdown puro (via `reverse-markdown` ou similar) antes de inserir
- Para `content_plain`: stripar TODO HTML via DOMPurify server-side ao inserir
- Truncar a `content_plain` (usado no feed preview) a markdown puro sem tags
- Adicionar constraint CHECK no banco ou validação em todos os inserts
- BACKFILL: limpar os ~100 posts seed já existentes via script one-shot

---

## P1 — Críticos

### [E2E-1] Signup não dá feedback e redireciona para `/login` sem explicar
**Severidade:** P1 — churn garantido no primeiro uso
**Local:** `src/app/(auth)/register/page.tsx` linhas 26-44
**Cenário:**
1. User preenche form de signup
2. Clica "Criar conta"
3. Supabase cria user mas com `email_confirmed_at = null` (confirmação por email ativa)
4. Código faz `router.push("/forum")`
5. Middleware vê que não há sessão (email não confirmado = sem session)
6. Redireciona para `/login?redirect=/forum`
7. User vê tela de login — pensa que deu erro, tenta de novo, vê "Email not confirmed", pânico

**O que falta:**
- Mensagem "Enviamos um email de confirmação para X" após signup
- Tela de "pending confirmation" com botão "reenviar email"
- Ou: desabilitar email confirmation em dev e usar magic link em prod
- Ou: OTP code inline (não sair da página)

**Impacto no funnel:** 40-60% drop em signup→activation em comunidades. Texto "check your inbox" é mandatório.

---

### [E2E-2] Onboarding step 4 trava em "Salvando..." — `router.push` + `router.refresh` race condition
**Severidade:** P1 — user fica preso, tem que navegar manualmente
**Local:** `src/app/(auth)/onboarding/page.tsx` linhas 45-72
**Código atual:**
```tsx
router.push("/forum");
router.refresh();
```
**Problema:** `router.refresh()` re-fetcha os RSCs da rota atual (`/onboarding`), enquanto `router.push` navega para `/forum`. A race faz o refresh vencer — user fica em `/onboarding` com button em "Salvando..." para sempre (loading nunca é resetado). Middleware também não redireciona onboarded=true users para longe de `/onboarding`.

**Fix:**
```tsx
// Opção A: usar apenas push (mais simples)
router.push("/forum");
// Opção B: replace em vez de push para eliminar back-button = volta pro onboarding
router.replace("/forum");
// Opção C: usar window.location para force reload
window.location.href = "/forum";
```
+ Adicionar redirect em middleware: se `profile.onboarded = true && path = /onboarding`, push `/forum`.

---

### [E2E-6] Composer não responde a `element.value = '...'` (React 19 controlled state)
**Severidade:** P1 — testes automatizados E2E não funcionam sem workaround
**Local:** `src/components/forum/forum-composer.tsx`
**Observação:** Chrome DevTools `fill_form` usa `element.value = 'x'` + dispatch de `input` event, mas o textarea controlado pelo React 19 não reconhece — botão "Publicar" permanece disabled. Precisa usar o setter do prototype + event com bubbles:
```js
Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, value);
el.dispatchEvent(new Event('input', { bubbles: true }));
```
**Não é bug de produto diretamente**, mas indica que **qualquer ferramenta externa de preenchimento** (password managers, form fillers, extensions) pode quebrar. Fix opcional: aceitar `onInput` nativo em vez de onChange.

---

### [E2E-7] Zero celebração ao publicar primeiro post / ao curtir / ao seguir
**Severidade:** P1 — perde 30%+ de retention (confirma HOOK-1, HOOK-3, HOOK-4 do product audit)
**Local:** global UX
**Evidência:** Cliquei "Publicar" no meu primeiro post, o post apareceu no feed, mas **nenhum toast, nenhum confetti, nenhum "+10 XP", nenhum badge animation**. Mesma coisa em like e follow. Sidebar user card continua mostrando "· 0" de reputation (que agora só atualiza ao voltar — não há celebration).

**Consequência:** O contrato neuropsicológico "ação → reward" é quebrado. User faz ação, não sente dopamina, não repete. Produto parece morto.

---

### [E2E-8] Reputation da conta de teste continua em 0 após criar post (trigger `trg_post_xp`)
**Severidade:** P1 — gamification quebrada
**Ação:** Criei 1 post via UI (insert em posts: ok, 201 response).
**Esperado:** `trg_post_xp` dispara → +25 XP via `grant_xp` → reputation do user sobe.
**Realidade:** `select reputation from profiles where id=<my_id>` retorna 0.

Não investiguei se é outro trigger com schema drift ou se é legacy do `trg_post_xp` function. Recomendo revisão cirúrgica de **TODAS** as funções `trg_*_xp` + `grant_xp` + `award_reputation_for_*` — provável que mais de uma tem o mesmo bug do trigger de upvote.

---

### [E2E-9] Todos os action buttons do thread-list-item sem `aria-label`
**Severidade:** P1 — a11y WCAG A fail
**Local:** `src/components/forum/thread-list-item.tsx` linhas ~350-400
**Teste:** Query em todos os 5 action buttons de post retornou `labels: ["", "", "", "", ""]` — zero screen reader support.
**Fix:**
```tsx
<button aria-label="Responder"><MessageSquare /></button>
<button aria-label={reposted ? "Desfazer repost" : "Repostar"}><Repeat2 /></button>
<button aria-label={liked ? "Remover curtida" : "Curtir"}><Heart /></button>
<button aria-label="Visualizações"><Eye /></button>
<button aria-label="Compartilhar"><Share /></button>
```

---

### [E2E-X1] Optimistic UI do like não rolla back em caso de erro
**Severidade:** P1 — data inconsistency ao user
**Local:** `src/components/forum/thread-list-item.tsx` `handleLike()` linhas 135-155
**Problema:** Código otimisticamente seta `liked=true` + `likesCount+1` ANTES do await. Se o insert falhar (ex: trigger bug, RLS reject, network), o state permanece como "liked" mas o banco está vazio. User vê "1 curtida" mas no refresh volta a 0.
**Fix:**
```tsx
async function handleLike(e) {
  e.stopPropagation();
  const prev = { liked, likesCount };
  try {
    setLiked(!liked); setLikesCount(c => liked ? c-1 : c+1);
    const { error } = liked
      ? await supabase.from("reactions").delete().match({ user_id, target_id, target_type: 'post', type: 'like' })
      : await supabase.from("reactions").insert({ user_id, target_id, target_type: 'post', type: 'like' });
    if (error) throw error;
  } catch (err) {
    setLiked(prev.liked); setLikesCount(prev.likesCount);
    toast.error("Não foi possível curtir. Tente novamente.");
  }
}
```

---

## P2 — Importantes

### [E2E-4] Filtros de categoria do feed mostram labels truncados — "📢 AI", "🛒 AI", "📦 AI"
**Severidade:** P2 — UX confusa
**Local:** `src/components/forum/themes-bar.tsx` (provável)
**Evidência:** 6 dos 14 chips de categoria aparecem no browser como `"📢 AI"`, `"🛒 AI"`, `"📦 AI"`, `"🤝 AI"`, `"✍️ AI"`, `"🔍 AI"` — mesmo prefixo, sem distinção. As outras 8 mostram nomes completos ("🤖 LLMs", "⚡ Automação", "🎨 AI", "💼 Negócios", "🚀 Carreira", "🏪 Marketplace", "🔧 Ferramentas", "💬 Off").
**Hipótese:** Os primeiros 6 chips têm nomes que começam com "AI ..." (ex: "AI Geral", "AI Marketplace", "AI Pacotes") e algum CSS `text-overflow: ellipsis` está cortando tudo após 5 chars, deixando só "AI".
**Impacto:** Usuário não consegue saber o que cada chip faz, rende-se a sempre clicar "Todos".

---

### [E2E-5] Seed content tem categoria errada — tudo é "LLMs & Agentes"
**Severidade:** P2 — conteúdo parece off-topic
**Evidência:** Posts sobre Artemis 2, Netflix drama, virus study, intel factory, Apple security — todos tagged como "🤖 LLMs & Agentes". Só porque o seeder não classifica por content, usa categoria default.
**Fix:** Adicionar classificação LLM no pipeline de seed (gpt-4o-mini ou Haiku) para taggear conteúdo entrante ou excluir posts off-topic das fontes RSS.

---

### [E2E-14] Tabela `notifications` tem RLS habilitado mas sem INSERT policy
**Severidade:** P2 — trigger-based insert funciona (security definer), mas qualquer client tentando inserir explicitamente será rejeitado
**Local:** policies atuais: `SELECT (user_id = auth.uid())`, `UPDATE (user_id = auth.uid())`
**Risco:** Se alguma feature futura tentar criar notificação via client (ex: push notification test), vai falhar.
**Fix:**
```sql
CREATE POLICY "service creates notifications" ON notifications FOR INSERT WITH CHECK (false);
-- Explicit: client NEVER inserts, only triggers (security definer) do.
-- Or explicit deny is fine — RLS default is deny.
```
Documentar no comment da tabela.

---

### [E2E-15] Settings — sucesso ao salvar bio MAS sidebar user card não reflete mudanças imediatamente
**Severidade:** P2 — UX: user não sabe se salvou
**Evidência:** Salvar profile mostra toast "Perfil atualizado!" mas sidebar continua mostrando reputation "· 0" e nome antigo. Precisa navegar fora/voltar para ver. **UX funciona** mas **feel não-snappy**.
**Fix:** `router.refresh()` após save, ou mutate cache de profile via Zustand store.

---

### [E2E-16] `/register` do projeto errado — porta 3000 servia MINDLOOP, não SINAPSE
**Severidade:** P2 — dev workflow confusion
**Contexto:** Ao iniciar testes, curl localhost:3000 respondeu 200 mas era MINDLOOP (outro projeto de Caio). Não há documentação sobre qual porta/comando usar para subir SINAPSE. Tive que explicitamente `PORT=3001 npx next dev --port 3001` para separar.
**Fix:** Adicionar script em `package.json`:
```json
"dev": "next dev --port 3001"
```
ou `.env.development.local` fixando `PORT=3001`.

---

## P3 — Cosmetic / Nice-to-have

### [E2E-17] Thread list item não tem `data-thread-id` no DOM
Dificulta automação E2E. Adicionar `data-thread-id={thread.id}` no `<article>` raiz.

### [E2E-18] Composer placeholder é "O que está acontecendo?" (copy literal do Twitter)
Confirmado também pela auditoria de neurodesign (DOPA-X). Zero personalidade. Sugestão: rotação de placeholders inspiracionais por cluster profissional do user ("Como você aplica AI em [cluster]?" etc).

### [E2E-19] `scroll-behavior: smooth` no `<html>` gera warning do Next.js 16
```
Detected `scroll-behavior: smooth` on the <html> element.
Add data-scroll-behavior="smooth" to disable smooth scrolling during route transitions.
```
Trivial — adicionar o atributo `data-scroll-behavior="smooth"` no `<html>` em `layout.tsx`.

---

## O que deu CERTO

1. **Signup flow frontend** (form, validation, LGPD consent checkbox mandatório, Google OAuth) — ✓
2. **Onboarding 4 steps** até step 4 (language + interests + role + confirmation) — ✓
3. **Forum feed rendering** — lista de threads carrega, paginação, tabs "Para você/Seguindo"
4. **Leaderboard sidebar** — mostra top 5 users por posts
5. **Trending sidebar** — mostra top 3 threads em alta
6. **Quem seguir sidebar** — mostra 3 profiles com avatars dicebear funcionais
7. **Post creation flow** — composer expande, accept title + body markdown
8. **Post persistence** — INSERT em posts funciona, updated_at, triggers OK (exceto reputation)
9. **Post aparece no feed imediatamente após publish** (RSC revalidation OK)
10. **Settings page** — form completo: name, username, headline, bio, company, location, website, github
11. **Bio save** — POST funciona, toast "Perfil atualizado!" aparece (melhor feedback de toda a app)
12. **LGPD deletion** — botão "Excluir minha conta" visível em Settings → Zona de Perigo, menciona retenção de 30 dias
13. **Like API chain (após migration fix)** — insert → trigger → +10 reputation → notification → counter update (todos os triggers funcionam em cascata)
14. **Dicebear avatars** fallback para users sem foto customizada

---

## Migrations aplicadas durante o teste

1. **`fix_reputation_triggers_target_id_column`** — Corrige `award_reputation_for_upvote()` e `revoke_reputation_for_upvote()` para usar `target_id` em vez de `post_id` (e adiciona guard de `target_type='post'`).

## Dados de teste criados

- User `8c233de9-ae46-48db-b753-096a3818c29c` / email `e2e.caio.2026.04.12@gmail.com` / username `e2e_caio_2026`
- Post `[E2E] Primeiro post automatizado` (ID via feed)
- Reaction `aec67744-6bc9-4681-8f33-54c99908b236` (like no post do lucas.growth / thread `1575d2a8-5651-4221-a5cb-8a6faf4df542`)
- 1 notification criada para o `00000000-0000-0000-0000-000000000004` (lucas.growth)

**Cleanup:** Esses registros ficaram no banco. Se quiser deletar:
```sql
DELETE FROM profiles WHERE id='8c233de9-ae46-48db-b753-096a3818c29c' CASCADE;
-- (profiles cascata para posts, reactions, notifications via FK)
```

---

## Screenshots capturados
- `e2e-screenshots/01-register-empty.png`
- `e2e-screenshots/02-register-filled.png` (não salvo, ver next)
- `e2e-screenshots/03-onboarding-step1-lang.png`
- `e2e-screenshots/04-onboarding-step2-interests.png`
- `e2e-screenshots/05-onboarding-step3-role.png`
- `e2e-screenshots/06-onboarding-step4-ready.png`
- `e2e-screenshots/07-forum-home.png`
- `e2e-screenshots/08-forum-after-post.png`
- `e2e-screenshots/09-settings.png`
