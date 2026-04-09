# 05 — Animations Spec — LP SINAPSE

**Squad:** @animations-orqx (Kinetic)
**Story:** LP-1 / FASE 3
**Data:** 2026-04-08
**Status:** v1 — Spec completa para implementacao
**Input:** 03-copy-framework.md (copy v3), 00-strategy-v3.md (estrategia)
**Design system:** B&W minimalista premium. Accent: azul (membro), verde (cursos), ambar/dourado (mentoria)

---

## Principios Gerais

1. **Animacao serve a conversao, nao a estetica.** Cada efeito tem motivo declarado.
2. **Performance acima de tudo.** CSS > Framer Motion > GSAP. Lottie apenas para icones pontuais.
3. **prefers-reduced-motion obrigatorio** em TODA animacao sem excecao.
4. **Lazy load** para tudo abaixo do fold via Intersection Observer.
5. **Sem animacoes de ego.** Se o usuario nao percebe o motivo, a animacao nao vai.

---

## Padrao de especificacao

Para cada animacao:
- **Motivo:** por que existe (guia atencao / reforça emocao / reduz friccao / cria urgencia)
- **Tipo:** CSS / Framer Motion / GSAP / Lottie / Canvas
- **Trigger:** load / scroll (IO) / hover / focus / click
- **Duration:** ms
- **Easing:** funcao especifica
- **Delay:** ms (se aplicavel)
- **Direcao:** fade-up / fade-left / scale / clip-path / etc.
- **Fallback:** comportamento com prefers-reduced-motion

---

## Secao 1 — Hero (Above the Fold)

### 1.1 Headline Principal

**Motivo:** Guiar o olho da esquerda para a direita palavra por palavra, aumentando o peso emocional de cada fragmento da promessa. O empresario le devagar, internaliza.

**Implementacao: Split Text + Stagger Reveal**
- Tipo: Framer Motion (`motion.span` por palavra ou bloco de 2-3 palavras)
- Trigger: load (page ready)
- Animacao: `opacity: 0 → 1` + `y: 20px → 0`
- Duration por bloco: 400ms
- Stagger entre blocos: 80ms
- Easing: `easeOut` (cubic-bezier 0.0, 0.0, 0.2, 1)
- Delay inicial: 200ms apos page load
- Fallback: texto visivel imediatamente, sem movimento

**Nota de implementacao:**
```tsx
// Dividir headline em segmentos semanticos, nao letra por letra
// "Pare de pagar caro" | "pra fazer o que IA faz melhor." | "Escale sem aumentar a folha."
// Manter legibilidade semantica no stagger
```

### 1.2 Subheadline

**Motivo:** Confirma e expande a promessa. Entra depois do headline para criar ritmo de leitura.

- Tipo: Framer Motion
- Trigger: load
- Animacao: `opacity: 0 → 1` + `y: 12px → 0`
- Duration: 500ms
- Delay: stagger total do headline + 120ms
- Easing: `easeOut`
- Fallback: visivel, sem movimento

### 1.3 Background — Gradient Pulse

**Motivo:** Comunicar atividade e vida sem distrair. Background que "respira" reforça que algo esta acontecendo dentro da plataforma.

**Implementacao: CSS animated gradient**
- Tipo: CSS `@keyframes` (nao JS — zero custo)
- Background: gradiente radial de `#000000` com bloom sutil de `rgba(255,255,255,0.03)` pulsando
- Animation: `backgroundPosition` se movendo devagar, efeito de "nebulosa lenta"
- Duration: 8000ms
- Easing: `ease-in-out`
- Iteration: `infinite alternate`
- Fallback: background estatico `#000000`

```css
/* Exemplo de implementacao */
@keyframes hero-pulse {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.hero-bg {
  background: radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.02) 0%, transparent 60%),
              #000;
  background-size: 200% 200%;
  animation: hero-pulse 8s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg { animation: none; }
}
```

### 1.4 Screenshot do Forum (produto no hero)

**Motivo:** A copy pede "mostrar o produto, nao ilustracao generica." O screenshot precisa aparecer de forma que comunique "isso e real, esta vivo."

- Tipo: Framer Motion
- Trigger: load
- Animacao: `opacity: 0 → 1` + `scale: 0.96 → 1` + leve `y: 24px → 0`
- Duration: 700ms
- Delay: 400ms (entra depois do headline ter comecado)
- Easing: `easeOut`
- Detalhe: leve sombra `box-shadow` que aparece junto com o scale (reforça profundidade)
- Fallback: visivel, sem scale/movimento

**Overlay de atividade no screenshot:**
- Indicadores de "online agora" (pontos verdes pulsando) — ver item 1.6

### 1.5 CTA Primario — Aparicao

**Motivo:** CTA nao pode aparecer antes da proposta de valor. Entra por ultimo, quando o usuario ja leu o suficiente para ter contexto.

- Tipo: Framer Motion
- Trigger: load
- Animacao: `opacity: 0 → 1` + `y: 10px → 0`
- Duration: 400ms
- Delay: 800ms (entra por ultimo no hero)
- Easing: `easeOut`
- Fallback: visivel

### 1.6 CTA Primario — Hover State

**Motivo:** Feedback visual imediato reforça que o botao e clicavel. Glow sutil reforça premium sem ser chamativo.

- Tipo: CSS transition
- Trigger: hover
- Animacao:
  - Background: `#ffffff` → `#e8e8e8` (branco para off-white, sem cor)
  - `box-shadow: 0 0 0 0 rgba(255,255,255,0)` → `0 0 20px 4px rgba(255,255,255,0.15)`
  - `transform: translateY(-1px)`
