# Gamification Benchmark — sinapse.club

**Data:** 2026-04-11
**Autor:** research-orqx (Prism)
**Missao:** Definir sistema de gamificacao que case com posicionamento premium, estetica dark/minimalista e publico de operadores senior em IA.

---

## TL;DR

O sinapse.club NAO pode usar gamificacao estilo Duolingo (XP farmavel, ligas competitivas, confete, infantilizacao). O publico-alvo — engenheiros e founders pagando R$97/mes — quer **sinalizar competencia**, nao colecionar gemas.

Os 3 sistemas que mais casam com a cara do produto sao, nesta ordem:

1. **Stack Overflow — Reputation + Privileges + Badges** (score 9.1/10)
2. **GitHub — Contribution Graph + Achievements** (score 8.7/10)
3. **Codewars — Kyu/Dan Ranks + Honor** (score 8.3/10)

A recomendacao final e um **sistema hibrido** que combina:
- **Reputation peer-validated** (SO) como metrica-titulo — numero no perfil, substitui "XP"
- **Privileges unlockaveis** (SO) como progression — ganha acesso a acoes conforme sobe
- **Contribution graph** (GitHub) — heatmap dark green/zinc mostrando consistencia no perfil
- **Ranks de tier** (Codewars Kyu/Dan) — 6 niveis narrativos (Iniciante → Operador → Senior → Referencia → Mestre → Legenda) visualizados com as cores dos tiers ja definidos (zinc/azul/verde/ambar)

Tudo implementavel em cima das tabelas que ja existem (`profiles.xp`, `reputation`, `levels`, `badges`, `threads_count`, `replies_count`). Zero necessidade de refatorar schema.

---

## Fase 1 — Benchmark Profundo

### 1. Stack Overflow — Reputation, Badges, Privileges

**Mecanica principal:** Reputation (inteiro, peer-validated). Upvote em pergunta = +10, em resposta = +10, resposta aceita = +15. Downvote = -2. Cap diario de 200 pontos. Acima disso so accepted answers e bounties contam.

**Badges:** 3 tiers (bronze/prata/ouro). Bronze = acoes basicas. Prata = uso continuado. Ouro = contribuicao excepcional. 66M+ badges ja distribuidos.

**Privileges:** Acesso a features destravado por threshold de reputation. Comentar = 50 rep. Votar = 15 rep. Editar posts dos outros = 2000 rep. Fechar perguntas = 3000 rep. Moderar = 20000 rep. **Cai abaixo do threshold, perde o privilege.**

**Como aparece visualmente:** Numero grande no perfil ao lado do nome. Badges como pequenos ícones circulares (bronze/silver/gold). Cada post mostra rep do autor inline.

**O que premia:** Qualidade validada por pares. NAO premia atividade pura — premia contribuicao que a comunidade considera util.

**Psicologia:** Status + mastery + unlock progression. Nao tem loss aversion tossica (a rep nao "expira"). Privileges criam sensacao real de crescimento — voce literalmente tem mais poder na plataforma.

**Profissional serio sente:** Premium. E a referencia dourada pra comunidades tecnicas. Zero cringe.

