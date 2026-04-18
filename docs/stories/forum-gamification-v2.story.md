# Story: Forum Gamification v2

- **ID:** FORUM-GAMIFICATION-V2
- **Status:** Ready
- **Owner:** @developer (Dex)
- **Phase:** 3 de 3 (Gamificacao focada em engajamento)

## Contexto

Fase 1 (foundation) + Fase 2 (separacao bot/human) prontas. Agora redesenhamos
XP pra premiar engajamento real (posts novos, saves, milestones de views),
reduzir valor de reply e adicionar anti-gaming (cap diario por doador, cap de
posts/dia pra XP). Tambem entregamos leaderboard **semanal** funcional.

## Regras de XP (aprovadas)

| Evento | XP | Notas |
|---|---:|---|
| Criar post/thread | +3 | Cap 5/dia/user |
| Criar reply | +2 | Reduzido de +5 |
| Receber like em post | +10 | ja existia |
| Receber like em comment | +3 | ja existia |
| Receber save em post | +15 | NOVO |
| Post atinge 100 views | +20 | milestone unico |
| Post atinge 500 views | +50 | milestone unico |
| Post atinge 1000 views | +100 | milestone unico |

**Anti-gaming:** cap de 30 XP/dia recebidos de um mesmo doador (likes+saves
combinados). Bots nao ganham nem doam. Reversao em DELETE de posts/reactions.

## Acceptance Criteria

### AC1 — Reply XP reduzido
Given reply criado, When `award_reputation_for_reply` roda, Then autor ganha +2
(antes era +5), com INSERT em `reputation_events` pra leaderboard semanal.

### AC2 — Novo XP por post/thread
Given post `type in ('post','thread')`, When inserido, Then autor ganha +3
**somente** se ja nao fez 5+ posts hoje (cap). Idempotente via tabela
`xp_daily_caps`.

### AC3 — Novo XP por save
Given reaction `type='save'` em post, When inserida, Then autor do post (se
human e != quem salvou) ganha +15 XP, respeitando cap de 30 XP/doador/dia.

### AC4 — Milestones de views
Given `posts.views_count` cruza 100/500/1000, When UPDATE roda, Then autor
recebe +20/+50/+100 XP, cada milestone unico por post (via tabela
`post_view_milestones`).

### AC5 — Anti-gaming cap por doador
Given mesmo user curte/salva varios posts de outro user no mesmo dia, When
XP acumulado dele excede 30, Then XP adicional e zerado ate o reset (UTC).

### AC6 — Reversao em DELETE
Given post ou reaction deletado que gerou XP, When DELETE roda, Then o XP
concedido e revertido no autor (`greatest(0, ...)`) e o evento e anotado em
`reputation_events` com xp negativo.

### AC7 — Log de eventos e leaderboard semanal
Given cada concessao de XP, When trigger roda, Then INSERT em
`reputation_events (user_id, xp, event_type, created_at)`. Leaderboard
semanal agrega `SUM(xp)` desde domingo 00:00 UTC, `profile_type='human'`,
limit 50.

### AC8 — UI de leaderboard semanal
Given pagina `/leaderboard`, When user entra na aba "Semanal", Then ve ranking
real dos humanos que mais ganharam XP na semana. Aba "Por Cargo" removida
(simplificada).

## Scope

### IN
- Migration `20260417000008_gamification_v2.sql`
- Tabelas: `reputation_events`, `xp_daily_caps`, `post_view_milestones`
- Triggers: reply (+2), post/thread (+3), save (+15), view milestones, revert-on-delete
- Leaderboard page: aba Semanal funcional; remove aba "Por Cargo"
- `leaderboard-table.tsx`: prop `mode` pra semanal usar `weekly_xp` em vez de `reputation`

### OUT
- UI de badges no perfil (bonus; TODO se >30min)
- Dashboard de stats agregado (futuro)
- Notificacoes de XP ganho (futuro)

## Dependencies
- FORUM-ENG-FOUNDATION (reactions, triggers base)
- FORUM-BOT-SEP (profile_type, bot blocks)

## Definition of Done
- Migration idempotente, passa em apply_migration
- `npx tsc --noEmit` + `npm run lint` sem novos erros
- Aba "Semanal" renderiza (mesmo vazia em ambiente fresco)
- XP reply reduzido de 5 pra 2 confirmado via review da migration