- Duration: 200ms
- Easing: `ease-out`
- Fallback: nao ha movimento, apenas mudanca de cor (sem `prefers-reduced-motion` issue)

### 1.7 Micro-copy abaixo do CTA

**Motivo:** "R$27/mes. Cancele quando quiser. Garantia de 7 dias." — precisa ser notado sem ser gritante. Aparece com delay maior.

- Tipo: Framer Motion
- Trigger: load
- Animacao: `opacity: 0 → 0.6`
- Duration: 600ms
- Delay: 1000ms
- Easing: `easeOut`
- Fallback: visivel com `opacity: 0.6`

### 1.8 Prova Social Imediata — Fade-in com Indicadores de Atividade

**Motivo:** "Empresarios de agencias, e-commerces, consultorias e SaaS trocando resultados reais." — precisa entrar sutilmente confirmando a claim do headline.

- Tipo: CSS + Framer Motion
- Trigger: load
- Animacao: `opacity: 0 → 1`
- Duration: 500ms
- Delay: 1200ms
- Fallback: visivel

**Pontos de atividade (indicadores "online agora"):**
- 3-5 avatares/iniciais empilhados (AvatarStack)
- Cada avatar: CSS `animation: pulse 2s ease-in-out infinite` com `opacity: 0.7 → 1`
- Stagger de 400ms entre cada avatar
- Dot verde ao lado: `animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite` (Tailwind ping)
- Fallback: avatares visiveis, sem pulse no dot

---

## Secao 2 — Agitacao (Amplificacao da Dor)

**Mood da secao:** Tensao crescente. Fundo ainda escuro. Copy agressiva. As animacoes AMPLIFICAM o desconforto.

### 2.1 Entrada da secao

**Motivo:** A transicao para a secao de dor precisa ser perceptivel. O usuario precisa "entrar" nesse espaco.

- Tipo: Framer Motion (viewport trigger via `whileInView`)
- Trigger: scroll — elemento entra 30% no viewport
- Animacao headline bloco: `opacity: 0 → 1` + `y: 30px → 0`
- Duration: 500ms
- Easing: `easeOut`
- `once: true` (nao re-anima ao scrollar para cima)
- Fallback: visivel

### 2.2 As 6 Dores — Reveal Progressivo com Stagger

**Motivo:** Cada dor que aparece aumenta a pressao psicologica. Stagger progressivo faz o usuario "receber" uma dor de cada vez, sem escapar.

- Tipo: Framer Motion (`staggerChildren`)
- Trigger: scroll (IO) — quando o container das dores entra no viewport
- Animacao por card/item: `opacity: 0 → 1` + `x: -20px → 0` (vem da esquerda, como acusacao)
- Duration por item: 400ms
- Stagger: 120ms entre cada dor
- Easing: `easeOut`
- Fallback: todos visiveis, sem movimento

**Micro-animation nos bullets/numeros das dores:**
- Numero (1, 2, 3...) ou icone: ao entrar no viewport, breve `scale: 0 → 1` em 200ms
- Efeito: cada dor "chega" com um beat visual
- Fallback: escala normal sem animacao

### 2.3 Texto de Consequencia

**Citacao "Voce esta pagando mais do que devia e trabalhando mais do que precisava."**

**Motivo:** Esta e a frase de maior carga emocional da secao. Precisa de respiro visual.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` — APENAS fade, sem movimento
- Duration: 800ms (mais lento, mais peso)
- Easing: `easeOut`
- Detalhe tipografico: a frase pode ter um leve `letter-spacing` que vai de `0.05em → 0` enquanto faz o fade (reforça o "peso")
- Fallback: visivel

### 2.4 Transicao para a Secao de Solucao

**Motivo:** A mudança de mood (dor → virada) precisa ser fisicamente sentida. A divisor nao e so visual, e uma "respiracao" da pagina.

- Tipo: CSS clip-path + Framer Motion
- Implementacao: Uma linha ou divisor que "varre" da esquerda para a direita enquanto o usuario chega
- Trigger: scroll (IO)
- Animacao: `scaleX: 0 → 1` com `transform-origin: left`
- Duration: 800ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Acompanhado de mudanca de background: gradiente de `#000` para `#0a0a0a` (quase imperceptivel, cria profundidade)
- Fallback: linha visivel estatica

---

## Secao 3 — A Virada (Apresentacao da Comunidade)

**Mood:** Alívio. Clareza. Encontrei o que procurava. Animacoes mais abertas, mais lentas.

### 3.1 Reveal da Promessa Central

