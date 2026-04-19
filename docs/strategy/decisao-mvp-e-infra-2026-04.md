# Decisão de MVP + Infra + Design — sinapse.club

> **Data:** 2026-04-18
> **Status:** Aprovado pelo founder (Caio)
> **Complementa:** `docs/architecture/processo-modularizacao-estrategica.md`, `docs/research/analise-super-app-sinapse-club-2026.md`, `docs/benchmark-comunidades-2026.md`

---

## 1. Posicionamento travado

**sinapse.club = super-app de IA + business para builders lusófonos.**

- Lança como **comunidade** (fórum nicho IA + empreendedorismo + marketing + paid media + conteúdo + growth)
- Projeta arquitetura como **super-app** (fórum → cursos → marketplace → tools AI)
- Anchor único nos primeiros 6-12 meses. Expansão só com gates de métrica passados.

**Pricing MVP:** tier único **R$ 197/mês** pras massas.

**Alternativa freemium mais segura (avaliar pré-launch):**
| Tier | Preço | Inclui |
|---|---:|---|
| Free | R$ 0 | Ler fórum, perfil básico |
| Pro | R$ 47/mês | Postar, DM, eventos |
| Builder | R$ 197/mês | Tudo + marketplace + cursos + tools premium |

---

## 2. Matriz comparativa dos projetos SINAPSE (contexto de priorização)

Escala 1-10 (10 = melhor). Risco e dependência Caio invertidos (10 = pouco risco / pouca dependência).

| Projeto | Retorno | Risco | Sinergia SINAPSE | Dep. Caio | T→R$10k MRR | Score |
|---|---:|---:|---:|---:|---:|---:|
| **sinapse.club (super-app)** | 9 | 6 | 10 | 8 | 6-9 meses | **8.4** |
| **ApseOS (SaaS fintech)** | 8 | 5 | 7 | 3 | 12-18 meses | 6.8 |
| **MindLoop (cliente)** | 5 | 9 | 4 | 7 | Já fatura | 6.4 |
| **SINAPSE Implementa** | 6 | 3 | 8 | 9 | 4-6 meses se liquidez | 5.5 |

**Conclusão:** sinapse.club é prioridade máxima. ApseOS roda paralelo (Soier-driven). SINAPSE Implementa vira feature da fase 3 do sinapse.club (não projeto autônomo).

---

## 3. Decisão arquitetural: monolito modular

**Não construir separado. Não fazer microservices. Modular monolith num único repo.**

### Por quê

| Alternativa | Custo | Resultado |
|---|---|---|
| Projetos separados + integrar depois | 4× setup/manutenção, integration hell | Atrasa MVP em 3-4 meses |
| Microservices desde início | 20+ semanas de overhead | Over-engineering pra <10k usuários |
| **Monolito modular** | 4-8 semanas MVP | Escala até 100k sem refactor |

### Estrutura

```
sinapse-plataform/
└── src/
    ├── modules/
    │   ├── forum/          ← Fase 1
    │   ├── courses/        ← Fase 2
    │   ├── marketplace/    ← Fase 3
    │   ├── tools/          ← Fase 3
    │   ├── identity/       ← compartilhado (auth, profile, reputation)
    │   └── gamification/   ← compartilhado
    └── shared/
        ├── auth/
        ├── payments/
        ├── ui/
        ├── db/
        └── events/
```

### Regras de ouro

1. Módulo só importa de `shared/` ou de si mesmo
2. Comunicação entre módulos SÓ via `@/modules/X/api` (sync) ou event bus (async)
3. Feature flags por módulo (liga/desliga sem deploy)
4. ESLint + dependency-cruiser bloqueiam violação no CI

**Detalhes completos em:** `docs/architecture/processo-modularizacao-estrategica.md`

---

## 4. Infra, código e segurança — por fase

### Princípio: Progressive hardening

Não constrói fortaleza no MVP. Constrói **fundação que aguenta fortaleza depois**.

### Fase 1 (0-6m) — Fórum R$ 197/mês

| Camada | Mínimo obrigatório | Pular no MVP |
|---|---|---|
| Stack | Next 15 + Supabase + Vercel + Resend | Microservices, k8s, custom backend |
| Auth | Supabase Auth + magic link + 2FA opcional | SSO, SAML, enterprise |
| DB | Postgres Supabase + **RLS em TODA tabela** | Sharding, read replicas |
| Pagamento | **Stripe** (global) OU **Asaas** (BR) — UM só | Split, escrow, custom checkout |
| Observability | Sentry + Vercel Analytics + Supabase logs | Datadog, New Relic |
| Backup | Supabase daily backup automático | DR multi-region |
| Secrets | Vercel env + Supabase vault | HashiCorp Vault |

### Segurança não-negociável desde dia 1

