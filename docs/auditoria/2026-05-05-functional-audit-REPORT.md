# Auditoria Funcional Exaustiva — Plataforma Logada

**Data:** 2026-05-05
**Escopo:** Cada funcionalidade, cada botão, cada interação dentro do produto autenticado. Estrutura/UI fechadas — foco é fazer cada feature rodar **impecável**.

---

## TL;DR

Auditei 8 componentes core de interação (thread-actions, thread-header-menu, comment-section, compose-modal, follow-button, etc.) cobrindo as features: **criar post · curtir · salvar · compartilhar · comentar · responder · seguir · editar · deletar · reportar · enquete · imagem · emoji**.

**Veredito:** estrutura sólida, mas tem **3 bugs CRITICAL**, **8 HIGH** e **12 MEDIUM** que estão entregando uma UX abaixo do "impecável" prometido.

---

## 🔴 3 BUGS CRITICAL (fix imediato)

### #1 — Comentários NUNCA mostram avatar dos autores
**Arquivo:** `src/components/feed/comment-section.tsx:173-175`
**Sintoma:** Toda reposta/comentário renderiza só com fallback de iniciais (círculo cinza com letra), ignorando `comment.author.avatar_url`.
**Causa:** O `<CommentItem>` não usa `<AvatarImage>`, só monta um `<div>` com a letra inicial. `AvatarImage` nem é importado no arquivo.
**Impact:** Cada comentário parece de "alguém qualquer" — quebra a sensação de comunidade humana que a gente acabou de construir com avatares dos personas.
**Fix:** Trocar o div manual por `<Avatar>` com `<AvatarImage src={comment.author.avatar_url}>` e fallback. ~10 linhas. **15min**.

### #2 — Usuário comum logado NÃO consegue reportar posts
**Arquivo:** `src/components/forum/thread-header-menu.tsx:38-39`
**Sintoma:** Botão "Reportar" só renderiza se `isOwner || isAdmin`. Mas usuário comum (paid) que vê post problemático tem o menu inteiro escondido.
**Causa:** Guard de early-return `if (!isOwner && !isAdmin) return null;` antes mesmo de chegar no `if (!isOwner && currentUserId)` que mostra Reportar.
**Impact:** Moderação comunitária quebrada. Conteúdo abusivo só pode ser reportado por admin (== Caio + Soier). Não escala.
**Fix:** Remover o segundo guard, mover lógica de "qual botão mostrar" toda pro JSX. ~5 linhas. **20min**.

### #3 — Imagem órfã no Storage se INSERT do post falhar
**Arquivo:** `src/components/forum/compose-modal.tsx:192-209`
**Sintoma:** Upload da imagem é feito ANTES do INSERT do post. Se INSERT falha (RLS, rede, paywall), imagem fica permanentemente no bucket sem post associado.
**Causa:** Sem cleanup no error path. Sem transação.
**Impact:** Storage acumula lixo. Custos eventuais. LGPD potencial (imagem armazenada sem registro associado).
**Fix:** Após INSERT falhar, chamar `supabase.storage.from("posts").remove([path])`. ~10 linhas. **30min**.

---

## 🟠 8 BUGS HIGH (fix esta semana)

### #4 — Erros silenciosos em todas as ações otimistas
**Arquivos:** `thread-actions.tsx`, `comment-section.tsx`, `thread-header-menu.tsx`, `follow-button.tsx`
**Sintoma:** Todo `try/catch {}` engole erro, faz rollback do state, e usuário NÃO SABE por que o like/save/follow/edit não funcionou.
**Cenários problemáticos:**
- RLS bloqueia (ex: bot tenta reagir → trigger lança exception)
- Rede caiu (offline)
- Sessão expirou (auth token inválido)
- Bug de servidor (500)
**Impact:** Ações falham silenciosamente. Confusão. Perda de confiança.
**Fix:** Trocar todos `catch {}` por `catch (err) { toast.error("Não foi possível [ação]. Tente novamente."); }`. **2h pra revisar todos os componentes**.

