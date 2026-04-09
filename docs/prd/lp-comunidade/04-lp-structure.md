# 04 — Estrutura Visual da LP SINAPSE (v1)

**Squad:** @design-orqx (Nexus)
**Story:** LP-1 / FASE 3
**Data:** 2026-04-08
**Status:** v1. Estrutura criada a partir da copy v3 aprovada (03-copy-framework.md + 06-offer-copy.md)
**Principio:** A estrutura serve a copy. Mobile first. Performance first. Acessibilidade nao e opcional.

---

## 0. Sistema de Design e Tokens

### Paleta base (B&W minimalista premium)

```
--color-bg:          #0A0A0A   /* preto quase-absoluto — fundo base */
--color-surface:     #111111   /* superficie de cards e secoes */
--color-surface-2:   #1A1A1A   /* superficie elevada */
--color-border:      #222222   /* bordas sutis */
--color-text-primary:#F5F5F5   /* branco suave — textos principais */
--color-text-muted:  #888888   /* cinza medio — secundarios */
--color-text-dim:    #555555   /* cinza escuro — hints, captions */

/* Cores de tier (usadas com moderacao, so em badges e destaques) */
--color-tier-forum:    #3B82F6  /* azul — forum/membro */
--color-tier-course:   #22C55E  /* verde — cursos */
--color-tier-mentoria: #F59E0B  /* ambar/dourado — mentoria */

/* Cores funcionais */
--color-cta:         #F5F5F5   /* CTA primario — branco sobre preto */
--color-cta-hover:   #FFFFFF
--color-danger:      #EF4444
--color-success:     #22C55E
```

### Grid system

- **12 colunas** em desktop (1280px max-width)
- **4 colunas** em tablet (768px)
- **1 coluna** em mobile (375px base)
- Gutter: 24px desktop / 16px mobile
- Padding lateral: 24px desktop / 20px mobile

### Tipografia

```
/* Escala tipografica */
--font-display:  'Inter' ou 'Geist', sans-serif
--font-body:     'Inter' ou 'Geist', sans-serif

/* Tamanhos desktop */
--text-hero:     clamp(2.5rem, 5vw, 4rem)     /* 40–64px */
--text-h1:       clamp(2rem, 3.5vw, 3rem)      /* 32–48px */
--text-h2:       clamp(1.5rem, 2.5vw, 2rem)    /* 24–32px */
--text-h3:       clamp(1.125rem, 2vw, 1.5rem)  /* 18–24px */
--text-body-lg:  1.125rem  /* 18px */
--text-body:     1rem       /* 16px */
--text-sm:       0.875rem  /* 14px */
--text-xs:       0.75rem   /* 12px */

/* Pesos */
--font-bold:     700
--font-semibold: 600
--font-normal:   400
--font-light:    300
```

### Espacamento

```
--space-xs:   8px
--space-sm:   16px
--space-md:   24px
--space-lg:   48px
--space-xl:   80px
--space-2xl:  120px
--space-3xl:  160px
```

---

## 1. Hierarquia de Scroll

### Mapa de secoes e alturas

| # | Secao | Altura Desktop | Altura Mobile | Funcao emocional |
|---|-------|---------------|--------------|-----------------|
| 1 | Above the Fold / Hero | 100vh | 100svh | Captura, orientacao |
| 2 | Agitacao / Dores | ~180vh | ~280vh | Tensao, identificacao |
| 3 | A Virada / Apresentacao | ~100vh | ~140vh | Alivio, esperanca |
| 4 | O Que Voce Recebe | ~220vh | ~360vh | Desejo, justificativa |
| 5 | Prova Social | ~200vh | ~320vh | Confianca, validacao |
| 6 | Quem e a SINAPSE / FOMO | ~140vh | ~200vh | Urgencia, emocao |
| 7 | Oferta / Pricing | ~160vh | ~240vh | Decisao, ancoragem |
| 8 | Objecoes / FAQ | ~200vh | ~300vh | Remocao de atrito |
| 9 | Urgencia / Janela | ~80vh | ~120vh | Custo de esperar |
| 10 | CTA Final | ~80vh | ~100vh | Conversao |
| — | Footer | 120px | 180px | Credibilidade legal |

**Total estimado:** ~1.460vh desktop / ~2.060vh mobile

### Pontos de ancoragem (onde o usuario para pra ler)

1. **Headline hero** — primeiro impacto, leitura obrigatoria
2. **"Enquanto voce assiste mais um video..."** — espelho da dor
3. **"A SINAPSE e a comunidade onde..."** — momento da virada
4. **Cards de beneficios** — escaneamento item a item
5. **Depoimentos** — leitura seletiva, busca identificacao
6. **Bloco de ancoragem de preco** — comparacao ativa
7. **Card do forum R$27/mes** — decisao de compra
8. **Garantia de 7 dias** — remocao do ultimo bloqueio
9. **CTA final** — acao

### Pontos de saida e retentores

| Ponto de saida | Por que sai | Retentor |
|---------------|-------------|---------|
| Apos headline hero | Nao se identificou | Subheadline de especificidade + prova social imediata com setores reais |
| Entre secao 1 e 2 | Achou que e mais do mesmo | Primeiro paragrafo da agitacao: "Voce ja sabe que IA vai mudar tudo. O problema e que saber nao paga boleto." |
| No meio das dores | Dor certa, nao acredita na solucao | CTA antecipado: "ja tem empresarios resolvendo isso" com link de ancoragem para prova social |
| Apos secao de beneficios | Interessado mas sem urgencia | Depoimentos logo em seguida + CTA secundario |
| Na secao de pricing | Acho caro / nao conheco | Ancoragem de valor imediatamente antes do preco + garantia visivel |
| No FAQ | Ainda com objecao especifica | FAQ cobre as 10 objecoes mais comuns; cada resposta termina apontando para CTA |

