# Retention, Habit-Forming Design & Behavioral UX — sinapse.club

> **Prepared by:** @analyst (Alex) + @product (Vector)
> **Date:** 2026-03-29
> **Status:** COMPREHENSIVE ANALYSIS
> **Aplicacao:** sinapse.club — comunidade AI em PT-BR

---

## Indice

1. [O Modelo Hooked (Nir Eyal) Aplicado a Comunidades](#parte-1--o-modelo-hooked-nir-eyal-aplicado-a-comunidades)
2. [Frameworks de Retencao](#parte-2--frameworks-de-retencao)
3. [Padroes de Onboarding dos Melhores Apps](#parte-3--padroes-de-onboarding-dos-melhores-apps)
4. [Estrategia de Notificacoes](#parte-4--estrategia-de-notificacoes)
5. [Motores de Recomendacao de Conteudo](#parte-5--motores-de-recomendacao-de-conteudo)
6. [Psicologia de Pricing para Comunidades](#parte-6--psicologia-de-pricing-para-comunidades)
7. [Jornada Ideal do Usuario](#jornada-ideal-do-usuario--da-primeira-visita-ao-dau)
8. [Habit Loop Visual do sinapse.club](#habit-loop-visual-do-sinapsclub)
9. [Prioridades de Implementacao](#prioridades-de-implementacao)

---

# PARTE 1 — O MODELO HOOKED (Nir Eyal) Aplicado a Comunidades

## O Framework

O modelo Hooked descreve como produtos criam habitos atraves de ciclos repetitivos de 4 fases. Cada ciclo completo torna o habito mais forte. Produtos que dominam esse ciclo (Instagram, Twitter, TikTok) se tornam parte da rotina diaria sem que o usuario perceba.

```
    ┌──────────────────────────────────────────────────────────────────┐
    │                                                                  │
    │   ┌─────────┐    ┌─────────┐    ┌───────────────┐    ┌────────┐ │
    │   │ TRIGGER │───→│ ACTION  │───→│ VARIABLE      │───→│ INVEST │ │
    │   │         │    │         │    │ REWARD        │    │ MENT   │ │
    │   └─────────┘    └─────────┘    └───────────────┘    └───┬────┘ │
    │        ↑                                                  │      │
    │        └──────────────────────────────────────────────────┘      │
    │                                                                  │
    │              Cada ciclo = habito mais forte                      │
    └──────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: TRIGGER (Gatilho)

### O que e
O trigger e o que inicia o comportamento. Sem trigger, nao ha acao. Existem dois tipos fundamentais:

### Triggers Externos (inicio da jornada)

Sao sinais do ambiente que dizem ao usuario "abra o app agora":

| Tipo | Mecanismo | Exemplo Generico | Aplicacao sinapse.club |
|------|-----------|------------------|------------------------|
| **Push Notification** | Alerta no celular/desktop | "Fulano comentou no seu post" | "3 novidades de AI que voce nao pode perder hoje" |
| **Email** | Digest/newsletter | Weekly recap do Substack | "Seu digest de AI da semana — 23 artigos curados" |
| **Social** | Outro usuario menciona | @mention no Twitter | "@caio te mencionou no Space LLMs" |
| **SEO/Organic** | Google search | Artigo encontrado no Google | "Como usar Claude Code" → post curado no sinapse |
| **Paid** | Anuncio | Ad no Instagram | Carrossel: "5 noticias de AI que voce perdeu" |
| **Relationship** | Convite de amigo | "Fulano te convidou" | "Rafael te convidou para o sinapse.club" |

### Triggers Internos (habito formado)

Sao emocoes, pensamentos ou situacoes que o usuario associa ao produto SEM precisar de estimulo externo:

| Emocao/Situacao | Pensamento Interno | Acao Resultante |
|-----------------|-------------------|-----------------|
| **Tedio** | "Tem algo novo sobre AI?" | Abre o sinapse.club |
| **FOMO** | "Sera que perdi algo importante?" | Checa o feed |
| **Curiosidade** | "Como funciona o novo modelo?" | Busca no sinapse.club |
| **Inseguranca profissional** | "Estou ficando para tras?" | Lê o digest curado |
| **Solidao intelectual** | "Ninguem no meu trampo entende AI" | Entra no forum |
| **Ambicao** | "Quero me destacar no mercado" | Faz curso/participa de live |

### A Transicao Critica: Externo → Interno

O objetivo e fazer o usuario migrar de triggers externos (que custam dinheiro e esforco) para triggers internos (que sao gratuitos e automaticos).

**Como fazer essa transicao no sinapse.club:**

1. **Primeiras 2 semanas:** Bombardeio estrategico de triggers externos
   - Email de boas-vindas (dia 0)
   - Push notification com conteudo personalizado (dia 1, 2, 3)
   - Email digest diario (dias 1-14)
   - Mencao em thread de boas-vindas (dia 0)

2. **Semanas 3-4:** Reducao gradual + reforco de valor
   - Digest passa para 3x/semana
   - Push notifications apenas para conteudo muito relevante
   - Streaks visuais ("voce esta ativo ha 5 dias!")

3. **Mes 2+:** Triggers internos dominam
   - O usuario ja tem o habito de abrir o sinapse de manha
   - Checa por conta propria porque "FOMO de AI"
   - Participa de conversas porque criou vinculos sociais

**Produtos que dominam essa transicao:**

- **Twitter/X:** Trigger externo = notificacao de like/reply. Trigger interno = "o que esta acontecendo?" (abrir o app no piloto automatico)
- **Reddit:** Trigger externo = email "trending in r/MachineLearning". Trigger interno = "estou entediado, vou dar um scroll"
- **Slack:** Trigger externo = notificacao de mensagem. Trigger interno = "sera que tem algo pendente?"

### Recomendacao sinapse.club — Estrategia de Triggers

```
SEMANA 1 (Agressivo — 1-2 triggers/dia):
├── Dia 0: Email boas-vindas + onboarding push + mention no thread
├── Dia 1: Push "3 noticias de AI de hoje" (baseado nos interesses)
├── Dia 2: Email "Voce viu? [topico quente]" + push se nao abriu
├── Dia 3: Push "Alguem respondeu ao seu comentario" (se aplicavel)
├── Dia 4: Email digest com resumo dos 3 primeiros dias
├── Dia 5-7: Push personalizado 1x/dia + email digest no dia 7

SEMANA 2 (Moderado — 1 trigger/dia):
├── Push 1x/dia (melhor conteudo do dia, horario otimizado)
├── Email digest 3x/semana (seg, qua, sex)
├── Mention automatica se alguem comentou em post/reply

SEMANA 3-4 (Seletivo):
├── Push apenas para conteudo de alta relevancia
├── Email digest 2x/semana (ter, sex)
├── Streak reminder se perder 1 dia

MES 2+ (Manutencao):
├── Push: apenas interacoes sociais (reply, mention, follow)
├── Email: digest semanal personalizado
├── In-app: badges, streaks, leaderboard
```

---

## Fase 2: ACTION (Acao)

### O que e
A acao e o comportamento que o usuario faz em resposta ao trigger. Segundo o modelo BJ Fogg (B=MAT), a acao so acontece quando:

```
Comportamento = Motivacao x Habilidade x Trigger
```

Se qualquer fator for zero, a acao nao acontece. A chave e maximizar Habilidade (facilidade) porque Motivacao e instavel.

### As 6 Dimensoes da Simplicidade (Fogg)

| Dimensao | Descricao | Aplicacao sinapse.club |
|----------|-----------|------------------------|
| **Tempo** | Quanto tempo leva? | Feed carrega em <1s. Primeiro conteudo visivel sem scroll |
| **Dinheiro** | Quanto custa? | Free tier generoso. Nao pede cartao no signup |
| **Esforco fisico** | Quantos cliques? | Login com Google = 1 clique. Like = 1 toque |
| **Esforco cognitivo** | Quanto precisa pensar? | Feed curado = nao precisa filtrar. Traducao automatica |
| **Desvio social** | Vai parecer estranho? | Comunidade de AI = posicionamento profissional positivo |
| **Nao-rotina** | E diferente do habitual? | Layout Twitter-style = familiar, nao precisa aprender |

### Acoes-Alvo no sinapse.club (ordenadas por facilidade)

| Acao | Esforco | Recompensa | Frequencia-Alvo |
|------|---------|------------|-----------------|
| Scroll no feed | Minimo (0 cliques apos abrir) | Conteudo novo de AI | Diaria |
| Like em post | 1 clique | Micro-satisfacao | 5-10x por sessao |
| Ler artigo curado | 1 clique + 2-5 min | Aprendizado, atualizacao | 3-5x por dia |
| Salvar post (bookmark) | 1 clique | Sensacao de controle | 1-3x por dia |
| Comentar | 1 clique + digitacao | Expressao, pertencimento | 1-3x por dia |
| Criar post | Clique + composicao | Status, reconhecimento | 1-3x por semana |
| Seguir usuario | 1 clique | Personalizacao do feed | Onboarding + continuo |

### Reducao de Friccao — Acoes Criticas

**Signup (de visitante a membro):**
```
RUIM:  Email + senha + verificacao + onboarding longo = 5+ minutos
BOM:   Google OAuth + 3-step onboarding (idioma/interesses/pronto) = 90 segundos
IDEAL: Google OAuth + auto-detect interests + skip = 30 segundos
```

**Primeiro valor (de membro a usuario ativo):**
```
RUIM:  Feed vazio, precisa buscar conteudo = abandono
BOM:   Feed pre-populado com conteudo curado = valor imediato
IDEAL: Feed personalizado por interesses do onboarding = "uau, e feito pra mim"
```

**Primeira interacao social:**
```
RUIM:  Usuario precisa encontrar alguem pra seguir sozinho
BOM:   Sugestoes de "quem seguir" baseadas em interesses
IDEAL: Auto-follow em perfis-chave (admin, curadoria, influencers) + thread de boas-vindas
```

---

## Fase 3: VARIABLE REWARD (Recompensa Variavel)

### O que e
A recompensa variavel e o que diferencia um produto que vicia de um que e apenas util. A variabilidade ativa o sistema dopaminergico de forma muito mais intensa do que recompensas previsiveis. E o mesmo principio de uma slot machine: voce nunca sabe exatamente o que vai encontrar.

### Os 3 Tipos de Recompensa Variavel

#### 1. Recompensa da Tribo (Social)

A necessidade de pertencimento, reconhecimento e conexao social.

| Mecanismo | Como funciona | sinapse.club |
|-----------|--------------|--------------|
| **Likes/reacoes** | "Quantas pessoas gostaram do meu post?" (variavel) | Like + save em posts e comentarios |
| **Replies** | "Alguem respondeu algo interessante?" | Threaded comments com notificacao |
| **Followers** | "Mais gente ta me seguindo!" | Sistema de follow + contagem visivel |
| **Badges** | "Ganhei um badge novo!" | PRO/ADMIN/BOT badges + futuro: contribuidor, embaixador |
| **Mencoes** | "Me citaram numa conversa!" | @mention em posts e comments |
| **Validacao social** | "Meu post ficou popular!" | Trending posts, sort by hot |

**Exemplo real:** No Twitter, voce abre o app sem saber quantos likes tem. As vezes 2, as vezes 200. Essa variabilidade e que vicia.

#### 2. Recompensa da Caca (Informacao)

A necessidade de encontrar algo novo, relevante, surpreendente.

| Mecanismo | Como funciona | sinapse.club |
|-----------|--------------|--------------|
| **Feed curado** | "O que tem de novo em AI hoje?" (sempre diferente) | 20-50 items/dia, sempre frescos |
| **Traducao exclusiva** | "Conteudo que ninguem mais tem em PT-BR" | EN→PT automatico de fontes premium |
| **Trending** | "O que ta bombando agora?" | Painel "Trending em AI" |
| **Scroll infinito** | "Mais um pouco..." (dopamina do scroll) | Feed timeline estilo Twitter |
| **Conteudo surpreendente** | "Nao sabia disso!" | Curation de papers, tools, noticias |
| **Source badges** | "Isso veio de onde?" | Badge X/Reddit/Docs + link original |

**Exemplo real:** No Reddit, voce nunca sabe o que o proximo post vai ser. Pode ser um breakthrough em AI, pode ser um meme. Essa imprevisibilidade mantem voce scrollando.

#### 3. Recompensa do Self (Competencia)

A necessidade de dominio, progresso pessoal, competencia.

| Mecanismo | Como funciona | sinapse.club |
|-----------|--------------|--------------|
| **Streak** | "5 dias consecutivos! Nao quero perder" | Streak counter no perfil |
| **Progresso de curso** | "65% concluido, falta pouco!" | Barra de progresso por modulo/curso |
| **Stats do perfil** | "532 posts lidos, 47 comentarios" | Weekly recap personalizado |
| **Leaderboard** | "Estou em #12 esse mes!" | Ranking mensal por participacao |
| **Level/XP** | "Subi de nivel!" | Sistema de nivel por engajamento |
| **Certificado** | "Concluí o curso, sou certificado!" | Badge no perfil + PDF |

### Aplicacao no sinapse.club — Mapa de Recompensas

```
ABERTURA DO APP (Caca):
├── Feed novo a cada visita (nunca o mesmo)
├── "3 noticias quentes" destacadas no topo
├── Badge de conteudo novo vs ja lido
└── Trending panel atualizado em real-time

DURANTE A SESSAO (Tribo + Caca):
├── Likes e replies nos seus posts (notificacao em real-time)
├── Novos followers aparecendo
├── Conteudo surpreendente no scroll
├── "Fulano que voce segue postou algo novo"
└── Threads com debates acalorados

APOS A SESSAO (Self):
├── "Voce leu 7 artigos hoje" (progresso)
├── "Streak de 3 dias!" (consistencia)
├── "Voce subiu para o Top 20 da comunidade" (status)
└── Weekly recap no email: "Sua semana no sinapse"
```

---

## Fase 4: INVESTMENT (Investimento)

### O que e
O investimento e a acao que o usuario faz para melhorar o produto para uso futuro. Diferente da recompensa (gratificacao imediata), o investimento e sobre valor futuro. Quanto mais o usuario investe, mais dificil e abandonar o produto.

### O Efeito IKEA
Pessoas valorizam mais coisas em que investiram esforco. Um feed personalizado que voce construiu ao longo de meses vale mais do que um feed generico.

### Tipos de Investimento no sinapse.club

| Investimento | O que o usuario faz | Valor armazenado | Custo de saida |
|-------------|---------------------|------------------|----------------|
| **Seguidores** | Follow em pessoas relevantes | Feed personalizado, rede social | Perder conexoes |
| **Bookmarks** | Salva posts para depois | Biblioteca pessoal de referencia | Perder curadoria pessoal |
| **Posts/Comments** | Cria conteudo | Historico, reputacao, threads | Perder identidade digital |
| **Perfil** | Bio, avatar, links, GitHub | Presenca profissional | Reconstruir perfil |
| **Progresso de curso** | Assiste aulas, completa modulos | Progresso, certificados | Perder progresso |
| **Interesses** | Seleciona topicos no onboarding | Feed personalizado | Feed generico |
| **Streak** | Mantem sequencia de dias | Streak count, orgulho | Reset a zero |
| **Reputacao** | Acumula likes, followers, badges | Status na comunidade | Comecar do zero |
| **Dados** | GitHub repos, stats, portfolio | CV/portfolio publico | Perder vitrine |

### O Loop Completo: Investimento → Proximo Trigger

O investimento e o que "recarrega" o trigger para o proximo ciclo:

```
CICLO 1:
  Trigger: Push notification "3 noticias de AI"
  Action: Abre o feed, le 3 artigos
  Reward: Aprende algo novo (Caca) + 2 likes no comentario (Tribo)
  Investment: Segue 2 pessoas + salva 1 post + comenta em 1 thread

CICLO 2 (proximo dia):
  Trigger: INTERNO "sera que tem algo novo?" + EXTERNO "Fulano respondeu seu comentario"
  Action: Abre o feed (agora personalizado pelos follows de ontem)
  Reward: Feed melhor (porque seguiu pessoas relevantes) + reply no comentario
  Investment: Mais follows + cria primeiro post proprio

CICLO 3 (dia seguinte):
  Trigger: INTERNO "quero ver se meu post teve engajamento" (vicio de checagem)
  Action: Abre direto nas notificacoes
  Reward: 5 likes + 2 replies + 1 novo follower
  Investment: Responde replies + segue quem curtiu + atualiza bio
```

**O habito esta formado quando o Ciclo 3 se repete sem trigger externo.**

---

## Produtos que Dominam Cada Fase — Referencia

| Fase | Melhor Exemplo | O que fazem de especial |
|------|---------------|------------------------|
| **Trigger** | Duolingo | Push notification com personagem que "chora" se voce nao entra. Guilt-trip brilhante |
| **Action** | TikTok | Friccao zero: abre o app = video ja tocando. Nao precisa nem scrollar |
| **Variable Reward** | Twitter/X | Mix de Tribo (likes), Caca (trending), Self (impressoes) que nunca e previsivel |
| **Investment** | Notion | Quanto mais templates/paginas voce cria, mais impossivel e sair |

---

# PARTE 2 — FRAMEWORKS DE RETENCAO

## 1. Aha Moment — O Momento "Clicou"

### O que e
O Aha Moment e o instante exato em que o usuario entende o valor do produto pela primeira vez. Antes desse momento, o usuario e um curioso. Depois, e um convertido.

### Aha Moments Classicos

| Produto | Aha Moment | Metrica |
|---------|-----------|---------|
| **Twitter** | Seguir 30 pessoas | Feed deixa de ser vazio → valor emerge |
| **Facebook** | Adicionar 7 amigos em 10 dias | Rede social pessoal se forma |
| **Slack** | Enviar 2,000 mensagens (equipe) | Equipe adota como ferramenta principal |
| **Dropbox** | Salvar 1 arquivo em 1 pasta | Entende "meus arquivos em todo lugar" |
| **Airbnb** | Completar 1 reserva | Entende que funciona e e seguro |
| **Spotify** | Criar 1 playlist | Investimento + personalizacao |

### O Aha Moment do sinapse.club

**Hipotese principal:**
> "Ler 3 artigos curados em portugues sobre AI em menos de 5 minutos"

**Porque:**
1. O usuario entende que nao precisa mais filtrar conteudo em ingles
2. Percebe que a curadoria e de alta qualidade e relevante
3. Economiza tempo real (valor tangivel)
4. O formato Twitter-like e familiar e rapido

**Hipoteses alternativas para testar:**

| Hipotese | Metrica | Porque |
|----------|---------|--------|
| Ler 3 artigos curados | Posts lidos >= 3 na primeira sessao | Valor da curadoria fica claro |
| Receber 1 like no primeiro post/comentario | Likes recebidos >= 1 em 48h | Validacao social, pertencimento |
| Seguir 5 pessoas | Follows >= 5 nos primeiros 3 dias | Feed personalizado, conexao |
| Ler 1 artigo traduzido EN→PT | Artigo traduzido lido | Valor unico do produto |
| Comentar em 1 thread | Comments criados >= 1 em 72h | Participacao ativa, voz |

**Como medir:**
```sql
-- Correlacionar cada metrica com retencao D7 e D30
-- Usuarios que leram 3+ artigos na primeira sessao vs os que nao leram
SELECT
  CASE WHEN first_session_articles_read >= 3 THEN 'aha_reached' ELSE 'not_reached' END as cohort,
  COUNT(*) as users,
  AVG(CASE WHEN last_active >= created_at + INTERVAL '7 days' THEN 1 ELSE 0 END) as d7_retention,
  AVG(CASE WHEN last_active >= created_at + INTERVAL '30 days' THEN 1 ELSE 0 END) as d30_retention
FROM profiles
GROUP BY 1;
```

**Recomendacao:** Implementar tracking de eventos desde o dia 1 (PostHog ou similar) e testar todas as 5 hipoteses simultaneamente para descobrir qual correlaciona mais com retencao.

---

## 2. Magic Number — A Metrica de Ativacao

### O que e
O Magic Number e o limiar quantitativo que prediz se um usuario vai reter ou churnar. E a versao numericada do Aha Moment.

### Magic Numbers Famosos

| Produto | Magic Number | Janela Temporal | Retencao Associada |
|---------|-------------|-----------------|-------------------|
| Twitter | 30 follows | Primeiros 30 dias | D90 retention 3x maior |
| Facebook | 7 amigos | 10 dias | D30 retention 5x maior |
| LinkedIn | 5 conexoes | 7 dias | D30 retention 4x maior |
| Slack | 2,000 mensagens | 30 dias (equipe) | Conversao para pago |
| Pinterest | 1 pin salvo | Primeira sessao | D7 retention 2x maior |

### Magic Number proposto para sinapse.club

**Hipotese primaria:**

> **"5 artigos lidos + 1 interacao social nos primeiros 7 dias"**

**Racional:**
- 5 artigos = entendeu o valor da curadoria (Caca)
- 1 interacao (like, comment, follow) = conectou-se socialmente (Tribo)
- 7 dias = janela realista para um produto de conteudo

**Hipoteses para teste A/B:**

| Candidato | Comportamento | Janela | Sinal |
|-----------|--------------|--------|-------|
| A | 5 artigos lidos + 1 interacao | 7 dias | Valor + social |
| B | 3 artigos lidos + 3 follows | 3 dias | Curadoria + rede |
| C | 1 post/comment criado | 14 dias | Participacao ativa |
| D | 3 sessoes distintas | 7 dias | Habito de retorno |
| E | 10 artigos lidos | 14 dias | Consumo de conteudo |

**Como validar:**
1. Instrumentar todos os eventos acima com PostHog
2. Apos 30 dias com 200+ signups, rodar analise de correlacao
3. O candidato com maior correlacao com D30 retention = Magic Number
4. Otimizar onboarding para guiar usuarios ate o Magic Number

---

## 3. North Star Metric — A Metrica que Importa

### O que e
A North Star Metric (NSM) e a UNICA metrica que melhor captura o valor central que o produto entrega. Toda a empresa deve se alinhar em torno dela.

### North Star Metrics de Referencia

| Produto | NSM | Porque |
|---------|-----|--------|
| **Airbnb** | Nights booked | Captura valor para hospede E anfitriao |
| **Facebook** | DAU | Atencao = monetizacao (ads) |
| **Spotify** | Time spent listening | Mais ouve = mais valor = menos churn |
| **Slack** | Messages sent (DAU per org) | Mais mensagens = mais adocao = mais pago |
| **Medium** | Total reading time | Mais leitura = mais valor para escritores e leitores |
| **Duolingo** | DAU of learners completing lesson | Ativo + progresso = retencao |

### North Star Metric do sinapse.club

**Recomendacao:**

> **"Weekly Active Engaged Members (WAEM)"**
>
> Definicao: Membros que, em uma semana, leram pelo menos 3 artigos E fizeram pelo menos 1 interacao social (like, comment, post, follow).

**Porque essa e melhor que alternativas:**

| Metrica Candidata | Problema | Veredicto |
|-------------------|----------|-----------|
| MAU | Muito vago, conta lurkers que nunca voltam | Rejeitada |
| DAU | Muito exigente para comunidade (nao e rede social pura) | Rejeitada |
| MRR | Metrica financeira, nao de valor do produto | Input metric, nao NSM |
| Posts criados | Exclui consumidores passivos que tem valor | Muito restritiva |
| Artigos lidos | Ignora componente social | Incompleta |
| **WAEM** | Captura consumo (valor curadoria) + participacao (valor comunidade) | **ACEITA** |

**Arvore de Metricas (NSM decomposta):**

```
WAEM (North Star)
├── Breadth: Quantos membros estao ativos?
│   ├── Signups novos por semana
│   ├── Reativacoes por semana
│   └── Churn semanal
│
├── Depth: Quao engajados estao?
│   ├── Artigos lidos por membro por semana
│   ├── Interacoes por membro por semana
│   ├── Sessoes por membro por semana
│   └── Tempo por sessao
│
├── Frequency: Com que frequencia voltam?
│   ├── Dias ativos por semana (media)
│   ├── DAU/WAU ratio
│   └── Streak medio
│
└── Quality: O engajamento tem valor?
    ├── Comments por post (qualidade de discussao)
    ├── Saves por post (valor percebido do conteudo)
    └── NPS / satisfacao
```

---

## 4. Engagement Loops vs Growth Loops

### Diferenca Fundamental

| | Engagement Loop | Growth Loop |
|-|----------------|-------------|
| **Objetivo** | Manter usuarios existentes ativos | Atrair novos usuarios |
| **Quem move** | O proprio usuario | Outros usuarios/SEO/viralidade |
| **Metrica** | Retencao, DAU, sessoes | Signups, conversao, K-factor |
| **Exemplo** | "Abro o feed todo dia" | "Compartilho post → amigo entra" |

### Engagement Loops do sinapse.club

```
LOOP 1: Conteudo Curado Diario
┌───────────────────────────────────────────────────────────────┐
│ Novo conteudo curado publicado (20-50 items/dia)             │
│   → Trigger: push/email "3 noticias de AI"                  │
│   → Acao: usuario abre, le artigos                           │
│   → Recompensa: aprende algo novo                            │
│   → Investimento: salva artigos, ajusta interesses           │
│   → Feed fica melhor → mais motivo pra voltar amanha         │
└───────────────────────────────────────────────────────────────┘

LOOP 2: Interacao Social
┌───────────────────────────────────────────────────────────────┐
│ Usuario posta/comenta                                         │
│   → Outros usuarios reagem (like, reply)                     │
│   → Trigger: notificacao "Fulano respondeu"                  │
│   → Acao: usuario volta pra ver resposta                     │
│   → Recompensa: validacao social                             │
│   → Investimento: responde de volta → gera mais notificacoes │
└───────────────────────────────────────────────────────────────┘

LOOP 3: Streak + Progresso
┌───────────────────────────────────────────────────────────────┐
│ Usuario completa dia de atividade                             │
│   → Streak incrementa (3, 5, 7, 14, 30 dias)                │
│   → Trigger: "Nao quebre seu streak de 7 dias!"             │
│   → Recompensa: badge/status + orgulho                       │
│   → Investimento: streak acumulado = custo de perder         │
└───────────────────────────────────────────────────────────────┘
```

### Growth Loops do sinapse.club

```
LOOP 1: SEO + Curadoria (Organico)
┌───────────────────────────────────────────────────────────────┐
│ Conteudo curado indexado pelo Google (PT-BR)                 │
│   → Busca organica "novidades AI portugues"                  │
│   → Visitante chega ao artigo                                │
│   → CTA: "Quer mais? Crie sua conta gratis"                 │
│   → Signup → mais conteudo consumido → mais pages indexadas  │
└───────────────────────────────────────────────────────────────┘

LOOP 2: Social Sharing (Viral)
┌───────────────────────────────────────────────────────────────┐
│ Membro cria post ou compartilha artigo curado                │
│   → Compartilha no X/LinkedIn com link do sinapse            │
│   → Followers veem o conteudo (gated ou parcial)             │
│   → CTA: "Leia completo no sinapse.club"                    │
│   → Signup → cria conteudo → compartilha → ciclo repete     │
└───────────────────────────────────────────────────────────────┘

LOOP 3: Referral (Word of Mouth)
┌───────────────────────────────────────────────────────────────┐
│ Membro indica amigo (link unico)                             │
│   → Amigo assina → membro ganha 1 mes gratis                │
│   → Amigo convida outro amigo (incentivo em cascata)         │
│   → K-factor > 1 = crescimento exponencial                  │
└───────────────────────────────────────────────────────────────┘

LOOP 4: Conteudo UGC (User-Generated)
┌───────────────────────────────────────────────────────────────┐
│ Membro cria post de qualidade                                 │
│   → Post e indexado pelo Google (SEO)                        │
│   → Mais visitantes organicos                                │
│   → Mais signups → mais UGC → mais SEO                      │
└───────────────────────────────────────────────────────────────┘
```

---

## 5. Cohort Analysis — Como Medir Retencao Corretamente

### O que e
Cohort analysis agrupa usuarios pela data de signup e rastreia seu comportamento ao longo do tempo. E a UNICA forma correta de medir retencao — metricas agregadas (como MAU total) escondem problemas.

### Tabela de Cohort — Template para sinapse.club

```
               Semana 0  Semana 1  Semana 2  Semana 3  Semana 4  Semana 8
Cohort Jan S1   100%       45%       35%       30%       28%       22%
Cohort Jan S2   100%       48%       38%       33%       30%       25%
Cohort Jan S3   100%       52%       42%       36%       33%       28%
Cohort Fev S1   100%       55%       44%       38%       35%       30%
```

**O que observar:**
1. **Curva de retencao:** A queda nas primeiras semanas e normal. O ideal e que estabilize (flatten) apos semana 4-8
2. **Melhoria entre cohorts:** Cada cohort novo deve reter MELHOR que o anterior (sinal de product-market fit)
3. **Ponto de estabilizacao:** Onde a curva para de cair = usuarios "retidos de verdade"

### Metricas de Retencao — Targets para sinapse.club

| Metrica | Target MVP | Target PMF | Benchmark Industria |
|---------|-----------|-----------|---------------------|
| D1 retention | 40% | 50% | 25-40% (communities) |
| D7 retention | 25% | 35% | 15-25% |
| D14 retention | 20% | 28% | 12-20% |
| D30 retention | 15% | 25% | 8-15% |
| D90 retention | 8% | 15% | 5-10% |
| DAU/MAU ratio | 15% | 25% | 10-20% (communities) |
| WAU/MAU ratio | 40% | 55% | 30-45% |

### SQL para Cohort Analysis (Supabase/Postgres)

```sql
-- Cohort retention semanal
WITH cohorts AS (
  SELECT
    id,
    DATE_TRUNC('week', created_at) as cohort_week,
    created_at
  FROM profiles
),
activity AS (
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('week', created_at) as activity_week
  FROM user_events
  WHERE event_type IN ('page_view', 'post_read', 'like', 'comment', 'post_create')
)
SELECT
  c.cohort_week,
  COUNT(DISTINCT c.id) as cohort_size,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week THEN c.id END) as week_0,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '1 week' THEN c.id END) as week_1,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '2 weeks' THEN c.id END) as week_2,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '4 weeks' THEN c.id END) as week_4,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '8 weeks' THEN c.id END) as week_8
FROM cohorts c
LEFT JOIN activity a ON c.id = a.user_id
GROUP BY c.cohort_week
ORDER BY c.cohort_week;
```

---

# PARTE 3 — PADROES DE ONBOARDING DOS MELHORES APPS

## 1. Duolingo — O Rei do Onboarding

### O que fazem

| Step | Conteudo | Psicologia |
|------|----------|-----------|
| 1 | "Eu quero aprender..." (escolhe idioma) | Commitment + personalizacao |
| 2 | "Por que voce quer aprender?" (motivacao) | Self-reflection, buy-in emocional |
| 3 | "Quanto tempo por dia?" (5/10/15/20 min) | Baixa barreira, qualquer resposta e valida |
| 4 | "Qual seu nivel?" (iniciante/basico/avancado) | Personalizacao, evitar frustacao |
| 5 | Primeira licao ANTES de pedir signup | **Valor antes de friccao** |
| 6 | "Voce acertou 80%! Crie sua conta para salvar" | Sunk cost — ja investiu, nao quer perder |
| 7 | Streak dia 1 + push permission | Habito formado desde o dia 1 |

### Principios extraidos

- **Valor antes de friccao:** Da a aula ANTES de pedir signup
- **Progressao psicologica:** Cada step diz "voce esta quase la"
- **Commitment escalation:** Comeca com perguntas faceis, escala gradualmente
- **Personalizacao real:** As respostas REALMENTE mudam a experiencia

### Aplicacao sinapse.club

```
EXTRAIR:
├── Perguntar motivacao ("Por que AI?") → personaliza mensagens futuras
├── Dar valor antes de friccao → mostrar feed curado ANTES de pedir signup completo
├── Streak desde o dia 1 → "Dia 1 na sinapse! Volte amanha para manter"
└── Progresso visivel → barra de "setup completo: 2 de 4 steps"
```

---

## 2. Slack — Onboarding Contextual

### O que fazem

| Step | Conteudo | Psicologia |
|------|----------|-----------|
| 1 | Criar workspace OU aceitar convite | Social proof (amigos ja estao la) |
| 2 | Sugestao de canais (default + custom) | Reducao de paradoxo de escolha |
| 3 | Slackbot mensagem de boas-vindas | Personificacao, nao parece "sistema" |
| 4 | "Envie sua primeira mensagem" prompt | CTA claro, acao minima |
| 5 | Tour contextual (tooltips on hover) | Aprende usando, nao lendo manual |
| 6 | Sugestao de integracao (Google Drive, etc.) | Investimento imediato |

### Principios extraidos

- **Bot de boas-vindas:** Humaniza a experiencia
- **Canais sugeridos:** Nao deixa o usuario decidir tudo sozinho
- **Tour contextual:** Tooltips que aparecem conforme o usuario explora
- **Acao guiada:** "Escreva sua primeira mensagem" com placeholder claro

### Aplicacao sinapse.club

```
EXTRAIR:
├── Bot/system message de boas-vindas no feed ("Bem-vindo! Aqui estao 3 posts pra comecar")
├── Spaces sugeridos baseados nos interesses do onboarding
├── Auto-join nos spaces relevantes (nao pedir pra escolher)
├── Tooltip contextual: "Isso e um post curado. Clique pra ler traduzido"
└── CTA claro: "Curta seu primeiro post" com destaque visual
```

---

## 3. Twitter/X — Discovery-First

### O que fazem

| Step | Conteudo | Psicologia |
|------|----------|-----------|
| 1 | Signup (email/Google/Apple) | Minimo de friccao |
| 2 | Escolher interesses (categorias amplas) | Personalizacao do "For You" |
| 3 | Seguir pessoas sugeridas (grid com fotos) | Feed preenchido imediatamente |
| 4 | Feed JA populado na primeira visita | Valor instantaneo |
| 5 | "Who to follow" persistente no sidebar | Investimento continuo |
| 6 | Trending topics + explore | Descoberta passiva |

### Principios extraidos

- **Follow suggestions agressivas:** Grid visual de 20+ sugestoes, facil de clicar
- **Feed nunca vazio:** Mesmo com 0 follows, o "For You" funciona
- **Discovery sidebar:** Sempre mostrando novos perfis para seguir
- **Trending:** Conteudo popular = validacao de que o app tem valor

### Aplicacao sinapse.club

```
EXTRAIR:
├── Grid de "quem seguir" no onboarding (admin + power users + bots de curadoria)
├── Feed NUNCA vazio (usar conteudo curado como fallback)
├── Sidebar "Trending em AI" desde a primeira visita
├── "Quem seguir" permanente no painel direito
└── Auto-follow em perfil oficial + bot de curadoria (opt-out, nao opt-in)
```

---

## 4. Discord — Community Discovery

### O que fazem

| Step | Conteudo | Psicologia |
|------|----------|-----------|
| 1 | Criar conta (username, nao email primeiro) | Identidade antes de burocracia |
| 2 | "Create server" ou "Join server" | Objetivo claro |
| 3 | Server discovery (search + categorias) | Catalogo de comunidades |
| 4 | Role selection no server (self-assign) | Investimento + personalizacao |
| 5 | Welcome channel com regras + onboarding | Contexto imediato |
| 6 | Channel suggestions baseadas em roles | Feed personalizado |

### Principios extraidos

- **Role selection:** Deixa o usuario se auto-categorizar (developer, iniciante, etc.)
- **Welcome channel:** Espaco dedicado para novatos
- **Rules upfront:** Expectativas claras sobre a comunidade
- **Channel suggestions:** Nao mostra TUDO, mostra o RELEVANTE

### Aplicacao sinapse.club

```
EXTRAIR:
├── Self-assign de "role": "Sou developer / founder / estudante / curioso"
├── Thread de boas-vindas (automatica) com CTA: "Apresente-se!"
├── Mostrar apenas Spaces relevantes para o role/interesses
├── Regras da comunidade visivel mas nao intrusiva
└── Onboarding progressivo: revela features conforme o usuario usa
```

---

## 5. Notion — Use Case Selection

### O que fazem

| Step | Conteudo | Psicologia |
|------|----------|-----------|
| 1 | "What will you use Notion for?" (categorias) | Personalizacao |
| 2 | Templates baseados na resposta | Valor instantaneo, nao comeca do zero |
| 3 | Workspace pre-populado | Reduz blank-page syndrome |
| 4 | Tutorial inline (interactive) | Aprende fazendo |
| 5 | "Invite team" prompt | Investimento social |

### Principios extraidos

- **Use case selection:** O produto se adapta ao usuario, nao o contrario
- **Templates:** Ninguem gosta de pagina em branco. Pre-popular com exemplos
- **Tutorial inline:** Nao e um video separado, e dentro do produto

### Aplicacao sinapse.club

```
EXTRAIR:
├── Perguntar use case: "Quero me atualizar" / "Quero aprender" / "Quero conectar"
├── Feed pre-organizado baseado na resposta
│   ├── "Atualizar" → foco em curadoria, trending, digest
│   ├── "Aprender" → foco em cursos, tutorials, recursos
│   └── "Conectar" → foco em posts UGC, discussions, who to follow
├── Template de perfil baseado no role (developer, founder, student)
└── Tutorial inline: primeiro "like" e guiado visualmente
```

---

## Onboarding Ideal sinapse.club — Sintese

### Flow Redesenhado (6 Steps, ~2 minutos)

```
STEP 1 — IDENTIDADE (5 seg)
┌──────────────────────────────────────────┐
│ "Como voce quer ser chamado?"            │
│ [Input: nome]                            │
│ Avatar: upload OU auto-generate          │
│ [Continuar]                              │
└──────────────────────────────────────────┘
  Psicologia: identidade + commitment

STEP 2 — MOTIVACAO (10 seg)
┌──────────────────────────────────────────┐
│ "O que te traz ao sinapse?"              │
│ ○ Me manter atualizado sobre AI          │
│ ○ Aprender AI do zero                    │
│ ○ Conectar com profissionais de AI       │
│ ○ Tudo acima                             │
│ [Continuar]                              │
└──────────────────────────────────────────┘
  Psicologia: self-reflection + personaliza onboarding

STEP 3 — INTERESSES (15 seg)
┌──────────────────────────────────────────┐
│ "O que te interessa em AI?"              │
│ [Grid 2x3 de interesses com icones]      │
│ LLMs | Coding | Carreira                 │
│ Research | Generativa | MLOps            │
│ (selecione pelo menos 1)                 │
│ [Continuar]                              │
└──────────────────────────────────────────┘
  Psicologia: personalizacao real do feed

STEP 4 — FOLLOW (20 seg)
┌──────────────────────────────────────────┐
│ "Siga pessoas relevantes"                │
│ ┌─────────────────────────────────────┐  │
│ │ 🔵 sinapse (oficial)  [Seguindo]   │  │
│ │ 🤖 AI Curator (bot)   [Seguir]     │  │
│ │ 👤 Caio Imori (admin)  [Seguir]    │  │
│ │ 👤 Power User 1        [Seguir]    │  │
│ │ 👤 Power User 2        [Seguir]    │  │
│ └─────────────────────────────────────┘  │
│ "Seguir todos" [link]                    │
│ [Continuar]                              │
└──────────────────────────────────────────┘
  Psicologia: feed populado + investimento

STEP 5 — PREVIEW + IDIOMA (15 seg)
┌──────────────────────────────────────────┐
│ "Idioma preferido"                       │
│ ○ 🇧🇷 Portugues (conteudo traduzido)    │
│ ○ 🌐 English (original)                 │
│                                          │
│ Preview: 3 cards de artigos curados      │
│ [Card 1] [Card 2] [Card 3]              │
│                                          │
│ "Esse e o tipo de conteudo que voce      │
│  encontra aqui todos os dias"            │
│ [Explorar o feed →]                      │
└──────────────────────────────────────────┘
  Psicologia: valor tangivel + confirmacao visual

STEP 6 — FEED (destino)
┌──────────────────────────────────────────┐
│ Feed personalizado com:                  │
│ - Conteudo curado dos interesses         │
│ - Posts de quem o usuario seguiu         │
│ - Banner: "Bem-vindo! ❤ seu 1o post"    │
│ - Tooltip: "Isso e um post curado →"    │
│ - Sidebar: "Trending em AI" + mais       │
│   sugestoes de follow                    │
└──────────────────────────────────────────┘
  Psicologia: aha moment imediato
```

**Delta vs onboarding atual:** O onboarding existente tem 3 steps (idioma, interesses, pronto). A proposta adiciona motivacao (personaliza messaging), follow suggestions (popula feed), e preview de valor (reduz incerteza). O step "pronto" generico e substituido por preview com conteudo real.

---

# PARTE 4 — ESTRATEGIA DE NOTIFICACOES

## Principios Fundamentais

### 1. Cada notificacao deve passar o teste de 3 perguntas:

| Pergunta | Criterio |
|----------|---------|
| **E relevante?** | Baseada nos interesses/comportamento do usuario? |
| **E acionavel?** | O usuario sabe exatamente o que fazer ao clicar? |
| **E oportuna?** | O timing faz sentido (nao madrugada, nao durante trabalho)? |

Se qualquer resposta for "nao", nao envie.

### 2. Hierarquia de Urgencia

```
URGENCIA ALTA (tempo real):
├── Alguem respondeu SEU post/comentario
├── Alguem te mencionou (@)
├── Alguem comecou a te seguir
└── Live comecando em 5 min

URGENCIA MEDIA (batch, 2-3x/dia):
├── Post trending no seu Space favorito
├── Novo conteudo curado nos seus interesses
├── "X pessoas curtiram seu post"
└── Streak reminder

URGENCIA BAIXA (digest, 1x/dia ou semana):
├── Resumo semanal de atividade
├── "Voce perdeu 5 posts populares"
├── Novo curso disponivel
├── Update de features da plataforma
```

---

## Push Notifications

### Melhores Praticas por Plataforma

| Plataforma | Estrategia | Resultado |
|-----------|-----------|-----------|
| **Duolingo** | 1 push/dia as 13h (horario de almoco). Tom pessoal ("You haven't practiced today!"). Testa 20+ variantes | D7 retention +10% vs sem push |
| **Twitter** | Push para interacoes sociais (like, reply, follow). Batch digests. "You missed X tweets" | Re-engagement de usuarios inativos |
| **YouTube** | Push para videos de canais inscritos + videos recomendados. "New from [channel]" | 30%+ dos DAU vem de push |
| **Instagram** | Push social (likes, follows, DMs) + stories de amigos proximos + IGTV | Timed para horarios de pico |
| **Slack** | Push para DMs e mentions. Mute por canal. "Do Not Disturb" inteligente | Nao irrita, so notifica o essencial |

### Estrategia de Push do sinapse.club

| Tipo | Conteudo | Frequencia | Horario |
|------|----------|-----------|---------|
| **Social direto** | "Fulano respondeu seu comentario" | Real-time | Qualquer (urgente) |
| **Social indireto** | "5 pessoas curtiram seu post" | Batch 2x/dia | 12h e 18h |
| **Conteudo** | "Nova noticia quente de AI" | 1x/dia (max) | 8h (manha) |
| **Streak** | "Nao quebre seu streak de 5 dias!" | 1x/dia (se nao entrou) | 20h |
| **Evento** | "Live em 15 minutos: [titulo]" | Pontual | 15 min antes |
| **Reengagement** | "Voce perdeu 3 posts populares" | 1x a cada 3 dias (se inativo 48h+) | 10h |

### Copy Templates para Push

```
SOCIAL:
├── "@{nome} respondeu: '{preview 30 chars}...'"
├── "{nome} e mais {N} curtiram seu post"
├── "{nome} comecou a te seguir"
└── "{nome} te mencionou em '{preview}'"

CONTEUDO:
├── "🔥 {titulo artigo} — novo no sinapse"
├── "Top 3 de AI hoje: {titulo1}, {titulo2}..."
├── "Trending agora: {topico} ({N} posts)"
└── "Nova ferramenta de AI: {nome} — veja o que a comunidade acha"

STREAK/GAMIFICATION:
├── "🔥 Streak de {N} dias! Nao quebre hoje"
├── "Voce esta no Top {N}% da comunidade essa semana"
├── "Falta 1 artigo pra completar sua meta do dia"
└── "Nivel {N} desbloqueado! Confira seus badges"

REENGAGEMENT:
├── "Sentimos sua falta! {N} posts novos desde sua ultima visita"
├── "{nome_que_segue} publicou algo novo"
├── "Os 3 posts mais comentados da semana (voce ainda nao viu)"
└── "Novidade: {feature nova} — confira"
```

---

## Email Digest

### Frequencias Otimas por Segmento

| Segmento | Frequencia | Conteudo | Horario |
|----------|-----------|----------|---------|
| **Onboarding (0-7 dias)** | Diario | "Seu digest de AI" + onboarding tips | 8h |
| **Ativo engajado** | 2-3x/semana | Top posts + trending + atividade pessoal | Ter/Qui/Sab 8h |
| **Ativo passivo** | Semanal | Best of week + FOMO highlights | Sabado 10h |
| **Inativo (7+ dias)** | Semanal → quinzenal | "Voce perdeu X coisas" + CTA forte | Segunda 10h |
| **Churned (30+ dias)** | Mensal | "Mudou muito! Volte e veja" + oferta | Primeira segunda do mes |

### Template de Email Digest Semanal

```
SUBJECT: Sua semana em AI — {data}

SECAO 1: Stats Pessoais
"Voce leu {N} artigos, curtiu {N} posts e manteve um streak de {N} dias."

SECAO 2: Top 5 Posts da Semana
[Card 1: Titulo + 2 linhas + autor + likes]
[Card 2: ...]
...

SECAO 3: Trending em AI
"Essa semana todo mundo falou sobre: {topico1}, {topico2}, {topico3}"

SECAO 4: Novos Membros que Voce Deveria Seguir
[Avatar + nome + bio curta + botao Seguir]

SECAO 5: CTA
"Continue explorando no sinapse.club →"

FOOTER:
Gerenciar preferencias de email | Cancelar inscricao
```

---

## Notificacoes In-App

### Tipos e Prioridade Visual

| Tipo | Indicador Visual | Persistencia | Exemplo |
|------|-----------------|-------------|---------|
| **Badge** | Numero no icone (bell) | Ate clicar | "3 novas notificacoes" |
| **Toast** | Banner temporario (3-5s) | Auto-dismiss | "Post publicado com sucesso" |
| **Inline** | Destaque no feed | Ate ver | "Novo post de @fulano" (highlight) |
| **Banner** | Barra no topo da pagina | Ate dismiss manual | "Novo: cursos disponiveis!" |
| **Modal** | Overlay | Ate dismiss | "Parabens! Streak de 7 dias!" |

### Sistema de Notificacoes In-App Recomendado

```
BELL ICON (canto superior direito):
├── Badge numerico (notificacoes nao lidas)
├── Dropdown com lista de notificacoes
├── Tipos:
│   ├── 🔴 Social: likes, replies, follows, mentions
│   ├── 🔵 Conteudo: trending, novo artigo relevante
│   ├── 🟢 Sistema: badge ganho, streak, nivel
│   └── 🟡 Admin: novidade da plataforma, evento
├── Agrupamento: "Fulano e mais 4 curtiram seu post" (nao 5 notificacoes separadas)
└── "Marcar todas como lidas" link

INLINE FEED:
├── Posts novos desde ultima visita: "3 novos posts ↑" (banner clicavel)
├── Post de alguem que voce segue: highlight sutil na borda
└── Post trending: badge "🔥 trending" no card

TOASTS (canto inferior):
├── Acao concluida: "Post publicado" / "Comentario enviado"
├── Achievement: "🎉 Streak de 7 dias!"
└── Error: "Nao foi possivel publicar. Tente novamente"
```

---

## FOMO sem ser Irritante — Principios

### O que funciona

| Mecanismo | Exemplo | Porque funciona |
|-----------|---------|-----------------|
| **Contagem social** | "127 pessoas ja viram isso" | Social proof, nao pressao |
| **Time-based scarcity** | "Live em 2 horas" (nao "CORRA!") | Informativo, nao manipulativo |
| **Personalized FOMO** | "Posts de @fulano que voce segue" | Relevante, nao generico |
| **Recap** | "Voce perdeu 3 posts populares" | Valor perdido real, nao inventado |
| **Streak visual** | Calendario com dias marcados | Autocompetitividade, nao pressao externa |

### O que NAO funciona (evitar)

| Mecanismo | Porque nao funciona |
|-----------|-------------------|
| "VOCE ESTA PERDENDO!" (caps, urgencia falsa) | Irritante, perde credibilidade |
| 5+ push/dia | Notificacao fadigue → mute → uninstall |
| Notificacao generica sem personalizacao | "Novo post" → tao vago que ignora |
| Guilting ("Faz 10 dias que voce nao entra...") | Funciona 1x, depois irrita |
| Fake urgency ("Ultimo dia para...") quando nao e | Destroi confianca |

---

# PARTE 5 — MOTORES DE RECOMENDACAO DE CONTEUDO

## 1. Twitter/X — "For You" Algorithm

### Como Funciona

O ranking do Twitter/X usa 3 fontes + um score final:

```
FONTES DE CANDIDATOS:
├── In-Network (50%): posts de quem voce segue
│   ├── Ranked por engagement (likes, replies, retweets)
│   ├── Recencia (time decay)
│   └── Afinidade (quao perto voce e do autor)
│
├── Out-of-Network (50%): posts de quem voce NAO segue
│   ├── "Social proof": posts que pessoas como voce engajaram
│   ├── Trending topics
│   └── Graph-based: amigos de amigos, interesses similares
│
└── Ads (intercalados)

SINAIS DE RANKING (peso):
├── Like: 30x base weight
├── Retweet: 20x
├── Reply: 1x (mais peso = mais valor)
├── Profile click: 12x
├── Time spent reading: variavel
├── Media engagement (video watch, image expand): variavel
├── Bookmark: 40x (sinal mais forte — "quero guardar")
├── Negative signals: mute (-74x), block (-100x), "not interested" (-50x)
```

### Sinais Adaptaveis para sinapse.club

| Sinal Twitter | Equivalente sinapse.club | Peso Sugerido |
|--------------|-------------------------|---------------|
| Like | Like/reacao | 10x |
| Retweet | Repost/compartilhar | 15x |
| Reply | Comentario | 20x (comentarios tem mais valor em comunidade) |
| Bookmark | Bookmark/salvar | 30x (sinal de alto valor) |
| Quote tweet | Quote post | 25x |
| Profile click | Visita ao perfil do autor | 8x |
| Time spent | Tempo lendo o post (scroll depth) | Variavel |
| Mute | Mute usuario/space | -50x |
| Report | Report | -100x |

---

## 2. Reddit — "Hot" Algorithm

### Como Funciona

```python
# Reddit Hot Score (simplificado)
def hot_score(upvotes, downvotes, created_at):
    score = log10(max(abs(upvotes - downvotes), 1))
    sign = 1 if upvotes > downvotes else (-1 if upvotes < downvotes else 0)
    age_hours = (now() - created_at).total_seconds() / 3600

    # O segredo: o TEMPO e um divisor que cresce linearmente
    # Posts velhos precisam de MUITO mais votos pra competir
    return sign * score - age_hours / 12
```

### Principios Chave

1. **Time decay forte:** Um post de 12 horas atras precisa de 10x mais votos que um de 1 hora
2. **Logaritmico em votos:** A diferenca entre 10 e 100 votos e menor que entre 1 e 10
3. **Sign matters:** Posts controversos (muitos up E down) ficam neutros
4. **"New" e separado:** Reddit tem tab "New" para cronologico puro

### Adaptacao para sinapse.club

```
HOT (default):
├── Score = engagement_score * time_decay
├── engagement_score = log10(likes + 2*comments + 3*saves + 5*reposts)
├── time_decay = 1 / (hours_since_posted / 12 + 1)
├── Boost: +2x se post e de usuario PRO/PREMIUM
├── Boost: +1.5x se post e curado (fonte verificada)
└── Penalty: -0.5x se autor tem < 5 posts (spam prevention)

FOLLOWING (cronologico filtrado):
├── Apenas posts de quem voce segue
├── Ordenados por created_at DESC
└── Sem algoritmo

NEW (cronologico puro):
├── Todos os posts
├── Ordenados por created_at DESC
└── Sem filtro
```

---

## 3. TikTok — O Rei da Recomendacao

### Como Funciona

```
SINAIS PRIMARIOS:
├── Watch time / completion rate (MAIS IMPORTANTE)
│   ├── Viu 100% do video = sinal forte positivo
│   ├── Reviu o video = sinal MUITO forte
│   ├── Saiu em 2 segundos = sinal negativo
│   └── Watch time > duration = replay = top sinal
│
├── Engagement signals (secundario)
│   ├── Like, comment, share, save
│   ├── Follow apos ver video
│   └── Ir ao perfil do criador
│
└── Content features (contexto)
    ├── Hashtags, sons, texto no video
    ├── Categoria/topico inferido
    └── Idioma e localizacao

SISTEMA DE DISTRIBUICAO:
├── Nivel 1: ~500 viewers (teste inicial)
│   ├── Se completion rate > 50% → nivel 2
│   └── Se completion rate < 20% → para
│
├── Nivel 2: ~5,000 viewers
│   ├── Se engagement rate > threshold → nivel 3
│   └── Senao → desacelera
│
├── Nivel 3: ~50,000 viewers (viral candidato)
│   └── Se mantiver metricas → nivel 4
│
└── Nivel 4: ~500,000+ (viral confirmado)
```

### Principios Adaptaveis para sinapse.club

| Principio TikTok | Adaptacao sinapse.club |
|-----------------|----------------------|
| Completion rate como sinal #1 | **Scroll depth / tempo no post** como sinal primario |
| Sistema de niveis de distribuicao | Posts novos testados com subset de usuarios → se engajarem, ampliar |
| Replay = sinal maximo | Revisita ao post (voltar ao mesmo) = sinal forte |
| Content-first (nao follower-first) | Feed "Para Voce" baseado em conteudo, nao apenas follows |
| Nao precisa de seguidores pra viralizar | Posts de novos membros podem aparecer no feed global |

---

## 4. Algoritmo Recomendado para sinapse.club

### Feed "Para Voce" (tab principal)

```
PIPELINE DE RANKING:
1. CANDIDATE GENERATION (pool de posts)
   ├── Posts de quem voce segue (ultimas 48h)
   ├── Posts trending nos seus Spaces (ultimas 24h)
   ├── Conteudo curado nos seus interesses (ultimas 24h)
   └── Posts com alto engagement global (ultimas 12h)

2. SCORING (cada candidato recebe score)
   score = (
     interest_match * 3.0        # match com interesses do usuario
     + author_affinity * 2.0     # quao proximo e do autor
     + engagement_rate * 2.5     # likes + comments / views
     + freshness * 1.5           # time decay
     + content_quality * 1.0     # curated > ugc se qualidade similar
     + diversity_bonus * 0.5     # variar fontes e autores
   )

3. DIVERSITY FILTER (evitar monotonia)
   ├── Max 3 posts do mesmo autor em sequencia
   ├── Max 5 posts curados em sequencia (intercalar com UGC)
   ├── Pelo menos 1 post de Space diferente a cada 7 posts
   └── Pelo menos 1 post "surpresa" (fora dos interesses) a cada 10 posts

4. RANKING FINAL
   ├── Score DESC
   ├── Intercalar curado e UGC
   └── Sticky: posts pinados pelo admin no topo
```

### Cold Start Problem — Novos Usuarios

```
USUARIO NOVO (0-3 dias):
├── Usar interesses do onboarding como proxy
├── Feed 70% curado + 30% UGC mais popular
├── Weight alto em trending e "hot" global
├── Sugestoes de follow agressivas (sidebar + inline)
└── Conforme interage, feedback loop comeca

USUARIO RETORNANTE SEM DADOS (visitante que fez signup):
├── Feed 100% curado (posts mais populares da semana)
├── Prompt: "Selecione seus interesses pra personalizar"
├── Mostrar "Best of sinapse" como vitrine
└── Transicao gradual pra personalizado conforme coleta sinais

CONTEUDO NOVO (post sem engajamento):
├── Distribuir para ~50 usuarios com interesses match
├── Se engagement rate > 5% em 1h → ampliar
├── Se engagement rate < 1% em 2h → desacelerar
├── Boost para primeiros posts de membros novos (+2x distribuicao)
└── Posts de membros PRO/PREMIUM tem baseline de distribuicao maior
```

### Implementacao Tecnica (Supabase/Postgres)

```sql
-- Feed scoring simplificado (v1, sem ML)
CREATE OR REPLACE FUNCTION get_personalized_feed(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(post_id UUID, score FLOAT) AS $$
BEGIN
  RETURN QUERY
  WITH user_interests AS (
    SELECT unnest(interests) as interest FROM profiles WHERE id = p_user_id
  ),
  user_follows AS (
    SELECT following_id FROM follows WHERE follower_id = p_user_id
  ),
  scored_posts AS (
    SELECT
      p.id as post_id,
      -- Interest match (3.0x)
      CASE WHEN p.space_slug IN (SELECT interest FROM user_interests) THEN 3.0 ELSE 0 END
      -- Author affinity (2.0x)
      + CASE WHEN p.author_id IN (SELECT following_id FROM user_follows) THEN 2.0 ELSE 0 END
      -- Engagement rate (2.5x)
      + (COALESCE(p.likes_count, 0) + COALESCE(p.comments_count, 0) * 2) * 2.5
        / GREATEST(COALESCE(p.views_count, 1), 1)
      -- Freshness (1.5x, decay over 24h)
      + 1.5 / (EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 86400 + 1)
      -- Content quality (1.0x)
      + CASE WHEN p.is_curated THEN 1.0 ELSE 0 END
      AS score
    FROM posts p
    WHERE p.created_at > NOW() - INTERVAL '48 hours'
      AND p.author_id != p_user_id -- nao mostrar seus proprios posts
      AND NOT EXISTS ( -- nao mostrar posts de usuarios mutados
        SELECT 1 FROM mutes m WHERE m.user_id = p_user_id AND m.muted_id = p.author_id
      )
  )
  SELECT sp.post_id, sp.score
  FROM scored_posts sp
  ORDER BY sp.score DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
```

---

# PARTE 6 — PSICOLOGIA DE PRICING PARA COMUNIDADES

## 1. Por que R$ 49/mo e o Sweet Spot

### Psicologia do Preco no Brasil (Tech)

| Faixa | Percepcao | Conversao | Exemplo |
|-------|-----------|-----------|---------|
| R$ 0-19/mo | "Barato demais, sera que presta?" | Alta mas desqualificada | Newsletter premium |
| R$ 20-39/mo | "Acessivel, posso testar" | Alta, boa qualidade | Comunidade basica |
| **R$ 40-59/mo** | **"Investimento justo, espero valor real"** | **Media-alta, qualificada** | **Comunidade premium** |
| R$ 60-99/mo | "Preciso pensar, e um compromisso" | Media, precisa de prova social | Plataforma educacional |
| R$ 100-199/mo | "Caro, so se realmente valer" | Baixa, precisa de trial | Alura, Rocketseat |
| R$ 200+/mo | "So pra empresa pagar" | Muito baixa p/ B2C | Ferramentas B2B |

### O Enquadramento R$ 49/mo

```
R$ 49/mo = R$ 1.63/dia

Framing:
├── "Menos que um cafe por dia"
├── "Menos que uma ida ao cinema por mes"
├── "Menos que 1 hora do seu salario como dev"
├── "ROI: 1 insight que melhora seu trabalho = paga o mes inteiro"
└── "Investimento: 30 artigos curados/dia x 30 dias = 900 artigos = R$ 0.054 cada"
```

### Ancoragem

```
PRICING PAGE (3 colunas):

FREE          PRO ★ POPULAR        PREMIUM
R$ 0          R$ 49/mo             R$ 97/mo
              R$ 39/mo (anual)     R$ 77/mo (anual)

A existencia do Premium a R$ 97 faz o Pro a R$ 49 parecer "barato".
A existencia do Free faz o Pro parecer "vale a pena o upgrade".
O badge "POPULAR" no Pro direciona 70% das conversoes.
```

---

## 2. Free vs Freemium vs Paid-Only

### Analise para Comunidades

| Modelo | Quando funciona | Quando nao funciona | sinapse.club |
|--------|----------------|-------------------|-------------|
| **Free-only (monetiza ads)** | Escala massiva (milhoes de MAU) | Nicho, <100k MAU | NAO |
| **Paid-only (sem free)** | Marca forte, social proof, nicho premium | Lancamento, sem prova social | NAO (MVP) |
| **Freemium (free + paid tiers)** | Comunidades em crescimento, SEO, viral | Nada no free tem valor real | SIM |

### O Modelo Freemium Ideal para sinapse.club

```
FREE (generoso o suficiente pra demonstrar valor):
├── Feed curado limitado (10 artigos/dia)
├── 1 Space publico (AI News — mais popular)
├── Perfil basico (sem GitHub integration)
├── Pode ler posts e comentarios
├── Pode criar ate 5 posts/semana
├── NENHUM curso incluido
└── Anuncio sutil de upgrade em pontos estrategicos

PRO (valor claro e tangivel):
├── Feed curado ILIMITADO (20-50 artigos/dia)
├── Todos os Spaces
├── Perfil completo + GitHub repos
├── Posts ilimitados
├── Lives mensais + gravacoes
├── Badge PRO no perfil
├── Desconto 15% em cursos
└── Email digest personalizado

PREMIUM (exclusividade e acesso):
├── Tudo do Pro +
├── Workshops exclusivos (2x/mes)
├── Canal privado de networking
├── Office hours (15 min/mes com Caio)
├── Desconto 30% em cursos
├── Badge PREMIUM no perfil
├── Early access a features novas
└── Prioridade no suporte
```

### A Linha Divisoria Free→Paid

**Regra de ouro:** O usuario free deve entender o valor do produto em 3 sessoes, mas sentir a limitacao na 4a.

```
Sessao 1: "Uau, tem conteudo bom aqui!" (10 artigos gratuitos)
Sessao 2: "Legal, ja li bastante" (mais 10 artigos)
Sessao 3: "Quero ver mais, mas ja vi os 10 de hoje..." (limitacao aparece)
Sessao 4: "Modal: Quer acesso ilimitado? Pro por R$ 49/mo" → CONVERSAO
```

---

## 3. Annual vs Monthly — Padroes de Conversao

### Dados de Mercado

| Metrica | Monthly | Annual | Fonte |
|---------|---------|--------|-------|
| Churn mensal | 6-10% | 2-4% (dividido por 12) | SaaS benchmarks |
| Adoption rate | 60-70% | 30-40% | Comunidades tech BR |
| LTV multiplicador | 1x base | 1.8-2.5x | Reduced churn effect |
| Cash flow | Mensal | Upfront (melhor) | Obvio |

### Estrategia de Conversao para Annual

| Tatica | Como | Impacto |
|--------|------|---------|
| **Desconto visivel** | "R$ 39/mo no plano anual (economize 20%)" | +15% annual adoption |
| **Preco riscado** | ~~R$ 588~~ R$ 470/ano | Ancora no valor cheio |
| **Parcelamento** | "12x R$ 39,17 no cartao" | Remove barreira BR |
| **Default annual** | Tab "Anual" pre-selecionada na pricing page | +20% annual adoption |
| **Trial no annual** | "7 dias gratis no plano anual" | Reduz risco percebido |
| **Bonus exclusivo annual** | "Annual: ganhe 1 mini-curso gratis" | Valor adicional |

---

## 4. Pricing Page UX que Converte

### Layout Recomendado

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  TOGGLE: [Mensal] [Anual ✨ economize 20%]     ← pre-selecionado Anual │
│                                                                         │
│  ┌──────────────┐  ┌──────────────────────┐  ┌──────────────┐          │
│  │    FREE      │  │    PRO ★ POPULAR     │  │   PREMIUM    │          │
│  │              │  │  ┌── ribbon/badge ──┐ │  │              │          │
│  │  R$ 0       │  │  │ MAIS ESCOLHIDO   │ │  │  R$ 77/mo   │          │
│  │  /sempre    │  │  │                  │ │  │  no anual    │          │
│  │              │  │  │  R$ 39/mo        │ │  │              │          │
│  │ ✓ Feed lim. │  │  │  no anual        │ │  │ ✓ Tudo Pro + │          │
│  │ ✓ 1 space   │  │  │                  │ │  │ ✓ Workshops  │          │
│  │ ✓ 5 posts   │  │  │  ~~R$ 49/mo~~    │ │  │ ✓ Canal priv │          │
│  │ ✗ Cursos    │  │  │                  │ │  │ ✓ Office hr  │          │
│  │ ✗ Lives     │  │  │ ✓ Feed ilimitado │ │  │ ✓ 30% desc   │          │
│  │ ✗ Badge     │  │  │ ✓ Todos spaces   │ │  │ ✓ Badge PREM │          │
│  │              │  │  │ ✓ Posts ilimit.  │ │  │ ✓ Early acc  │          │
│  │ [Comece      │  │  │ ✓ Lives mensais  │ │  │              │          │
│  │  gratis]     │  │  │ ✓ Badge PRO      │ │  │ [Assinar     │          │
│  │              │  │  │ ✓ 15% desc curso │ │  │  Premium]    │          │
│  │              │  │  │                  │ │  │              │          │
│  │              │  │  │ [Comece 7 dias   │ │  │              │          │
│  │              │  │  │  gratis →]       │ │  │              │          │
│  │              │  │  └─────────────────┘ │  │              │          │
│  └──────────────┘  └──────────────────────┘  └──────────────┘          │
│                                                                         │
│  "Sem compromisso. Cancele quando quiser."                             │
│  "Pagamento seguro via PIX ou cartao (AbacatePay)"                    │
│  ⭐ "Mais de {N} profissionais de AI ja fazem parte"                   │
│                                                                         │
│  ┌─── FAQ ────────────────────────────────────────────────────────┐    │
│  │ "Posso cancelar a qualquer momento?" → Sim, sem multa         │    │
│  │ "Aceita PIX?" → Sim! E mais barato que cartao                 │    │
│  │ "Tem nota fiscal?" → Sim, emitida automaticamente             │    │
│  │ "E se eu nao gostar?" → 7 dias gratis, sem risco              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Principios de Conversao da Pricing Page

| Principio | Implementacao |
|-----------|--------------|
| **Ancoragem** | Premium alto faz Pro parecer acessivel |
| **Default option** | Pro com badge "POPULAR" + border destacada |
| **Loss aversion** | Mostrar o que Free NAO tem (✗ com vermelho/cinza) |
| **Social proof** | "{N} profissionais ja fazem parte" |
| **Risk reversal** | "7 dias gratis" + "cancele quando quiser" |
| **PIX prominence** | "Aceita PIX" → BR valoriza muito isso |
| **Price framing** | R$ 39/mo (nao R$ 470/ano) → parecer mensal |
| **FAQ** | Responder objecoes antes que o usuario saia |

---

## 5. "Founding Member" e Early Adopter Pricing

### A Estrategia

```
FASE 1: PRE-LANCAMENTO (antes de ir ao ar)
├── Lista de espera: "Garanta seu lugar como Founding Member"
├── Beneficio: preco travado PARA SEMPRE
├── Limite: 100 Founding Pro + 30 Founding Premium
├── Scarcity real: "67/100 vagas preenchidas"
└── Urgencia: "Apos as vagas, preco sobe pra R$ 49/mo"

FASE 2: LANCAMENTO (primeiros 30 dias)
├── Founding Pro: R$ 29/mo (travado para sempre)
├── Founding Premium: R$ 67/mo (travado para sempre)
├── Badge exclusivo "FOUNDING MEMBER" no perfil (nunca mais disponivel)
├── Canal exclusivo "Founders" (mesmo quando virar membro normal seria Pro)
└── Prioridade em roadmap (voto em features)

FASE 3: POS-LANCAMENTO (dia 31+)
├── Preco regular: Pro R$ 49/mo, Premium R$ 97/mo
├── Founding members mantem preco antigo
├── Novo badge: "EARLY ADOPTER" (para quem entra no primeiro trimestre)
└── Early Adopter desconto: 15% off no primeiro ano
```

### Psicologia do Founding Member

| Mecanismo Psicologico | Como funciona |
|-----------------------|--------------|
| **Scarcity** | "So 100 vagas" → precisa decidir rapido |
| **Loss aversion** | "Se perder, nunca mais tera esse preco" → medo de perder |
| **Status** | Badge "FOUNDING MEMBER" = reconhecimento permanente |
| **Sunk cost** | Preco travado = "nao posso cancelar, senao perco o deal" |
| **Reciprocity** | "Confiou em nos no inicio" → lealdade mutua |
| **Identity** | "Sou um dos primeiros" → identidade com a marca |

---

# JORNADA IDEAL DO USUARIO — Da Primeira Visita ao DAU

## Timeline Completa

```
═══════════════════════════════════════════════════════════════════════════
FASE 0: DESCOBERTA (pre-signup)
═══════════════════════════════════════════════════════════════════════════

Dia -X: Descobre o sinapse.club via:
  ├── Google (busca "noticias AI portugues") → artigo curado
  ├── X/LinkedIn (post de membro compartilhado) → preview
  ├── Indicacao de amigo (link de referral)
  └── Instagram carrossel (conteudo de AI)

Landing page:
  ├── Hero: "Tudo sobre AI. Em portugues. Curado pra voce."
  ├── Preview: 3 cards de artigos curados (valor tangivel)
  ├── Social proof: "{N} profissionais de AI"
  ├── Pricing transparente: Free / Pro / Premium
  └── CTA: "Comece gratis" (nao pede cartao)

═══════════════════════════════════════════════════════════════════════════
FASE 1: ONBOARDING (0-5 minutos)
═══════════════════════════════════════════════════════════════════════════

Signup: Google OAuth (1 clique)
Onboarding (6 steps, 2 min):
  1. Nome + avatar
  2. Motivacao ("por que AI?")
  3. Interesses (grid)
  4. Follow suggestions (5+ perfis)
  5. Idioma + preview de conteudo
  6. → Feed personalizado

First session:
  ├── Feed pre-populado (curado + follows)
  ├── Banner: "Bem-vindo! Curta seu primeiro post"
  ├── Tooltip guiado no primeiro post curado
  ├── Like guiado → "Otimo! Voce acaba de interagir com a comunidade"
  └── Sugestoes de follow no sidebar

═══════════════════════════════════════════════════════════════════════════
FASE 2: AHA MOMENT (0-48 horas)
═══════════════════════════════════════════════════════════════════════════

Meta: Ler 3+ artigos curados + 1 interacao social

Dia 0 (apos onboarding):
  ├── Le 2-3 artigos curados nos interesses
  ├── Curte 1 post
  ├── Segue mais 2-3 pessoas
  └── Push permission request (apos valor demonstrado)

Dia 1:
  ├── Push: "3 noticias de AI de hoje" (8h da manha)
  ├── Abre o feed, le mais artigos
  ├── Comenta em 1 thread
  ├── Email de boas-vindas: "Seu primeiro digest de AI"
  └── AHA MOMENT: "Esse feed me economiza tempo REAL"

═══════════════════════════════════════════════════════════════════════════
FASE 3: ATIVACAO (dias 2-7)
═══════════════════════════════════════════════════════════════════════════

Meta: Magic Number = 5 artigos + 1 interacao + 3 sessoes distintas

Dia 2-3:
  ├── Retorna por push/email
  ├── Le mais artigos, salva alguns
  ├── Recebe primeiro like/reply (validacao social)
  └── Streak: "2 dias consecutivos!"

Dia 4-5:
  ├── Cria primeiro post proprio ou faz pergunta
  ├── Recebe respostas da comunidade
  ├── Explora Spaces diferentes
  └── Push: "Fulano respondeu seu post"

Dia 6-7:
  ├── Email: "Sua primeira semana no sinapse"
  │   ├── Stats: "Voce leu {N} artigos e interagiu {N} vezes"
  │   ├── Recap: melhores posts da semana
  │   └── CTA: "Continue amanha pra manter seu streak"
  ├── Habito emergindo: abre o sinapse como parte da rotina matinal
  └── ATIVACAO COMPLETA: Magic Number atingido

═══════════════════════════════════════════════════════════════════════════
FASE 4: RETENCAO (semanas 2-4)
═══════════════════════════════════════════════════════════════════════════

Meta: DAU/WAU > 50% (pelo menos 4 dias ativos por semana)

Semana 2:
  ├── Rotina formada: abrir sinapse de manha com o cafe
  ├── Trigger interno dominando: "tem algo novo em AI?"
  ├── Participa de primeira live (Pro value)
  ├── Push reduzido: apenas social + 1 conteudo/dia
  └── Streak: "10 dias! 🔥"

Semana 3-4:
  ├── Contribui regularmente (posts, comments)
  ├── Tem "conhecidos" na comunidade
  ├── Salvou 20+ posts (investimento alto)
  ├── Recebe weekly digest personalizado
  ├── Se FREE: atinge limites com frequencia → friction points
  │   └── Modal: "Quer acesso ilimitado? 7 dias gratis de Pro"
  └── RETENCAO CONFIRMADA: usuario volta sem triggers externos

═══════════════════════════════════════════════════════════════════════════
FASE 5: CONVERSAO FREE→PRO (semana 2-4)
═══════════════════════════════════════════════════════════════════════════

Triggers de conversao (em ordem de eficacia):
  1. Atinge limite de 10 artigos/dia pela 3a vez → modal com trial
  2. Tenta acessar Space Pro → paywall com preview
  3. Ve live acontecendo mas nao pode assistir (Free) → CTA
  4. Email dia 7: "7 dias gratis de Pro"
  5. Amigo indica + ganha desconto
  6. Founding Member deal (se disponivel)

Conversao:
  ├── Trial 7 dias gratis (sem cartao) OU
  ├── PIX direto (R$ 49 ou R$ 39/mo anual)
  ├── Badge PRO aparece no perfil imediatamente
  └── Feed desbloqueia tudo → "uau, isso tudo estava escondido?"

═══════════════════════════════════════════════════════════════════════════
FASE 6: HABITO + DAU (mes 2+)
═══════════════════════════════════════════════════════════════════════════

Comportamento daily active:
  ├── 08:00 — Abre sinapse no cafe (rotina matinal)
  ├── 12:00 — Check rapido durante almoco
  ├── 18:00 — Contribui (post/comment) apos trabalho
  ├── Streak > 30 dias → badge permanente
  ├── Segue 20+ pessoas → feed rico e personalizado
  ├── 50+ bookmarks → biblioteca pessoal de referencia
  └── Participa de 2+ lives/mes

Trigger interno dominante:
  └── "Preciso checar o sinapse" (mesmo sem notificacao)

Defesas contra churn:
  ├── Streak alto (nao quer perder)
  ├── Rede social construida (nao quer abandonar conexoes)
  ├── Bookmarks acumulados (nao quer perder curadoria)
  ├── Reputacao (badges, followers, posts)
  ├── Founding Member price (nao quer perder o desconto)
  └── Progresso em cursos (sunk cost)

═══════════════════════════════════════════════════════════════════════════
FASE 7: EVANGELISMO (mes 3+)
═══════════════════════════════════════════════════════════════════════════

O usuario se torna growth loop:
  ├── Compartilha posts do sinapse no X/LinkedIn
  ├── Indica amigos via referral link
  ├── Menciona sinapse em conversas profissionais
  ├── Contribui conteudo de alta qualidade (UGC → SEO)
  ├── Defende a comunidade em espacos externos
  └── Converte de Pro para Premium (lifetime value maximo)
```

---

# HABIT LOOP VISUAL DO SINAPSE.CLUB

## Loop Diario (usuario retido)

```
                    ┌──────────────────────┐
                    │     TRIGGER          │
                    │                      │
                    │ INTERNO: "Tem algo   │
                    │ novo em AI?"         │
                    │ (cafe da manha,      │
                    │  almoco, pos-work)   │
                    │                      │
                    │ EXTERNO: push        │
                    │ "3 noticias de AI"   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     ACTION           │
                    │                      │
                    │ Abre sinapse.club    │
                    │ Scroll no feed       │
                    │ Le artigos curados   │
                    │ (< 2 segundos para   │
                    │  primeiro conteudo)  │
                    └──────────┬───────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │          VARIABLE REWARD                      │
        │                                               │
        │  TRIBO:                CACA:                  │
        │  ├── 3 likes no       ├── Noticia surpresa   │
        │  │   post de ontem    │   sobre novo modelo   │
        │  ├── Reply de         ├── Thread com debate   │
        │  │   @fulano          │   sobre AI e emprego  │
        │  └── 2 new followers  └── Tool que nao        │
        │                           conhecia            │
        │  SELF:                                        │
        │  ├── "Streak de 12 dias!"                    │
        │  ├── "Top 15% da comunidade"                 │
        │  └── "23 artigos lidos essa semana"          │
        └──────────────────────┬───────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     INVESTMENT       │
                    │                      │
                    │ ├── Salva 2 artigos  │
                    │ ├── Segue 1 pessoa   │
                    │ ├── Comenta 1 thread │
                    │ ├── Cria 1 post      │
                    │ └── Streak +1 dia    │
                    │                      │
                    │ VALOR ARMAZENADO:    │
                    │ Feed mais pessoal    │
                    │ Rede mais rica       │
                    │ Reputacao mais alta  │
                    │ Streak mais longo    │
                    └──────────┬───────────┘
                               │
                               │ Carrega proximo trigger
                               │ (feed melhor amanha,
                               │  replies nas interacoes,
                               │  streak para manter)
                               │
                               ▼
                    ┌──────────────────────┐
                    │     TRIGGER          │
                    │                      │
                    │ INTERNO: "Sera que   │
                    │ responderam meu      │
                    │ comentario?"         │
                    │                      │
                    │ EXTERNO: push        │
                    │ "@fulano respondeu"  │
                    └──────────┬───────────┘
                               │
                               ▼
                          (CICLO REPETE)
```

## Loop Semanal (reforco)

```
Segunda:   Push "As 3 maiores noticias de AI do fim de semana"
Terca:     Feed normal (sem push extra)
Quarta:    Email digest "Meio da semana — voce viu isso?"
Quinta:    Feed normal + notificacao se houver live
Sexta:     Email digest "Melhores posts da semana"
Sabado:    Weekly recap: "Sua semana: {N} artigos, {N} interacoes, streak {N}"
Domingo:   Silencio (respeitar descanso = confianca)
```

---

# PRIORIDADES DE IMPLEMENTACAO

## Tier 1 — PRE-LANCAMENTO (implementar antes de ir ao ar)

| # | Feature | Impacto | Esforco | Justificativa |
|---|---------|---------|---------|---------------|
| 1 | **Feed ranking (Hot algorithm)** | Alto | Medio | Feed cronologico puro perde contra curado+rankeado |
| 2 | **Onboarding redesenhado (6 steps)** | Alto | Medio | Aha moment depende de primeiro valor rapido |
| 3 | **Founding Member pricing** | Alto | Baixo | Gera urgencia + primeiras conversoes |
| 4 | **Pricing page otimizada** | Alto | Baixo | Converte visitantes em assinantes |
| 5 | **Feed "Para Voce" vs "Following"** | Alto | Medio | Core da experiencia diaria |

## Tier 2 — PRIMEIRO MES (implementar nas primeiras 4 semanas)

| # | Feature | Impacto | Esforco | Justificativa |
|---|---------|---------|---------|---------------|
| 6 | **Email digest (onboarding drip)** | Alto | Medio | Re-engagement de usuarios novos |
| 7 | **Push notifications (web)** | Alto | Medio | Trigger externo mais eficaz |
| 8 | **Trending panel** | Medio | Baixo | Discovery + FOMO saudavel |
| 9 | **Follow suggestions (sidebar)** | Medio | Baixo | Investimento continuo + feed melhor |
| 10 | **Event tracking (PostHog)** | Alto | Medio | Sem dados = cego. Precisa medir tudo |

## Tier 3 — MESES 2-3 (apos dados de uso real)

| # | Feature | Impacto | Esforco | Justificativa |
|---|---------|---------|---------|---------------|
| 11 | **Streaks** | Medio | Baixo | Gamification leve que funciona |
| 12 | **Weekly recap email** | Medio | Baixo | Reforco do habito + stats pessoais |
| 13 | **Cohort analysis dashboard** | Alto (interno) | Medio | Entender retencao por cohort |
| 14 | **Referral system** | Medio | Medio | Growth loop viral |
| 15 | **In-app notification center** | Medio | Medio | Centraliza todas as notificacoes |

## Tier 4 — MESES 4-6 (otimizacao)

| # | Feature | Impacto | Esforco | Justificativa |
|---|---------|---------|---------|---------------|
| 16 | **Leaderboard mensal** | Baixo-Medio | Baixo | Gamification competitiva |
| 17 | **Badges/achievements** | Baixo | Medio | Recompensa do Self |
| 18 | **Personalized feed ML** | Alto | Alto | Requer dados. So vale com 500+ MAU |
| 19 | **A/B testing framework** | Alto (interno) | Medio | Testar onboarding, CTAs, pricing |
| 20 | **Churn prediction** | Alto (interno) | Alto | Intervir antes do churn acontecer |

---

## Metricas para Monitorar Desde o Dia 1

### Dashboard Minimo Viavel (PostHog ou similar)

```
AQUISICAO:
├── Signups por dia/semana
├── Fonte de aquisicao (Google, social, referral, direto)
├── Landing page → signup conversion rate
└── Onboarding completion rate

ATIVACAO:
├── % que atingem Aha Moment (3 artigos em primeira sessao)
├── % que atingem Magic Number (5 artigos + 1 interacao em 7 dias)
├── Onboarding step drop-off (onde param?)
└── First session duration

RETENCAO:
├── D1, D7, D14, D30, D90 retention (cohort)
├── DAU, WAU, MAU
├── DAU/MAU ratio
├── Streak distribution
└── Sessions per user per week

ENGAJAMENTO:
├── Artigos lidos por usuario por dia
├── Likes, comments, posts por usuario por semana
├── Feed scroll depth
├── Tempo por sessao
├── Bookmarks per user

RECEITA:
├── MRR, ARR
├── Free → Pro conversion rate
├── Pro → Premium upgrade rate
├── Monthly churn rate
├── LTV, CAC, LTV:CAC
└── Annual vs Monthly ratio

NORTH STAR:
└── WAEM (Weekly Active Engaged Members)
```

---

## Resumo Executivo — As 5 Coisas Mais Importantes

1. **O Aha Moment e ler 3 artigos curados em PT-BR na primeira sessao.** Todo o onboarding deve guiar o usuario ate esse ponto em menos de 5 minutos. Se o usuario nao experimentar isso, ele nao volta.

2. **O feed e o produto.** Ranking por relevancia (nao cronologico), mix de curado + UGC, tabs "Para Voce" vs "Following", e trending sidebar. E isso que faz o usuario voltar todo dia.

3. **Founding Member pricing gera urgencia real e retencao.** R$ 29/mo travado para sempre, limitado a 100 vagas. Cria FOMO, recompensa early adopters, e reduz churn (ninguem quer perder o preco).

4. **Notificacoes sao a ponte entre sessoes.** Sem notificacao, o usuario precisa LEMBRAR de voltar. Com notificacao bem feita, o produto puxa o usuario de volta. Estrategia: agressivo na semana 1, seletivo apos mes 1.

5. **Medir desde o dia 1 ou voar cego.** PostHog (gratis ate 1M eventos/mes) ou similar. Sem dados de cohort, nao da pra saber se o onboarding melhorou, se o churn diminuiu, ou se o feed ranking funciona.

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-03-29 | Comprehensive retention & behavioral design analysis | @analyst (Alex) + @product (Vector) |