**Motivo:** Esta e a virada emocional da pagina. A animacao precisa comunica "chegamos".

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` + `y: 40px → 0` (movimento maior que os anteriores — "subida")
- Duration: 700ms
- Easing: `easeOut`
- Detalhe: a palavra-chave ("Reduza custos. Escale. Saia da operacao.") pode ter um breve `font-weight` transition ou underline que aparece
- Fallback: visivel

### 3.2 Bloco "Por que SINAPSE e nao outra solucao"

**Motivo:** Cada comparacao (Nao e um curso / Nao e um grupo de WhatsApp / etc.) precisa chegar como uma revelacao, nao como lista.

- Tipo: Framer Motion `staggerChildren`
- Trigger: scroll (IO)
- Animacao por item: `opacity: 0 → 1` + `x: 0, y: 15px → 0`
- Duration por item: 400ms
- Stagger: 100ms
- Easing: `easeOut`
- Fallback: todos visiveis

### 3.3 Badge de Posicionamento de Categoria

**"A unica comunidade operacional de IA para negocios no Brasil."**

**Motivo:** Esta claim de categoria unica merece destaque. Um badge ou pill que aparece com impacto.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `scale: 0.8 → 1` + `opacity: 0 → 1`
- Duration: 500ms
- Easing: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (leve overshoot — "chegou")
- Fallback: visivel sem scale

---

## Secao 4 — O Que Voce Recebe (Beneficios)

**Mood:** Clareza de valor. Confianca crescente. Animacoes revelam valor progressivamente.

### 4.1 Cards de Beneficio — Scroll-triggered Entrance

**Motivo:** Cada beneficio e uma camada de valor. Revelar um por vez mantém atencao e aumenta o desejo progressivamente.

- Tipo: Framer Motion `staggerChildren` + `whileInView`
- Trigger: scroll (IO) — container dos cards
- Animacao por card: `opacity: 0 → 1` + `y: 30px → 0`
- Duration por card: 500ms
- Stagger: 150ms
- Easing: `easeOut`
- `once: true`
- Fallback: todos visiveis

### 4.2 Cards de Beneficio — Hover Effects

**Motivo:** Hover em card e sinal de interesse. Feedback visual confirma "voce pode clicar/explorar isso."

- Tipo: CSS transition
- Trigger: hover
- Animacao:
  - `border-color: rgba(255,255,255,0.1) → rgba(255,255,255,0.3)` (borda clareia)
  - `background: rgba(255,255,255,0.02) → rgba(255,255,255,0.05)` (fundo levissimo)
  - `transform: translateY(-3px)` (leve levitacao)
  - `box-shadow: 0 4px 20px rgba(255,255,255,0.05)` aparece
- Duration: 200ms
- Easing: `ease-out`
- Fallback: apenas a mudanca de cor, sem translateY

### 4.3 Icone de cada beneficio — Entrada animada

**Motivo:** O icone ancora visualmente o beneficio. Uma entrada sutil faz ele ser "notado" antes do texto.

- Tipo: Framer Motion
- Trigger: scroll (IO) — junto com o card pai
- Animacao: `opacity: 0 → 1` + `scale: 0.6 → 1`
- Duration: 300ms
- Delay: 0ms (entra antes do texto do card — 50ms de antecedencia no stagger)
- Easing: `easeOut`
- Fallback: visivel sem scale

### 4.4 Destaque do Ecossistema (Forum / Cursos / Mentoria)

**"Forum. Cursos. Mentoria. Cada passo no seu ritmo."**

**Motivo:** Este bloco planta a semente da escada de valor. Os tres pilares precisam ser percebidos como complementares, nao competitivos.

**Implementacao:**
- Tres pills/badges com cores de accent (azul, verde, ambar)
- Trigger: scroll (IO)
- Animacao: pills aparecem em stagger com `scale: 0 → 1` + `opacity: 0 → 1`
- Stagger: 200ms entre cada pill
- Duration por pill: 400ms
- Easing: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (overshoot suave)
- Ao aparecer, cada pill tem uma borda colorida que vai de `opacity: 0` para `opacity: 1` separadamente (2-step: badge aparece, entao borda acende)
- Fallback: visiveis sem animacao

---

## Secao 5 — Prova Social

**Mood:** Credibilidade construida por pares. Animacoes nao devem parecer "marketing", devem parecer "real."

### 5.1 Depoimentos — Grid ou Carrossel

**Motivo:** 10 depoimentos. Se todos aparecem de uma vez, nenhum e lido. Revelar em grupos de 2-3 mantem engajamento.

**Opcao A: Grid com scroll reveal (recomendada para desktop)**
- Tipo: Framer Motion `staggerChildren`
- Trigger: scroll (IO) por linha do grid
- Animacao por card: `opacity: 0 → 1` + `y: 20px → 0`
- Duration: 400ms
- Stagger: 100ms
- Easing: `easeOut`
- Fallback: todos visiveis

**Opcao B: Carrossel horizontal infinito (para mobile ou secao compacta)**
- Tipo: CSS `animation: scroll-left linear infinite`
- Dois tracks espelhados (loop seamless)
- Duration: 40s (devagar o suficiente pra ler)
- `animation-play-state: paused` on hover (usuario para pra ler)
- Fallback: grid estatico, sem scroll

### 5.2 Screenshot do Forum como Prova Viva

**Motivo:** "Nao acredita? O forum esta la." — o screenshot precisa aparecer como evidencia, nao como decoracao.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` + leve `scale: 0.97 → 1`
- Duration: 600ms
- Easing: `easeOut`
- Detalhe: `border` do screenshot tem um glow `box-shadow: 0 0 0 1px rgba(255,255,255,0.15)` que aparece junto com o fade
- Overlay de "atividade recente" no screenshot: timestamps ou indicadores pulsando (ver 1.8)
- Fallback: visivel sem scale

### 5.3 Numero-Counters (sem membros — outros numeros possiveis)

**Motivo:** Se houver numeros (ex: "15h economizadas por semana", "40% mais margem"), counter animado prende atencao e torna o numero memoravel.

**Implementacao: Counter incremental**
- Tipo: Framer Motion + `useMotionValue` ou lib leve (countup.js ~2kb)
- Trigger: scroll (IO) — quando o numero entra no viewport
- Animacao: valor numerico vai de 0 ao valor final em duracao proporcional
- Duration: 1500ms para numeros grandes, 800ms para percentuais
- Easing: `easeOut` (rapido no inicio, desacelera no final — parece "chegar")
- Fallback: numero final estatico