---

## 2. Layout por Secao

---

### SECAO 1: ABOVE THE FOLD — Hero

**Altura:** 100vh (desktop) / 100svh (mobile)
**Layout:** Full-width, conteudo centralizado em 8 colunas (desktop) / 1 coluna (mobile)
**Fundo:** #0A0A0A com textura sutil (noise ou grain layer, opacity 0.03)

#### Hierarquia tipografica

```
[BADGE OPCIONAL — "Comunidade de IA para Negocios" — pill com borda #222]
[H1 — headline principal — var(--text-hero) — font-bold — cor: #F5F5F5]
[H2 / subheadline — var(--text-h3) — font-normal — cor: #888888]
[CTA PRIMARIO — botao]
[micro-copy abaixo do CTA]
[prova social imediata — linha de texto]
[screenshot do forum — abaixo do fold ou como fundo com overlay]
```

#### Wireframe textual (desktop — 12 colunas)

```
|--col1--|--col2--|--col3--|--col4--|--col5--|--col6--|--col7--|--col8--|--col9--|--col10--|--col11--|--col12--|

TOPO: Navbar minimalista — logo esquerda, "Entrar" botao direita
      altura: 64px, fundo transparente, border-bottom: 1px solid #1A1A1A

[cols 3-10, centrado]

  BADGE PILL
  "Comunidade de IA para Negocios"
  — fundo: #1A1A1A, borda: 1px #333, texto: #888, tamanho: 12px
  — margem inferior: 24px

  HEADLINE (H1)
  "Pare de pagar caro pra fazer o
  que IA faz melhor. Escale sem
  aumentar a folha."
  — multiline, centrado, var(--text-hero), bold, #F5F5F5
  — max-width: 720px, centrado

  SUBHEADLINE
  "A comunidade onde donos de negocio aplicam IA na operacao
  real. Reduzem custo, aumentam margem e escalam sem depender
  de mais gente. Tudo isso por R$27/mes."
  — var(--text-body-lg), #888888, centrado
  — max-width: 560px, centrado
  — margem: 24px acima e abaixo

  CTA PRIMARIO [botao]
  "Quero entrar na SINAPSE"
  — fundo: #F5F5F5, texto: #0A0A0A, font-semibold
  — padding: 16px 40px, border-radius: 6px
  — hover: fundo #FFFFFF, sombra sutil
  — tamanho: min-width 240px

  MICRO-COPY
  "R$27/mes. Cancele quando quiser. Garantia de 7 dias."
  — var(--text-sm), #555555, centrado
  — margem: 12px acima

  PROVA SOCIAL IMEDIATA
  "Empresarios de agencias, e-commerces, consultorias e SaaS
  trocando resultados reais sobre IA aplicada a negocios."
  — var(--text-sm), #666666, centrado
  — margem: 32px acima

  VISUAL DO PRODUTO (screenshot do forum)
  — posicao: abaixo da dobra, parcialmente visivel
  — 10 colunas (cols 2-11), centrado
  — bordas arredondadas: 12px no topo
  — borda: 1px solid #222222
  — sombra: 0 -40px 80px rgba(255,255,255,0.04) (luz vindo de cima)
  — nomes de usuarios borrados (blur: 4px) para privacidade
  — titulos de threads visiveis
  — indicadores de atividade visiveis (verde, membros online)
```

#### Mobile (375px)

```
NAVBAR: logo centrado, "Entrar" como link texto canto direito, altura 56px

[padding: 0 20px]
BADGE PILL — centrado
HEADLINE (H1) — centrado, var(--text-h1), max 2 linhas se possivel
SUBHEADLINE — centrado, var(--text-body), 3-4 linhas
CTA PRIMARIO — width: 100%, height: 56px (thumb-friendly)
MICRO-COPY — centrado, var(--text-xs)
PROVA SOCIAL — centrado, var(--text-xs)
SCREENSHOT — 100% width, top arredondado, parcialmente visivel
```

#### Elementos visuais necessarios

- Screenshot real do forum (com blur nos nomes de usuarios)
- Logo SINAPSE (SVG, versao branca)
- Noise/grain texture overlay (SVG ou CSS, performance-safe)

---

### SECAO 2: AGITACAO — Amplificacao da Dor

**Altura:** ~180vh desktop / ~280vh mobile
**Layout:** Coluna central (6 colunas desktop, full-width mobile)
**Fundo:** #0A0A0A com transicao sutil para #0D0D0D a partir dos cards de dor
**Tom visual:** Tensao. Contraste alto. Espacamento denso. Sem imagens.

#### Hierarquia tipografica

```
[BLOCO DE IDENTIFICACAO — corpo de texto simples, grande]
[HEADLINE TRANSICAO — "Enquanto voce..."]
[6 CARDS DE DOR — grid 2x3 ou lista 1x6 dependendo do dispositivo]
[BLOCO DE CONSEQUENCIA — texto largo, impactante]
[TRANSICAO — "Nao precisa ser assim."]
```

#### Wireframe textual (desktop)

```
[cols 3-10, centrado]

BLOCO ABERTURA
"Voce ja sabe que IA vai mudar tudo.
O problema e que saber nao paga boleto."
— var(--text-h2), #F5F5F5, centrado
— margem: 80px superior

"Enquanto voce assiste mais um video..."
— var(--text-body-lg), #888888, centrado
— max-width: 640px, 3-4 linhas

[GRID DE DORES — 2 colunas x 3 linhas]
cols 1-6 / cols 7-12

  CARD DE DOR
  — fundo: #111111
  — borda: 1px solid #1A1A1A
  — borda-left: 3px solid #333333
  — padding: 32px
  — border-radius: 8px

  Numero da dor (01-06)
  — var(--text-xs), #444444, font-mono

  Titulo da dor
  "Estou ficando para tras."
  — var(--text-h3), #F5F5F5, font-semibold

  Copy expandida
  — var(--text-body), #888888
  — 3-5 linhas

BLOCO DE CONSEQUENCIA
"Voce esta pagando mais do que devia
e trabalhando mais do que precisava."
— var(--text-h2), #F5F5F5, centrado
— margem: 80px superior

Paragrafos de consequencia
— var(--text-body-lg), #888888, centrado
— max-width: 640px

TRANSICAO
"Nao precisa ser assim. Existe um lugar..."
— var(--text-h3), #F5F5F5, centrado
— cor de destaque: none — so texto
```

