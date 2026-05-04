# Prompt Pronto Pro Caio Mandar Pro Soier

> Copia o bloco entre os `---` e manda pro Matheus por DM/email.
> Ele cola na primeira sessão Claude Code dele e tudo se configura.
>
> **Última atualização:** 2026-05-04
> **Foco atual:** Stripe em produção (Soier cria Products + webhook)

---

```
Soier, vamos finalizar o setup pra você operar o sinapse-club com o
mesmo poder que eu. Resumo: a base tá pronta, falta voce configurar
sua maquina + criar uns Products no Stripe pra liberar o deploy.

==============================
PARTE 1 — Setup da sua maquina
==============================

Cola esse texto inteiro no Claude Code e ele te guia. Se travar em
qualquer coisa, cola o erro e ele resolve — voce nao precisa entender
git nem CLI, agente faz tudo.

1. Confirma se ja tem instalado: Node 20+, Git, GitHub CLI, Claude Code.
   Faltando algum? Instala.

2. Roda no terminal:
   gh auth login

3. Clona o repo numa pasta de trabalho sua:
   cd C:\Users\SEU-USUARIO\Workspace
   git clone https://github.com/caioimori/sinapse-club.git
   cd sinapse-club

4. Configura tua identidade git (importante pra branches automaticas):
   git config --global user.name "Matheus Soier"
   git config --global user.email "TEU-EMAIL"

5. Pede pro Caio te mandar o arquivo .env.local pelo Bitwarden Send
   ou 1Password Send (NUNCA por WhatsApp/email/texto comum). Cola na
   raiz do repo.

6. Aceita os convites no email:
   - GitHub (caioimori/sinapse-club) — role admin
   - Vercel (sinapse-club)
   - Supabase (organizacao do sinapse) — role Owner

7. Roda:
   npm install
   npm run dev

   Confirma que abre http://localhost:3000

8. Abre Claude Code DENTRO da pasta sinapse-club. Os hooks ja estao
   versionados (settings.json), entao tudo carrega automatico:
   - Synapse engine (contexto)
   - Secret scanning (bloqueia commit de credencial)
   - Story gate, delegation, architecture-first
   - Permissions liberadas pra git/gh/npm/supabase/vercel/stripe sem prompt

9. Dentro do Claude Code, digita: /session soier
   (registra tua sessao pro terminal-bus, agente sabe que e voce)

10. Manda mensagem teste pro Caio:
    "manda pro caio que terminei o setup"

==============================
PARTE 2 — Le o estado do projeto
==============================

Depois do setup, pede pro Claude Code:

   le docs/STATUS-LIVE.md e me explica em portugues simples o que
   esta pronto, o que ta na minha mao, e o que ta na do Caio

Ele vai te dar um resumo focado em acao. Confere se faz sentido pro
seu lado.

==============================
PARTE 3 — Sua frente: Stripe Products + Webhook
==============================

Tarefas tuas no Stripe Dashboard (so voce tem acesso completo de admin):

A) Criar 3 Products RECURRING:

   Mensal:    R$ 37,90 — billing every 1 month
   Semestral: R$ 203,40 — billing every 6 months
   Anual:     R$ 358,80 — billing every 12 months

   Cada um gera um price_… ID. Manda os 3 pro Caio (ou cola direto
   no Vercel env: STRIPE_PRICE_MENSAL, STRIPE_PRICE_SEMESTRAL,
   STRIPE_PRICE_ANUAL).

   Se travar, peca pro Claude Code: "abre stripe dashboard via mcp e
   me guia a criar 3 products recurring com esses precos"

B) Criar Webhook Endpoint no Stripe:

   - URL: https://sinapse.club/api/webhooks/stripe
   - Eventos a escutar (peca pro Claude Code listar exatamente quais):
     invoice.paid, invoice.payment_failed, customer.subscription.created,
     customer.subscription.updated, customer.subscription.deleted,
     payment_intent.succeeded, payment_intent.payment_failed
   - Stripe gera um whsec_… → cola no Vercel env como STRIPE_WEBHOOK_SECRET

C) sk_live_ secret key:

   Dashboard > Developers > API keys > Reveal live secret key.
   Cola no Vercel env como STRIPE_SECRET_KEY.

==============================
REGRA DE COLAB
==============================

A regra do nosso repo: somos iguais, sem hierarquia. Voce pode mergear
PRs sozinho, fazer deploy, mexer em qualquer area. Marca eu como
reviewer mas nao precisa esperar minha aprovacao se for urgente.

Se algo quebrar fora do teu dominio (codigo, infra), abre Claude Code
na pasta e pede direto: "tem isso quebrando, resolve". Ele resolve OU
me chama via terminal-bus.

Bora.
— Caio
```

---

## Checklist do Caio (ações manuais que SÓ você pode fazer)

- [x] GitHub username canônico: `matheus-soier` (registrado em memória global, não pergunto mais)
- [x] Convidar Soier no **GitHub** como `maintain` — feito via agente
- [ ] Convidar Soier no **Vercel** como Member do projeto sinapse-club
- [ ] Convidar Soier no **Supabase** como Owner da organization
- [ ] AbacatePay em fade-out — não precisa convidar (deprecated)
- [ ] Mandar `.env.local` pelo Bitwarden Send / 1Password Send (NUNCA chat texto)
- [ ] Configurar branch protection em `main` (atualmente DESPROTEGIDA):
  - Require PR before merging: SIM
  - Required approvals: 0 (confiança mútua)
  - Block force push: SIM
  - Posso fazer via agente quando autorizar
- [ ] Adicionar `pk_live_…` no Vercel env como `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Quando Soier mandar Price IDs e webhook secret + você mandar `sk_live`: Vercel env completo, deploy

## Mudanças desde a versão anterior deste prompt

- Settings de Claude Code agora portáveis (paths via `$CLAUDE_PROJECT_DIR`) — Soier não precisa mexer nada
- Permissões pré-aprovadas (git/gh/npm/supabase/vercel/stripe) — sem prompt em ações comuns
- Foco em Stripe (estado atual: infra pronta, faltam credenciais)
- AbacatePay removido do prompt (deprecated)
- Adicionada parte de "ler STATUS-LIVE.md" pra Soier entender contexto rápido