**Nota:** Apenas usar se os numeros forem reais e verificaveis. Nao inventar.

---

## Secao 6 — Quem e a SINAPSE AI (FOMO Section)

**Mood:** Urgencia emocional profunda. FOMO real. Esta secao faz o usuario sentir que esta perdendo algo que acontece AGORA. Animacoes comunicam atividade ao vivo.

### 6.1 Headline de Abertura

**"A maioria dos empresarios brasileiros vai descobrir o que IA faz por negocios daqui a 2 anos. Voce pode descobrir agora."**

**Motivo:** Esta frase e a abertura do FOMO. Precisa chegar com peso. Sem distracoes.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` APENAS (sem movimento — o peso e no silencio)
- Duration: 1000ms (lento — deixa a frase pesar)
- Easing: `easeOut`
- Fallback: visivel

### 6.2 Activity Feed — "Isso esta acontecendo agora"

**"Enquanto voce le isso, tem empresario la dentro do forum fechando automacao..."**

**Motivo:** Esta copy menciona atividade em tempo real. Uma animacao de "feed de atividade" torna isso literal e visceral.

**Implementacao: Fake Activity Feed animado**
- Estrutura: lista vertical de atividades ficticias ("Ricardo acabou de postar sobre automacao de atendimento", "Fernanda compartilhou resultado: 70% dos tickets resolvidos sem humano")
- Tipo: CSS `@keyframes` + JS (setInterval ou Framer Motion variants)
- Animacao: novo item aparece no topo a cada 4-6 segundos com `opacity: 0 → 1` + `y: -10px → 0`
- Item mais antigo some na base com `opacity: 1 → 0`
- Velocidade: devagar o suficiente pra ler, rapido o suficiente pra parecer vivo
- Max items visiveis: 3-4
- Duration por item: 300ms de entrada, 300ms de saida
- Easing: `easeOut` (entrada), `easeIn` (saida)
- Fallback: lista estatica com 3 atividades, sem movimento

**Performance:** Este componente deve ser lazy-loaded. Suspense boundary com static fallback.

### 6.3 Perfis dos Fundadores (Caio e Matheus)

**Motivo:** Os fundadores sao a prova humana da promessa. A foto/avatar precisa aparecer como presenca real, nao como marketing.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` + `scale: 0.9 → 1`
- Duration: 500ms
- Stagger entre os dois: 200ms
- Easing: `easeOut`
- Detalhe: ring/borda em torno do avatar que "acende" (border glow de `opacity: 0 → 1` em 300ms apos o avatar aparecer)
- Fallback: visiveis sem scale

### 6.4 Copy de FOMO Progressivo

**Os paragrafos de "Isso esta acontecendo agora. Todo dia. E voce nao esta la."**

**Motivo:** Esta e a parte mais agressiva emocionalmente. Os paragrafos precisam chegar um por vez, como socos graduais.

- Tipo: Framer Motion `staggerChildren`
- Trigger: scroll (IO)
- Animacao por paragrafo: `opacity: 0 → 1` + `y: 15px → 0`
- Duration: 500ms
- Stagger: 200ms
- `once: true`
- Fallback: todos visiveis

---

## Secao 7 — Pricing

**Mood:** Clareza total. Zero confusao. Animacoes guiam para o CTA, nao distraem.

### 7.1 Card do Forum (R$27/mes) — Destaque Visual

**Motivo:** Este e o produto que a LP vende. O card precisa ter presenca visual superior aos outros itens da secao.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` + `y: 30px → 0` + `scale: 0.97 → 1`
- Duration: 600ms
- Easing: `easeOut`
- Detalhe: `border` branca com `box-shadow: 0 0 30px rgba(255,255,255,0.08)` que aparece com o card (comunica "principal")
- Fallback: visivel sem animacao

### 7.2 Badge "R$27/mes" — Destaque do Preco

**Motivo:** O preco e surpreendentemente baixo. A animacao deve comunicar "espera, e so isso?"

- Tipo: Framer Motion
- Trigger: scroll (IO) — quando o badge entra no viewport
- Animacao: `scale: 1.2 → 1` (entra maior, estabiliza — atencao sem grito)
- Duration: 400ms
- Easing: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (overshoot suave)
- Fallback: visivel sem scale

### 7.3 Items de Cursos e Mentoria — Reveal Secundario

**Motivo:** Cursos e mentoria sao os proximos degraus. Aparecem depois do card principal, como possibilidades futuras.

- Tipo: Framer Motion `staggerChildren`
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 0.8` (levemente mais opaco que o principal — hierarquia visual)
- Duration: 400ms
- Stagger: 150ms
- Easing: `easeOut`
- Fallback: visiveis com opacity 0.8

### 7.4 Badge "Em breve" (Cursos) e "Vagas limitadas" (Mentoria)

**Motivo:** Estes badges criam antecipacao e urgencia respectivamente. Precisam de destaque proprio.

**Badge "Em breve":**
- Tipo: CSS
- Animacao: leve pulse de `opacity: 0.7 → 1 → 0.7` continuo
- Duration: 2000ms
- Easing: `ease-in-out`
- Fallback: estatico sem pulse

**Badge "Vagas limitadas":**
- Tipo: CSS + dot pulsante (ambar)
- Dot: `animation: ping` (Tailwind) na cor `#f59e0b` (ambar)
- Duration: 1500ms
- Fallback: dot estatico sem ping

### 7.5 CTA do Pricing — Hover e Focus