#### Mobile

```
Cards de dor: 1 coluna, empilhados
Grid colapsa para lista vertical
Espacamento interno reduzido: padding 24px
Bloco de abertura: var(--text-h2) reduzido para var(--text-h3)
```

---

### SECAO 3: A VIRADA — Apresentacao da Comunidade

**Altura:** ~100vh desktop / ~140vh mobile
**Layout:** Coluna central (8 colunas) com divisao visual da secao anterior
**Fundo:** Transicao de #0D0D0D para #0F0F0F — contraste intencional com secao de dor
**Tom visual:** Alivio. Resposta. Mais luz. Mais espaco branco.

#### Wireframe textual (desktop)

```
SEPARADOR VISUAL
— linha horizontal de 1px, gradiente de transparente para #222 e volta
— ou espaco em branco de 80px + icone minimalista da SINAPSE centrado

[cols 3-10, centrado]

LABEL PEQUENA
"A solucao"
— var(--text-xs), #555555, maiusculas, letter-spacing: 0.1em

HEADLINE (H2)
"A SINAPSE e a comunidade onde donos
de negocio aplicam IA na operacao real."
— var(--text-h1), #F5F5F5, centrado

CORPO PRINCIPAL
"Nao estudam teoria, nao assistem palestra.
Aplicam. Testam. Medem resultado. E compartilham o que funciona."
— var(--text-body-lg), #888888, centrado
— max-width: 600px

A PROMESSA CENTRAL
"Reduza custos. Escale sem aumentar time.
Saia da operacao e volte pra estrategia."
— var(--text-h2), #F5F5F5, centrado
— destaque visual: sublinhado fino em #333 ou aspas visuais

BLOCO "POR QUE NAO OUTRA SOLUCAO"
— 4 itens lado a lado (ou 2x2 em mobile)
— cada item: label negrito + copy explicativa
— sem cards — so texto com separadores de linha

  "Nao e um curso." | copy
  "Nao e um grupo de WhatsApp." | copy
  "Nao e um mastermind de R$10k/mes." | copy
  "Nao e mais um infoproduto." | copy

POSICIONAMENTO DE CATEGORIA
"A SINAPSE e a unica comunidade operacional
de IA para negocios no Brasil."
— var(--text-h3), #F5F5F5, centrado
— borda-left: 3px solid #333 + padding, ou centrado puro
```

#### Mobile

```
Bloco "Por que nao outra solucao": 1 coluna, empilhado
Reducao de margens superiores
Copy de posicionamento: destaque em bloco com borda
```

---

### SECAO 4: O QUE VOCE RECEBE — Beneficios

**Altura:** ~220vh desktop / ~360vh mobile
**Layout:** Mix de layouts por sub-secao
**Fundo:** #0A0A0A base
**Tom visual:** Desejo. Especificidade. Proof points visiveis.

#### Estrutura interna

```
4.0 Headline da secao
4.1 Forum SINAPSE — card destaque
4.2 Cursos — card "em breve"
4.3 Mentoria — card "vagas limitadas"
4.4 Conteudo de trincheira — lista
4.5 Networking — lista
4.6 Bloco de ecossistema — CTA secundario
```

#### Wireframe textual (desktop)

```
HEADLINE DA SECAO
"O que voce recebe"
— var(--text-h2), #F5F5F5, centrado

CARD FORUM (col 1-12, destaque)
— fundo: #111111
— borda: 1px solid #222222
— borda-top: 3px solid var(--color-tier-forum) [azul]
— padding: 40px 48px
— border-radius: 12px

  [TOPO DO CARD]
  Badge "R$27/mes"
  — pill, fundo: rgba(59,130,246,0.15), texto: #3B82F6, var(--text-sm)

  Headline do card
  "Forum SINAPSE"
  — var(--text-h2), #F5F5F5, font-bold

  Feature
  "Forum ativo com categorias de alto valor..."
  — var(--text-body), #888888

  [DIVISOR]
  — linha 1px #1A1A1A

  [IMPACTO — destaque]
  "Em vez de perder 6 horas pesquisando..."
  — var(--text-body-lg), #F5F5F5

  [LISTA DE INCLUI — 2 colunas]
  check-icon + item | check-icon + item

  CTA
  "Entrar no forum por R$27/mes"
  — botao primario (igual ao hero)


GRID 2 COLUNAS — Cursos + Mentoria

  CARD CURSOS (col 1-6)
  — fundo: #0F0F0F
  — borda: 1px solid #1A1A1A
  — borda-top: 3px solid var(--color-tier-course) [verde]
  — padding: 32px
  — border-radius: 12px
  — opacity: 0.85 (sutil indicativo "em breve")

    Badge "Em breve"
    — pill, fundo: rgba(34,197,94,0.1), texto: #22C55E

    Headline "Cursos Praticos de IA Aplicada"
    Copy principal
    Copy de valor futuro
    [NO CTA — apenas badge "Em breve"]


  CARD MENTORIA (col 7-12)
  — fundo: #0F0F0F
  — borda: 1px solid #1A1A1A
  — borda-top: 3px solid var(--color-tier-mentoria) [ambar]
  — padding: 32px
  — border-radius: 12px

    Badge "Vagas limitadas"
    — pill, fundo: rgba(245,158,11,0.1), texto: #F59E0B

    Headline "Mentoria com os Fundadores"
    Copy principal
    CTA SECUNDARIO
    "Agendar uma conversa"
    — botao outline: borda #F59E0B, texto #F59E0B
    Micro-copy "Sem compromisso."


LISTA DE BENEFICIOS EXTRAS
Conteudo de trincheira + Networking
— layout: 2 itens lado a lado
— sem cards — linhas com icone + headline + copy


BLOCO DE ECOSSISTEMA
"Forum. Cursos. Mentoria. Cada passo no seu ritmo."
— var(--text-h3), #F5F5F5, centrado
— fundo: #111111, padding: 48px, border-radius: 12px
— copy de ecossistema abaixo, centrada
— CTA: "Entrar no forum por R$27/mes"
```