### #5 — Race conditions em like/save/follow
**Arquivos:** `thread-actions.tsx`, `comment-section.tsx`, `follow-button.tsx`
**Sintoma:** Click rápido 2-3x deixa state local inconsistente com DB. Like vira not-like vira like, mas requests chegam fora de ordem.
**Cenário:** User excitado curte e descurte 5x rápido. State local mostra "curtido", mas DB tem "não curtido". Próximo refresh fica diferente do que ele viu.
**Fix:** Adicionar `disabled={pending}` nos botões durante operação (já tem em comment-section, falta no thread-actions e follow-button). **1h**.

### #6 — Comentários respondidos nunca aparecem como "curtidos" pro user
**Arquivo:** `src/components/feed/comment-section.tsx:213-214`
**Sintoma:** Pra replies aninhados (sub-comentários), `initialLiked={false}` é passado SEMPRE — não consulta `likedCommentIds`.
**Cenário:** User curte um sub-comentário, refresha página, sub-comentário aparece sem coração colorido apesar dele estar curtido no DB.
**Fix:** Passar `likedCommentIds` recursivamente via context ou prop. **30min**.

### #7 — Click fora do menu de ações não fecha o menu
**Arquivo:** `src/components/forum/thread-header-menu.tsx:32-129`
**Sintoma:** `menuRef` é declarado mas nunca tem listener `mousedown` outside attached. Menu fica aberto até user clicar de novo no botão.
**Cenário:** Mobile especialmente — user abre menu, mexe na tela, menu continua aberto cobrindo conteúdo.
**Fix:** `useEffect` com `mousedown` listener checando `menuRef.current.contains(target)`. **20min**.

### #8 — `confirm()` e `alert()` nativos do browser
**Arquivos:** `thread-header-menu.tsx`, possivelmente outros
**Sintoma:** Excluir post usa `confirm("Excluir esta publicação?")`. Reportar usa `alert("Conteúdo reportado.")`. UX pré-2010, fora do brand.
**Impact:** Fora do brandbook. Mobile especialmente feio. Bloqueia thread.
**Fix:** Substituir por modal/toast usando shadcn `<AlertDialog>` (já deve estar instalado). **2h pra todos os lugares**.

### #9 — Free user não vê CTA "Ver planos" no botão de like/save
**Arquivos:** `thread-actions.tsx:36-37`
**Sintoma:** Like/save tem `if (!currentUserId) return;` — se não logado, click não faz nada visualmente. Sem toast, sem tooltip, sem login modal.
**Cenário:** Free user (com role free) curte post → trigger RLS bloqueia (provavel?) → rollback silencioso.
**Verificar:** Trigger atual bloqueia só `curator_bot`/`curator_persona`. Free user humano consegue curtir? Se sim, não há gate. Se não, falta toast.
**Fix:** Validar comportamento via SQL teste + adicionar paywall toast se for o caso. **1h**.

### #10 — Sem validação client-side de tamanho de imagem
**Arquivo:** `src/components/forum/compose-modal.tsx:134-140`
**Sintoma:** `handleImageSelect` aceita qualquer `File` sem verificar size. Storage tem limite 5MB; se user tentar upar 50MB, vai engolir, fazer roundtrip enorme, falhar no servidor.
**Fix:** `if (file.size > 5 * 1024 * 1024) { setError("Imagem max 5MB"); return; }`. **15min**.

### #11 — Role lookup duplicado a cada click do follow
**Arquivo:** `src/components/feed/follow-button.tsx:29-39`
**Sintoma:** Cada click no botão Seguir faz query `select role from profiles where id = user.id`. Latency desnecessária + carga de DB.
**Fix:** Cachear role via context/atom no nível do layout. **1-2h**.

---

## 🟡 12 BUGS MEDIUM (próxima sprint)