1. **RLS em toda tabela** — nunca confiar no frontend
2. **Zero service-role key em client** — só server-side
3. **Rate limiting em toda API** (Upstash/Vercel)
4. **Content moderation** (OpenAI moderation ou Perspective API) — fórum sem moderação vira cesspool em 30 dias
5. **LGPD compliance** — política privacidade + opt-in marketing + export/delete account
6. **Pen test OWASP Top 10** antes do launch público

### Fase 2 (6-12m) — Cursos integrados

Adiciona:
- Hotmart/Kiwify API (webhook libera acesso — **não hostea vídeo**)
- CDN Cloudflare pra assets
- Search: full-text Supabase → Algolia/Meilisearch quando >5k posts

### Fase 3 (12-24m) — Marketplace + Tools

Adiciona:
- Stripe Connect (escrow) OU Asaas Split
- Webhook infra robusta (idempotência, retry, DLQ)
- KYC provider (Idwall/Unico) pros vendedores
- SOC 2 Type 1 (se mirar enterprise)
- Audit log completo

### Orçamento mensal de infra

| Fase | Custo/mês | Premissa |
|---|---:|---|
| Fase 1 | R$ 200-800 | <1k usuários ativos |
| Fase 2 | R$ 1.500-4.000 | 5-10k usuários |
| Fase 3 | R$ 8k-25k | 30-100k usuários + transações |

---

## 5. Design system minimalista — receita Abacate Pay

### 5 princípios replicáveis

| Princípio | Aplicação sinapse.club |
|---|---|
| **1 cor ancoradora** | Escolher 1 cor SINAPSE (ciano/roxo?) + escala neutros 50-950 |
| **Tipografia única** | 1 sans + 1 mono. Escala: 12/14/16/20/32/48. Fim. |
| **Whitespace agressivo** | Seções com 80px vertical mínimo, container `max-w-4xl` |
| **1 CTA por tela** | Cada página = 1 ação principal. Resto é link texto. |
| **Componentes limitados** | ~15 no total: Button, Input, Card, Badge, Avatar, Dialog, Toast + layout |

### Stack técnica

- **shadcn/ui** (já no projeto) — customiza, não reinventa
- **Tailwind v4** — CSS variables pro tema + dark mode nativo
- **Radix primitives** — acessibilidade grátis
- **Lucide icons** — 1 biblioteca só
- **Framer Motion** só em microinterações (hover, toast). Zero parallax/scroll-hijack.

### Anti-patterns proibidos

| Tentação | Motivo pra resistir |
|---|---|
| "Dashboard com 8 widgets" | Vira Notion-hell. Fórum = 1 feed + sidebar. |
| "Gradient arco-íris hero" | Envelhece em 6 meses. |
| "5 tamanhos de botão" | 2 basta (`sm`, `default`). |
| "Ilustrações custom everywhere" | Usa fotos reais de membros. |
| "Animação em toda transição" | Lag percebido. Só em feedback. |

### Teste de minimalismo

> **Regra do primo de 50 anos:** seu primo que nunca usou app de IA entra no sinapse.club e em **3 segundos** sabe o que fazer (postar, ler, responder). Se não sabe, simplifica mais.

---

## 6. Ordem de execução recomendada

| Semana | Foco |
|---|---|
| **Semana 1** | Fase 0 — Foundation (migrar pra `src/modules/`, setup Vitest+Playwright, dependency-cruiser, feature flags, event bus, CI completo) |
| **Semana 2-7** | Fase 1 — Fórum isolado no padrão modular + E2E P0 (login → pagar R$197 → postar) |
| **Mês 3-5** | Launch público + validar R$ 10k MRR (ajustar preço/tier se não converter) |
| **Mês 6-8** | Fase 2 — Cursos via Hotmart/Kiwify plug-in |
| **Mês 12-18** | Fase 3 — Marketplace + Tools AI |

**Gate crítico:** nenhuma feature nova no fórum **antes** da Fase 0 completar. Senão é trabalho dobrado (terá que migrar depois).

---

## 7. Referências cruzadas

- Processo de modularização detalhado: `docs/architecture/processo-modularizacao-estrategica.md`
- Benchmark de comunidades: `docs/benchmark-comunidades-2026.md`
- Análise super-app 2026: `docs/research/analise-super-app-sinapse-club-2026.md`

---

## 8. Decisões pendentes (resolver antes da Fase 1)

- [ ] Pricing final: tier único R$ 197 ou freemium 3 camadas?
- [ ] Gateway: Stripe (global) ou Asaas (BR)?
- [ ] Cor ancoradora do design system (ciano? roxo? outro?)
- [ ] Content moderation: OpenAI moderation ou Perspective API?
- [ ] Domínio oficial: sinapse.club confirmado?