#### Mobile

```
Card forum: 1 coluna, full-width
Lista inclui: 1 coluna
Cards cursos e mentoria: empilhados, 1 coluna
CTA do card forum: 100% width, 56px height
```

---

### SECAO 5: PROVA SOCIAL — Credibilidade

**Altura:** ~200vh desktop / ~320vh mobile
**Layout:** Abertura centrada + grid de depoimentos + fechamento
**Fundo:** #0A0A0A / #0D0D0D alternado
**Tom visual:** Confianca. Diversidade de perfis. Real.

#### Wireframe textual (desktop)

```
HEADLINE
"Quem esta dentro ja esta aplicando"
— var(--text-h2), #F5F5F5, centrado

PROVA QUALITATIVA
"Empresarios de agencias de marketing, e-commerces,
consultorias, SaaS, escritorios de advocacia e franquias.
Gente que fatura de R$30 mil a R$5 milhoes por mes."
— var(--text-body-lg), #888888, centrado
— max-width: 640px

GRID DE DEPOIMENTOS — 3 colunas x 3 linhas + 1 destaque

  DEPOIMENTO CARD
  — fundo: #111111
  — borda: 1px solid #1A1A1A
  — padding: 28px 32px
  — border-radius: 8px

    Aspas visuais "
    — var(--text-hero), #1A1A1A, absolute, topo-esquerda

    Texto do depoimento
    — var(--text-body), #D0D0D0

    [RODAPE DO CARD]
    Avatar placeholder (iniciais em circulo, fundo #1A1A1A)
    Nome — var(--text-sm), #F5F5F5, font-semibold
    Descricao — var(--text-xs), #666666
    Cidade — var(--text-xs), #444444

FORUM COMO PROVA VIVA
"Nao acredita? O forum esta la."
— var(--text-h3), #F5F5F5, centrado

Screenshot do forum (segunda imagem)
— destaque em threads especificas de alto nivel
— 10 colunas, centrado, borda + shadow

CTA APOS PROVA SOCIAL
"Quero entrar na SINAPSE"
— botao primario, centrado
```

#### Mobile

```
Grid colapsa: 1 coluna, depoimentos empilhados
Maximo 5 depoimentos visiveis, botao "Ver mais" para expansao
Screenshot: 100% width
CTA: 100% width
```

---

### SECAO 6: QUEM E A SINAPSE / FOMO

**Altura:** ~140vh desktop / ~200vh mobile
**Layout:** Full-width intencional + coluna central para copy
**Fundo:** Mudanca deliberada para #0F0F10 — levissima diferenca, cria ritmo
**Tom visual:** Urgencia contida. Escuro. Denso. Sem distracao.

#### Wireframe textual (desktop)

```
[ABERTURA — FOMO DIRETO]
"A maioria dos empresarios brasileiros vai descobrir
o que IA faz por negocios daqui a 2 anos.
Voce pode descobrir agora."
— var(--text-h1), #F5F5F5, centrado, max-width 720px

BLOCO DE FOMO NARRATIVO
"Enquanto voce le isso, tem empresario la dentro..."
— var(--text-body-lg), #888888, centrado, max-width 640px
— 3-4 paragrafos, espacamento generoso

BLOCO "O QUE A SINAPSE SABE"
"O que a SINAPSE sabe que o mercado ainda nao sabe:"
— var(--text-h3), #F5F5F5

3 bullets de insight
— lista sem icones banais
— marcador: linha vertical de 2px em #333
— padding-left: 24px
— texto: #D0D0D0, var(--text-body-lg)

BLOCO DE ACUMULACAO DE VANTAGEM
— copy agressiva de custo de esperar
— var(--text-body-lg), #888888

EXCLUSIVIDADE PSICOLOGICA
"Isso nao e para todo mundo."
— var(--text-h2), #F5F5F5, centrado
— destaque visual: isolado entre espacos brancos

DIVISAO CAIO + MATHEUS — 2 colunas

  CAIO IMORI (col 1-6)
  — avatar: foto ou placeholder minimalista em circulo, 80px
  — nome: var(--text-h3), #F5F5F5, font-bold
  — titulo: var(--text-sm), #666666
  — copy de autoridade: var(--text-body), #888888

  MATHEUS SOIER (col 7-12)
  — mesma estrutura

BLOCO JUNTOS
"100+ alunos formados."
— var(--text-h3), #F5F5F5, centrado

MISSAO
"Dar a todo empresario brasileiro as ferramentas,
o metodo e a comunidade pra usar IA como vantagem competitiva.
Antes que vire obrigacao."
— var(--text-body-lg), #888888, centrado, italico opcional
```

#### Mobile

```
Divisao Caio + Matheus: empilhados, 1 coluna
Avatares: 64px
Espacamento reduzido mas mantendo breathing room
```

---

### SECAO 7: OFERTA — Pricing e Escada de Valor

