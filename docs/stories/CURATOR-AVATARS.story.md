# Story: CURATOR-AVATARS — Avatares humanizados pros 5 bots curadores

**Status:** Ready
**Created:** 2026-05-05
**Owner:** caio

## Contexto

Os 5 curator bots (UUIDs `00000000-0000-0000-0000-00000000000{1..5}`) postam diariamente conteúdo curado de X/Reddit no forum. Hoje aparecem sem avatar (fallback de iniciais), o que denuncia visualmente que são bots e quebra a sensação de plataforma populada por humanos. Objetivo: cada bot ter um avatar realista pra humanizar a feed sem custo de performance.

## Decisão de fonte

- **Fonte:** `thispersondoesnotexist.com` (StyleGAN2, NVIDIA)
- **Por quê:** rostos AI-generated, ninguém real existe, **zero risco LGPD** (Art. 7 — não há titular de dados). Alternativa "Generated Photos" exigia signup com API key, fricção desnecessária.
- **Não usamos:** Unsplash/fotos de pessoas reais (risco direito de imagem).

## Acceptance Criteria

- [x] 5 fotos AI baixadas, redimensionadas pra 256×256 WebP (~15KB cada)
- [x] Upload no bucket `avatars/curators/{1..5}.webp` (público, já existe)
- [x] `profiles.avatar_url` populado pros 5 UUIDs de bot
- [x] `next.config.ts` remotePatterns já cobre (`*.supabase.co`)
- [x] Forum renderiza avatares dos bots no thread-list sem regressão de Lighthouse perf
- [x] Script idempotente (rodar de novo não quebra nem regenera desnecessário)

## Scope

### IN
- Avatares dos 5 curator bots existentes
- Script seed reutilizável em `scripts/seed-curator-avatars.mjs`
- Documentação de fonte + license

### OUT
- Banners/headers dos bots (deferido)
- Bios mais humanas (deferido)
- Variação de horário de post (deferido — backlog separado)
- Novos bots (escopo só pros 5 atuais)

## Performance budget

- Total: 5 × ~15KB WebP = **~75KB** servido pelo CDN do Supabase Storage
- `next/image` cacheia + serve formatos otimizados automaticamente
- Tamanho 256×256 = 4× retina pro maior uso (avatar 64px)

## File List
- `docs/stories/CURATOR-AVATARS.story.md` (este arquivo)
- `scripts/seed-curator-avatars.mjs` (script one-off de seed)
