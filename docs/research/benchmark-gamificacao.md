# Benchmark de Gamificação — sinapse.club

> Pesquisa realizada em 2026-03-29. 20 plataformas analisadas + Hooked Model + Octalysis Framework.

## Plataformas Analisadas

1. Duolingo (padrão ouro)
2. Opal (gamificação calm/wellness)
3. Reddit (karma, awards)
4. Stack Overflow (reputation, privileges)
5. GitHub (contribution graph, badges)
6. Strava (segments, KOMs, kudos)
7. Nike Run Club (achievements, milestones)
8. Habitica (RPG habits)
9. Forest (focus timer)
10. Todoist (karma points)
11. LinkedIn (profile strength, SSI)
12. BeReal (time pressure)
13. Snapchat (streaks, Snap Score)
14. Discord (roles, levels, boosts)
15. Skool (levels, leaderboard, content unlock)
16. Khan Academy (mastery, energy points)
17. Codecademy (streaks, skill paths)
18. Chess.com (ELO, daily puzzles)
19. Peloton (real-time leaderboard, shoutouts)
20. Clash Royale (seasons, leagues, chest system)

---

## Referências-Chave para sinapse.club

| Referência | O que clonar | Por quê |
|------------|-------------|---------|
| **Skool** | Leaderboard sidebar, levels com content unlock | Modelo mais similar (comunidade paga + courses) |
| **Duolingo** | Streak, ligas semanais, XP system | Mecânicas de retenção mais provadas do mundo |
| **Stack Overflow** | Reputation por qualidade, privilege unlock, expertise badges | Gamificação que gera VALOR REAL |
| **GitHub** | Contribution graph, badges sóbrios, profile como portfólio | Estética developer-friendly |
| **Opal** | Design calm, celebrações discretas | Tom adequado para profissionais |

---

## TOP 10 Mecânicas a Implementar

### #1 — XP + LEVELS (Impacto: ★★★★★)

**Tabela de XP por ação:**

| Ação | XP |
|------|-----|
| Criar post no feed | +15 |
| Receber upvote em post | +5 |
| Responder pergunta | +10 |
| Resposta marcada como "melhor" | +25 |
| Completar módulo de course | +50 |
| Completar course inteiro | +200 |
| Streak diário (login + 1 ação) | +10 |
| Receber kudos | +3 |
| Primeiro post do dia | +5 (bonus) |
| Ajudar outro membro (mentoria) | +20 |

**10 Levels:**

| Level | Nome | XP |
|-------|------|-----|
| 1 | Initiate | 0 |
| 2 | Script Kiddie | 100 |
| 3 | Debugger | 500 |
| 4 | Developer | 1.500 |
| 5 | Engineer | 4.000 |
| 6 | Architect | 10.000 |
| 7 | Principal | 25.000 |
| 8 | Distinguished | 60.000 |
| 9 | Fellow | 150.000 |
| 10 | Legendary | 500.000 |

### #2 — CONTRIBUTION STREAK (Impacto: ★★★★★)

- Dias consecutivos com pelo menos 1 ação significativa
- Streak Shield: protege 1 dia (comprável com XP, max 2 armazenados)
- Milestones: badges em 7, 30, 100, 365 dias
- Recovery: pode recuperar streak de ontem por custo alto de XP

### #3 — LEADERBOARD SEMANAL COM LIGAS (Impacto: ★★★★★)

- 5 Ligas: Bronze → Silver → Gold → Platinum → Diamond
- Top 10 sobem, bottom 5 descem (reseta toda segunda)
- Leaderboard POR SPACE (não só global)

### #4 — BADGES DE CONQUISTA (Impacto: ★★★★☆)

- 3 Tiers: Bronze / Silver / Gold
- Categorias: Contribuição, Social, Learning, Streak, Especial, Raros
- Até 5 "pinned" no perfil

### #5 — SKILL MAP / TECH TREE (Impacto: ★★★★☆)

- Mapa visual de skills por domain (Frontend, Backend, IA/ML, DevOps)
- 4 níveis: Aware → Practicing → Proficient → Mastered
- Estilo tech tree de jogos de estratégia