**Altura:** ~160vh desktop / ~240vh mobile
**Layout:** Ancoragem (texto) + cards de tier + garantia
**Fundo:** #0A0A0A — volta ao fundo base para clareza de decisao
**Tom visual:** Clareza. Decisao. Sem ruido. O preco e o heroi.

#### Wireframe textual (desktop)

```
HEADLINE
"Quanto custa resolver isso sem a SINAPSE?"
— var(--text-h2), #F5F5F5, centrado

BLOCO DE ANCORAGEM (comparacao antes do preco)
— layout: 3 itens lado a lado

  ITEM ANCORAGEM
  — sem card formal, apenas separador de coluna
  — label: "1 funcionario junior"
  — preco: "R$3.000 a R$5.000/mes"
  — sub: copy de consequencia
  — cada preco em var(--text-h3), #888888, riscado mentalmente pelo leitor

"Agora veja o que a SINAPSE entrega por R$27 por mes."
— var(--text-h2), #F5F5F5, centrado
— esse texto serve como pivô visual entre ancoragem e preco

[CARDS DE TIER — 3 colunas]

  CARD FORUM (col 2-6, destaque — maior ou com borda azul)
  — fundo: #111111
  — borda: 2px solid var(--color-tier-forum)
  — badge "Mais escolhido" ou nenhum (nao forcar)
  — preco: "R$27/mes" — var(--text-h1), #3B82F6, bold
  — descricao de valor
  — lista do que inclui
  — CTA primario

  CARD CURSOS (col 7-9)
  — fundo: #0F0F0F
  — borda: 1px solid #1A1A1A, borda-top: 3px solid #22C55E
  — badge: "Em breve"
  — placeholder de preco: "—"
  — copy: "Membros do forum serao os primeiros a saber"
  — sem CTA de compra

  CARD MENTORIA (col 10-12)
  — fundo: #0F0F0F
  — borda: 1px solid #1A1A1A, borda-top: 3px solid #F59E0B
  — badge: "Vagas limitadas"
  — preco: nao revelado (venda consultiva)
  — CTA: "Agendar conversa"

NOTA COMPARATIVA (abaixo da tabela — opcional)
tabela de comparacao SINAPSE vs. alternativas
— linhas alternadas #111 / #0F0F0F
— header: fundo #1A1A1A

BLOCO DE GARANTIA
— fundo: #111111
— borda: 1px solid #1A1A1A
— padding: 40px
— border-radius: 12px
— icone de escudo (SVG simples, #333)

  Headline "7 dias de garantia incondicional."
  — var(--text-h2), #F5F5F5

  Copy de garantia completa

  Copy de inversao de risco
  "O risco real nao e entrar na SINAPSE..."
  — var(--text-body), #888888

NOTAS DE RODAPE DO PRICING
— var(--text-xs), #444444
— 4 linhas de nota (ver secao 5 do 06-offer-copy.md)
```

#### Mobile

```
Ancoragem: empilhada, 1 item por linha
Cards: empilhados, card forum primeiro
Tabela de comparacao: scroll horizontal (overflow-x: auto)
Card forum CTA: 100% width
```

---

### SECAO 8: OBJECOES — FAQ Estrategico

**Altura:** ~200vh desktop / ~300vh mobile
**Layout:** Accordion ou lista expandida
**Fundo:** #0A0A0A
**Tom visual:** Neutro. Organizado. Sem carregar emocionalmente — aqui e logica.

#### Wireframe textual (desktop)

```
HEADLINE
"Ainda com duvida? A gente responde."
— var(--text-h2), #F5F5F5, centrado

[ACCORDION DE OBJECOES — col 2-11]

  ITEM DE FAQ
  — borda-bottom: 1px solid #1A1A1A
  — padding: 24px 0

  [CABECALHO — clicavel]
  Pergunta
  — var(--text-body-lg), #F5F5F5, font-semibold
  Icone de mais/menos (16px, #888888, alinhado a direita)

  [CORPO — expansivel]
  Resposta
  — var(--text-body), #888888
  — padding: 16px 0 24px 0
  — max-height: 0 fechado / auto aberto
  — transicao suave (300ms ease)

10 objecoes listadas na ordem do 03-copy-framework.md
```

#### Mobile

```
Accordion identico ao desktop
Fonte aumentada para legibilidade: var(--text-body) = 16px minimo
Icone de mais/menos: 20px (thumb-friendly)
```

---

### SECAO 9: URGENCIA — Janela de Vantagem

**Altura:** ~80vh desktop / ~120vh mobile
**Layout:** Coluna central, full-bleed vertical
**Fundo:** Transicao para #0D0D0D — ritmo visual antes do fechamento
**Tom visual:** Custo de esperar. Sem ornamentos. Texto puro.

#### Wireframe textual (desktop)

```
[cols 2-11, centrado]

HEADLINE TEMPORAL
"Em 2024, IA era curiosidade.
Em 2025, virou ferramenta.
Em 2026, quem nao usa perde competitividade."
— var(--text-h2), #F5F5F5, centrado
— line-by-line com color diferente: 2024 #444, 2025 #888, 2026 #F5F5F5

BLOCO JANELA DE VANTAGEM
— copy de urgencia sem prazo fixo
— var(--text-body-lg), #888888, centrado, max-width 640px

CUSTO DE NAO AGIR — 3 bullets
— marcador: X em vez de check
— cor do X: #444444
— texto: o que o empresario perde cada mes sem agir

COMPARACAO TEMPORAL
"Voce pode aprender sozinho em 2 anos.
Ou com a gente em 2 meses."
— var(--text-h3), #F5F5F5, centrado
— destaque visual: as duas linhas em fonte diferente ou cor diferente

CTA ANTECIPADO
"Entrar no forum por R$27/mes"
— botao primario, centrado
```

#### Mobile