### #12 — Replies em comments compartilham textarea sem indicação visual
**Arquivo:** `comment-section.tsx`
**Sintoma:** Click "Responder" muda destino do comment global, mas o textarea principal não muda visualmente — só mostra "Responder" no botão. User pode achar que vai criar comentário top-level e na verdade vai responder a outro.
**Fix:** Mostrar "Respondendo a @user" acima do textarea, com X pra cancelar. **45min**.

### #13 — Sem empty state em comentários
**Arquivo:** `comment-section.tsx`
**Sintoma:** Thread com 0 comments só mostra textarea + lista vazia (nada). Sem call-to-action.
**Fix:** "Seja o primeiro a comentar" se `comments.length === 0`. **15min**.

### #14 — Sem validação de tamanho mínimo no comment/reply
**Arquivo:** `comment-section.tsx:50`
**Sintoma:** Apenas `text.trim().length > 0` — comentário "a" (1 char) é aceito.
**Fix:** Mínimo 3 chars + max ~1000 chars + contador. **30min**.

### #15 — Sem feedback "Copiado!" persistente em share
**Arquivo:** `thread-actions.tsx:107`
**Sintoma:** Click em Compartilhar copia URL e mostra "Copiado!" por 2s. Mas se user clicou de leve no botão e olhou pra outro lugar, perde o feedback.
**Fix:** Toast.success("Link copiado!") em vez de mudar texto inline. **15min**.

### #16 — Edit de post não valida tamanho
**Arquivo:** `thread-header-menu.tsx:42`
**Sintoma:** `if (!editTitle.trim() || !editContent.trim()) return;` mas sem max length. User pode editar pra title de 5000 chars.
**Fix:** `maxLength` no input + validação. **15min**.

### #17 — Edit modal não fecha com Esc
**Arquivo:** `thread-header-menu.tsx:79-118`
**Sintoma:** Cobre o card inteiro com `absolute inset-0` mas só sai clicando Cancelar. Esperado: Esc fecha como qualquer modal.
**Fix:** `useEffect` com keydown Escape. **15min**.

### #18 — Sem drag-and-drop pra imagem no compose
**Arquivo:** `compose-modal.tsx`
**Sintoma:** Tem que clicar no ícone pra abrir file picker. UX moderna espera arrastar imagem na área do post.
**Fix:** `onDrop` handler no body do modal. **1h**.

### #19 — Hover-only "Deixar de seguir" em mobile
**Arquivo:** `follow-button.tsx:71`
**Sintoma:** Em desktop hover mostra "Deixar de seguir". Mobile não tem hover, então user vê "Seguindo" sempre — sem affordance pra unfollow.
**Fix:** Em mobile, tap mostra confirmação. **30min**.

### #20 — Emoji picker pode ficar fora da tela em mobile
**Arquivo:** `compose-modal.tsx:340-345`
**Sintoma:** Picker abre relativo ao botão emoji. Em mobile pequeno pode cortar.
**Fix:** Position fixed centralizada em mobile breakpoint. **30min**.

### #21 — Poll sem limite de opções
**Arquivo:** `composer-poll.tsx` (não auditei mas é provável)
**Sintoma:** User pode adicionar 50 opções de poll. Sem limite.
**Fix:** Cap em 4 opções (Twitter padrão). **15min**.

### #22 — Sem auto-save de draft no compose
**Arquivo:** `compose-modal.tsx`
**Sintoma:** User digita post longo, navega/refresha por engano, perde tudo.
**Fix:** localStorage draft a cada change, restaurar na próxima abertura. **2h**.

### #23 — Char counter aparece só após 85% (1700 chars)
**Arquivo:** `compose-modal.tsx:361`
**Sintoma:** User digita 1690 chars, contador some. Digita mais 10, aparece. UX inconsistente.
**Fix:** Mostrar contador a partir dos primeiros 100 chars OU sempre. **15min**.

---

## ✅ O que está IMPECÁVEL