Fontes: [Stack Overflow badges explained](https://stackoverflow.blog/2021/04/12/stack-overflow-badges-explained/), [Membership Has Its Privileges](https://stackoverflow.blog/2010/10/07/membership-has-its-privileges/), [Reputation and Voting](https://internal.stackoverflow.help/en/articles/8775594-reputation-and-voting)

---

### 2. GitHub — Contribution Graph + Achievements

**Mecanica principal:** Heatmap 52x7 (1 ano x dias). Cada celula verde quanto mais contribs (commits, PRs, issues, reviews). Tons mais escuros = mais ativo.

**Achievements:** Badges sutis no perfil — Pull Shark, YOLO, Pair Extraordinaire, Starstruck, Arctic Code Vault. NAO sao o centro da experiencia — sao easter eggs.

**Como aparece visualmente:** Heatmap ocupa metade do perfil. Fundo escuro, celulas zinc (vazias) ou 4 tons de verde. Hover mostra "X contributions on Y". Achievements em linha discreta abaixo.

**O que premia:** Consistencia. Atividade publica. NAO premia qualidade — um commit "fix typo" conta igual a um PR de 10k linhas. **Essa e a fraqueza do GitHub.**

**Psicologia:** Streak implicito (nao conta os dias, mas voce ve o "buraco cinza" e quer preencher). Gestalt da continuidade — a mente quer a linha completa. Sunk cost bias: voce ve 6 meses verdes, nao quer quebrar.

**Profissional serio sente:** Orgulho. O heatmap virou simbolo cultural de dev produtivo. Muita gente printa no LinkedIn. Motiva sem infantilizar porque **nao fala "streak de X dias" na cara** — voce interpreta visualmente.

Fontes: [How GitHub Leverages Gamification](https://trophy.so/blog/github-gamification-case-study), [Contributions on your profile — GitHub Docs](https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile)

---

### 3. Codewars — Kyu/Dan Ranks + Honor

**Mecanica principal:** DOIS eixos separados.
- **Rank (Kyu/Dan):** Indica SKILL. 8 kyu (iniciante) → 1 kyu → 1 dan → 8 dan (mestre). Subir exige completar kata DIFICIL, nao muitos faceis.
- **Honor:** Indica CONTRIBUICAO/atividade. Ganha resolvendo kata, criando kata, votando, participando de review.

**Insight crucial:** Separar "skill" de "atividade" resolve o problema do Duolingo — um usuario pode ter muita honor (muito ativo) mas rank baixo (ainda iniciante). Ambos numeros sao honestos.

**Como aparece:** Rank como "5 kyu" ao lado do username, com cor associada (branco, amarelo, laranja, azul, roxo, preto). Honor como numero discreto.

**O que premia:** Rank premia dificuldade superada. Honor premia contribuicao cumulativa.

**Psicologia:** Mastery puro. Tomada de martial arts — herda narrativa seria (dojo, faixas). Zero infantil.

**Profissional serio sente:** Respeito. Dizer "sou 3 kyu" e como dizer "faixa marrom" — tem peso cultural.

Fontes: [Codewars Ranks](https://docs.codewars.com/gamification/ranks/), [Codewars Honor](https://docs.codewars.com/gamification/honor/)

---

### 4. Strava — Kudos, Segments, KOM/QOM, Local Legend

**Mecanica principal:** Kudos (likes). Segments (trechos de rua/trilha com leaderboard automatico). KOM/QOM = King/Queen of the Mountain (recordista all-time do segment). Local Legend = quem completou mais vezes em 90 dias.

**Como aparece:** Icone de coroa ao lado do nome em segments onde e lider. Medalhas em atividades. 14 BILHOES de kudos dados em 2025.

**O que premia:** Performance competitiva em contextos locais + consistencia (Local Legend premia quem volta, nao quem e mais rapido).

**Psicologia:** Status social + competicao hiper-local. O brilhante: nao compete com o mundo, compete com voce + seus pares locais. Reduz desespero.

**Profissional serio sente:** Motivador, mas muito focado em **performance fisica**. O conceito de "Local Legend" (consistencia local) e transportavel.

Aderencia sinapse: baixa-media. Competicao nao e o centro da cultura. MAS o conceito de "lider de um nicho especifico" (ex: "lider em posts sobre RAG") e interessante.

Fontes: [How Strava Uses Gamification](https://trophy.so/blog/strava-gamification-case-study)

---

### 5. Apple Fitness — Activity Rings

**Mecanica principal:** 3 aneis (Move/Exercise/Stand). Fechar os 3 todos os dias = "All Rings Closed Day". Streaks de dias fechados.

**Visual:** 3 aneis concentricos, cores vermelho/verde/azul. Preenchem durante o dia. Gestalt da closure — cerebro QUER fechar o anel.

**Psicologia:** A mais estudada em design. Gestalt closure + streak + sunk cost. Estudo de 140k participantes: quem fecha aneis tem 48% menos problemas de sono.

**Profissional serio sente:** Motivacao real. O visual e tao forte que virou linguagem — "fechei meus aneis hoje" entrou no vocabulario.

Aderencia sinapse: media. As **cores sao berrantes** (vermelho/verde/azul Apple) — nao casa com dark minimalista. Mas o **principio de closure visual** e ouro. Poderiamos usar anel/progresso zinc→tier color em vez das cores Apple.

Fontes: [The Psychology of Apple Watch's Close Your Rings](https://trophy.so/blog/the-psychology-of-apple-watchs-close-your-rings), [Activity rings — Apple Developer](https://developer.apple.com/design/human-interface-guidelines/activity-rings)

---

### 6. Opal — Gems, Streaks, Focus Hours

**Mecanica:** Colecionar gemas 3D por sessoes completadas. Streaks de dias com session. Leaderboard com amigos.

**Visual:** Gems 3D renderizadas bonitas. App todo em tons suaves (nao dark minimalista — mais "calm aesthetic").

**Psicologia:** Colecao + streaks + social comparison opcional.

**Profissional serio sente:** Calmo, premium-ish, mas **infantil demais** pra um B2B de operadores IA. Gemas 3D em dashboard de engenheiro senior = cringe.

Aderencia sinapse: baixa. Opal e lindo pra personal wellness, mas nao transporta pra comunidade profissional. O **unico aprendizavel** e o tom "calm, nao gritante" — mas ja temos isso no zinc.

Fontes: [Opal Features](https://www.opal.so/features), [Opal Streaks and Focus Hours](https://www.opal.so/help/what-are-streaks-and-focus-hours)

---

### 7. Linear — Cycles + Velocity (nao e gamificacao)

Linear NAO tem gamificacao explicita. Tem cycles (sprints 2 semanas), velocity tracking, completion rate, carryover. E metrics operacionais, nao recompensa.

**Profissional serio sente:** Respeito. Linear e a referencia de "ferramenta seria que nao precisa de gamification pra engajar".

**Licao importante pro sinapse:** Linear ensina que **ausencia de gamification ruidosa** ja e um sinal de seriedade. Se for fazer, faz discreto como o GitHub — sem confete, sem level-up animado, sem som.

Fontes: [Linear Cycles Docs](https://linear.app/docs/use-cycles), [Linear Method](https://linear.app/method/introduction)

---

### 8. Duolingo — XP, Streaks, Leagues (ANTI-REFERENCIA)

**Mecanica:** XP por licao. Streak diario. 10 ligas bronze → diamante. Demote/promote semanal.

**Criticas documentadas:**
- XP virou alvo de farm — desconectado de aprendizado real (ha bugs que farmam XP sem falar nada).
- Ligas penalizam usuarios que **completaram metas diarias** mas nao foram agressivos o suficiente.
- Streak notifications foram classificadas como dark pattern (push agressivo).
- Paper academico (arxiv 2203.16175) documenta burnout e desonestidade.

**Profissional serio sente:** Cringe absoluto. Mascote verde chorando, confete, "You earned 15 XP!" com som. Zero espaco pra isso num produto premium.

**Licao pro sinapse:** Tudo que Duolingo faz, sinapse faz o OPOSTO.
- Duolingo: XP farmavel. Sinapse: reputation peer-validated.
- Duolingo: streak ameacado. Sinapse: heatmap silencioso.
- Duolingo: ligas com perda. Sinapse: progressao sem regressao.
- Duolingo: animacao/som/cor. Sinapse: silencio visual.

Fontes: [When Gamification Spoils Your Learning (arXiv)](https://arxiv.org/pdf/2203.16175), [Duolingo Bug Lets You Farm XP](https://www.findarticles.com/duolingo-bug-lets-you-farm-xp-without-speaking/)

---

### 9. Discord MEE6 — Server Levels

**Mecanica:** XP por mensagem (cooldown 1 min/msg pra evitar spam). Level up destravaveis roles. Leaderboard por servidor. Rank cards customizaveis.

**Profissional serio sente:** Tolera, mas sem entusiasmo. MEE6 e associado a servidores gaming. Em comunidades B2B serias, e percebido como "barulho".

**Licao pro sinapse:** O cooldown anti-spam e bom. MAS recompensar por volume de mensagem leva a lixo textual. Nossa metrica precisa ser **valor da contribuicao** (upvote/bookmark/reply count do post), nao volume bruto.

Fontes: [MEE6 Levels Wiki](https://wiki.mee6.xyz/plugins/levels)

---

### 10. Reddit — Karma + Trophies + Awards

**Mecanica:** Link karma (upvotes em posts) + comment karma (upvotes em comments). Trophies = badges por marcos (verify email, cake day, mod). Awards = gifts pagos (gold) que outros usuarios enviam.

**Profissional serio sente:** Neutro. Karma e familiar e respeitado. Trophies sao ignorados. Awards pagos cheiram a monetizacao forcada.

**Licao pro sinapse:** Karma peer-validated funciona. **Nao** cobrar por awards (Reddit teve backlash). Trophies discretos podem existir mas nao sao o centro.

Fontes: [Reddit Karma and Trophies](https://www.howtogeek.com/reddit-karma-and-trophies-what-are-they-and-how-do-you-get-them/), [Reddit Awards](https://support.reddithelp.com/hc/en-us/articles/26465598697876-What-are-awards-and-how-do-I-use-them)

---

### 11. LinkedIn SSI (menciao rapida)

Score 0-100 dividido em 4 pilares. Pensado pra vendedores, nao pra comunidade. Considerado ultrapassado. **Nao aplicavel.**

Fontes: [LinkedIn SSI](https://business.linkedin.com/sales-solutions/social-selling/the-social-selling-index-ssi)

---

## Fase 2 — Filtro de Aderencia Sinapse

Score 1-10. Peso aplicado ao final. Ranking por score ponderado.

| App | Visual dark/min (20%) | Premia substancia (25%) | Sinaliza competencia (20%) | Psicologia adulta (15%) | Implementavel stack atual (10%) | Engagement saudavel (10%) | **Score ponderado** |
|-----|----|----|----|----|----|----|----|
| **Stack Overflow** | 8 | 10 | 10 | 9 | 10 | 8 | **9.1** |
| **GitHub** | 9 | 7 | 9 | 10 | 9 | 9 | **8.7** |
| **Codewars** | 7 | 9 | 10 | 9 | 8 | 7 | **8.3** |
| Linear (metrics) | 10 | 6 | 7 | 10 | 5 | 8 | 7.5 |
| Apple Rings | 5 | 5 | 5 | 8 | 7 | 9 | 6.2 |
| Strava | 4 | 6 | 6 | 7 | 6 | 6 | 5.8 |
| Reddit | 6 | 7 | 5 | 7 | 8 | 5 | 6.2 |
| Opal | 6 | 4 | 3 | 6 | 5 | 8 | 5.1 |
| Discord MEE6 | 5 | 3 | 4 | 5 | 8 | 4 | 4.6 |
| Duolingo | 2 | 2 | 2 | 2 | 7 | 3 | 2.6 |

**Top 3:** Stack Overflow (9.1), GitHub (8.7), Codewars (8.3).

---

## Fase 3 — Top 3 Detalhado

### TOP 1 — Stack Overflow Reputation + Privileges

**Por que e a cara do sinapse (3 razoes):**
1. Peer-validated — numero que sobe SO quando outro profissional serio valida seu trabalho. Impossivel farmar. Casa com cultura anti-hype.
2. Privileges unlockaveis — voce literalmente ganha poder na plataforma (moderar tags, votar pra fechar, editar wiki). E progressao real, nao cosmetica.
3. Visual sobrio — SO nunca usa animacao ou cor berrante pra comunicar reputation. E um numero. E sagrado.

**Como adaptar pro stack atual:**
- Tabela `profiles.reputation` JA EXISTE. Basta popular.
- Mapear triggers: thread criada +0 (so existir nao vale nada), reply com upvote +10, reply marcada como "melhor resposta" +15, bookmark recebido +2, downvote -2, daily cap 200 (config em `levels` table).
- Tabela `privileges` nova (simples): `(level_min_rep INT, privilege_key TEXT, description TEXT)`. Query no frontend checa `user.reputation >= min_rep`.
- Privileges sugeridos pro sinapse:
  - 0 rep: ler, dar upvote em post proprio
  - 50 rep: comentar em qualquer post
  - 200 rep: dar upvote em qualquer post
  - 500 rep: criar tag nova
  - 1000 rep: marcar post como duplicado
  - 2000 rep: editar posts dos outros (wiki)
  - 5000 rep: destravar flair customizado no profile
  - 10000 rep: participar do conselho de moderacao

**Mockup descritivo:**
- No perfil, abaixo do avatar: numero grande em `text-3xl font-light text-zinc-100`. Label `reputation` em `text-xs uppercase tracking-wide text-zinc-500`.
- Em cada post, ao lado do username: `• 2,340` em `text-xs text-zinc-400`. Click leva ao perfil.
- Pagina `/profile/[user]/reputation` com historico: lista cronologica de ganhos ("+10 por upvote em 'Como voces fazem chunking de PDFs?'").
- Zero animacao no numero subindo. Update silencioso. Reload e ja esta la.

**Impacto esperado:**
- Usuario olha o proprio numero e quer subir porque significa respeito real.
- Olha o numero dos outros e sabe com quem esta falando (rep alta = voz que vale peso).
- Conta pro amigo: "cara, to com 3200 de rep no sinapse, ja posso moderar tags" — **soa profissional**.

---

### TOP 2 — GitHub Contribution Graph

**Por que e a cara do sinapse (3 razoes):**
1. Visual minimalista puro — e literalmente um grid de quadrados. Casa 100% com dark + zinc.
2. Mostra consistencia sem gritar streak — o usuario interpreta visualmente. Nao tem numero "STREAK: 45" na cara.
3. E o padrao-ouro que dev ja respeita. Zero onboarding visual.

**Como adaptar pro stack atual:**
- Nova tabela `daily_contributions (user_id UUID, date DATE, contribution_count INT)` OU view materializada agregando `posts`, `replies`, `votes_given`, `bookmarks`. Melhor view materializada (sem escrita extra).
- Componente `<ContributionHeatmap userId />` — 52x7 grid. Cor: `zinc-900` (vazio), `zinc-800` (0 contribs com hover), `tier-color/20`, `tier-color/40`, `tier-color/70`, `tier-color` (mais ativo). A cor do tier do usuario (azul/verde/ambar) "colore" o heatmap dele — **isso e genial**: cada tier tem seu proprio heatmap visual.
- Renderiza no `/profile/[user]`, acima do feed de posts do usuario.

**Mockup descritivo:**
- Grid 52 colunas x 7 linhas, cada celula 10x10px com 2px gap.
- Fundo: `bg-black`. Borda sutil `border-zinc-800`.
- Legenda embaixo: "Menos [5 quadrados em gradiente zinc→tier] Mais".
- Tooltip no hover: "12 contribs em 8 de abril" em `bg-zinc-900 text-xs`.
- Acima do grid, numero discreto: "847 contributions in the last year" em `text-sm text-zinc-400`.
- Zero animacao. Aparece instantaneo.

**Impacto esperado:**
- Usuario quer "pintar o quadrado de hoje". Motivacao visual silenciosa.
- Print-worthy: dev vai printar e postar no X tipo "6 meses no sinapse, so crescimento". Marketing organico.
- Assina consistencia sem moralizar — se voce nao postou, apenas tem quadrado cinza, nao recebe push notification culposa.

---

### TOP 3 — Codewars Kyu/Dan Ranks (renomeados)

**Por que e a cara do sinapse (3 razoes):**
1. Separa skill de atividade — resolve o problema do Duolingo (volume nao vira rank). Casa com o anti-hype.
2. Narrativa de mastery — faixas sao metafora adulta. Nao e "level 42" de RPG, e "faixa preta".
3. Poucos niveis (6-8) — cada um e significativo. Nao vira "level 147" como MEE6.

**Como adaptar pro stack atual:**
- Tabela `levels` JA EXISTE. Popular com 6 niveis:
  - **Iniciante** (0-99 rep) — zinc-500
  - **Operador** (100-499 rep) — tier member blue
  - **Senior** (500-1999 rep) — tier member blue brighter
  - **Referencia** (2000-4999 rep) — tier alumni green
  - **Mestre** (5000-9999 rep) — tier mentorado amber
  - **Legenda** (10000+ rep) — tier mentorado amber brighter
- Importante: rank **NAO se perde** (ao contrario de privileges). Subiu, ficou. Anti-loss-aversion toxica.
- Rank derivado de `reputation`, nao "XP". Reuse a coluna que ja tem sentido.

**Mockup descritivo:**
- Ao lado do username em posts: `Ana Silva · Senior` onde "Senior" e em `text-xs` com a cor do tier de rank (azul claro pra Senior).
- No perfil, abaixo do numero de reputation: badge horizontal `Senior — 500/2000 para Referencia` com progress bar zinc→tier-color, fill sutil.
- Animacao: NENHUMA no momento do level up. Apenas um toast discreto (canto inferior direito) `"Voce alcancou Senior."` que dura 4s e some. Sem som, sem confete.
- Narrativa opcional por nivel (texto curto ao clicar): "Operador — voce entendeu as regras do jogo. Agora e executar."

**Impacto esperado:**
- Usuario quer subir de Operador pra Senior porque o label "Senior" tem peso real fora do app tambem.
- "Sou Referencia no sinapse" e uma frase que cabe no LinkedIn sem cringe.
- Poucos niveis = cada conquista importa. Nao vira "grind infinito" tipo MEE6 level 150.

---

## Fase 4 — Sistema Hibrido Recomendado

**Nome interno:** Reputation System (RS). Sem nome fancy. O numero fala por si.

### Mecanicas (5 totais, nao mais)

1. **Reputation (numero principal)** — peer-validated. Substitui "XP" em todas as UIs. Ganha por acoes de TERCEIROS (upvote, bookmark, best-answer). Nao ganha por acoes proprias (criar thread = 0 rep ate receber engagement).
2. **Rank (6 tiers)** — derivado de reputation. Iniciante → Legenda. Narrativa adulta. Irreversivel.
3. **Contribution Heatmap** — visual de 1 ano no perfil. Cor do tier do usuario "colore" o grid. Sem contador de streak explicito.
4. **Privileges (unlock progressivo)** — comentar (50), votar (200), criar tag (500), editar wiki (2000), flair custom (5000), conselho mod (10000).
5. **Badges (silenciosos)** — 3 tiers (bronze/prata/ouro), bem poucos (max 20 badges total no sistema). Bronze por primeiras acoes. Ouro por marcos raros (ex: "Referencia da comunidade" = 10 best-answers em threads com 50+ views). Aparecem como icones pequenos no profile, sem notificacao celebratoria.

### O que cada uma recompensa

| Mecanica | Recompensa |
|----------|-----------|
| Reputation | Contribuicao validada por pares (peer trust) |
| Rank | Acumulo cumulativo ao longo do tempo (tenure) |
| Heatmap | Consistencia diaria (nao exibida como numero, so visual) |
| Privileges | Confianca da comunidade (mais rep = mais poder real) |
| Badges | Marcos especificos raros (nao farmaveis) |

### Onde aparece na UI

| Local | O que mostra |
|-------|-------------|
| **Perfil** (`/profile/[user]`) | Reputation grande, rank inline, heatmap full-width, lista de privileges desbloqueados, badges em grid discreto |
| **Inline em posts** | `Ana Silva · Senior · 2,340` ao lado do avatar |
| **Topbar (direita)** | Badge minusculo `Senior` + rep number (so visivel no proprio user) |
| **Leaderboard** (`/leaderboard`) | Tabela zinc-first com rep + rank. Sem podio, sem emojis. |
| **Sidebar do forum** | Widget "Top contributors da semana" — 5 usuarios, avatar + rep. Sem coroa, sem fogo. |

### Paleta (respeitando tiers ja definidos)

| Elemento | Cor |
|----------|-----|
| Fundo base | `bg-black` (preto puro) |
| Container cards | `bg-zinc-950` com `border-zinc-900` |
| Texto principal | `text-zinc-100` |
| Texto secundario | `text-zinc-400` |
| Label/uppercase micro | `text-zinc-500` |
| Reputation number | `text-zinc-100` sempre (sem cor ghost) |
| Tier Iniciante | `text-zinc-500` / heatmap `zinc-600` |
| Tier Membro (Operador/Senior) | `text-blue-400` / heatmap gradient `blue-950 → blue-400` |
| Tier Aluno (Referencia) | `text-emerald-400` / heatmap `emerald-950 → emerald-400` |
| Tier Mentorado (Mestre/Legenda) | `text-amber-400` / heatmap `amber-950 → amber-400` |
| Progress bar fill | Tier color com opacity `/60` |
| Privilege unlocked | `text-zinc-100` com check icon `text-emerald-500` |
| Privilege locked | `text-zinc-600` com lock icon |

**Proibicoes explicitas:**
- Sem gradientes berrantes
- Sem emoji nos numeros (nada de fogo pra streak)
- Sem animacao de level up tipo RPG
- Sem som
- Sem confete, sparkle, particula
- Sem push notification celebratoria ("Parabens!!!")
- Toast de level up e opcional e discreto, 4s, sem icone comemorativo

### Fase de Rollout

**Fase 1 (MVP — semana 1-2)** — Nao quebrar nada do que ja existe:
1. Ativar triggers SQL que ja foram criados mas nao estao ligados (criar thread +0, reply +5, upvote recebido +10, downvote -2, daily cap 200). Atencao: ajustar pra "criar thread +0" — so rende com engagement.
2. Preencher `levels` table com os 6 niveis definidos + ranges de rep.
3. Exibir `rank` + `reputation` inline em posts (ao lado do username). **Essa unica mudanca visual ja comunica que tem sistema.**

**Fase 2 (semana 3-4)** — Tornar visivel:
4. Pagina de perfil com numero grande de reputation + rank badge.
5. Leaderboard polido (ja tem query, so UI).
6. Widget "Top da semana" na sidebar do forum.

**Fase 3 (semana 5-6)** — Progresso e privileges:
7. Progress bar pro proximo rank no perfil.
8. Implementar 3 primeiros privileges (comentar 50, votar 200, criar tag 500). Checagem simples no backend.
9. Pagina `/perfil/privileges` listando o que esta desbloqueado e o que falta.

**Fase 4 (semana 7-8)** — Heatmap:
10. View materializada `daily_contributions`.
11. Componente `<ContributionHeatmap />` no perfil.
12. Refresh materialized view via cron diario (3am BRT).

**Fase 5 (semana 9+ — adiavel)** — Badges:
13. Definir 15-20 badges totais. Bronze/silver/gold.
14. SQL triggers pra detectar e atribuir.
15. Display discreto no perfil.

**ADIAR indefinidamente:**
- Ligas competitivas semanais (risco Duolingo)
- Sistema de coins/awards pagos (risco Reddit backlash)
- Streak counter numerico visivel (use heatmap em vez)
- Animacoes de level up elaboradas
- Push notifications de gamification (quebra tom profissional)

---

## Resumo Executivo (800 palavras max)

### Top 3 apps + pontuacao

1. **Stack Overflow Reputation + Privileges** — 9.1/10. Peer-validated, premium, privileges reais destravaveis, visual sobrio. E a cara do sinapse.
2. **GitHub Contribution Graph** — 8.7/10. Heatmap escuro silencioso que comunica consistencia sem gritar streak. Print-worthy, print-cultural.
3. **Codewars Kyu/Dan** — 8.3/10. Separa skill de atividade (anti-Duolingo). Narrativa adulta de faixas. Poucos niveis, cada um significativo.

Anti-referencia absoluta: **Duolingo** (2.6/10). Tudo que Duolingo faz, o sinapse faz o oposto.

### Sistema hibrido recomendado — 5 mecanicas

- **Reputation (numero principal)** peer-validated. Acao propria = 0 rep ate outro user validar. Daily cap 200. Nao farmavel.
- **Rank (6 tiers narrativos):** Iniciante → Operador → Senior → Referencia → Mestre → Legenda. Derivado de rep. Cores respeitam tiers existentes (zinc/azul/verde/ambar). Irreversivel.
- **Contribution heatmap** estilo GitHub no perfil. Grid 52x7, cor do tier do user "colore" o grid. Sem numero de streak.
- **Privileges unlockaveis** por rep — comentar (50), votar (200), criar tag (500), editar wiki (2000), flair (5000), conselho mod (10000). Poder REAL, nao cosmetico.
- **Badges silenciosas** (max 20 totais, bronze/prata/ouro). Sem notificacao celebratoria, sem som, sem animacao.

Tudo aproveitando `profiles.reputation`, `levels`, `badges` que JA existem no DB. Zero refactor.

### Paleta nao-negociavel

Fundo `bg-black` puro. Cards `zinc-950/900`. Texto principal `zinc-100`. Tier colors como progress/accent, nunca como fundo. **Proibido:** gradientes ruidosos, emoji em numeros, animacao RPG de level up, som, confete, push notification comemorativo. Se o Duolingo faz, sinapse NAO faz.

### Proximos passos concretos (3 acoes para o MVP da gamification)

1. **Ativar os triggers SQL que ja existem** (reply +5, upvote +10, downvote -2, daily cap 200) mas AJUSTAR: criar thread = 0 rep (so rende com engagement recebido). Tabela `profiles.reputation` comeca a popular hoje.
2. **Exibir rank + rep inline nos posts** — ao lado do username em cada card de thread/reply: `Ana Silva · Senior · 2,340`. Essa mudanca UI minima (1 componente, 1 query) ja comunica imediatamente que tem sistema.
3. **Popular `levels` table** com os 6 niveis narrativos + ranges (0/100/500/2000/5000/10000). Criar helper `getRankFromRep(rep)` no frontend. Exibir no perfil atual (ja existe) + inline.

### Mecanica para comecar primeiro no MVP

**REPUTATION + RANK INLINE.** Comece pela base. So reputation (numero) + rank (label). **Nada mais.** Heatmap, privileges, badges vem depois.

Por que essa ordem:
- Reputation e o eixo central — todas as outras mecanicas derivam dele. Se a rep nao esta populando bem, qualquer coisa em cima vira lixo.
- Rank inline em posts e a mudanca de **menor esforco e maior impacto percebido**. Um componente, uma query, comunicacao instantanea: "a partir de hoje, ser visto aqui vale alguma coisa".
- Heatmap e lindo mas exige view materializada + componente complexo + refresh cron. Deixa pra fase 4.
- Privileges exigem checagens em 5+ lugares do backend. Deixa pra fase 3 quando o sistema de rep ja provou que funciona.
- Badges sao cosmeticas e adiaveis indefinidamente sem custo.

Se rodar MVP 1 semana com **so rep + rank inline** e voce ver o usuario checando o proprio numero, voltando pra ver se subiu, mencionando "sou Senior" — o sistema funcionou. So entao invista em heatmap e privileges.

**Principio guia:** todo elemento de gamificacao do sinapse deve passar no "teste do engenheiro serio": se um staff engineer pagando R$97/mes olhar pra aquilo e achar cringe, delete. Se achar premium, mantem.

---

## Fontes

- [Stack Overflow badges explained](https://stackoverflow.blog/2021/04/12/stack-overflow-badges-explained/)
- [Stack Overflow — Membership Has Its Privileges](https://stackoverflow.blog/2010/10/07/membership-has-its-privileges/)
- [Stack Overflow Reputation and Voting](https://internal.stackoverflow.help/en/articles/8775594-reputation-and-voting)
- [How GitHub Leverages Gamification — Trophy](https://trophy.so/blog/github-gamification-case-study)
- [GitHub Contributions Docs](https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile)
- [Codewars Ranks Documentation](https://docs.codewars.com/gamification/ranks/)
- [Codewars Honor Documentation](https://docs.codewars.com/gamification/honor/)
- [How Strava Uses Gamification — Trophy](https://trophy.so/blog/strava-gamification-case-study)
- [Psychology of Apple Watch Close Your Rings — Trophy](https://trophy.so/blog/the-psychology-of-apple-watchs-close-your-rings)
- [Apple Activity Rings HIG](https://developer.apple.com/design/human-interface-guidelines/activity-rings)
- [Opal Features](https://www.opal.so/features)
- [Opal Streaks and Focus Hours](https://www.opal.so/help/what-are-streaks-and-focus-hours)
- [Linear Cycles Docs](https://linear.app/docs/use-cycles)
- [Linear Method](https://linear.app/method/introduction)
- [When Gamification Spoils Your Learning — arXiv 2203.16175](https://arxiv.org/pdf/2203.16175)
- [Duolingo Bug Lets You Farm XP](https://www.findarticles.com/duolingo-bug-lets-you-farm-xp-without-speaking/)
- [MEE6 Levels Wiki](https://wiki.mee6.xyz/plugins/levels)
- [Reddit Karma and Trophies — How-To Geek](https://www.howtogeek.com/reddit-karma-and-trophies-what-are-they-and-how-do-you-get-them/)
- [Reddit Awards Help](https://support.reddithelp.com/hc/en-us/articles/26465598697876-What-are-awards-and-how-do-I-use-them)
- [LinkedIn SSI](https://business.linkedin.com/sales-solutions/social-selling/the-social-selling-index-ssi)