```
Headline temporal: empilhado, 1 linha por data
Bullets: 1 coluna
CTA: 100% width
```

---

### SECAO 10: CTA FINAL — Fechamento

**Altura:** ~80vh desktop / ~100vh mobile
**Layout:** Full-width, centrado
**Fundo:** #0A0A0A — tudo de volta ao inicio, circulo fechado
**Tom visual:** Conclusao. Clareza maxima. Zero distracao.

#### Wireframe textual (desktop)

```
[cols 3-10, centrado]

HEADLINE DE RECAPITULACAO
"Forum ativo com empresarios que usam IA de verdade.
Cursos praticos chegando em breve.
Mentoria com os fundadores ja disponivel."
— var(--text-h2), #F5F5F5, centrado
— cada linha separada para leitura escaneada

COPY DE FECHAMENTO
"Por R$27/mes, voce entra no lugar onde
empresarios como voce estao montando seus stacks de IA..."
— var(--text-body-lg), #888888, centrado
— max-width: 560px

"A janela de vantagem esta aberta.
A decisao e sua."
— var(--text-h3), #F5F5F5, centrado
— destaque: isolado entre dois blocos de espaco

CTA PRINCIPAL — GRANDE
"Entrar pra SINAPSE agora"
— botao primario
— tamanho aumentado: padding 20px 56px, font-size 18px
— ou 100% de col 3-10 com max-width: 400px

COPY DE REASSURANCE
"Voce esta entrando numa comunidade de empresarios verificados."
— var(--text-sm), #666666, centrado

MICRO-COPY DO BOTAO
"R$27/mes. Cancele quando quiser. Garantia de 7 dias."
— var(--text-xs), #555555, centrado

NOTA FINAL
"A SINAPSE nao e pra todo mundo. E pra quem quer resultado, nao diploma..."
— var(--text-sm), #444444, centrado, italico
— max-width: 480px
```

#### Mobile

```
CTA: 100% width, height: 60px
Headline: reducao de tamanho
Nota final: var(--text-xs)
```

---

## 3. Elementos de Retencao Visual

### Sticky CTA

**Comportamento:**
- Nao aparece na secao 1 (hero ja tem CTA)
- Aparece apos o usuario scrollar ~120vh (saindo do hero)
- Posicao: fixed, bottom: 0, full-width mobile / canto inferior direito desktop
- Fundo: #0A0A0A / #111111 com borda-top: 1px solid #222
- Conteudo mobile: "Entrar por R$27/mes" + micro-copy em uma linha
- Conteudo desktop: texto + preco + botao lado a lado
- Desaparece ao chegar na secao 10 (CTA final) para nao duplicar
- Animacao: slide-up com 200ms ease-out
- `prefers-reduced-motion`: aparecer sem animacao

```
MOBILE STICKY BAR
[height: 64px, padding: 0 20px]
[left: "Entrar pra SINAPSE" var(--text-sm) bold]
[right: botao "R$27/mes" pill compacto]

DESKTOP STICKY BAR (bottom-right)
[posicao: fixed, bottom: 24px, right: 24px]
[card compacto: fundo #111111, borda #222, border-radius: 8px]
[padding: 16px 20px]
["Entrar por R$27/mes" + botao]
```

### Indicadores de secao

- Barra de progresso de leitura: NAO. Distrai e parece cheesy.
- Navegacao por secao (desktop): sidebar de pontinhos — SIM, discreto
  - Posicao: fixed, lado direito, centrado vertical
  - 10 pontos (1 por secao), 6px cada, gap: 12px
  - Ativo: #F5F5F5 / Inativo: #333333
  - Hover: tooltip com nome da secao
  - Visivel apenas em viewport >= 1280px

### Ancora de secao

Cada secao tem um `id` para ancoragem direta:
```
#hero, #dor, #solucao, #beneficios, #prova,
#quem-somos, #oferta, #faq, #urgencia, #cta
```

### Floating elements

- NENHUM floating element animado (respeita performance e `prefers-reduced-motion`)
- Permitidos: sticky nav, sticky CTA bar, sidebar de navegacao (desktop)
- Proibidos: popups, exit-intent, chat bubbles autoabertas, banners animados

---

## 4. Mobile First

### Principios de adaptacao

1. **Colapso de grid:** Todas as grids multi-coluna colapsam para 1 coluna
2. **Ordem de elementos:** Conteudo critico primeiro, CTAs sempre ao final do bloco
3. **Tamanho de touch targets:** Minimo 44x44px (WCAG 2.5.5), CTAs primarios 56px height
4. **Tipografia:** Nunca menor que 16px para corpo de texto em mobile
5. **Imagens:** Screenshots servidas em formatos responsivos (Next.js Image)
6. **Depoimentos:** 5 visiveis, accordion ou "Ver mais" para os demais
7. **Tabela comparativa:** `overflow-x: auto` com scroll horizontal

### Adaptacoes por secao (mobile)

| Secao | Desktop | Mobile |
|-------|---------|--------|
| 1 Hero | Screenshot parcialmente visivel abaixo do fold | Screenshot como fundo com overlay escuro |
| 2 Dores | Grid 2x3 | Lista 1x6, empilhada |
| 3 Virada | 4 items "por que nao" lado a lado | 1 coluna |
| 4 Beneficios | Card forum destaque + 2 cards menores | Forum primeiro, cursos e mentoria empilhados |
| 5 Depoimentos | Grid 3 colunas | 1 coluna, max 5 + "Ver mais" |
| 6 FOMO | 2 colunas para Caio + Matheus | 1 coluna, empilhado |
| 7 Oferta | 3 colunas de tier | 1 coluna, forum no topo |
| 8 FAQ | Accordion 9 colunas | Accordion full-width |
| 9 Urgencia | 3 bullets lado a lado | 1 coluna |
| 10 CTA final | Coluna central | Full-width |