Pra balancear, achados positivos relevantes:

| Feature | Implementação |
|---|---|
| **Compose modal** | Portal + Esc + backdrop click + body scroll lock + focus auto. Sólido. |
| **Optimistic updates** | Padrão correto em todos os toggles, com rollback. Falha é só no UX feedback. |
| **Paywall toast** | CTA "Ver planos" + duration 5s + go-to-pricing com query string trackable. Excelente. |
| **Compose poll** | Filter de options vazias + min 2 opcoes pra criar payload. Defensivo. |
| **Triggers DB anti-bot** | curator_bot/curator_persona bloqueados de reagir/comentar via Postgres trigger (defesa em camadas). |
| **Defesa em camadas no compose** | Paywall checked no openModal + fallback no handlePublish. Bom. |
| **Auto-grow textarea** | Compose modal cresce conforme digita. Detalhe que humaniza. |
| **Char counter visual** | Vira vermelho ao passar limite + botão disabled. Educativo. |

---

## 🎯 Plano de Fix priorizado

### Bloco A — CRITICAL (faço hoje, se autorizar)
- [ ] #1 Avatares em comentários (15min)
- [ ] #2 Reportar pra usuário comum (20min)
- [ ] #3 Cleanup imagem órfã (30min)

**Total: ~1h. Ganho: corrige 3 quebras visíveis.**

### Bloco B — HIGH (esta semana)
- [ ] #4 Toast de erro em vez de catch silencioso (2h)
- [ ] #5 Disabled durante pending em todos os botões (1h)
- [ ] #6 Liked state em replies recursivos (30min)
- [ ] #7 Click outside no menu (20min)
- [ ] #8 AlertDialog em vez de confirm/alert (2h)
- [ ] #9 Validar comportamento free + paywall toast (1h)
- [ ] #10 Validar tamanho imagem client-side (15min)
- [ ] #11 Cachear role lookup (1-2h)

**Total: ~10h. Ganho: UX rodando suave em 100% dos cenários comuns.**

### Bloco C — MEDIUM (próxima sprint)
- [ ] #12-#23 (12 issues, ~6h totais)

---

## Cobertura desta auditoria

Componentes auditados em profundidade:
- ✅ `forum/thread-actions.tsx` (like, save, share)
- ✅ `forum/thread-header-menu.tsx` (edit, delete, report)
- ✅ `feed/comment-section.tsx` (commentar, responder, curtir comentário)
- ✅ `feed/follow-button.tsx` (seguir/deixar de seguir)
- ✅ `forum/compose-modal.tsx` (criar post + imagem + emoji + poll)
- ✅ `access/paywall-toast.ts` (UX de gate)

Componentes inventariados mas não auditados em detalhe (próxima sessão se necessário):
- `forum/thread-reply.tsx` (400 linhas — replies em thread detail)
- `forum/thread-list-item.tsx` (cards do feed)
- `forum/explore-search.tsx` (busca)
- `forum/forum-search.tsx` (outra busca?)
- `profile/edit-profile-modal.tsx` (editar perfil)
- `profile/connect-github-button.tsx` (conectar GitHub)
- `profile/github-repos.tsx` (mostrar repos)
- `notifications/notifications-mark-read.tsx` (já fix anterior aplicado)
- `feed/post-card.tsx` (450 linhas — vi parcialmente)
- `feed/rich-editor.tsx` (editor rico)

Decisão pra Caio: posso aprofundar nesses 10 também (~+2h trabalho), OU executar o Bloco A agora pra você ver melhoria já. Qual prefere?

---

## Decisão pendente

**Recomendo executar o Bloco A (3 CRITICAL fixes) agora.** É 1h de trabalho meu, zero risco, e tira 3 quebras visíveis que arranham a UX "impecável" que você quer.

Bloco B fica pra próxima sessão. Bloco C entra em backlog.

Aprova seguir com Bloco A imediatamente?