### #6 — DAILY CHALLENGE / QUEST DO DIA (Impacto: ★★★★☆)

- 1 desafio diário que muda à meia-noite
- 3 Weekly Quests com recompensa maior
- Quest completion % visível na comunidade

### #7 — REPUTATION / KARMA (Impacto: ★★★★☆)

- Separado de XP: XP = volume, Reputation = qualidade
- Reputation desbloqueia PRIVILEGES (como Stack Overflow)
- 50 rep: comentar, 200: votar, 500: editar, 1000: criar Spaces, 2500: moderar

### #8 — KUDOS TIPADOS (Impacto: ★★★☆☆)

- 5 tipos: 🧠 Big Brain, 🚀 Ship It, 🎯 Spot On, 💡 Light Bulb, 🤝 Helper
- Limitado a 10 kudos/dia (escassez = valor)
- Peso por quem dá (Level 8 > Level 1)

### #9 — MENTORSHIP MATCHING (Impacto: ★★★☆☆)

- Level 6+ podem ser Mentors oficiais
- "Mentor da Semana" no dashboard
- XP bonus para ações de mentoria

### #10 — ONBOARDING GAMIFICADO (Impacto: ★★★☆☆)

- Checklist primeiros 7 dias com XP por cada ação
- Barra "Seu setup está X% completo" (estilo LinkedIn)
- Badge "Founding Steps" ao completar

---

## Hooked Model para sinapse.club

```
TRIGGER → ACTION → VARIABLE REWARD → INVESTMENT → (loop)

TRIGGER:
  - Push: "Desafio do dia disponível"
  - Internal: "Quero aprender IA" / "Quero ver meu ranking"

ACTION (2-5 min):
  - Completar daily challenge
  - Ler/responder 1 post
  - Assistir 1 módulo

VARIABLE REWARD:
  - Tribe: Kudos, comments, followers
  - Hunt: Conteúdo novo no feed
  - Self: XP, level up, badge

INVESTMENT:
  - Perfil mais rico (rep, badges, skill map)
  - Streak mais longo
  - Reputation acumulada (privileges)
```

**Ciclos temporais:**

| Ciclo | Mecânica | Hook Emocional |
|-------|----------|----------------|
| Diário | Streak + Daily Challenge | "Não quero perder meu streak" |
| Semanal | Liga/Leaderboard + Weekly Quests | "Quero subir de liga" |
| Mensal | Badges de milestone | "Quero meu badge de 30 dias" |
| Trimestral | Season com rewards exclusivos | "Season rewards expiram!" |
| Anual | Year in Review | "Minha jornada no sinapse.club" |

---

## Octalysis Framework — Priorização

| Core Drive | Prioridade | Mecânica |
|-----------|-----------|----------|
| CD2: Progresso | **MUITO ALTO** | XP, Skills, Levels, Mastery |
| CD4: Propriedade | **MUITO ALTO** | Perfil rico, reputation, portfolio |
| CD5: Social | **MUITO ALTO** | Leaderboard, mentoria, kudos |
| CD1: Propósito | ALTO | "Maior comunidade dev IA do BR" |
| CD3: Criatividade | ALTO | Criar conteúdo, projetos |
| CD6: Escassez | MODERADO | Level-locked content, kudos limitados |
| CD7: Imprevisibilidade | MODERADO | Daily challenges, mystery badges |
| CD8: Perda | MODERADO | Streak (com tom suave) |

---

## Anti-Patterns a EVITAR

1. **Pointsification** — XP por login sem ação = inflação
2. **Guilt-tripping** — Tom passivo-agressivo não funciona pra devs
3. **Pay-to-win** — Dinheiro compra conveniência, NUNCA status
4. **Leaderboard tóxico** — Usar ligas para novatos competirem entre si
5. **Complexidade excessiva** — Lançar simples, iterar
6. **Decay agressivo** — Nunca resetar level/reputation
7. **Visual infantil** — Estética sóbria (GitHub, not Candy Crush)
8. **Notificação spam** — Max 1-2 push/dia
9. **Sem endgame** — Topo = mentorship + leadership, não tédio
10. **Gamificação sem propósito** — Toda mecânica deve incentivar aprender/compartilhar/ajudar

