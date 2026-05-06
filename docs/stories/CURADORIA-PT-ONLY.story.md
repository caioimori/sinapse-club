# Story: CURADORIA-PT-ONLY — Pipeline de curadoria 100% PT, sem tradução

**Status:** Done
**Created:** 2026-05-05
**Owner:** caio

## Contexto

Auditoria de 2026-05-05 revelou que o pipeline de curadoria estava **morto há 26 dias**:
- 878 itens no backlog (100% aguardando tradução)
- Só 1-2 posts/dia publicados (devia ser ~70/dia)
- Causa raiz: função `translate-content` sem cron + sem `DEEPL_API_KEY`

Decisão: pivotar pra **MVP PT-only nativo** em vez de pagar tradução.
Forum brasileiro fala português — coletar direto da fonte é mais barato,
mais rápido e mais autêntico que traduzir matéria gringa.

## Arquitetura nova

```
RSS BR → curate-rss (filtra PT + IA) → curated_content → publish-curated → posts (5 bots)
```

- 11 fontes BR validadas (HTTP 200 + items reais)
- 2 tiers: `ai` (canaltech AI bypassa filtro) + `business` (precisa menção AI)
- Detector PT defensivo (mata items EN que vazem em feed BR)
- AI gate refinado pra evitar false positives clássicos (palavras PT
  terminadas em -ia: diretoria, agência, tecnologia, história…)

## Fontes BR ativas (11)

**Tier AI (1):**
- canaltech.com.br/rss/inteligencia-artificial/

**Tier business (10):**
- canaltech.com.br/rss/empreendedorismo/
- olhardigital.com.br/feed/
- neofeed.com.br/feed/
- braziljournal.com/feed/
- tiinside.com.br/feed/
- digitalks.com.br/feed/
- adnews.com.br/feed/
- meioemensagem.com.br/feed
- b9.com.br/feed/
- abradi.com.br/feed/

**Descartadas (HTML em vez de RSS, ou sem volume):**
- exame.com (todos endpoints 404)
- mundodomarketing, ecommercebrasil, distrito, imasters, hubspot.pt
- startse, tecmundo, hotmart blog, rdstation, convergenciadigital
  (retornam HTML estático, RSS descontinuado)
- endeavor (channel vazio)
- Reddit BR (0-1 entry por feed, sem massa crítica)

## Acceptance Criteria

- [x] Função `translate-content` removida do código
- [x] `curate-rss` reescrito pra aceitar APENAS items PT
- [x] AI gate refinado (tokens com preposição/pontuação, sem `"ia "` solto)
- [x] `publish-curated` simplificado (sem gate de tradução)
- [x] Backlog EN pendente limpo (891 itens marcados is_published=true)
- [x] Edge functions deployadas em prod (v6 curate-rss, v4 publish-curated)
- [x] Smoke test: 3 posts PT-BR relevantes publicados pelos bots ana, rafael, sinapse-bot

## Custo

**R$ 0/mês.** Só RSS público + Supabase free tier. Sem API de tradução.

## Bug encontrado e corrigido

Token `"ia "` (sigla IA + espaço) matchava QUALQUER palavra PT terminada em
`-ia` seguida de espaço — `diretoria da`, `agência de`, `tecnologia que`,
`história`, `estratégia`, etc. Por isso lixo tipo "Chapa Abradi PE" passava
no filtro de relevância AI.

Fix: substituí `"ia "` solto por padrões com **preposição** (`" da ia"`,
`" de ia"`, `" usar ia"`…) ou **pontuação adjacente** (`" ia,"`, `" ia."`…).

## File List

- `supabase/functions/curate-rss/index.ts` — reescrito (v3.0)
- `supabase/functions/publish-curated/index.ts` — simplificado
- `supabase/functions/translate-content/` — DELETADO
- `docs/stories/CURADORIA-PT-ONLY.story.md` — este arquivo