**Motivo:** O usuario que chegou na secao de pricing tem intencao alta. O CTA precisa ter hover que reforça "vai ser bom."

- Tipo: CSS transition
- Trigger: hover + focus
- Animacao:
  - Background lightens: `#ffffff → #f5f5f5`
  - `transform: translateY(-2px) scale(1.02)`
  - `box-shadow: 0 8px 25px rgba(255,255,255,0.12)`
- Duration: 180ms
- Easing: `ease-out`
- Focus: mesma animacao + `outline: 2px solid rgba(255,255,255,0.5)` para acessibilidade
- Fallback: apenas mudanca de cor, sem transform

### 7.6 Bloco de Garantia

**Motivo:** "7 dias de garantia incondicional" reduz friccao no momento de maior hesitacao. A animacao deve comunica seguranca, nao urgencia.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` (apenas fade — serenidade)
- Duration: 700ms
- Easing: `easeOut`
- Icone de garantia (escudo/check): leve `scale: 0 → 1` em 300ms, 100ms antes do texto
- Fallback: visivel

---

## Secao 8 — FAQ

**Mood:** Clareza objetiva. Zero ruido. Animacoes funcionais, nao decorativas.

### 8.1 Accordion — Expand/Collapse

**Motivo:** Animacao suave no accordion reduz a percepcao de "demora" ao abrir uma resposta.

- Tipo: CSS + Framer Motion (`AnimatePresence` + `height: auto`)
- Trigger: click
- Animacao: `height: 0 → auto` com `opacity: 0 → 1`
- Duration: 300ms
- Easing: `easeOut` (abrir), `easeIn` (fechar)
- Seta/chevron: `rotate: 0 → 180deg` em 300ms (indica estado)
- Fallback: funcional sem animacao (toggle simples com CSS `display: none/block`)

**Nota de implementacao:**
```tsx
// Usar Framer Motion AnimatePresence para height auto
// Nao usar max-height com valor fixo — causa lag no final
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

### 8.2 FAQ Items — Scroll Reveal

**Motivo:** Revelar perguntas progressivamente mantém estrutura visual da secao.

- Tipo: Framer Motion `staggerChildren`
- Trigger: scroll (IO)
- Animacao por item: `opacity: 0 → 1` + `y: 10px → 0`
- Duration: 300ms
- Stagger: 60ms (rapido — sao muitos itens)
- Easing: `easeOut`
- Fallback: todos visiveis

---

## Secao 9 — Urgencia (Janela de Vantagem)

**Mood:** Clareza sobre custo de nao agir. Sem alarmismo. Animacoes reforçam peso das palavras.

### 9.1 Reveal da Copy de Urgencia

**Motivo:** Esta copy ativa FOMO baseado em logica, nao emocao. A animacao deve ser sobria.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` + `y: 20px → 0`
- Duration: 600ms
- Easing: `easeOut`
- Fallback: visivel

### 9.2 Contraste "Custo visivel vs. Custo invisivel"

**"O custo da SINAPSE e R$27/mes. Visivel. O custo de NAO estar na SINAPSE e invisivel. Mas real."**

**Motivo:** Este contraste e o argumento logico mais forte da secao. Merece tratamento visual proprio.

- Implementacao: duas colunas ou linha divisora
- Lado A (R$27): texto branco, `opacity: 1`
- Lado B (custo invisivel): texto que começa `opacity: 0.4` e vai para `opacity: 1` ao scroll
- Trigger: scroll (IO)
- Duration: 800ms
- Easing: `easeOut`
- Fallback: ambos com `opacity: 1`

### 9.3 Parallax Sutil na Secao de Urgencia

**Motivo:** Parallax sutil cria sensacao de profundidade e "movimento" que reforça que o mundo esta se movendo sem o usuario.

- Tipo: CSS ou Framer Motion (`useScroll` + `useTransform`)
- Implementacao: elemento de background se move a 0.3x da velocidade do scroll
- Apenas para elemento decorativo — NUNCA para copy ou CTAs
- Range: transformY de `0px` para `-30px` enquanto o usuario scrolla pela secao
- Fallback: estatico (`prefers-reduced-motion`)

---

## Secao 10 — CTA Final

**Mood:** Clareza, confianca, momento de decisao. A animacao nao pode ser excessiva — deve ser positiva e segura.

### 10.1 Headline de Recapitulacao

**Motivo:** O usuario que chegou aqui leu tudo. Esta headline confirma a promessa e o leva para o clique.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 1` + `y: 20px → 0`
- Duration: 600ms
- Easing: `easeOut`
- Fallback: visivel

### 10.2 CTA Principal — "Entrar pra SINAPSE agora"

**Motivo:** Este e o botao mais importante da pagina. A animacao deve comunicar importancia sem grito.

- Tipo: Framer Motion + CSS
- Trigger: scroll (IO) para aparicao
- Animacao entrada: `opacity: 0 → 1` + `scale: 0.95 → 1`
- Duration: 500ms
- Easing: `easeOut`
- Delay: 200ms apos o texto acima

**Pulse permanente (muito sutil):**
- CSS `@keyframes pulse-glow`
- `box-shadow` alternando entre `0 0 0 0 rgba(255,255,255,0.1)` e `0 0 20px 4px rgba(255,255,255,0.08)` ao longo de 3000ms
- Communicado: "clique em mim" sem ser agressivo
- Fallback: sem pulse, botao estatico com hover normal

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
  50% { box-shadow: 0 0 20px 4px rgba(255,255,255,0.08); }
}

