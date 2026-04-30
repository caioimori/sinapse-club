# Collaboration — Caio + Soier (Equal Authority)

> **Aplica a TODOS os agentes operando neste repo.**
> Os dois socios (Caio Imori e Matheus Soier) tem o MESMO nivel de acesso e
> autoridade tecnica. Nao ha hierarquia, nao ha owner unico, nao ha aprovacao
> obrigatoria de um sobre o outro.

## Premissa

Os dois sao product builders, NAO desenvolvedores. Os agentes fazem todo o
trabalho tecnico. A diferenca entre uma sessao Caio e uma sessao Soier e
APENAS a identidade de quem esta dirigindo o briefing — capacidades sao
identicas.

## Identidade Auto-Detectada

Os agentes detectam quem esta dirigindo a sessao via `git config user.name`
ou variavel de ambiente `$USERNAME` / `$USER`, conforme tabela em
`.claude/rules/safe-collaboration.md`:

| Detectado | Branch prefix | Sessao terminal-bus |
|-----------|---------------|---------------------|
| `caio` (case-insensitive) | `caio/*` | `caio` |
| `matheus` ou `soier` | `soier/*` | `soier` |
| outro | `dev/*` | nome do projeto |

Nenhum dos dois precisa lembrar de configurar nada manualmente — a regra
existe e o agente verifica antes de cada operacao git.

## Regra de Coordenacao Antes de Tocar Arquivo

Antes de iniciar trabalho em qualquer arquivo:

1. `git fetch origin` (silencioso)
2. Listar branches abertas remotas: `git branch -r --sort=-committerdate | head -10`
3. Se houver branch do outro socio mexendo em area parecida (mesmo dominio
   de arquivos), avisar antes de comecar:
   > "Vi que o {outro} esta numa branch chamada {nome}. Quer continuar la
   > junto ou abrir branch separada?"
4. Se o usuario confirmar branch separada, prosseguir normalmente (merge
   resolve depois)

## PR Flow — Self-Merge Permitido (Velocidade > Burocracia)

Como os dois sao socios com confianca mutua e perfis nao-tecnicos:

| Operacao | Regra |
|----------|-------|
| Criar PR | Sempre obrigatorio (nunca commit direto em main) |
| Atribuir reviewer | Marca o outro automaticamente |
| Aprovacao bloqueia merge? | **NAO** — qualquer um pode self-merge |
| Branch protection | Apenas exige PR (sem required reviews) |
| Force push em main | BLOQUEADO sempre (mesmo com confirmacao) |

A logica: revisao e desejavel mas nao deve travar entrega. Se um socio
quiser feedback, pede explicitamente. Caso contrario, merge livre.

## Comunicacao Cross-Terminal

Os dois usam `terminal-bus` pra comunicacao assincrona entre maquinas:

- Inicio de sessao: `/session caio` ou `/session soier`
- Mandar mensagem: linguagem natural funciona — "manda pro soier que
  subi a feature X" — o agente escreve direto no inbox do outro
- Checar mensagens: "tem mensagem pra mim?" — agente le inbox

Casos onde DEVE comunicar:
- Antes de mexer em arquivo grande/critico (contracts, schema, paywall)
- Apos deploy em producao (informa o outro pra checar)
- Quando merge tem conflito que afeta trabalho do outro

## Conflitos — Resolucao Automatica

Hierarquia de resolucao quando dois socios tocam o mesmo arquivo:

| Tipo de conflito | Quem resolve |
|------------------|--------------|
| Whitespace, imports, formatacao | Agente auto-merge |
| Adicao em areas diferentes do mesmo arquivo | Agente auto-merge |
| Mesmas linhas, semanticamente compativel | Agente auto-merge |
| Mesmas linhas, semantica divergente | Agente avisa o socio dono da sessao + manda msg pro outro via terminal-bus pedindo direcao |
| Conflito em migration/schema | SEMPRE comunica antes de resolver — pode ter side-effect em DB |

`package.json`, lockfiles e arquivos gerados: regenera apos merge.

## Antipatterns FORBIDDEN

- Tratar Caio como "owner" e Soier como "contributor" (sao iguais)
- Bloquear merge esperando review do outro sem ser pedido
- Force push em main sob qualquer circunstancia
- Commitar credencial em qualquer .env
- Mexer em area onde o outro tem branch ativa sem comunicar
- Esquecer de mandar mensagem cross-terminal apos deploy critico
- Usar branch prefix errado (caio comitando em `soier/*` ou vice-versa)

## Casos Especiais

### Quando Caio inicia trabalho que Soier ja iniciou
Agente avisa: "{soier} ta na branch X com mudancas em arquivos Y. Quer
puxar a branch dele e continuar, ou abrir paralela?"

### Quando os dois tocam producao no mesmo dia
Apos deploy do segundo, agente confirma com primeiro: "deploy adicional
foi feito por {outro}, sistema continua estavel."

### Quando um precisa de credencial que so o outro tem
Agente identifica e avisa: "essa operacao exige credencial X que e do
{outro}. Mando mensagem pra ele agora?"

---

> **Nota tecnica:** esta regra esta em `docs/guides/` por convencao do
> repo (deny rule em `.claude/rules/` impede edicao por agentes).
> Para enforcement automatico, considerar promover via `@devops` num PR
> futuro pra `.claude/rules/collaboration-soier-caio.md`.
