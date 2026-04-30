# Onboarding Soier — Setup Maquina Pra Trabalhar no sinapse.club

> Esse doc é pra **Matheus Soier** rodar uma vez na maquina dele.
> Tudo aqui e checklist do que tem que existir pra Claude Code operar
> com mesma capacidade do Caio.
>
> Se algo der errado em qualquer passo, **abre o Claude Code, cola o
> erro e pede pra resolver**. Voce NAO precisa entender o que ta
> acontecendo — o agente resolve.

---

## 1. O que voce precisa instalado (uma vez so)

| Ferramenta | Por que | Como instalar |
|---|---|---|
| Node.js 20+ | Roda o site local | https://nodejs.org/ — versao LTS |
| Git | Versionamento | https://git-scm.com/ |
| GitHub CLI | Acesso autenticado ao repo | https://cli.github.com/ |
| Claude Code | A IDE | https://claude.ai/code |

Apos instalar, abre o terminal e roda **uma vez**:

```bash
gh auth login
```

Segue o wizard, escolhe GitHub.com, autentica via browser. Pronto.

---

## 2. Clonar o repo

```bash
cd C:\Users\SEU-USUARIO\Workspace
git clone https://github.com/caioimori/sinapse-club.git
cd sinapse-club
```

Aviso: o Caio te convidou como collaborator — voce vai receber email
do GitHub. **Aceita antes de tentar clonar**.

---

## 3. Configurar identidade git

Roda **uma vez**:

```bash
git config --global user.name "Matheus Soier"
git config --global user.email "SEU-EMAIL@dominio.com"
```

A regra `safe-collaboration.md` ja esta configurada pra te detectar pelo
nome (qualquer coisa contendo "matheus" ou "soier" → branch prefix
`soier/*`). Voce nao precisa lembrar disso.

---

## 4. Variaveis de ambiente (.env.local)

Copia o template:

```bash
copy .env.example .env.local
```

E pede o **arquivo `.env.local` real** pro Caio (ele tem todas as chaves).
Ele vai te mandar via canal seguro (NUNCA por commit, NUNCA por
WhatsApp em texto).

Variaveis que voce vai precisar receber preenchidas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (so server, NUNCA expor)
- `ABACATEPAY_API_KEY`
- `ABACATEPAY_WEBHOOK_SECRET`
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_APP_URL` (`http://localhost:3000` em dev)

Se faltar alguma, o `npm run dev` reclama explicito qual ta faltando.

---

## 5. Configuracao do Claude Code (rules + skills + agents)

A magia do setup do Caio mora em `~/.claude/` (na maquina dele).
Voce precisa ter equivalente. **Nao precisa copiar tudo — o que importa**:

### 5a. Rules (regras automaticas que o Claude segue)

O proprio repo ja vem com `.claude/rules/` — sao regras DESTE projeto
e funcionam automaticamente quando voce abre o Claude Code aqui dentro.

Se voce quiser as regras GLOBAIS do Caio (que se aplicam fora deste
repo), pede pra ele te enviar o conteudo de `~/.claude/CLAUDE.md` e de
`~/.claude/rules/` zipados. Cola na sua pasta `~/.claude/`.

### 5b. MCP servers

Os agentes usam MCPs pra tarefas avancadas. Configuracao do Caio mora
em `~/.claude.json`. Voce precisa habilitar pelo menos:

| MCP | Pra que |
|---|---|
| `chrome-devtools` | Inspecionar paginas em dev |
| `terminal-bus` | Mandar mensagem entre voce e o Caio |
| Skill Supabase (claude.ai) | Queries no banco |
| Skill Vercel (claude.ai) | Deploy logs |
| Skill Figma (claude.ai) | Mockups |

As skills vem de graca quando voce loga em https://claude.ai/code com
sua conta. MCPs locais (chrome-devtools, terminal-bus) — pede pro
Claude Code instalar quando precisar.

### 5c. Agentes do framework SINAPSE

Esse repo usa um meta-framework de agentes (Imperator, Dex, etc.).
Tudo ja vem versionado em `.claude/` e `.sinapse-ai/`. Voce nao
precisa fazer nada — abre o repo no Claude Code e digita `@sinapse-orqx`
pra invocar o orquestrador master.

---

## 6. Acessos nas plataformas externas

O Caio te convidou (ou vai convidar) em cada uma:

| Plataforma | Como aceitar | O que voce pode fazer |
|---|---|---|
| **GitHub** | Email de invite → aceita | Push, PR, merge — full access |
| **Vercel** | Email de invite → aceita | Deploy, env vars, logs, dominio |
| **Supabase** | Email de invite → aceita | Queries, migrations, dashboard |
| **AbacatePay** | Login com Google da conta compartilhada (Caio te passa qual) | Ver pagamentos, refund, webhooks |

Quando aceitar Vercel: ve se aparece o projeto `sinapse-club` no seu
dashboard. Se sim, deploy ta liberado.

---

## 7. Rodar local (validacao final)

```bash
npm install
npm run dev
```

Abre http://localhost:3000 — se carrega o site, ta tudo certo.

Se quebra, abre Claude Code e diz "subi o projeto e deu erro X" — agente
debuga sozinho.

---

## 8. Comunicar com o Caio via Claude Code

Dentro de qualquer sessao Claude Code, voce pode mandar mensagem pra
sessao Caio sem sair do terminal:

```
"manda pro caio que terminei a feature X"
```

O agente escreve no inbox dele e ele vai ver na proxima vez que abrir
Claude Code.

Pra checar mensagens:

```
"tem mensagem pra mim?"
```

O agente le seu inbox e mostra.

---

## 9. Branch + commit + PR — voce NAO faz isso, o agente faz

Voce nunca digita `git push` ou `git commit`. O fluxo e:

1. Voce briefa o agente: "implementa feature X"
2. Agente cria branch automatico (`soier/feat/x`)
3. Agente codifica, testa, commita
4. Agente abre PR no GitHub, marca o Caio como reviewer
5. Voce pode auto-mergear se quiser velocidade (regra do repo permite)

O unico comando que voce **pode** precisar digitar manualmente algum
dia e:

```bash
git push origin main
```

— e SO se um hook de seguranca bloquear o agente. 99% das vezes, agente
faz tudo.

---

## 10. Checklist final

- [ ] Node, Git, GitHub CLI, Claude Code instalados
- [ ] `gh auth login` feito
- [ ] Repo clonado
- [ ] `git config --global user.name "Matheus Soier"` rodado
- [ ] `.env.local` recebido do Caio e colocado na raiz do repo
- [ ] Convites aceitos: GitHub, Vercel, Supabase, AbacatePay
- [ ] `npm install && npm run dev` funciona
- [ ] Conseguiu mandar uma mensagem teste pro Caio via terminal-bus

**Pronto. Voce ta operando com mesmo nivel do Caio.**

---

## Quando algo da errado

NAO tenta consertar manualmente. Cola o erro no Claude Code, deixa o
agente diagnosticar. Voce nao e desenvolvedor — voce briefa, ele executa.