### CTAs thumb-friendly

Todos os CTAs primarios em mobile:
```css
height: 56px;                      /* minimo confortavel */
width: 100%;                       /* full-width em mobile */
font-size: 16px;                   /* nao menor que isso */
padding: 0 24px;                   /* espaco interno */
border-radius: 8px;
```

---

## 5. Paleta de Emocoes por Secao

| Secao | Momento emocional | Tom visual | Contraste | Elementos de cor |
|-------|------------------|-----------|-----------|-----------------|
| 1 Hero | Esperanca, curiosidade | Neutro-premium. Abertura. | Medio | Screenshot do forum. Badge azul. |
| 2 Agitacao | Tensao, identificacao | Escuro, denso, sem alivio visual | Alto (texto branco em fundo muito escuro) | Bordas de card em #333 (quase invisivel). Zero cor de tier. |
| 3 Virada | Alivio, reconhecimento | Ligeiramente mais "aberto" | Medio-baixo | Linha separadora de gradiente. |
| 4 Beneficios | Desejo, antecipacao | Cards distintos por tier | Deliberado por tier | Azul para forum, verde para cursos, ambar para mentoria |
| 5 Prova social | Confianca, validacao | Quente dentro do B&W | Baixo | Nomes em branco, subtitulos em cinza |
| 6 FOMO | Urgencia, emocao, FOMO | Mais escuro, mais comprimido | Alto | Zero cor — forca visual so pelo texto |
| 7 Oferta | Decisao, clareza | Limpo, sem ruido | Medio | Preco em azul (#3B82F6). Ambar para mentoria. Verde para cursos. |
| 8 FAQ | Logica, remocao de atrito | Neutro, organizado | Baixo | Linha separadora. Zero cor. |
| 9 Urgencia | Custo de nao agir | Escuro novamente, pulsante | Alto | X vermelho (#444) nos bullets de perda |
| 10 CTA final | Resolucao, acao | Igual ao hero — circulo fechado | Medio | Botao branco. Nada mais. |

### Transicoes entre secoes

- Nao usar `background: linear-gradient` entre secoes (efeito barato)
- Usar: mudanca abrupta de fundo com `padding` generoso entre secoes
- Unica excecao: separador visual entre secao 2 (dor) e secao 3 (virada)
  - Linha de 1px com gradiente horizontal: `transparent → #222 → transparent`

---

## 6. Wireframe Textual Completo (visao geral de scroll)

```
┌─────────────────────────────────────────────────────────────────┐
│ NAVBAR — 64px — logo | nav | "Entrar" botao                    │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 1 — HERO — 100vh                                         │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  [espaço top: 120px]                                        │ │
│ │  badge pill                                                 │ │
│ │  HEADLINE PRINCIPAL                                         │ │
│ │  subheadline                                                │ │
│ │  [CTA PRIMARIO]                                             │ │
│ │  micro-copy                                                 │ │
│ │  prova social imediata                                      │ │
│ │  [espaço: 40px]                                             │ │
│ │  ┌───────────────────────────────────────────────────────┐  │ │
│ │  │  screenshot do forum (parcialmente visivel)           │  │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 2 — AGITACAO — ~180vh                                    │
│  bloco de abertura                                              │
│  ┌────────┐ ┌────────┐  ┌────────┐ ┌────────┐  grid 2x3      │
│  │ dor 01 │ │ dor 02 │  │ dor 03 │ │ dor 04 │               │
│  └────────┘ └────────┘  └────────┘ └────────┘               │
│  ┌────────┐ ┌────────┐                                        │
│  │ dor 05 │ │ dor 06 │                                        │
│  └────────┘ └────────┘                                        │
│  bloco de consequencia                                         │
│  "Nao precisa ser assim."                                      │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 3 — A VIRADA — ~100vh                                    │
│  separador visual                                               │
│  label "A solucao"                                              │
│  HEADLINE DA VIRADA                                             │
│  corpo principal                                                │
│  promessa central                                               │
│  4 diferenciais (por que nao outra solucao)                    │
│  posicionamento de categoria                                    │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 4 — BENEFICIOS — ~220vh                                  │
│  "O que voce recebe"                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  CARD FORUM — destaque (borda azul)    Badge R$27/mes    │  │
│  │  feature + beneficio + impacto + lista + CTA             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │ CARD CURSOS          │  │ CARD MENTORIA               │    │
│  │ badge: Em breve      │  │ badge: Vagas limitadas       │    │
│  │ (verde)              │  │ (ambar) CTA: Agendar         │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
│  lista beneficios extras                                        │
│  bloco de ecossistema + CTA                                     │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 5 — PROVA SOCIAL — ~200vh                                │
│  headline                                                       │
│  prova qualitativa                                              │
│  ┌────────┐ ┌────────┐ ┌────────┐  grid 3x3 de depoimentos   │
│  │ dep 01 │ │ dep 02 │ │ dep 03 │                            │
│  │ dep 04 │ │ dep 05 │ │ dep 06 │                            │
│  │ dep 07 │ │ dep 08 │ │ dep 09 │                            │
│  └────────┘ └────────┘ └────────┘                            │
│  depoimento 10 (destaque ou descarte se visual ficar pesado)   │
│  forum como prova viva + screenshot                             │
│  [CTA PRIMARIO]                                                 │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 6 — QUEM E A SINAPSE / FOMO — ~140vh                    │
│  FOMO headline                                                  │
│  bloco narrativo (paragrafos)                                   │
│  "O que a SINAPSE sabe..."                                      │
│  3 bullets de insight                                           │
│  "Isso nao e para todo mundo."                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │ CAIO IMORI           │  │ MATHEUS SOIER               │    │
│  │ avatar + autoridade  │  │ avatar + autoridade          │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
│  "Juntos" + missao                                              │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 7 — OFERTA — ~160vh                                      │
│  headline de ancoragem                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │ funcionario │ │ mastermind  │ │ sozinho     │ ancoragem   │
│  └─────────────┘ └─────────────┘ └─────────────┘             │
│  "Agora veja o que a SINAPSE entrega por R$27"                 │
│  ┌─────────────────────────┐ ┌───────────┐ ┌──────────────┐  │
│  │ FORUM R$27/mes          │ │ CURSOS    │ │ MENTORIA     │  │
│  │ (card destaque, azul)   │ │ Em breve  │ │ Vagas lim.   │  │
│  └─────────────────────────┘ └───────────┘ └──────────────┘  │
│  tabela comparativa (opcional)                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GARANTIA 7 DIAS — icone escudo + copy completa          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  notas de rodape                                                │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 8 — FAQ — ~200vh                                         │
│  headline                                                       │
│  [accordion de 10 objecoes — expandiveis]                      │
│  ▼ Objecao 1 ─────────────────────────────────────────────    │
│  ▼ Objecao 2 ─────────────────────────────────────────────    │
│  ...                                                            │
│  ▼ Objecao 10 ────────────────────────────────────────────    │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 9 — URGENCIA — ~80vh                                     │
│  headline temporal (2024/2025/2026)                             │
│  janela de vantagem                                             │
│  bullets de custo de nao agir                                   │
│  "2 anos sozinho vs. 2 meses com a gente"                      │
│  [CTA antecipado]                                               │
├─────────────────────────────────────────────────────────────────┤
│ SECAO 10 — CTA FINAL — ~80vh                                   │
│  recapitulacao (3 linhas)                                       │
│  copy de fechamento                                             │
│  "A janela de vantagem esta aberta."                            │
│  [CTA PRINCIPAL — maior]                                        │
│  copy de reassurance                                            │
│  micro-copy                                                     │
│  nota final                                                     │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER — 120px                                                  │
│  logo | links legais | "Desenvolvido por Caio e Matheus"       │
│  "SINAPSE AI © 2026. CNPJ. Todos os direitos reservados."      │
└─────────────────────────────────────────────────────────────────┘

STICKY CTA BAR (aparece apos 120vh de scroll, some na secao 10)
└── mobile: full-width bar no bottom
└── desktop: card fixo no canto inferior direito
```

---

## 7. Especificacoes de Acessibilidade

### Contraste minimo

- Texto sobre fundo escuro: ratio minimo 4.5:1 (WCAG AA)
- Texto grande (>= 18px bold ou >= 24px normal): ratio minimo 3:1
- Verificar: #F5F5F5 sobre #0A0A0A = ~19:1 (PASSA)
- Verificar: #888888 sobre #0A0A0A = ~4.6:1 (PASSA AA)
- Verificar: #555555 sobre #0A0A0A = ~2.8:1 (FALHA AA — usar apenas para elementos decorativos)

### Tamanhos minimos de fonte

- Corpo de texto: 16px (1rem) em qualquer viewport
- Captions, micro-copies: 12px (0.75rem) no minimo — se necessitar 12px, aumentar o contraste

### Prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- Sticky CTA: aparece sem animacao
- Accordion FAQ: abre sem transicao de altura
- Screenshot: sem parallax

### Focus states

- Todo elemento interativo deve ter `focus-visible` estilizado
- Estilo sugerido: `outline: 2px solid #F5F5F5; outline-offset: 4px`

### Semantica HTML

```
<header> — navbar
<main>
  <section aria-labelledby="hero-headline"> — secao 1
  <section aria-labelledby="pain-headline"> — secao 2
  ... (cada secao com aria-labelledby)
</main>
<footer> — rodape
```

---

## 8. Performance

### Imagens

- Screenshots do forum: formato WebP com fallback JPEG
- Blur de nomes: aplicado via CSS filter no cliente (nao via imagem)
- Tamanhos responsivos: srcset com 375w, 768w, 1280w, 1920w
- Loading: `loading="lazy"` em tudo abaixo do fold
- Priority: `loading="eager"` apenas na imagem do hero

### Fonts

- Carregar apenas pesos: 400, 600, 700
- `font-display: swap`
- Preload apenas da fonte do hero

### Animacoes

- Nenhum efeito de parallax (performance ruim em mobile)
- Entrance animations: apenas fade + translate simples via Intersection Observer
- Sem libraries de animacao (Framer Motion so se ja estiver no bundle)

---

## 9. Notas para Implementacao

### Ordem de implementacao sugerida para o @developer

1. Layout base (fundo, grid, tipografia, tokens)
2. Secao 1 — Hero (critico, above the fold)
3. Sticky CTA bar
4. Secao 7 — Oferta (decisao de compra)
5. Secao 10 — CTA final
6. Secoes 2 e 3 (dor e virada)
7. Secao 4 — Beneficios
8. Secao 5 — Prova social
9. Secao 6 — FOMO + fundadores
10. Secao 8 — FAQ accordion
11. Secao 9 — Urgencia
12. Footer + navegacao por pontos

### Dependencias de conteudo

| Elemento | Conteudo necessario | Status |
|----------|-------------------|--------|
| Screenshot do forum | Print real do forum.sinapse.club | Pendente |
| Avatares Caio + Matheus | Fotos reais ou iniciais | Pendente |
| Copy de cada secao | 03-copy-framework.md v3 | PRONTO |
| Precos e badges | 06-offer-copy.md v3 | PRONTO |
| Copy de garantia | 06-offer-copy.md v3 | PRONTO |

---

*Entregue por @design-orqx (Nexus). 2026-04-08 (v1)*
*Inputs consumidos: 03-copy-framework.md (v3), 06-offer-copy.md (v3), 00-strategy-v3.md (v3)*
*Consumidores: @developer (implementacao da LP)*