---

## Roadmap de Implementação

| Fase | Sprint | Entregas |
|------|--------|----------|
| Foundation | 1-2 | XP + Levels + Streak + Onboarding gamificado + Activity Heatmap |
| Social | 3-4 | Leaderboard/Ligas + Kudos + Reputation + Badges (~20 iniciais) |
| Depth | 5-6 | Daily Challenge + Skill Map + Privileges + Weekly Quests |
| Endgame | 7-8 | Mentorship + Seasons + Year in Review + Community Leader |

---

## Análises Detalhadas por Plataforma

### Duolingo — O Padrão Ouro
- **DAU/MAU:** ~50% (extraordinário)
- **Retenção D30:** ~40% (vs ~10% média ed-tech)
- **75% da receita** atribuída ao streak
- **Mecânica central:** Streak + Loss Aversion
- **Clonar:** XP system, ligas semanais, streak com shield
- **Evitar:** Tom passivo-agressivo das notificações

### Opal — Gamificação Calm
- **Insight-chave:** Gamificação pode maximizar QUALIDADE, não quantidade
- **Opal Score:** Pontuação diária (0-100) baseada em comportamento
- **Clonar:** Design calmo, celebrações discretas, tom respeitoso
- **Relevância:** Tom ideal para público profissional

### Reddit — Gamificação Social Orgânica
- **DAU/MAU:** ~44%
- **Sessão média:** 20+ min
- **Karma cumulativo NUNCA pode ser perdido** — progresso permanente
- **Clonar:** Variable rewards do feed, subreddits como Spaces
- **Insight:** Karma baixa barreira → Reddit funciona pela imprevisibilidade

### Stack Overflow — Gamificação de Expertise
- **Top contributors (>10K rep):** retenção anual >90%
- **25K+ moderadores voluntários** criados pelo privilege system
- **Clonar:** Reputation por qualidade, privilege unlocking
- **Insight:** Gamificação baseada em COMPETÊNCIA > atividade

### GitHub — Gamificação Implícita
- **Contribution graph aumentou frequência de commits em ~15%**
- **Clonar:** Activity heatmap no perfil, badges sóbrios
- **Insight:** Gamificação SUTIL funciona melhor para devs

### Skool — Comunidade Paga Gamificada
- **Engagement 3-5x maior** que Facebook Groups
- **Level unlocks** reduzem churn significativamente
- **MODELO MAIS SIMILAR** ao sinapse.club
- **Clonar:** Leaderboard sidebar, levels com content unlock

### Strava — Gamificação Competitiva
- **Membros de clubs:** retenção 2.5x maior
- **Clonar:** Kudos (reação social), leaderboard por segmento/space
- **Insight:** Competição renovável por segmento = por Space

### Peloton — Gamificação Premium
- **Milestone shoutout:** 90%+ retenção anual
- **Leaderboard ao vivo** aumenta esforço em 15-20%
- **Clonar:** Celebração de milestones, real-time competition

### Chess.com — Gamificação Intelectual
- **150M+ membros**
- **Daily puzzle** cria ritual de 2 minutos
- **Clonar:** Daily challenge como ritual, stats detalhados por skill

### Snapchat — Streaks Sociais
- **Streaks = ~60% do engagement** entre teens
- **DAU/MAU: ~60%** (altíssimo)
- **Insight:** Streaks bilaterais (entre 2 pessoas) > streaks solo

### Discord — Gamificação Comunitária
- **Servers com bots de XP/levels:** engagement 2x maior
- **Membros com roles customizados:** 3x retenção
- **Clonar:** Roles/cargos visuais, hierarchy por cor

### LinkedIn — Profile Gamification
- **Profile meter aumentou perfis completos em 55%**
- **"Who Viewed"** é feature mais acessada
- **Clonar:** Barra de progresso de perfil, curiosity gaps

### Clash Royale — Seasonal Engagement
- **Clan members:** 3x retenção vs solo
- **$14B+ receita** combinada Supercell
- **Clonar:** Seasons com reset parcial, chest/reward system variável