.cta-final { animation: pulse-glow 3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .cta-final { animation: none; }
}
```

### 10.3 Copy de Reassurance abaixo do CTA

**Motivo:** Reduz friccao de ultima hora. Aparece depois do botao, nao antes.

- Tipo: Framer Motion
- Trigger: scroll (IO)
- Animacao: `opacity: 0 → 0.7`
- Duration: 500ms
- Delay: 300ms apos CTA
- Fallback: visivel com opacity 0.7

### 10.4 Confetti / Celebracao po Conversao

**Motivo:** Reforco positivo imediato apos o clique no CTA. Comunica "boa escolha."

- Tipo: `canvas-confetti` (lib ~15kb, lazy-loaded)
- Trigger: click no CTA
- Animacao: confetti burst discreto (cores B&W + accent azul) saindo do ponto de clique
- Duration: 2000ms, auto-remove
- Quantidade: moderada (nao exagerada — premium, nao carnaval)
- Lazy-load: importar a lib apenas quando o usuario esta proximo do final da pagina (IO observando a secao 9)
- Fallback: sem confetti — a navegacao acontece normalmente

```ts
// Lazy load pattern
const loadConfetti = () => import('canvas-confetti').then(m => m.default);

// Pre-load quando o usuario entra na secao 9
const { ref: section9Ref } = useInView({
  onChange: (inView) => { if (inView) loadConfetti(); }
});
```

---

## Secao 11 — Transicoes entre Secoes

### 11.1 Divisores e Clips

| Transicao | Implementacao | Motivo |
|-----------|--------------|--------|
| Hero → Dor | Diagonal cut clip-path (`polygon(0 0, 100% 0, 100% 90%, 0 100%)`) | Cria tensao visual |
| Dor → Virada | Linha horizontal que varre da esquerda para direita (`scaleX: 0→1`) | Beat visual de virada |
| Virada → Beneficios | Gradiente fade, sem clip | Fluxo suave, alívio |
| Beneficios → Prova | Sem divisor visivel, apenas spacing | Continuidade natural |
| Prova → FOMO | Wave suave (SVG) | Separa secoes de humor diferente |
| FOMO → Pricing | Linha fina branca | Clareza antes da oferta |
| Pricing → FAQ | Gradiente fade | Transicao calma |
| FAQ → Urgencia | Sem divisor, apenas mudanca de background | Urgencia nao avisa |
| Urgencia → CTA Final | Gradiente ascendente (escuro → levemente menos escuro) | "Subida" para o clique |

### 11.2 Scroll Fade entre Mudancas de Mood

Para transicoes de escuro para menos escuro:
- Tipo: CSS gradient no pseudo-elemento `::after` do container
- `background: linear-gradient(to bottom, transparent, #000)`
- Nao e animado — e estatico
- Fallback: identico (nao tem animacao)

---

## Secao 12 — Elementos Globais

### 12.1 Sticky CTA — Comportamento e Animacao

**Motivo:** O CTA sticky aumenta conversao mas so pode aparecer quando o hero CTA nao esta mais visivel.

- **Quando aparece:** quando o hero CTA sai do viewport (Intersection Observer)
- **Tipo de entrada:** Framer Motion `AnimatePresence`
- Animacao: `y: -60px → 0` + `opacity: 0 → 1` (vem de cima)
- Duration: 300ms
- Easing: `easeOut`
- **Quando some:** quando o CTA final entra no viewport
- Animacao de saida: `y: 0 → -60px` + `opacity: 1 → 0`
- Duration: 200ms
- Fallback: aparece sem animacao quando hero sai, some quando CTA final aparece

**Design do sticky CTA:**
- Height: 52px
- Background: `rgba(0,0,0,0.9)` com `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid rgba(255,255,255,0.1)`
- Texto: "Entrar na SINAPSE — R$27/mes"
- Hover state igual ao CTA primario

### 12.2 Scroll Indicator no Hero

**Motivo:** Usuario que nao scrolla perde a LP inteira. Indicador sutil comunicar "tem mais abaixo."

- Tipo: CSS animation
- Implementacao: seta para baixo ou dot com `animation: bounce 2s infinite`
- Position: bottom do hero, centrado
- Desaparece: quando usuario da o primeiro scroll (`opacity: 1 → 0` em 300ms via JS)
- Fallback: seta visivel estatica sem bounce

```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.scroll-indicator { animation: bounce 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .scroll-indicator { animation: none; }
}
```

### 12.3 Cursor Effects

**Decisao: NAO implementar cursor custom.**

**Motivo:** Cursor custom adiciona JS overhead, quebra acessibilidade (usuarios com precisao reduzida), e nao tem impacto mensuravel em conversao. O design B&W premium nao precisa disso.

### 12.4 Page Loading State

**Motivo:** A LP precisa parecer instantanea. Loading states so para recursos assincronos (screenshot do forum, avatares de depoimentos).

- Tipo: CSS skeleton screens
- Implementacao: `@keyframes shimmer` em divs placeholder
- Background: `linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)`
- `background-size: 400% 100%`
- `animation: shimmer 1.5s infinite`
- Fallback: fundo solido `#111` sem animacao

---

## Secao 13 — Performance (NON-NEGOTIABLE)

### 13.1 Budget por Animacao

| Tipo | Max Duration | Max JS Bundle | Notas |
|------|-------------|---------------|-------|
| Hero load | 1200ms total (stagger incluso) | 0kb (CSS) ou Framer Motion ja carregado | |
| Scroll reveals | 500ms por elemento | 0kb adicional | |
| Hover states | 200ms | 0kb (CSS) | |
| Activity feed | Indefinido (loop) | < 2kb | Lazy-load obrigatorio |
| Confetti | 2000ms | < 15kb | Lazy-load obrigatorio |
| Counter | 1500ms | < 3kb (countup) | Lazy-load obrigatorio |

### 13.2 Regras de Implementacao

**CSS primeiro:**
- Todo hover state: CSS transition
- Todo background animado: CSS @keyframes
- Todo scroll indicator, bounce, pulse: CSS @keyframes
- Motivo: zero JS, zero re-render

**Framer Motion para:**
- Scroll-triggered reveals (whileInView)
- Stagger entre multiplos elementos
- AnimatePresence (accordion, sticky CTA)
- Animacoes condicionais (estado de UI)

**GSAP apenas se:**
- Animacao precisar de timeline complexa
- Scroll-scrubbing preciso necessario
- Motivo: bundle maior, justifica so quando Framer nao da conta

**Lottie apenas para:**
- Icones animados complexos (se existirem no design)
- Manter arquivos < 20kb cada
- Lazy-load obrigatorio

### 13.3 Intersection Observer — Padrao Unico

Para evitar multiplos observers (memory leak):

```ts
// Criar um IntersectionObserver compartilhado
// Ou usar Framer Motion whileInView que ja gerencia internamente
// NUNCA criar um observer por componente sem cleanup

// Padrao recomendado:
const { ref, inView } = useInView({
  threshold: 0.2,    // 20% do elemento visivel
  triggerOnce: true, // once: true — nao re-anima
});
```

### 13.4 Targets de Performance

| Metrica | Target | Critico |
|---------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | < 4s |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| FID/INP | < 200ms | < 500ms |
| FPS durante animacoes | 60fps | 30fps minimo |
| Bundle de animacoes | < 50kb gzip total | < 100kb |

**Regra anti-CLS:** TODO elemento animado com `y` ou `scale` DEVE ter seu espaco reservado no DOM antes da animacao. `opacity: 0` preserva o espaco. `display: none` nao preserva — nunca usar para elementos com animacao de reveal.

### 13.5 prefers-reduced-motion — Implementacao Global

```css
/* Global reset para reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```ts
// Para animacoes Framer Motion
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Secao 14 — Especificacoes Tecnicas Consolidadas

### Tabela Mestre de Animacoes

| ID | Secao | Elemento | Tipo | Trigger | Duration | Easing | Delay | Direcao | prefers-reduced |
|----|-------|---------|------|---------|----------|--------|-------|---------|----------------|
| A01 | Hero | Headline (stagger) | Framer Motion | load | 400ms/bloco | easeOut | 200ms | fade-up (y:20) | fade-only |
| A02 | Hero | Subheadline | Framer Motion | load | 500ms | easeOut | headline+120ms | fade-up (y:12) | fade-only |
| A03 | Hero | Background | CSS @keyframes | load | 8000ms | ease-in-out | 0 | gradient-shift | none |
| A04 | Hero | Screenshot forum | Framer Motion | load | 700ms | easeOut | 400ms | fade-up + scale | fade-only |
| A05 | Hero | CTA apareicao | Framer Motion | load | 400ms | easeOut | 800ms | fade-up (y:10) | fade-only |
| A06 | Hero | CTA hover | CSS transition | hover | 200ms | ease-out | 0 | translateY(-1px) | color-only |
| A07 | Hero | Micro-copy | Framer Motion | load | 600ms | easeOut | 1000ms | fade (opacity) | identical |
| A08 | Hero | Prova social | Framer Motion | load | 500ms | easeOut | 1200ms | fade | identical |
| A09 | Hero | Avatar pulse | CSS @keyframes | load | 2000ms/inf | ease-in-out | stagger 400ms | opacity pulse | none |
| A10 | S2 | Secao entrada | Framer Motion | scroll IO | 500ms | easeOut | 0 | fade-up (y:30) | fade-only |
| A11 | S2 | 6 dores stagger | Framer Motion | scroll IO | 400ms/item | easeOut | 120ms stagger | fade-left (x:-20) | fade-only |
| A12 | S2 | Icones dores | Framer Motion | scroll IO | 200ms | easeOut | -50ms (antes texto) | scale (0→1) | none |
| A13 | S2 | Copy consequencia | Framer Motion | scroll IO | 800ms | easeOut | 0 | fade-only | identical |
| A14 | S2 | Divisor virada | CSS + Framer | scroll IO | 800ms | cubic-bezier | 0 | scaleX (0→1) | static |
| A15 | S3 | Promessa central | Framer Motion | scroll IO | 700ms | easeOut | 0 | fade-up (y:40) | fade-only |
| A16 | S3 | Lista comparacao | Framer Motion | scroll IO | 400ms/item | easeOut | 100ms stagger | fade-up (y:15) | fade-only |
| A17 | S3 | Badge categoria | Framer Motion | scroll IO | 500ms | overshoot | 0 | scale+fade | fade-only |
| A18 | S4 | Cards beneficio | Framer Motion | scroll IO | 500ms/card | easeOut | 150ms stagger | fade-up (y:30) | fade-only |
| A19 | S4 | Card hover | CSS transition | hover | 200ms | ease-out | 0 | translateY(-3px) | color-only |
| A20 | S4 | Icones beneficio | Framer Motion | scroll IO | 300ms | easeOut | -50ms | scale (0.6→1) | none |
| A21 | S4 | Pills ecossistema | Framer Motion | scroll IO | 400ms/pill | overshoot | 200ms stagger | scale+fade | fade-only |
| A22 | S5 | Grid depoimentos | Framer Motion | scroll IO | 400ms/card | easeOut | 100ms stagger | fade-up (y:20) | fade-only |
| A23 | S5 | Screenshot prova | Framer Motion | scroll IO | 600ms | easeOut | 0 | scale+fade | fade-only |
| A24 | S5 | Counters | countup.js | scroll IO | 1500ms | easeOut | 0 | numeric | static value |
| A25 | S6 | Headline FOMO | Framer Motion | scroll IO | 1000ms | easeOut | 0 | fade-only | identical |
| A26 | S6 | Activity feed | CSS + JS | auto | 300ms/item | easeOut/In | 4-6s interval | fade-up | static list |
| A27 | S6 | Fotos fundadores | Framer Motion | scroll IO | 500ms | easeOut | 200ms stagger | scale+fade | fade-only |
| A28 | S6 | Copy FOMO paragrafos | Framer Motion | scroll IO | 500ms/p | easeOut | 200ms stagger | fade-up (y:15) | fade-only |
| A29 | S7 | Card forum | Framer Motion | scroll IO | 600ms | easeOut | 0 | fade-up+scale | fade-only |
| A30 | S7 | Badge preco | Framer Motion | scroll IO | 400ms | overshoot | 0 | scale (1.2→1) | fade-only |
| A31 | S7 | Items cursos/mentoria | Framer Motion | scroll IO | 400ms/item | easeOut | 150ms stagger | fade (opacity→0.8) | identical |
| A32 | S7 | Badge "Em breve" | CSS | load | 2000ms/inf | ease-in-out | 0 | opacity pulse | none |
| A33 | S7 | Badge "Vagas limitadas" | CSS (ping) | load | 1500ms/inf | cubic-bezier | 0 | ping dot | none |
| A34 | S7 | CTA pricing hover | CSS transition | hover/focus | 180ms | ease-out | 0 | translateY(-2px) | color-only |
| A35 | S7 | Garantia | Framer Motion | scroll IO | 700ms | easeOut | 0 | fade | identical |
| A36 | S8 | FAQ items | Framer Motion | scroll IO | 300ms/item | easeOut | 60ms stagger | fade-up (y:10) | fade-only |
| A37 | S8 | Accordion open | Framer Motion | click | 300ms | easeOut | 0 | height auto | instant toggle |
| A38 | S8 | Chevron rotate | CSS transition | click | 300ms | easeOut | 0 | rotate 0→180 | instant |
| A39 | S9 | Copy urgencia | Framer Motion | scroll IO | 600ms | easeOut | 0 | fade-up (y:20) | fade-only |
| A40 | S9 | Contraste custo | Framer Motion | scroll IO | 800ms | easeOut | 0 | opacity (0.4→1) | identical |
| A41 | S9 | Parallax bg | Framer Motion | scroll | continuo | linear | 0 | translateY | none |
| A42 | S10 | Headline recap | Framer Motion | scroll IO | 600ms | easeOut | 0 | fade-up (y:20) | fade-only |
| A43 | S10 | CTA final entrada | Framer Motion | scroll IO | 500ms | easeOut | 200ms | scale+fade | fade-only |
| A44 | S10 | CTA pulse glow | CSS @keyframes | load | 3000ms/inf | ease-in-out | 0 | box-shadow | none |
| A45 | S10 | Reassurance | Framer Motion | scroll IO | 500ms | easeOut | 300ms | fade (→0.7) | identical |
| A46 | S10 | Confetti | canvas-confetti | click CTA | 2000ms | easeOut | 0 | burst | none |
| G01 | Global | Sticky CTA entrada | Framer Motion | IO hero CTA | 300ms | easeOut | 0 | fade-down (y:-60) | instant |
| G02 | Global | Sticky CTA saida | Framer Motion | IO CTA final | 200ms | easeIn | 0 | fade-up (y:-60) | instant |
| G03 | Global | Scroll indicator | CSS @keyframes | load | 2000ms/inf | ease-in-out | 0 | bounce | none |
| G04 | Global | Skeleton loading | CSS @keyframes | load | 1500ms/inf | linear | 0 | shimmer | static bg |

---

## Notas para Implementacao

### Stack recomendado
```
framer-motion: ^11.x     (scroll reveals, stagger, AnimatePresence)
canvas-confetti: ^1.x    (lazy-load — apenas secao 10)
react-intersection-observer: via framer-motion nativo ou use-inview
```

### O que NAO fazer
- Nao usar `animate.css` (bundle desnecessario, sem controle)
- Nao usar `ScrollMagic` (obsoleto, GSAP substituiu)
- Nao animar `width`, `height` diretamente (causa layout reflow)
- Nao usar `top/left` para mover elementos (usar `transform: translate`)
- Nao criar animacoes que bloqueiem o thread principal
- Nao ter mais de 3 elementos animando simultaneamente no mesmo momento visual

### Ordem de prioridade de implementacao
1. prefers-reduced-motion global (CSS reset) — PRIMEIRO
2. Scroll indicator no hero
3. Hero load animations (A01-A09)
4. CTA hover states globais
5. Scroll reveals das secoes 2-4
6. Activity feed (secao 6)
7. Sticky CTA
8. Accordion FAQ
9. Confetti (lazy-load)
10. Counters (lazy-load)

---

*Entregue por @animations-orqx (Kinetic). 2026-04-08 (v1)*
*Inputs consumidos: 03-copy-framework.md, 00-strategy-v3.md*
*Consumidores: @developer (implementacao), @design-orqx (validacao visual)*
